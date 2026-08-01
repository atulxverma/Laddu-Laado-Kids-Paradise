import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function validateAddress(data: any) {
  const name = String(data.name || "").trim();
  const phone = String(data.phone || "").replace(/\D/g, "");
  const pincode = String(data.pincode || "").replace(/\D/g, "");
  const city = String(data.city || "").trim();
  const state = String(data.state || "").trim();
  const houseDetails = String(data.houseDetails || "").trim();
  const label = String(data.label || "Home").trim();

  if (name.length < 2) {
    return { error: "Please enter a valid name." };
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return { error: "Please enter a valid 10-digit mobile number." };
  }

  if (!/^[1-9]\d{5}$/.test(pincode)) {
    return { error: "Please enter a valid pincode." };
  }

  if (!city) {
    return { error: "City is required." };
  }

  if (!state) {
    return { error: "State is required." };
  }

  if (!houseDetails) {
    return { error: "Complete address is required." };
  }

  return {
    data: {
      name,
      phone,
      pincode,
      city,
      state,
      houseDetails,
      label: label || "Home",
    },
  };
}

// ==========================================
// GET — Logged-in user's saved addresses
// ==========================================

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const addresses = await db.address.findMany({
      where: {
        clerkId: user.id,
      },

      orderBy: [
        {
          isDefault: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("GET_ADDRESSES_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load saved addresses.",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// POST — Save new address
// ==========================================

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const validation = validateAddress(body);

    if ("error" in validation) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const addressData = validation.data;

    // Limit addresses so one user cannot create unlimited records.
    const addressCount = await db.address.count({
      where: {
        clerkId: user.id,
      },
    });

    if (addressCount >= 10) {
      return NextResponse.json(
        {
          success: false,
          error: "You can save up to 10 addresses.",
        },
        { status: 400 }
      );
    }

    // First address automatically becomes default.
    const shouldBeDefault =
      addressCount === 0 || body.isDefault === true;

    const address = await db.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: {
            clerkId: user.id,
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.address.create({
        data: {
          clerkId: user.id,

          name: addressData.name,
          phone: addressData.phone,

          pincode: addressData.pincode,
          city: addressData.city,
          state: addressData.state,
          houseDetails: addressData.houseDetails,

          label: addressData.label,

          isDefault: shouldBeDefault,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        address,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_ADDRESS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save address.",
      },
      { status: 500 }
    );
  }
}