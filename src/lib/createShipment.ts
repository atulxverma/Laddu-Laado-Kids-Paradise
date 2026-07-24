import { nimbus } from "./nimbus";

export async function createShipment(order: any) {
  const DEFAULT_WEIGHT = 0.5;
  const DEFAULT_LENGTH = 15;
  const DEFAULT_BREADTH = 15;
  const DEFAULT_HEIGHT = 5;
  const body = {
    order_number: order.id,

    payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",

    name: order.customerName,

    email: order.email,

    phone: order.phone,

    address: order.address,

    city: order.city,

    state: order.state,

    pincode: order.pincode,

    country: "India",

    products: order.orderItems.map((item: any) => ({
      name: item.product.name,
      sku: item.product.id,
      qty: item.quantity,
      price: item.product.price,
      size: item.size,
    })),

    weight: DEFAULT_WEIGHT,
    length: DEFAULT_LENGTH,
    breadth: DEFAULT_BREADTH,
    height: DEFAULT_HEIGHT,
  };

  try {
    const { data } = await nimbus.post("/courier/create-shipment", body);

    return data;
  } catch (error: any) {
    console.error(
      "Nimbus Shipment Error:",
      error.response?.data || error.message,
    );

    throw new Error(
      error.response?.data?.message || "Failed to create shipment.",
    );
  }
}
