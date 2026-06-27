"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { Resend } from "resend";
import Razorpay from "razorpay";

const resend = new Resend(process.env.RESEND_API_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// --- SECURITY HELPER ---
async function checkAdmin() {
  const user = await currentUser();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!user || user.primaryEmailAddress?.emailAddress !== adminEmail) {
    throw new Error("Unauthorized: Access Denied");
  }
}

// --- RAZORPAY ACTION ---
export async function initiateRazorpayPayment(amount: number) {
  try {
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    return { success: true, orderId: order.id, amount: order.amount };
  } catch (error) {
    return { success: false, error: "Failed to initiate payment" };
  }
}

// --- PRODUCT ACTIONS ---
export async function createProduct(data: any) {
  try {
    await checkAdmin();
    const {
      name,
      description,
      price,
      categoryId,
      images,
      size,
      color,
      stock,
      gender,
      ageGroup,
    } = data;

    if (!name) return { error: "Product Name is required" };
    if (!price || isNaN(parseFloat(price)))
      return { error: "Valid Price is required" };
    if (!categoryId) return { error: "Please select a Category" };
    if (!images || images.length === 0)
      return { error: "Please upload at least one image" };
    if (!stock || isNaN(parseInt(stock)))
      return { error: "Stock quantity is required" };

    await db.product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId,
        size: size || "Standard",
        color: color || "Standard",
        gender: gender || "Unisex",
        ageGroup: ageGroup || "2-4Y",
        images: { create: images.map((url: string) => ({ url })) },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    return { error: "Database Error: " + error.message };
  }
}

// --- ORDER ACTIONS (With Dual Premium Emails) ---
export async function createOrder(data: {
  clerkId: string;
  phone: string;
  address: string;
  total: number;
  items: any[];
}) {
  try {
    // 🔥 Sabse pehle user fetch karo taaki mail bhej sakein
    const user = await currentUser();

    const order = await db.$transaction(async (tx) => {
      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product || product.stock < item.quantity) {
          throw new Error(`Item ${item.name} is currently out of stock.`);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          clerkId: data.clerkId,
          phone: data.phone,
          address: data.address,
          total: data.total,
          isPaid: true,
          status: "Confirmed",
          orderItems: {
            create: data.items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              size: item.size,
            })),
          },
        },
      });

      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    // --- EMAILS LOGIC ---
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const orderIdShort = order.id.slice(-6).toUpperCase();

    if (process.env.RESEND_API_KEY) {
      // 1. ADMIN ALERT
      if (adminEmail) {
        await resend.emails.send({
          from: "Laddu Laado <onboarding@resend.dev>",
          to: adminEmail,
          subject: `✨ New Order [#${orderIdShort}] Received`,
          html: `<div style="font-family:sans-serif; padding:20px; border:1px solid #eee; border-radius:20px;">
                  <h2>New Premium Order!</h2>
                  <p><strong>Revenue:</strong> ₹${data.total.toLocaleString("en-IN")}</p>
                  <p><strong>Customer:</strong> ${user?.fullName} (${data.phone})</p>
                  <p><strong>Address:</strong> ${data.address}</p>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders">View Dashboard</a>
                </div>`,
        });
      }

      // 2. CUSTOMER CONFIRMATION
      if (user?.primaryEmailAddress?.emailAddress) {
        await resend.emails.send({
          from: "Laddu Laado <onboarding@resend.dev>",
          to: user.primaryEmailAddress.emailAddress,
          subject: "Your Laddu Laado Order is Confirmed! ✨",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #f0f0f0; border-radius: 24px;">
              <h1 style="text-align: center; font-style: italic;">LADDU LAADO</h1>
              <h2 style="text-align: center; margin-bottom: 30px;">Order Confirmed!</h2>
              <p>Hi ${user.fullName},</p>
              <p>Thank you for choosing Laddu Laado. Your premium selection is being prepared for shipment.</p>
              <div style="background: #fafafa; padding: 20px; border-radius: 15px; margin: 20px 0;">
                 <p><strong>Order ID:</strong> #${orderIdShort}</p>
                 <p style="font-size: 18px;"><strong>Total Amount:</strong> ₹${data.total.toLocaleString("en-IN")}</p>
              </div>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" style="background:#000; color:#fff; padding:15px 30px; border-radius:50px; text-decoration:none; font-weight:bold;">TRACK MY ORDER</a>
              </p>
            </div>
          `,
        });
      }
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");
    revalidatePath("/orders");
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("ORDER_ERROR", error);
    return { error: error.message || "Failed to place order." };
  }
}

// --- OTHER ACTIONS ---
export async function createCategory(name: string) {
  try {
    await checkAdmin();
    if (!name) return { error: "Category name is required" };
    await db.category.create({ data: { name } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to create category" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await checkAdmin();
    await db.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete product" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await checkAdmin();
    await db.order.update({ where: { id: orderId }, data: { status } });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to update status" };
  }
}

export async function createReview(data: {
  productId: string;
  rating: number;
  comment: string;
  clerkId: string;
  userName: string;
  userImage: string;
}) {
  try {
    await db.review.create({ data });
    revalidatePath(`/product/${data.productId}`);
    return { success: true };
  } catch (error) {
    return { error: "Review failed" };
  }
}

export async function subscribeNewsletter(email: string) {
  try {
    await db.newsletter.create({ data: { email } });
    return { success: true };
  } catch (error) {
    return { error: "Already subscribed or invalid email" };
  }
}

export async function upsertBanner(data: any) {
  try {
    await checkAdmin();
    await db.banner.upsert({
      where: { id: data.type },
      update: { imageUrl: data.imageUrl, title: data.title, label: data.label },
      create: {
        id: data.type,
        type: data.type,
        imageUrl: data.imageUrl,
        title: data.title,
        label: data.label,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await checkAdmin();
    await db.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    return { error: "Cannot delete category with products." };
  }
}

export async function deleteBanner(id: string) {
  try {
    await checkAdmin();
    await db.banner.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete banner" };
  }
}

export async function syncCartWithDb(clerkId: string, items: any[]) {
  try {
    await db.cartItem.deleteMany({ where: { clerkId } }); 
    
    if (items.length > 0) {
      await db.cartItem.createMany({
        data: items.map(i => ({
          clerkId,
          productId: i.id, 
          quantity: i.quantity,
          size: i.size
        }))
      });
    }
  } catch (e) {
    console.error("DB_SYNC_FAIL", e);
  }
}

export async function getDbCart(clerkId: string) {
  try {
    return await db.cartItem.findMany({
      where: { clerkId },
      include: { product: { include: { images: true } } }
    });
  } catch (e) { return [] }
}