"use server";

import { sendAdminMail } from "@/lib/sendAdminMail";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { Resend } from "resend";
import Razorpay from "razorpay";
import crypto from "crypto";
import { render } from "@react-email/render";

import OrderConfirmationEmail from "@/app/(store)/emails/OrderConfirmationEmail";
import AdminOrderEmail from "@/app/(store)/emails/AdminOrderEmail";
import WelcomeNewsletterEmail from "@/app/(store)/emails/WelcomeNewsletterEmail";

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

  await sendAdminMail(
    "🚨 Unauthorized Access Attempt",
    `
      <p><b>User:</b> ${user?.fullName || "Unknown User"}</p>
      <p><b>Email:</b> ${user?.primaryEmailAddress?.emailAddress || "Unknown Email"}</p>
    `,
  );

  if (!user || user.primaryEmailAddress?.emailAddress !== adminEmail) {
    throw new Error("Unauthorized: Access Denied");
  }
}

type CheckoutItem = {
  id: string;
  quantity: number;
  size: string;
};

type PaymentDetails = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export async function initiateRazorpayPayment(items: CheckoutItem[]) {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        error: "Please sign in before checkout.",
      };
    }

    if (!items || items.length === 0) {
      return {
        success: false,
        error: "Cart is empty.",
      };
    }

    const productIds = [...new Set(items.map((item) => item.id))];

    const products = await db.product.findMany({
      
      where: {
        id: {
          in: productIds,
        },
        isArchived: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        variants: true,
      },
    });

    if (products.length !== productIds.length) {
      return {
        success: false,
        error: "Some products are unavailable.",
      };
    }

    let serverTotal = 0;

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return {
          success: false,
          error: "Invalid product quantity.",
        };
      }

      const product = products.find((product) => product.id === item.id);

      if (!product) {
        return {
          success: false,
          error: "Product not found.",
        };
      }

      const variant = product.variants.find((v) => v.size === item.size);

      if (!variant) {
        return {
          success: false,
          error: `${product.name} (${item.size}) not available.`,
        };
      }

      if (variant.stock < item.quantity) {
        return {
          success: false,
          error: `${product.name} (${item.size}) has only ${variant.stock} left.`,
        };
      }

      serverTotal += product.price * item.quantity;
    }

    const amountInPaise = Math.round(serverTotal * 100);

    if (amountInPaise <= 0) {
      return {
        success: false,
        error: "Invalid order amount.",
      };
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return {
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      total: serverTotal,
    };
  } catch (error) {
    console.error("Razorpay order creation error:", error);

    return {
      success: false,
      error: "Failed to initiate payment.",
    };
  }
}

