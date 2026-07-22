import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  customerName: string;
  orderId: string;
};

export default function CancelledOrderEmail({
  customerName,
  orderId,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your order has been cancelled</Preview>

      <Body
        style={{
          background: "#f5f5f5",
          fontFamily: "Arial,sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "620px",
            margin: "40px auto",
            background: "#fff",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Section
            style={{
              background: "#111",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <Heading style={{ color: "#fff" }}>
              ❌ Order Cancelled
            </Heading>
          </Section>

          <Section style={{ padding: "40px" }}>
            <Text>
              Hi <b>{customerName}</b>,
            </Text>

            <Text>
              Your order <b>#{orderId}</b> has been cancelled successfully.
            </Text>

            <Text>
              If this cancellation wasn't made by you, please contact us
              immediately.
            </Text>

            <Button
              href="https://laddoolaado.com/shop"
              style={{
                background: "#111",
                color: "#fff",
                padding: "14px 26px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Continue Shopping
            </Button>
          </Section>

          <Section
            style={{
              background: "#fafafa",
              textAlign: "center",
              padding: "25px",
            }}
          >
            <Text>
              © 2026 Laddoo Laado
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}