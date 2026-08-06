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
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface OrderReceiptEmailProps {
  orderNumber?: string;
  customerName?: string;
  totalAmount?: number;
  items?: any[];
  shippingAddress?: any;
}

export default function OrderReceiptEmail({
  orderNumber = "JD-123456",
  customerName = "Valued Customer",
  totalAmount = 0,
  items = [],
  shippingAddress = {},
}: OrderReceiptEmailProps) {
  const previewText = `Your Jennyd order ${orderNumber} is confirmed!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: "#faf8f5", fontFamily: "serif, sans-serif", margin: "0", padding: "20px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "16px", padding: "32px", maxWidth: "600px", margin: "0 auto" }}>
          
          {/* Header Logo */}
          <Section style={{ textAlignment: "center" as any, textAlign: "center", marginBottom: "24px" }}>
            <Text style={{ fontSize: "22px", fontFamily: "serif", fontWeight: "bold", color: "#1a1a1a", letterSpacing: "3px", textTransform: "uppercase", margin: 0 }}>
              JENNYD PARFUMS
            </Text>
            <Text style={{ fontSize: "11px", color: "#D4AF37", letterSpacing: "2px", textTransform: "uppercase", margin: "4px 0 0 0" }}>
              LUXURY FRAGRANCES
            </Text>
          </Section>

          <Hr style={{ borderColor: "#f0f0f0", margin: "20px 0" }} />

          <Heading style={{ color: "#1a1a1a", fontSize: "20px", fontWeight: "normal", textAlign: "center", margin: "20px 0 10px 0" }}>
            Order Confirmation
          </Heading>
          
          <Text style={{ color: "#555555", fontSize: "14px", lineHeight: "22px", textAlign: "center", margin: "0 0 24px 0" }}>
            Dear <strong>{customerName}</strong>, thank you for your order! We have received your order <strong style={{ color: "#1a1a1a" }}>#{orderNumber}</strong> and are preparing it with care.
          </Text>

          {/* Items Table */}
          <Section style={{ backgroundColor: "#faf8f5", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
            <Text style={{ fontSize: "12px", fontWeight: "bold", color: "#888888", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 12px 0" }}>
              Order Items
            </Text>
            
            {items && items.length > 0 ? (
              items.map((item: any, idx: number) => (
                <Row key={idx} style={{ marginBottom: idx === items.length - 1 ? 0 : "12px" }}>
                  <Column style={{ width: "70%" }}>
                    <Text style={{ color: "#1a1a1a", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                      {item.title}
                    </Text>
                    <Text style={{ color: "#777777", fontSize: "12px", margin: "2px 0 0 0" }}>
                      Qty: {item.quantity} {item.variant_info?.size ? `| Size: ${item.variant_info.size}` : ""}
                    </Text>
                  </Column>
                  <Column style={{ width: "30%", textAlign: "right" }}>
                    <Text style={{ color: "#1a1a1a", fontSize: "14px", fontWeight: "bold", margin: 0 }}>
                      ₹{(item.price || item.unit_price || 0) * item.quantity}
                    </Text>
                  </Column>
                </Row>
              ))
            ) : (
              <Text style={{ color: "#555555", fontSize: "13px", margin: 0 }}>Order details recorded.</Text>
            )}

            <Hr style={{ borderColor: "#e5e5e5", margin: "16px 0" }} />
            
            <Row>
              <Column style={{ width: "70%" }}>
                <Text style={{ color: "#1a1a1a", fontSize: "15px", fontWeight: "bold", margin: 0 }}>Total Amount Paid / Due</Text>
              </Column>
              <Column style={{ width: "30%", textAlign: "right" }}>
                <Text style={{ color: "#D4AF37", fontSize: "16px", fontWeight: "bold", margin: 0 }}>₹{totalAmount}</Text>
              </Column>
            </Row>
          </Section>

          {/* Shipping Address */}
          {shippingAddress && (
            <Section style={{ marginBottom: "24px" }}>
              <Text style={{ fontSize: "12px", fontWeight: "bold", color: "#888888", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 8px 0" }}>
                Shipping Address
              </Text>
              <Text style={{ color: "#444444", fontSize: "13px", lineHeight: "20px", margin: 0 }}>
                {shippingAddress.fullName || customerName}<br />
                {shippingAddress.addressLine1 || ""}{shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""}<br />
                {shippingAddress.city || ""}{shippingAddress.state ? `, ${shippingAddress.state}` : ""}{shippingAddress.zip ? ` - ${shippingAddress.zip}` : ""}<br />
                {shippingAddress.country || "India"}<br />
                {shippingAddress.phone ? `Phone: ${shippingAddress.phone}` : ""}
              </Text>
            </Section>
          )}

          <Hr style={{ borderColor: "#f0f0f0", margin: "24px 0" }} />

          <Section style={{ textAlign: "center" }}>
            <Text style={{ color: "#999999", fontSize: "12px", lineHeight: "20px", margin: 0 }}>
              If you have any questions about your order, reply to this email or contact us at <a href="mailto:support@jennydscents.com" style={{ color: "#D4AF37", textDecoration: "underline" }}>support@jennydscents.com</a>.
            </Text>
            <Text style={{ color: "#cccccc", fontSize: "11px", margin: "16px 0 0 0" }}>
              © Jennyd Parfums. All rights reserved.
            </Text>
          </Section>
          
        </Container>
      </Body>
    </Html>
  );
}