export async function createOrder(data: {
  phone: string;

  address: string;

  items: CheckoutItem[];

  paymentMethod: "ONLINE" | "COD";

  payment?: PaymentDetails;
}) {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        error: "Please sign in before placing an order.",
      };
    }

    if (!data.items || data.items.length === 0) {
      return {
        error: "Cart is empty.",
      };
    }

    const cleanAddress = data.address.trim();
    const cleanPhone = data.phone.trim();

    if (!cleanAddress) {
      return {
        error: "Address is required.",
      };
    }

    if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
      return {
        error: "Please enter a valid 10-digit Indian phone number.",
      };
    }
    const isCOD = data.paymentMethod === "COD";
    const productIds = [...new Set(data.items.map((item) => item.id))];

    const products = await db.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        isArchived: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        variants: true,
      },
    });

    if (products.length !== productIds.length) {
      return {
        error: "Some products are unavailable.",
      };
    }

    let serverTotal = 0;

    for (const item of data.items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return { error: "Invalid quantity." };
      }

      const product = products.find((p) => p.id === item.id);

      if (!product) {
        return { error: "Product not found." };
      }

      const variant = product.variants.find((v) => v.size === item.size);

      if (!variant) {
        return {
          error: `${product.name} (${item.size}) is unavailable.`,
        };
      }

      if (variant.stock < item.quantity) {
        return {
          error: `${product.name} (${item.size}) has only ${variant.stock} left.`,
        };
      }

      serverTotal += product.price * item.quantity;
    }

    const finalTotal =
      serverTotal + (serverTotal >= 999 ? 0 : 79) + (isCOD ? 49 : 0);
    if (!isCOD) {
      if (
        !data.payment?.razorpayOrderId ||
        !data.payment?.razorpayPaymentId ||
        !data.payment?.razorpaySignature
      ) {
        return {
          error: "Payment verification details are missing.",
        };
      }

      const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!razorpaySecret) {
        throw new Error("Razorpay secret is not configured.");
      }

      const generatedSignature = crypto
        .createHmac("sha256", razorpaySecret)
        .update(
          `${data.payment.razorpayOrderId}|${data.payment.razorpayPaymentId}`,
        )
        .digest("hex");

      const receivedSignature = data.payment.razorpaySignature;

      const generatedBuffer = Buffer.from(generatedSignature, "utf8");

      const receivedBuffer = Buffer.from(receivedSignature, "utf8");

      const isSignatureValid =
        generatedBuffer.length === receivedBuffer.length &&
        crypto.timingSafeEqual(generatedBuffer, receivedBuffer);

      if (!isSignatureValid) {
        return {
          error: "Payment verification failed.",
        };
      }

      const existingOrder = await db.order.findFirst({
        where: {
          razorpayPaymentId: data.payment.razorpayPaymentId,
        },
      });

      if (existingOrder) {
        return {
          success: true,
          orderId: existingOrder.id,
        };
      }

      const razorpayPayment = await razorpay.payments.fetch(
        data.payment.razorpayPaymentId,
      );

      if (razorpayPayment.order_id !== data.payment.razorpayOrderId) {
        return {
          error: "Payment order verification failed.",
        };
      }

      if (razorpayPayment.status !== "captured") {
        return {
          error: "Payment has not been successfully captured.",
        };
      }

      const razorpayOrder = await razorpay.orders.fetch(
        data.payment.razorpayOrderId,
      );

      const expectedAmount = Math.round(serverTotal * 100);

      if (
        Number(razorpayOrder.amount) !== expectedAmount ||
        razorpayOrder.currency !== "INR"
      ) {
        return {
          error: "Payment amount verification failed.",
        };
      }
    }

    //without razorpay code

    //     const productIds = [...new Set(data.items.map((item) => item.id))];

    // const products = await db.product.findMany({
    //   where: {
    //     id: {
    //       in: productIds,
    //     },
    //     isArchived: false,
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     price: true,
    //     stock: true,
    //   },
    // });

    // let serverTotal = 0;

    // for (const item of data.items) {
    //   const product = products.find((p) => p.id === item.id);

    //   if (!product) {
    //     return { error: "Product not found." };
    //   }

    //   serverTotal += product.price * item.quantity;
    // }

    //till there

    const order = await db.$transaction(async (tx) => {
      for (const item of data.items) {
        const latestProduct = await tx.product.findUnique({
          where: {
            id: item.id,
          },
          include: {
            variants: true,
          },
        });

        if (!latestProduct) {
          throw new Error("A product in your cart no longer exists.");
        }

        const variant = latestProduct.variants.find(
  (v) => v.size === item.size
);

if (!variant) {
  throw new Error(
    `${latestProduct.name} (${item.size}) is unavailable.`
  );
}

if (variant.stock < item.quantity) {
  throw new Error(
    `${latestProduct.name} (${item.size}) has only ${variant.stock} left.`
  );
}
} 
      
      const newOrder = await tx.order.create({
        data: {
          clerkId: user.id,
          customerName: user.fullName || "Guest User",
          phone: cleanPhone,
          address: cleanAddress,
          isPaid: !isCOD,

          status: isCOD ? "Pending" : "Confirmed",

          paymentMethod: data.paymentMethod,

          subtotal: serverTotal,

          deliveryCharge: serverTotal >= 999 ? 0 : 79,

          codCharge: isCOD ? 49 : 0,

          total: finalTotal,

          razorpayOrderId: isCOD ? null : data.payment?.razorpayOrderId,

          razorpayPaymentId: isCOD ? null : data.payment?.razorpayPaymentId,

          orderItems: {
            create: data.items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              size: item.size,
            })),
          },
        },
      });
    
      for (const item of data.items) {
        await tx.productVariant.update({
          where: {
            productId_size: {
              productId: item.id,
              size: item.size,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
        await tx.product.update({
  where: {
    id: item.id,
  },
  data: {
    stock: {
      decrement: item.quantity,
    },
  },
});
      }

      await tx.cartItem.deleteMany({
        where: {
          clerkId: user.id,
        },
      });

      return newOrder;
    });
    const fullOrder = await db.order.findUnique({
      where: {
        id: order.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!fullOrder) {
      throw new Error("Order not found.");
    }

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    const orderIdShort = order.id.slice(-6).toUpperCase();

    if (process.env.RESEND_API_KEY) {
      try {
        const products = fullOrder.orderItems.map((item) => ({
          name: item.product.name,
          image: item.product.images[0]?.url || "",
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          color: item.product.color || "",
          gender: item.product.gender || "",
        }));

        const customerEmail = user.primaryEmailAddress?.emailAddress;

        if (customerEmail) {
          await resend.emails.send({
            from: "Laddoo Laado <onboarding@resend.dev>",
            to: customerEmail,
            subject: `Your Order #${orderIdShort} is Confirmed 🎉`,
            html: await render(
              OrderConfirmationEmail({
                customerName: fullOrder.customerName,
                orderId: orderIdShort,
                phone: fullOrder.phone,
                address: fullOrder.address,
                paymentMethod: fullOrder.paymentMethod,
                paymentStatus: fullOrder.isPaid ? "Paid" : "Pending",
                subtotal: fullOrder.subtotal,
                deliveryCharge: fullOrder.deliveryCharge,
                codCharge: fullOrder.codCharge,
                total: fullOrder.total,
                products,
              }),
            ),
          });
        }

        if (adminEmail) {
          await sendAdminMail(
            `🛒 New Order #${orderIdShort}`,
            await render(
              AdminOrderEmail({
                customerName: fullOrder.customerName,
                customerEmail: user.primaryEmailAddress?.emailAddress || "N/A",
                orderId: orderIdShort,
                phone: fullOrder.phone,
                address: fullOrder.address,
                paymentMethod: fullOrder.paymentMethod,
                paymentStatus: fullOrder.isPaid ? "Paid" : "Pending",
                subtotal: fullOrder.subtotal,
                deliveryCharge: fullOrder.deliveryCharge,
                codCharge: fullOrder.codCharge,
                total: fullOrder.total,
                products,
              }),
            ),
          );
        }
      } catch (emailError) {
        console.error("Order email failed:", emailError);
      }
    }
    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");
    revalidatePath("/orders");
    revalidatePath("/shop");
    revalidatePath("/cart");

    return {
      success: true,
      orderId: order.id,
    };
  } catch (error) {
    console.error("Create order error:", error);

    return {
      error: error instanceof Error ? error.message : "Failed to place order.",
    };
  }
}

// --- PRODUCT ACTIONS ---
export async function createProduct(data: any) {
  try {
    await checkAdmin();

    if (!data.name?.trim()) {
      return { error: "Product name is required" };
    }

    if (!data.price || Number(data.price) <= 0) {
      return { error: "Valid price is required" };
    }

    if (!data.categoryId) {
      return { error: "Please select a category" };
    }

    if (!data.images?.length) {
      return { error: "Upload at least one image" };
    }

    if (!data.gender) {
      return { error: "Please select gender" };
    }

    if (!data.variants || data.variants.length === 0) {
      return { error: "Please add at least one size." };
    }

    const validVariants = data.variants.filter(
      (v: any) =>
        v.size && Number.isInteger(Number(v.stock)) && Number(v.stock) >= 0,
    );

    if (validVariants.length === 0) {
      return {
        error: "Please enter valid stock for every selected size.",
      };
    }

    const totalStock = validVariants.reduce(
      (sum: number, v: any) => sum + Number(v.stock),
      0,
    );

    await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),

        isNewArrival: data.isNewArrival ?? true,
        isTrending: data.isTrending ?? false,
        isExclusive: data.isExclusive ?? false,

        gender: data.gender,
        color: data.color,

        categoryId: data.categoryId,

        specifications: data.specifications,

        // backward compatibility
        size: validVariants.map((v: any) => v.size).join(","),

        stock: totalStock,

        images: {
          create: data.images.map((url: string) => ({
            url,
          })),
        },

        variants: {
          create: validVariants.map((v: any) => ({
            size: v.size,
            stock: Number(v.stock),
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/shop");

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
}

// --- OTHER ACTIONS ---
export async function createCategory(
  name: string,
  imageUrl?: string,
  showOnHome?: boolean,
) {
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
        showOnHome: showOnHome ?? true,
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
    await db.productVariant.deleteMany({
  where: {
    productId: id,
  },
});
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

    if (!data.images?.length) {
      return {
        error: "Please upload at least one image",
      };
    }

    if (!data.price || Number(data.price) <= 0) {
      return {
        error: "Price must be greater than 0",
      };
    }

    if (!data.categoryId) {
      return {
        error: "Please select category",
      };
    }

    if (!data.gender) {
      return {
        error: "Please select gender",
      };
    }

    if (!data.variants || data.variants.length === 0) {
      return {
        error: "Please add at least one size.",
      };
    }

    const validVariants = data.variants.filter(
      (v: any) =>
        v.size && Number.isInteger(Number(v.stock)) && Number(v.stock) >= 0,
    );

    if (validVariants.length === 0) {
      return {
        error: "Invalid variants.",
      };
    }

    const totalStock = validVariants.reduce(
      (sum: number, v: any) => sum + Number(v.stock),
      0,
    );

    await db.$transaction(async (tx) => {
      // Delete old images
      await tx.image.deleteMany({
        where: {
          productId: id,
        },
      });
    

      // Delete old variants
      await tx.productVariant.deleteMany({
        where: {
          productId: id,
        },
      });

      // Update product
      await tx.product.update({
        where: {
          id,
        },

        data: {
          name: data.name,
          description: data.description,
          price: Number(data.price),

          isNewArrival: data.isNewArrival ?? true,
          isTrending: data.isTrending ?? false,
          isExclusive: data.isExclusive ?? false,

          categoryId: data.categoryId,

          color: data.color,

          gender: data.gender,

          specifications: data.specifications || [],

          // backward compatibility
          size: validVariants.map((v: any) => v.size).join(","),

          stock: totalStock,

          images: {
            create: data.images.map((url: string) => ({
              url,
            })),
          },

          variants: {
            create: validVariants.map((v: any) => ({
              size: v.size,
              stock: Number(v.stock),
            })),
          },
        },
      });
    });

    revalidatePath("/admin/products");
    revalidatePath(`/product/${id}`);
    revalidatePath("/shop");
    revalidatePath("/");

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

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return {
        error: "Invalid order status",
      };
    }

    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        status: true,
      },
    });

    if (!order) {
      return {
        error: "Order not found",
      };
    }

    if (order.status === "Delivered" || order.status === "Cancelled") {
      return {
        error: `${order.status} orders cannot be modified`,
      };
    }

    await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });
    if (status === "Cancelled") {
      await sendAdminMail(
        "❌ Order Cancelled",
        `
<p><b>Order:</b> ${orderId}</p>

<p>Status : Cancelled</p>
`,
      );
    }
    if (status === "Delivered") {
      await sendAdminMail(
        "✅ Order Delivered",
        `
<p>Order : ${orderId}</p>

<p>Status : Delivered</p>
`,
      );
    }
    if (status === "Shipped") {
      await sendAdminMail(
        "🚚 Order Shipped",
        `
<p>Order : ${orderId}</p>

<p>Status : Shipped</p>
`,
      );
    }

    revalidatePath("/admin/orders");
    revalidatePath("/orders");

    return {
      success: true,
    };
  } catch (error) {
    console.error("UPDATE_ORDER_STATUS_ERROR", error);

    return {
      error: "Failed to update status",
    };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const order = await db.order.findFirst({
      where: {
        id: orderId,
        clerkId: user.id,
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return { error: "Order not found." };
    }

    if (order.status !== "Pending") {
      return {
        error: "Only pending orders can be cancelled.",
      };
    }

    await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "Cancelled",
        },
      });

      for (const item of order.orderItems) {
  await tx.productVariant.update({
    where: {
      productId_size: {
        productId: item.productId,
        size: item.size,
      },
    },
    data: {
      stock: {
        increment: item.quantity,
      },
    },
  });

  await tx.product.update({
    where: {
      id: item.productId,
    },
    data: {
      stock: {
        increment: item.quantity,
      },
    },
  });
}
    });

    revalidatePath("/orders");
    revalidatePath("/admin/orders");
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to cancel order.",
    };
  }
}

