import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface OrderShippedEmailProps {
  orderNumber?: string;
  customerName?: string;
  trackingUrl?: string;
  trackingId?: string;
}

export default function OrderShippedEmail({
  orderNumber = "JD-123456",
  customerName = "Valued Customer",
  trackingUrl = "https://jennydscents.com/account/orders",
  trackingId = "",
}: OrderShippedEmailProps) {
  const previewText = `Your order ${orderNumber} has been shipped!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: "#faf8f5", fontFamily: "serif, sans-serif", margin: "0", padding: "20px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "16px", padding: "32px", maxWidth: "600px", margin: "0 auto" }}>
          
          <Section style={{ textAlign: "center" }}>
            <Text style={{ fontSize: "22px", fontFamily: "serif", fontWeight: "bold", color: "#1a1a1a", letterSpacing: "3px", textTransform: "uppercase", margin: 0 }}>
              JENNYD PARFUMS
            </Text>
            <Text style={{ fontSize: "11px", color: "#D4AF37", letterSpacing: "2px", textTransform: "uppercase", margin: "4px 0 0 0" }}>
              LUXURY FRAGRANCES
            </Text>
          </Section>

          <Hr style={{ borderColor: "#f0f0f0", margin: "20px 0" }} />

          <Heading style={{ color: "#1a1a1a", fontSize: "20px", fontWeight: "normal", textAlign: "center", margin: "20px 0 10px 0" }}>
            Your Order is on the Way!
          </Heading>
          
          <Text style={{ color: "#555555", fontSize: "14px", lineHeight: "22px", textAlign: "center", margin: "0 0 24px 0" }}>
            Dear <strong>{customerName}</strong>, great news! Your luxury fragrance order <strong style={{ color: "#1a1a1a" }}>#{orderNumber}</strong> has been shipped and is currently in transit.
          </Text>

          {trackingId && (
            <Section style={{ backgroundColor: "#faf8f5", borderRadius: "12px", padding: "16px", textAlign: "center", marginBottom: "24px" }}>
              <Text style={{ color: "#888888", fontSize: "11px", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                Tracking Number
              </Text>
              <Text style={{ color: "#1a1a1a", fontSize: "16px", fontWeight: "bold", fontFamily: "monospace", margin: 0 }}>
                {trackingId}
              </Text>
            </Section>
          )}

          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              style={{ backgroundColor: "#1a1a1a", borderRadius: "10px", color: "#ffffff", fontSize: "12px", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none", textAlign: "center", padding: "14px 28px", display: "inline-block" }}
              href={trackingUrl}
            >
              Track Your Order
            </Button>
          </Section>

          <Hr style={{ borderColor: "#f0f0f0", margin: "24px 0" }} />
          
          <Section style={{ textAlign: "center" }}>
            <Text style={{ color: "#999999", fontSize: "12px", lineHeight: "20px", margin: 0 }}>
              Thank you for shopping with Jennyd Parfums.<br/>
              If you have any questions, reply to this email or contact us at <a href="mailto:support@jennydscents.com" style={{ color: "#D4AF37", textDecoration: "underline" }}>support@jennydscents.com</a>.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
