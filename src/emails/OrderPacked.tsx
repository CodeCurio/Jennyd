import {
  Body,
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
import * as React from "react";

interface OrderPackedEmailProps {
  orderNumber?: string;
  customerName?: string;
  items?: any[];
  shippingAddress?: any;
}

export default function OrderPackedEmail({
  orderNumber = "JD-123456",
  customerName = "Valued Customer",
  items = [],
  shippingAddress = {},
}: OrderPackedEmailProps) {
  const previewText = `Your Jennyd Scents order ${orderNumber} is packed & ready for dispatch!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: "#faf8f5", fontFamily: "serif, sans-serif", margin: "0", padding: "20px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "16px", padding: "32px", maxWidth: "600px", margin: "0 auto" }}>
          
          {/* Header Logo & Branding */}
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <Img
              src="https://www.jennydscents.com/logo.png"
              width="70"
              height="70"
              alt="Jennyd Scents Logo"
              style={{ margin: "0 auto 12px auto", display: "block", borderRadius: "50%" }}
            />
            <Text style={{ fontSize: "22px", fontFamily: "serif", fontWeight: "bold", color: "#1a1a1a", letterSpacing: "3px", textTransform: "uppercase", margin: 0 }}>
              JENNYD SCENTS
            </Text>
            <Text style={{ fontSize: "11px", color: "#D4AF37", letterSpacing: "2px", textTransform: "uppercase", margin: "4px 0 0 0" }}>
              LUXURY EXTRAIT DE PARFUM
            </Text>
          </Section>

          <Hr style={{ borderColor: "#f0f0f0", margin: "20px 0" }} />

          <Heading style={{ color: "#1a1a1a", fontSize: "20px", fontWeight: "normal", textAlign: "center", margin: "20px 0 10px 0" }}>
            📦 Order Packed & Ready!
          </Heading>
          
          <Text style={{ color: "#555555", fontSize: "14px", lineHeight: "22px", textAlign: "center", margin: "0 0 24px 0" }}>
            Dear <strong>{customerName}</strong>, great news! Your luxury fragrance order <strong style={{ color: "#1a1a1a" }}>#{orderNumber}</strong> has been quality-checked, elegantly hand-packed, and is now ready for courier pickup.
          </Text>

          {/* Status Badge */}
          <Section style={{ backgroundColor: "#FAF8F5", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "16px", textAlign: "center", marginBottom: "24px" }}>
            <Text style={{ color: "#D4AF37", fontSize: "12px", fontWeight: "bold", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 4px 0" }}>
              CURRENT STATUS
            </Text>
            <Text style={{ color: "#1a1a1a", fontSize: "15px", fontWeight: "bold", margin: 0 }}>
              Packed & Handed Over to Dispatch
            </Text>
            <Text style={{ color: "#777777", fontSize: "12px", margin: "4px 0 0 0" }}>
              You will receive another notification with your tracking link once your parcel is scanned by the courier.
            </Text>
          </Section>

          {/* Items Summary */}
          {items && items.length > 0 && (
            <Section style={{ marginBottom: "24px" }}>
              <Text style={{ fontSize: "12px", fontWeight: "bold", color: "#888888", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 12px 0" }}>
                Packed Items
              </Text>
              
              {items.map((item: any, idx: number) => (
                <Row key={idx} style={{ marginBottom: idx === items.length - 1 ? 0 : "10px" }}>
                  <Column style={{ width: "80%" }}>
                    <Text style={{ color: "#1a1a1a", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                      {item.title}
                    </Text>
                    <Text style={{ color: "#777777", fontSize: "12px", margin: "2px 0 0 0" }}>
                      Qty: {item.quantity} {item.variant_info?.size ? `| Size: ${item.variant_info.size}` : ""}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
          )}

          <Hr style={{ borderColor: "#f0f0f0", margin: "24px 0" }} />

          <Section style={{ textAlign: "center" }}>
            <Text style={{ color: "#999999", fontSize: "12px", lineHeight: "20px", margin: 0 }}>
              Thank you for choosing Jennyd Parfums.<br />
              If you have any questions, reply to this email or contact us at <a href="mailto:support@jennydscents.com" style={{ color: "#D4AF37", textDecoration: "underline" }}>support@jennydscents.com</a>.
            </Text>
          </Section>
          
        </Container>
      </Body>
    </Html>
  );
}
