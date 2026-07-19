import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Row,
    Column,
} from "@react-email/components";

type OrderConfirmationEmailProps = {
    customerName: string;
    orderId: string;

    phone: string;
    address: string;

    paymentMethod: string;
    paymentStatus: string;

    subtotal: number;
    deliveryCharge: number;
    codCharge: number;
    total: number;

    products: {
        name: string;
        image: string;
        price: number;
        quantity: number;
        size: string;
        color?: string;
        gender?: string;
    }[];
};

export default function OrderConfirmationEmail({
    customerName,
    orderId,
    phone,
    address,
    paymentMethod,
    paymentStatus,
    subtotal,
    deliveryCharge,
    codCharge,
    total,
    products,
}: OrderConfirmationEmailProps) {
    return (
        <Html>

            <Head />
            <Preview>
                Your Laddoo Laado order has been confirmed 🎉
            </Preview>

            <Body
                style={{
                    backgroundColor: "#f5f5f5",
                    fontFamily:
                        "Inter,Arial,sans-serif",
                }}
            ><Container
                style={{
                    maxWidth: "680px",
                    background: "#ffffff",
                    margin: "40px auto",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid #ececec",
                }}
            ><Section
                style={{
    backgroundColor: "#111111",
    padding: "40px",
    textAlign: "center",
}}
            >
                        <Img
                            src="https://laddoolaado.com/logo1.jpeg"
                            width="90"
                            alt="Laddoo Laado"
                            style={{
                                margin: "0 auto 20px",
                            }}
                        />
                        <Heading
                            style={{
                                color: "#fff",
                                fontSize: "34px",
                                marginBottom: 8,
                            }}
                        >
                            Laddoo Laado
                        </Heading><Text
                            style={{
                                color: "#ddd",
                                fontSize: 15,
                            }}
                        >
                            Premium Fashion For Every Occasion
                        </Text></Section><Section
                            style={{
                                padding: "40px",
                            }}
                        ><Heading
                            style={{
                                fontSize: 28,
                                marginBottom: 10,
                            }}
                        >

                            🎉 Order Confirmed

                        </Heading><Text
                            style={{
                                fontSize: 16,
                                lineHeight: "28px",
                                color: "#555",
                            }}
                        >

                            Hi {customerName},

                            <br />

                            Thank you for shopping with
                            <b> Laddoo Laado.</b>

                            Your order has been successfully confirmed and is now being prepared with care.

                        </Text></Section>
                    <Hr style={{ borderColor: "#eeeeee", margin: "0" }} />

                    <Section style={{ padding: "35px 40px" }}>
                        <Heading
                            style={{
                                fontSize: 20,
                                marginBottom: 25,
                                color: "#111",
                            }}
                        >
                            📦 Ordered Items
                        </Heading>

                        {products.map((product, index) => (
                            <Section
                                key={index}
                                style={{
                                    border: "1px solid #e5e5e5",
                                    borderRadius: "18px",
                                    padding: "18px",
                                    marginBottom: "20px",
                                }}
                            >
                                <Row>
                                    <Column width="120">
                                        <Img
                                            src={product.image}
                                            width="100"
                                            height="120"
                                            alt={product.name}
                                            style={{
                                                borderRadius: "12px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Column>

                                    <Column>
                                        <Text
                                            style={{
                                                fontSize: "18px",
                                                fontWeight: "700",
                                                color: "#111",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            {product.name}
                                        </Text>

                                        <Text
                                            style={{
                                                color: "#666",
                                                margin: "4px 0",
                                            }}
                                        >
                                            Size : <b>{product.size}</b>
                                        </Text>

                                        <Text
                                            style={{
                                                color: "#666",
                                                margin: "4px 0",
                                            }}
                                        >
                                            Quantity : <b>{product.quantity}</b>
                                        </Text>
                                        {product.color && (
                                            <Text
                                                style={{
                                                    color: "#666",
                                                    margin: "4px 0",
                                                }}
                                            >
                                                Color : <b>{product.color}</b>
                                            </Text>
                                        )}

                                        {product.gender && (
                                            <Text
                                                style={{
                                                    color: "#666",
                                                    margin: "4px 0",
                                                }}
                                            >
                                                Category : <b>{product.gender}</b>
                                            </Text>
                                        )}
                                        <Text
                                            style={{
                                                color: "#666",
                                                margin: "4px 0",
                                            }}
                                        >
                                            Price : <b>₹{product.price.toFixed(2)}</b>
                                        </Text>

                                        <Text
                                            style={{
                                                color: "#111",
                                                fontWeight: "700",
                                                marginTop: "12px",
                                            }}
                                        >
                                            Total : ₹{(product.price * product.quantity).toFixed(2)}
                                        </Text>
                                    </Column>
                                </Row>
                            </Section>
                        ))}
                    </Section><Hr style={{ borderColor: "#eeeeee" }} />

                    <Section style={{ padding: "35px 40px" }}>
                        <Heading
                            style={{
                                fontSize: 20,
                                marginBottom: 20,
                            }}
                        >
                            💳 Order Summary
                        </Heading>

                        <Row>
                            <Column>
                                <Text>Subtotal</Text>
                            </Column>

                            <Column align="right">
                                <Text>₹{subtotal.toFixed(2)}</Text>
                            </Column>
                        </Row>

                        <Row>
                            <Column>
                                <Text>Delivery</Text>
                            </Column>

                            <Column align="right">
                                <Text>
                                    {deliveryCharge === 0 ? "FREE 🎉" : `₹${deliveryCharge.toFixed(2)}`}
                                </Text>
                            </Column>
                        </Row>

                        <Row>
                            <Column>
                                <Text>COD Charge</Text>
                            </Column>

                            <Column align="right">
                                <Text>
                                    {codCharge === 0 ? "-" : `₹${codCharge.toFixed(2)}`}
                                </Text>
                            </Column>
                        </Row>

                        <Hr />

                        <Row>
                            <Column>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "700",
                                    }}
                                >
                                    Grand Total
                                </Text>
                            </Column>

                            <Column align="right">
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "700",
                                    }}
                                >
                                    ₹{total.toFixed(2)}
                                </Text>
                            </Column>
                        </Row>
                    </Section><Hr style={{ borderColor: "#eeeeee" }} />

                    <Section style={{ padding: "35px 40px" }}>
                        <Heading
                            style={{
                                fontSize: 20,
                                marginBottom: 25,
                                color: "#111",
                            }}
                        >
                            📋 Order Information
                        </Heading>

                        <Row>
                            <Column>
                                <Text style={{ color: "#777" }}>Order ID</Text>
                            </Column>

                            <Column align="right">
                                <Text style={{ fontWeight: "700" }}>{orderId}</Text>
                            </Column>
                        </Row>

                        <Row>
                            <Column>
                                <Text style={{ color: "#777" }}>Payment Method</Text>
                            </Column>

                            <Column align="right">
                                <Text style={{ fontWeight: "700" }}>
                                    {paymentMethod}
                                </Text>
                            </Column>
                        </Row>

                        <Row>
                            <Column>
                                <Text style={{ color: "#777" }}>Payment Status</Text>
                            </Column>

                            <Column align="right">
                                <Text
                                    style={{
                                        display: "inline-block",
                                        backgroundColor:
                                            paymentStatus === "Paid"
                                                ? "#DCFCE7"
                                                : "#FEE2E2",
                                        color:
                                            paymentStatus === "Paid"
                                                ? "#166534"
                                                : "#B91C1C",
                                        padding: "6px 12px",
                                        borderRadius: "999px",
                                        fontWeight: "700",
                                    }}
                                >
                                    {paymentStatus}
                                </Text>
                            </Column>
                        </Row>
                    </Section><Hr style={{ borderColor: "#eeeeee" }} />

                    <Section
                        style={{
                            padding: "35px 40px",
                        }}
                    >
                        <Heading
                            style={{
                                fontSize: 20,
                                marginBottom: 20,
                            }}
                        >
                            🚚 Shipping Address
                        </Heading>

                        <Text
                            style={{
                                fontSize: 15,
                                lineHeight: "28px",
                                color: "#555",
                            }}
                        >
                            <b>{customerName}</b>

                            <br />

                            {address}

                            <br />

                            📞 {phone}
                        </Text>
                    </Section><Hr style={{ borderColor: "#eeeeee" }} />

                    <Section
                        style={{
                            padding: "40px",
                            textAlign: "center",
                        }}
                    >
                        <Heading
                            style={{
                                fontSize: 24,
                                marginBottom: 12,
                                color: "#111",
                            }}
                        >
                            ❤️ Thank You For Shopping With Us
                        </Heading>

                        <Text
                            style={{
                                color: "#666",
                                lineHeight: "28px",
                                fontSize: "16px",
                            }}
                        >
                            We truly appreciate your trust in Laddoo Laado.

                            <br />

                            Every order is packed carefully with love.

                            <br />

                            We hope to see you again soon.
                        </Text>
                    </Section><Section
                        style={{
                            textAlign: "center",
                            paddingBottom: "45px",
                        }}
                    >
                        <Button
                            href={`https://laddoolaado.com/orders/${orderId}`}
                            style={{
                                background: "#111",
                                color: "#fff",
                                padding: "14px 28px",
                                borderRadius: "10px",
                                textDecoration: "none",
                                marginRight: "10px",
                            }}
                        >
                            Track Order
                        </Button>

                        <Button
                            href="https://laddoolaado.com/shop"
                            style={{
                                background: "#ffffff",
                                color: "#111",
                                border: "1px solid #111",
                                padding: "14px 28px",
                                borderRadius: "10px",
                                textDecoration: "none",
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Section><Hr />

                    <Section
                        style={{
                            padding: "30px",
                            textAlign: "center",
                            background: "#fafafa",
                        }}
                    >
                        <Text
                            style={{
                                color: "#666",
                                lineHeight: "28px",
                                fontSize: "14px",
                            }}
                        >
                            Need help?

                            <br />

                            support@laddoolaado.com

                            <br /><br />

                            © 2026 Laddoo Laado

                            <br />

                            Made with ❤️ in India
                        </Text>
                    </Section></Container>

            </Body>

        </Html >
    );
}