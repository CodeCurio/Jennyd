import { Resend } from "resend";
import OrderReceiptEmail from "@/emails/OrderReceipt";
import OrderShippedEmail from "@/emails/OrderShipped";

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// For testing on unverified domains, Resend requires sending from onboarding@resend.dev
const SENDER_EMAIL = process.env.NODE_ENV === "production" 
  ? "Jennyd Parfums <support@jennydscents.com>" 
  : "onboarding@resend.dev";

export const sendOrderReceiptEmail = async (
  email: string,
  orderNumber: string,
  customerName: string,
  totalAmount: number,
  items: any[],
  shippingAddress: any
) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Skipping email send.");
      return { success: false, error: "API Key missing" };
    }

    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      react: OrderReceiptEmail({
        orderNumber,
        customerName,
        totalAmount,
        items,
        shippingAddress
      }),
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Error sending receipt email:", err);
    return { success: false, error: err.message };
  }
};

export const sendOrderShippedEmail = async (
  email: string,
  orderNumber: string,
  customerName: string,
  trackingUrl?: string,
  trackingId?: string
) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Skipping email send.");
      return { success: false, error: "API Key missing" };
    }

    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: `Your Order ${orderNumber} has been shipped!`,
      react: OrderShippedEmail({
        orderNumber,
        customerName,
        trackingUrl,
        trackingId
      }),
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Error sending shipped email:", err);
    return { success: false, error: err.message };
  }
};
