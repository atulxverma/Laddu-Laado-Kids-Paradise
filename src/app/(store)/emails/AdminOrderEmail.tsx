import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";

type AdminOrderEmailProps = {
    customerName: string;
    customerEmail: string;

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
        quantity: number;
        price: number;
        size: string;
        color?: string;
    }[];
};

export default function AdminOrderEmail({
    customerName,
    customerEmail,
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
}: AdminOrderEmailProps) {
    return (
        <Html>
            <Head />

            <Preview>🛒 New Order Received</Preview>

            <Body
                style={{
                    backgroundColor: "#f5f5f5",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <Container
                    style={{
                        maxWidth: "680px",
                        margin: "40px auto",
                        background: "#fff",
                        borderRadius: "20px",
                        overflow: "hidden",
                        border: "1px solid #ececec",
                    }}
                >
                    <Section
                        style={{
                            backgroundColor: "#111111",
                            padding: "40px",
                            textAlign: "center",
                        }}
                    >
                        <Heading
                            style={{
                                color: "#fff",
                                fontSize: "32px",
                            }}
                        >
                            🛒 New Order
                        </Heading>

                        <Text
                            style={{
                                color: "#ddd",
                            }}
                        >
                            Laddoo Laado Admin Notification
                        </Text>
                    </Section>
                    <Hr />

                    <Section
                        style={{
                            padding: "35px 40px",
                        }}
                    >
                        <Heading
                            style={{
                                fontSize: 20,
                            }}
                        >
                            👤 Customer Details
                        </Heading>

                        <Text><b>Name:</b> {customerName}</Text>

                        <Text><b>Email:</b> {customerEmail}</Text>

                        <Text><b>Phone:</b> {phone}</Text>

                        <Text><b>Address:</b></Text>

                        <Text>{address}</Text>
                    </Section>
                    <Hr />

                    <Section
                        style={{
                            padding: "35px 40px",
                        }}
                    >
                        <Heading
                            style={{
                                fontSize: 20,
                            }}
                        >
                            📋 Order Details
                        </Heading>

                        <Row>
                            <Column>
                                <Text>Order ID</Text>
                            </Column>

                            <Column align="right">
                                <Text>{orderId}</Text>
                            </Column>
                        </Row>

                        <Row>
                            <Column>
                                <Text>Payment</Text>
                            </Column>

                            <Column align="right">
                                <Text>{paymentMethod}</Text>
                            </Column>
                        </Row>

                        <Row>
                            <Column>
                                <Text>Status</Text>
                            </Column>

                            <Column align="right">
                                <Text
                                    style={{
                                        color:
                                            paymentStatus === "Paid"
                                                ? "#16a34a"
                                                : "#dc2626",
                                        fontWeight: "700",
                                    }}
                                >
                                    {paymentStatus}
                                </Text>
                            </Column>
                        </Row>
                    </Section>
                    <Hr />

                    <Section
                        style={{
                            padding: "35px 40px",
                        }}
                    >
                        <Heading
                            style={{
                                fontSize: 20,
                            }}
                        >
                            📦 Ordered Products
                        </Heading>

                        {products.map((product, index) => (
                            <Section
                                key={index}
                                style={{
                                    border: "1px solid #ececec",
                                    borderRadius: "14px",
                                    padding: "18px",
                                    marginBottom: "18px",
                                }}
                            >
                                <Row>
                                    <Column width="110">
                                        <Img
                                            src={product.image}
                                            width="90"
                                            height="110"
                                            alt={product.name}
                                            style={{
                                                borderRadius: "10px",
                                            }}
                                        />
                                    </Column>

                                    <Column>
                                        <Text
                                            style={{
                                                fontSize: "17px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {product.name}
                                        </Text>

                                        <Text>Size : {product.size}</Text>

                                        {product.color && (
                                            <Text>
                                                Color : {product.color}
                                            </Text>
                                        )}

                                        <Text>
                                            Qty : {product.quantity}
                                        </Text>

                                        <Text>
                                            ₹{product.price.toFixed(2)}
                                        </Text>

                                        <Text
                                            style={{
                                                fontWeight: "700",
                                            }}
                                        >
                                            Total ₹
                                            {(product.price * product.quantity).toFixed(2)}
                                        </Text>
                                    </Column>
                                </Row>
                            </Section>
                        ))}
                    </Section>
                    <Hr />

                    <Section
                        style={{
                            padding: "35px 40px",
                        }}
                    >
                        <Heading
                            style={{
                                fontSize: 20,
                            }}
                        >
                            💰 Revenue Summary
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
                                    {deliveryCharge === 0
                                        ? "FREE"
                                        : `₹${deliveryCharge.toFixed(2)}`}
                                </Text>
                            </Column>
                        </Row>

                        <Row>
                            <Column>
                                <Text>COD</Text>
                            </Column>

                            <Column align="right">
                                <Text>
                                    {codCharge === 0
                                        ? "-"
                                        : `₹${codCharge.toFixed(2)}`}
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
                                    Total Revenue
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
                    </Section>
                    <Hr />

                    <Section
                        style={{
                            textAlign: "center",
                            padding: "40px",
                        }}
                    >
                        <Button
                            href="https://laddoolaado.com/admin/orders"
                            style={{
                                background: "#111",
                                color: "#fff",
                                padding: "14px 30px",
                                borderRadius: "10px",
                                textDecoration: "none",
                            }}
                        >
                            Open Admin Dashboard
                        </Button>
                    </Section>

                    <Section
                        style={{
                            background: "#fafafa",
                            textAlign: "center",
                            padding: "30px",
                        }}
                    >
                        <Text
                            style={{
                                color: "#777",
                                lineHeight: "26px",
                            }}
                        >
                            This email was automatically generated by
                            <br />
                            <b>Laddoo Laado Admin System</b>
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    );
}