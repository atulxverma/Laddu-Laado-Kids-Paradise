"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { Resend } from "resend";
import Razorpay from "razorpay";

const resend = new Resend(process.env.RESEND_API_KEY);

// Razorpay Config
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

// --- RAZORPAY ACTION (Ye missing tha!) ---
export async function initiateRazorpayPayment(amount: number) {
  try {
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return { success: true, orderId: order.id, amount: order.amount };
  } catch (error) {
    console.error("RAZORPAY_INIT_ERROR", error);
    return { success: false, error: "Failed to initiate payment" };
  }
}

// --- PRODUCT ACTIONS ---
export async function createProduct(data: any) {
  try {
    await checkAdmin();
    const { name, description, price, categoryId, images, size, color } = data;

    if (!name || !price || !categoryId || !images || images.length === 0) {
      return { error: "Missing fields" };
    }

    await db.product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        categoryId,
        size: size || "Standard",
        color: color || "Standard",
        images: { create: images.map((url: string) => ({ url })) },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// --- CATEGORY ACTIONS ---
export async function createCategory(name: string) {
  try {
    await checkAdmin();
    await db.category.create({ data: { name } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to create category" };
  }
}

// --- ORDER ACTIONS ---
export async function createOrder(data: {
  clerkId: string
  phone: string
  address: string
  total: number
  items: any[]
}) {
  try {
    const order = await db.order.create({
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
            size: item.size, // 👈 Cart se selected size yahan save hoga
          })),
        },
      },
    });

    // 🔥 OWNER EMAIL ALERT (PREMIUM ENGLISH EDITION)
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (adminEmail && process.env.RESEND_API_KEY) {
      const orderIdShort = order.id.slice(-6).toUpperCase();

      // BUILD PRODUCT LIST HTML
      const itemsHtml = data.items
        .map(
          (item) => `
        <div style="display: flex; align-items: center; padding: 16px 0; border-bottom: 1px solid #f0f0f0;">
          <div style="width: 80px; height: 100px; border-radius: 12px; overflow: hidden; background-color: #f5f5f5; margin-right: 20px;">
            <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="flex: 1;">
            <h4 style="margin: 0; font-size: 15px; color: #111; font-weight: 700;">${item.name}</h4>
            <p style="margin: 6px 0 0 0; font-size: 11px; color: #999; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
              Size: ${item.size} | Qty: ${item.quantity}
            </p>
            <p style="margin: 6px 0 0 0; font-size: 14px; font-weight: 800; color: #000;">₹${item.price.toLocaleString("en-IN")}</p>
          </div>
        </div>
      `,
        )
        .join("");

      await resend.emails.send({
        from: "Laddu Laado <onboarding@resend.dev>",
        to: adminEmail,
        subject: `✨ New Premium Order Received [#${orderIdShort}]`,
        html: `
          <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f3f4f6; padding: 50px 10px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 30px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.08); border: 1px solid #eeeeee;">
              
              <!-- BRAND HEADER -->
              <div style="background-color: #000000; padding: 35px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 6px; font-weight: 900; text-transform: uppercase;">LADDU LAADO</h1>
              </div>

              <!-- MAIN MESSAGE -->
              <div style="padding: 45px 35px; text-align: center;">
                <div style="margin-bottom: 25px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/1162/1162456.png" width="50" height="50" alt="box" />
                </div>
                <h2 style="font-size: 28px; font-weight: 900; color: #000; margin: 0; letter-spacing: -0.5px;">GREAT CHOICE MADE!</h2>
                <p style="color: #6b7280; font-size: 16px; margin-top: 15px; line-height: 1.6; font-weight: 400;">
                  A new premium soul just picked their favorite pieces from your collection. 
                  It's time to prepare the package and spread the elegance.
                </p>
              </div>

              <!-- ORDER LIST CONTAINER -->
              <div style="padding: 0 35px;">
                <div style="border-top: 2px solid #f3f4f6; padding-top: 10px;">
                  <p style="font-size: 10px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">Cart Summary</p>
                  ${itemsHtml}
                </div>
              </div>

              <!-- FINANCIAL SUMMARY -->
              <div style="padding: 30px; background-color: #f9fafb; margin: 25px 35px; border-radius: 24px; border: 1px solid #f3f4f6;">
                <table style="width: 100%;">
                  <tr>
                    <td style="font-size: 14px; color: #6b7280; padding-bottom: 12px;">Total Value</td>
                    <td style="font-size: 14px; font-weight: 700; text-align: right; padding-bottom: 12px; color: #111;">₹${data.total.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #6b7280; padding-bottom: 12px;">Standard Shipping</td>
                    <td style="font-size: 14px; font-weight: 800; color: #10b981; text-align: right; padding-bottom: 12px;">FREE</td>
                  </tr>
                  <tr>
                    <td style="font-size: 16px; font-weight: 900; color: #000; padding-top: 12px; border-top: 1px solid #e5e7eb;">TOTAL REVENUE</td>
                    <td style="font-size: 22px; font-weight: 900; color: #000; text-align: right; padding-top: 12px; border-top: 1px solid #e5e7eb;">₹${data.total.toLocaleString("en-IN")}</td>
                  </tr>
                </table>
              </div>

              <!-- SHIPPING & CONTACT -->
              <div style="padding: 0 35px 45px 35px;">
                <div style="background-color: #000; color: #fff; border-radius: 24px; padding: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                  <p style="margin: 0 0 12px 0; font-size: 10px; font-weight: 800; color: #4b5563; text-transform: uppercase; letter-spacing: 2px;">Shipping Address</p>
                  <p style="margin: 0; font-size: 14px; font-weight: 500; line-height: 1.7; color: #e5e7eb;">${data.address}</p>
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #1f2937; display: flex; align-items: center;">
                    <span style="font-size: 14px; font-weight: 800; color: #fff;">📞 ${data.phone}</span>
                  </div>
                </div>
              </div>

              <!-- VIEW DETAILS BUTTON -->
              <div style="text-align: center; padding-bottom: 60px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders" style="background-color: #000000; color: #ffffff; padding: 22px 45px; border-radius: 100px; text-decoration: none; font-size: 13px; font-weight: 800; letter-spacing: 2px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); display: inline-block;">
                  VIEW ORDER DETAILS →
                </a>
              </div>

              <!-- FOOTER -->
              <div style="background-color: #f9fafb; padding: 35px; text-align: center; border-top: 1px solid #f3f4f6;">
                <p style="margin: 0; font-size: 11px; color: #9ca3af; font-weight: 700; letter-spacing: 1px;">LADDU LAADO OFFICIAL ENGINE</p>
                <p style="margin: 8px 0 0 0; font-size: 10px; color: #d1d5db;">© 2026 Premium Fashion Store. All rights reserved.</p>
              </div>

            </div>
          </div>
        `,
      });
    }

    revalidatePath("/admin/orders");
    return { success: true, orderId: order.id };
  } catch (error: any) {
    return { error: "Failed to place order" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await checkAdmin();
    await db.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to delete" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await checkAdmin();
    await db.order.update({ where: { id: orderId }, data: { status } });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to update" };
  }
}
