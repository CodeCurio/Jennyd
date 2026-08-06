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
  Tailwind,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface OrderReceiptEmailProps {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  items: any[];
  shippingAddress: any;
}

export default function OrderReceiptEmail({
  orderNumber = "JD-123456",
  customerName = "Valued Customer",
  totalAmount = 0,
  items = [],
  shippingAddress = {},
}: OrderReceiptEmailProps) {
  const previewText = `Your Jennyd order ${orderNumber} is confirmed!`;
  
  // Base URL for images
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jennydscents.com";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[600px]">
            <Section className="mt-[32px] text-center">
              <Text className="text-[24px] font-serif font-bold text-[#1a1a1a] tracking-widest uppercase m-0">
                JENNYD PARFUMS
              </Text>
            </Section>
            
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Thank you for your order!
            </Heading>
            
            <Text className="text-black text-[14px] leading-[24px]">
              Dear {customerName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              We have received your order <strong>{orderNumber}</strong> and we're getting it ready for shipment. You'll receive another email when your luxury fragrance is on its way.
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Heading className="text-black text-[18px] font-normal m-0 mb-[16px]">
              Order Summary
            </Heading>
            
            {items.map((item, idx) => (
              <Row key={idx} className="mb-[12px]">
                <Column className="w-[80%]">
                  <Text className="text-black text-[14px] m-0 font-medium">
                    {item.title}
                  </Text>
                  <Text className="text-gray-500 text-[12px] m-0 mt-[2px]">
                    Qty: {item.quantity} {item.variant_info?.size && `| Size: ${item.variant_info.size}`}
                  </Text>
                </Column>
                <Column className="w-[20%] text-right">
                  <Text className="text-black text-[14px] m-0 font-medium">
                    ₹{(item.price || item.unit_price) * item.quantity}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr className="border border-solid border-[#eaeaea] my-[16px] mx-0 w-full" />
            
            <Row>
              <Column className="w-[80%]">
                <Text className="text-black text-[16px] font-bold m-0">Total</Text>
              </Column>
              <Column className="w-[20%] text-right">
                <Text className="text-black text-[16px] font-bold m-0">₹{totalAmount}</Text>
              </Column>
            </Row>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Heading className="text-black text-[18px] font-normal m-0 mb-[16px]">
              Shipping Address
            </Heading>
            
            <Text className="text-gray-600 text-[14px] leading-[20px] m-0">
              {shippingAddress.fullName}<br />
              {shippingAddress.addressLine1} {shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""}<br />
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zip}<br />
              {shippingAddress.country}<br />
              Phone: {shippingAddress.phone}
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Text className="text-gray-500 text-[12px] leading-[24px]">
                If you have any questions, reply to this email or contact us at support@jennydscents.com
              </Text>
            </Section>
            
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
