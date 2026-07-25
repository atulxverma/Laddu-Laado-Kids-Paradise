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
    order_amount: order.total,
  };

  try {
    const response = await nimbus.post("/courier/create-shipment", body);

    console.log("=========== NIMBUS DEBUG ===========");
    console.log("STATUS:", response.status);
    console.log("HEADERS:", response.headers);
    console.log("CONTENT-TYPE:", response.headers["content-type"]);
    console.log("FINAL URL:", response.request?.res?.responseUrl);
    console.log("DATA:");
    console.log(response.data);
    console.log("====================================");

    return response.data;
  } catch (error: any) {
    console.error("=========== NIMBUS ERROR ===========");
    console.error("STATUS:", error.response?.status);
    console.error("HEADERS:", error.response?.headers);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);
    console.error("====================================");

    throw new Error(
      error.response?.data?.message || "Failed to create shipment.",
    );
  }
}
