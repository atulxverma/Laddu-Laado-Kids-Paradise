import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  email: string;
};

export default function WelcomeNewsletterEmail({ email }: Props) {
  return (
    <Html>
      <Head />
      <Preview>✨ Welcome to the Laddoo Laado Family</Preview>

      <Body
        style={{
          backgroundColor: "#f6f6f6",
          fontFamily:
            "Arial, Helvetica, sans-serif",
          padding: "30px 0",
        }}
      >
        <Container
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            overflow: "hidden",
            maxWidth: "600px",
          }}
        >
          <Section
            style={{
              background: "#111111",
              padding: "35px",
              textAlign: "center",
            }}
          >
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
                color: "#d4d4d4",
                marginTop: "10px",
                fontSize: "14px",
              }}
            >
              Premium Kids Fashion
            </Text>
          </Section>

          <Section style={{ padding: "40px" }}>
            <Heading
              style={{
                fontSize: "30px",
                marginBottom: "20px",
                color: "#111",
              }}
            >
              Welcome! 🎉
            </Heading>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "28px",
                color: "#555",
              }}
            >
              Hi,
            </Text>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "28px",
                color: "#555",
              }}
            >
              Thank you for subscribing to the
              <strong> Laddoo Laado </strong>
              newsletter.
            </Text>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "28px",
                color: "#555",
              }}
            >
              You're now part of our growing family where every outfit is
              thoughtfully crafted with comfort, softness and timeless style for
              every little star.
            </Text>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "30px",
                color: "#555",
              }}
            >
              As a subscriber you'll receive:
            </Text>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "30px",
                color: "#555",
              }}
            >
              ✨ Early access to new arrivals
              <br />
              🎁 Exclusive subscriber-only offers
              <br />
              💖 Festive & seasonal collections
              <br />
              ⭐ Special updates and surprises
            </Text>

            <Section
              style={{
                textAlign: "center",
                margin: "35px 0",
              }}
            >
              <Button
                href="https://laddoolaado.com/shop"
                style={{
                  backgroundColor: "#111111",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Explore Collection
              </Button>
            </Section>

            <Hr />

            <Text
              style={{
                fontSize: "15px",
                lineHeight: "28px",
                color: "#666",
              }}
            >
              Newsletter subscribed with:
              <br />
              <strong>{email}</strong>
            </Text>

            <Text
              style={{
                fontSize: "15px",
                lineHeight: "28px",
                color: "#666",
              }}
            >
              Thank you for trusting Laddoo Laado.
              <br />
              We look forward to being a part of your little one's beautiful
              journey.
            </Text>

            <Text
              style={{
                marginTop: "35px",
                fontSize: "15px",
                color: "#111",
                fontWeight: "bold",
              }}
            >
              ❤️ Team Laddoo Laado
            </Text>
          </Section>

          <Section
            style={{
              background: "#fafafa",
              padding: "25px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: "13px",
                color: "#888",
                lineHeight: "24px",
              }}
            >
              You're receiving this email because you subscribed to the
              Laddoo Laado newsletter.
              <br />
              © {new Date().getFullYear()} Laddoo Laado. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}