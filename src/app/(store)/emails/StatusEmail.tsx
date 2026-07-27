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
} from "@react-email/components";

type StatusEmailProps = {
  preview: string;

  title: string;

  icon: string;

  customerName: string;

  orderId: string;

  message: string;

  buttonText: string;

  buttonLink: string;

  footerMessage?: string;

  showLogo?: boolean;
};

export default function StatusEmail({
  preview,
  title,
  icon,
  customerName,
  orderId,
  message,
  buttonText,
  buttonLink,
  footerMessage = "Thank you for choosing Laddoo Laado ❤️",
  showLogo = true,
}: StatusEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>{preview}</Preview>

      <Body
        style={{
          backgroundColor: "#f5f5f5",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "30px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid #ececec",
          }}
        >
          {/* Header */}

          <Section
            style={{
              backgroundColor: "#111111",
              padding: "40px",
              textAlign: "center",
            }}
          >
            {showLogo && (
              <Img
                src="https://laddoolaado.com/logo1.jpeg"
                width="90"
                alt="Laddoo Laado"
                style={{
                  margin: "0 auto 18px",
                }}
              />
            )}

            <Heading
              style={{
                color: "#ffffff",
                margin: 0,
                fontSize: "34px",
              }}
            >
              Laddoo Laado
            </Heading>

            <Text
              style={{
                color: "#dddddd",
                marginTop: "10px",
                fontSize: "15px",
              }}
            >
              Premium Fashion For Every Occasion
            </Text>
          </Section>

          {/* Main */}

          <Section
            style={{
              padding: "40px",
            }}
          >
            <Heading
              style={{
                fontSize: "30px",
                color: "#111",
              }}
            >
              {icon} {title}
            </Heading>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "28px",
                color: "#555",
              }}
            >
              Hi <strong>{customerName}</strong>,
            </Text>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "30px",
                color: "#555",
              }}
            >
              {message}
            </Text>
          </Section>

          <Hr />

          {/* Order */}

          <Section
            style={{
              padding: "35px 40px",
            }}
          >
            <Heading
              style={{
                fontSize: "20px",
              }}
            >
              📋 Order Information
            </Heading>

            <Text
              style={{
                fontSize: "16px",
                color: "#444",
              }}
            >
              <strong>Order ID :</strong> #{orderId}
            </Text>
          </Section>

          <Hr />

          {/* CTA */}

          <Section
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            <Button
              href={buttonLink}
              style={{
                backgroundColor: "#111111",
                color: "#ffffff",
                textDecoration: "none",
                padding: "14px 30px",
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              {buttonText}
            </Button>
          </Section>

          <Hr />

          {/* Footer */}

          <Section
            style={{
              background: "#fafafa",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                color: "#666",
                lineHeight: "28px",
                fontSize: "15px",
              }}
            >
              {footerMessage}
            </Text>

            <Text
              style={{
                color: "#888",
                fontSize: "13px",
                marginTop: "20px",
                lineHeight: "24px",
              }}
            >
              Need help?

              <br />

              support@laddoolaado.com

              <br />
              <br />

              © {new Date().getFullYear()} Laddoo Laado

              <br />

              Made with ❤️ in India
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}