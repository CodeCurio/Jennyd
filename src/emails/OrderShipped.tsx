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
  Tailwind,
  Button,
} from "@react-email/components";
import * as React from "react";

interface OrderShippedEmailProps {
  orderNumber: string;
  customerName: string;
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
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[600px]">
            <Section className="mt-[32px] text-center">
              <Text className="text-[24px] font-serif font-bold text-[#1a1a1a] tracking-widest uppercase m-0">
                JENNYD PARFUMS
              </Text>
            </Section>
            
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Your order is on the way!
            </Heading>
            
            <Text className="text-black text-[14px] leading-[24px]">
              Dear {customerName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Great news! Your luxury fragrance order <strong>{orderNumber}</strong> has been shipped and is currently in transit.
            </Text>

            {trackingId && (
              <Text className="text-black text-[14px] leading-[24px] mt-[10px]">
                Your tracking number is: <strong>{trackingId}</strong>
              </Text>
            )}

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#1a1a1a] rounded text-white text-[12px] font-bold uppercase tracking-wider no-underline text-center px-6 py-4"
                href={trackingUrl}
              >
                Track Your Order
              </Button>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            
            <Section className="text-center mt-[32px] mb-[32px]">
              <Text className="text-gray-500 text-[12px] leading-[24px]">
                Thank you for shopping with Jennyd Parfums.<br/>
                If you have any questions, reply to this email or contact us at support@jennydscents.com
              </Text>
            </Section>
            
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