export async function createReview(data: {
  productId: string;
  rating: number;
  comment: string;
}) {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        error: "Please sign in to submit a review.",
      };
    }

    const cleanComment = data.comment.trim();

    if (!cleanComment) {
      return {
        error: "Review cannot be empty.",
      };
    }

    if (cleanComment.length < 10) {
      return {
        error: "Review must be at least 10 characters long.",
      };
    }

    if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
      return {
        error: "Invalid rating.",
      };
    }

    const product = await db.product.findUnique({
      where: {
        id: data.productId,
      },
      select: {
        id: true,
        isArchived: true,
      },
    });

    if (!product || product.isArchived) {
      return {
        error: "This product is no longer available.",
      };
    }

    const existingReview = await db.review.findFirst({
      where: {
        productId: data.productId,
        clerkId: user.id,
      },
    });

    if (existingReview) {
      return {
        error: "You have already reviewed this product.",
      };
    }

    await db.review.create({
      data: {
        productId: data.productId,
        rating: data.rating,
        comment: cleanComment,
        clerkId: user.id,
        userName: user.fullName || "Valued Customer",
        userImage: user.imageUrl || null,
      },
    });

    revalidatePath(`/product/${data.productId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Create review error:", error);

    return {
      error: "Review failed.",
    };
  }
}

export async function subscribeNewsletter(email: string) {
  await resend.emails.send({
    from: "Laddoo Laado <onboarding@resend.dev>",
    to: email,
    subject: "✨ Welcome to the Laddoo Laado Family",
    html: await render(
      WelcomeNewsletterEmail({
        email,
      }),
    ),
  });
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

    await sendAdminMail(
      "📧 New Newsletter Subscriber",
      `
    <h2>New Subscriber</h2>

    <p><b>Email:</b> ${email}</p>

    <p><b>Time:</b> ${new Date()}</p>
  `,
    );
    await resend.emails.send({
      from: "Laddoo Laado <onboarding@resend.dev>",
      to: email,
      subject: "✨ Welcome to the Laddoo Laado Family",
      html: await render(
        WelcomeNewsletterEmail({
          email,
        }),
      ),
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
        active: true,
      },

      create: {
        type: data.type,
        imageUrl: data.imageUrl,
        title: data.title,
        label: data.label,
        subtitle: data.subtitle,
        link: data.link,
        active: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");

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
  showOnHome?: boolean,
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
        showOnHome,
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

export async function deleteBanner(type: string) {
  try {
    await db.banner.update({
      where: {
        type,
      },
      data: {
        imageUrl: "",
        title: "",
        label: "",
        active: false,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to remove banner.",
    };
  }
}

export async function syncCartWithDb(items: any[]) {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        error: "Unauthorized",
      };
    }

    if (!Array.isArray(items)) {
      return {
        error: "Invalid cart data",
      };
    }

    const clerkId = user.id;

    const mergedItems = new Map<
      string,
      {
        id: string;
        size: string;
        quantity: number;
      }
    >();

    for (const item of items) {
      if (
        !item.id ||
        !item.size ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        continue;
      }

      const key = `${item.id}-${item.size}`;

      const existing = mergedItems.get(key);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        mergedItems.set(key, {
          id: item.id,
          size: item.size,
          quantity: item.quantity,
        });
      }
    }

    const validItems = [];

    for (const item of mergedItems.values()) {
      const product = await db.product.findUnique({
  where: {
    id: item.id,
  },
  select: {
    id: true,
    isArchived: true,
    variants: true,
  },
});

if (!product || product.isArchived) {
  continue;
}

const variant = product.variants.find(
  (v) => v.size === item.size
);

if (!variant || variant.stock <= 0) {
  continue;
}

validItems.push({
  clerkId,
  productId: product.id,
  quantity: Math.min(item.quantity, variant.stock),
  size: item.size,
});
    }

    await db.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({
        where: {
          clerkId,
        },
      });

      if (validItems.length > 0) {
        await tx.cartItem.createMany({
          data: validItems,
        });
      }
    });
  

    return {
      success: true,
    };
  } catch (error) {
    console.error("DB_SYNC_FAIL", error);

    return {
      error: "Failed to sync cart",
    };
  }
}

export async function getDbCart() {
  try {
    const user = await currentUser();

    if (!user) {
      return [];
    }

    const cartItems = await db.cartItem.findMany({
      where: {
        clerkId: user.id,
      },
      include: {
        product: {
          include: {
            images: true,
            category: true,
            reviews: true,
            variants: true,
          },
        },
      },
    });

    return cartItems.filter((item) => {
  if (!item.product || item.product.isArchived) {
    return false;
  }

  const variant = item.product.variants.find(
    (v) => v.size === item.size
  );

  return !!variant && variant.stock > 0;
});
  } catch (error) {
    console.error("GET_CART_FAIL", error);
    return [];
  }
}
