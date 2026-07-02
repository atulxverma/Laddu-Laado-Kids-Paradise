"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { Resend } from "resend";
import Razorpay from "razorpay";

const resend = new Resend(process.env.RESEND_API_KEY);

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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
      specifications, // 👈 NEW
    } = data;

    if (!name.trim()) {
      return {
        error: "Product name is required",
      };
    }

    if (!price || isNaN(parseFloat(price))) {
      return { error: "Valid Price is required" };
    }

    if (Number(price) <= 0) {
      return {
        error: "Price must be greater than 0",
      };
    }

    if (!categoryId) {
      return { error: "Please select a Category" };
    }

    if (!images || images.length === 0) {
      return { error: "Please upload at least one image" };
    }

    if (stock === undefined || isNaN(parseInt(stock))) {
      return { error: "Stock quantity is required" };
    }
    if (Number(stock) < 0) {
      return {
        error: "Stock cannot be negative",
      };
    }
    if (!data.size) {
      return { error: "Please select at least one size" };
    }

    if (!data.gender) {
      return { error: "Please select gender" };
    }

    await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),

        isNewArrival: data.isNewArrival ?? true,

        stock: Number(data.stock),
        gender: data.gender,
        ageGroup: data.ageGroup,

        size: data.size,
        color: data.color,
        categoryId: data.categoryId,

        specifications: data.specifications,

        images: {
          create: data.images.map((url: string) => ({
            url,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/shop");

    return { success: true };
  } catch (error: any) {
    return {
      error: "Database Error: " + error.message,
    };
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
    if (!data.items.length) {
      return { error: "Cart is empty" };
    }

    if (!data.address.trim()) {
      return { error: "Address is required" };
    }

    if (!/^[0-9]{10}$/.test(data.phone)) {
      return { error: "Invalid phone number" };
    }

    const user = await currentUser();

    const order = await db.$transaction(async (tx) => {
      // Stock Validation
      for (const item of data.items) {
        const latestProduct = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!latestProduct) {
          throw new Error(`${item.name} no longer exists.`);
        }

        if (latestProduct.stock < item.quantity) {
          throw new Error(
            `${item.name} has only ${latestProduct.stock} item(s) left in stock.`,
          );
        }
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          clerkId: data.clerkId,
          customerName: user?.fullName || "Guest User",
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

      // Reduce Stock
      for (const item of data.items) {
        const updatedProduct = await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updatedProduct.stock <= 0) {
          await tx.product.update({
            where: { id: item.id },
            data: {
              isArchived: true,
            },
          });
        }
      }

      return newOrder;
    });
    await db.cartItem.deleteMany({
      where: {
        clerkId: data.clerkId,
      },
    });

    // Emails
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const orderIdShort = order.id.slice(-6).toUpperCase();

    if (process.env.RESEND_API_KEY) {
      if (adminEmail) {
        await resend.emails.send({
          from: "Laddu Laado <onboarding@resend.dev>",
          to: adminEmail,
          subject: `✨ New Order [#${orderIdShort}] Received`,
          html: `
            <div>
              <h2>New Premium Order!</h2>
              <p>Total Revenue: ₹${data.total}</p>
              <p>Customer: ${user?.fullName}</p>
            </div>
          `,
        });
      }

      if (user?.primaryEmailAddress?.emailAddress) {
        await resend.emails.send({
          from: "Laddu Laado <onboarding@resend.dev>",
          to: user.primaryEmailAddress.emailAddress,
          subject: "Your Laddu Laado Order is Confirmed! ✨",
          html: `
            <div>
              <h2>Order Confirmed!</h2>
              <p>Hi ${user.fullName}</p>
              <p>Your order #${orderIdShort} has been confirmed.</p>
              <p>Total Amount: ₹${data.total}</p>
            </div>
          `,
        });
      }
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");
    revalidatePath("/orders");
    revalidatePath("/shop");

    return {
      success: true,
      orderId: order.id,
    };
  } catch (error: any) {
    console.error(error);

    return {
      error: error.message || "Failed to place order.",
    };
  }
}

// --- OTHER ACTIONS ---
export async function createCategory(name: string, imageUrl?: string) {
  try {
    await checkAdmin();
    if (!name || !name.trim()) return { error: "Category name is required" };

    const slug = slugify(name);
    const existing = await db.category.findFirst({
      where: { OR: [{ name: name.trim() }, { slug }] },
    });
    if (existing) return { error: "This category already exists" };

    const count = await db.category.count();
    await db.category.create({
      data: {
        name: name.trim(),
        slug,
        imageUrl,
        isCore: false,
        order: count,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to create category" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await checkAdmin();

    // Delete reviews first
    await db.review.deleteMany({
      where: {
        productId: id,
      },
    });

    // Delete product images
    await db.image.deleteMany({
      where: {
        productId: id,
      },
    });

    // Delete cart items
    await db.cartItem.deleteMany({
      where: {
        productId: id,
      },
    });

    // Delete wishlist items
    await db.wishlistItem.deleteMany({
      where: {
        productId: id,
      },
    });

    // Finally delete product
    const orderExists = await db.orderItem.findFirst({
      where: {
        productId: id,
      },
    });

    if (orderExists) {
      return {
        error: "This product has orders and cannot be deleted.",
      };
    }
    await db.product.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return {
      error: "Failed to delete product",
    };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    await checkAdmin();

    if (!data.name?.trim()) {
      return {
        error: "Product name is required",
      };
    }

    if (!data.images || data.images.length === 0) {
      return {
        error: "Please upload at least one image",
      };
    }

    if (Number(data.price) <= 0) {
      return {
        error: "Price must be greater than 0",
      };
    }

    if (Number(data.stock) < 0) {
      return {
        error: "Stock cannot be negative",
      };
    }

    if (!data.size) {
      return {
        error: "Please select at least one size",
      };
    }

    if (!data.gender) {
      return {
        error: "Please select gender",
      };
    }

    await db.image.deleteMany({
      where: {
        productId: id,
      },
    });

    await db.product.update({
      where: { id },

      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),

        isNewArrival: data.isNewArrival ?? true,

        categoryId: data.categoryId,
        size: data.size,
        color: data.color,

        gender: data.gender,
        ageGroup: data.ageGroup,

        specifications: data.specifications || [],

        images: {
          create: data.images.map((url: string) => ({
            url,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/product/${id}`);

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
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
    if (!data.comment.trim()) {
      return {
        error: "Review cannot be empty",
      };
    }

    if (data.comment.trim().length < 10) {
      return {
        error: "Review must be at least 10 characters long",
      };
    }
    if (data.rating < 1 || data.rating > 5) {
      return {
        error: "Invalid rating",
      };
    }

    const existingReview = await db.review.findFirst({
      where: {
        productId: data.productId,
        clerkId: data.clerkId,
      },
    });

    if (existingReview) {
      return {
        error: "You have already reviewed this product.",
      };
    }

    await db.review.create({
      data,
    });

    revalidatePath(`/product/${data.productId}`);

    return { success: true };
  } catch (error) {
    return {
      error: "Review failed",
    };
  }
}

export async function subscribeNewsletter(email: string) {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return {
        error: "Invalid email address",
      };
    }

    await db.newsletter.create({
      data: { email },
    });

    return { success: true };
  } catch (error: any) {
    if (
      error.code === "P2002" ||
      error.message?.includes("Unique constraint")
    ) {
      return {
        error: "You are already subscribed",
      };
    }

    return {
      error: "Subscription failed",
    };
  }
}

export async function upsertBanner(data: any) {
  try {
    await checkAdmin();

    await db.banner.upsert({
      where: {
        type: data.type,
      },

      update: {
        imageUrl: data.imageUrl,
        title: data.title,
        label: data.label,
        subtitle: data.subtitle,
        link: data.link,
      },

      create: {
        type: data.type,
        imageUrl: data.imageUrl,
        title: data.title,
        label: data.label,
        subtitle: data.subtitle,
        link: data.link,
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
    // Check if category has products
    const productCount = await db.product.count({
      where: {
        categoryId: id,
      },
    });

    if (productCount > 0) {
      return {
        error:
          "Cannot delete this category because products are assigned to it.",
      };
    }

    await db.category.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    return {
      error: "Failed to delete category.",
    };
  }
}

export async function updateCategory(
  id: string,
  name: string,
  imageUrl?: string,
) {
  try {
    await checkAdmin();

    const slug = slugify(name);

    // Duplicate slug check
    const existing = await db.category.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    });

    if (existing) {
      return {
        error: "Category already exists",
      };
    }

    await db.category.update({
      where: { id },
      data: {
        name,
        slug,
        imageUrl,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    return {
      error: "Failed to update category",
    };
  }
}

export async function seedCoreCategories() {
  try {
    await checkAdmin();
    const core = [
      { name: "Ethnic Wear", slug: "ethnic-wear", order: 0 },
      { name: "Party Wear", slug: "party-wear", order: 1 },
      { name: "Casual Wear", slug: "casual-wear", order: 2 },
      { name: "Night Wear", slug: "night-wear", order: 3 },
    ];

    for (const cat of core) {
      await db.category.upsert({
        where: { slug: cat.slug },
        update: { isCore: true, order: cat.order },
        create: { ...cat, isCore: true },
      });
    }

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to seed categories" };
  }
}

export async function getNavCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return categories;
  } catch (e) {
    return [];
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
    await db.cartItem.deleteMany({
      where: { clerkId },
    });

    const validItems = [];

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.id },
      });

      if (!product || product.stock <= 0) continue;

      validItems.push({
        clerkId,
        productId: item.id,
        quantity: Math.min(item.quantity, product.stock),
        size: item.size,
      });
    }

    if (validItems.length > 0) {
      await db.cartItem.createMany({
        data: validItems,
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
      include: { product: { include: { images: true } } },
    });
  } catch (e) {
    return [];
  }
}
