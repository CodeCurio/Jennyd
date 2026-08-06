import { Resend } from "resend";
import OrderReceiptEmail from "@/emails/OrderReceipt";
import OrderShippedEmail from "@/emails/OrderShipped";

// Initialize Resend safely inside helper functions to prevent build-time missing API key crashes
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

// Verified custom domain sender address
const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || "Jennyd Parfums <support@jennydscents.com>";

export const sendOrderReceiptEmail = async (
  email: string,
  orderNumber: string,
  customerName: string,
  totalAmount: number,
  items: any[],
  shippingAddress: any
) => {
  try {
    const resend = getResendClient();
    if (!resend) {
      console.warn("RESEND_API_KEY is not set. Skipping email send.");
      return { success: false, error: "RESEND_API_KEY environment variable is missing on Vercel." };
    }

    let { data, error } = await resend.emails.send({
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

    // If custom sender failed for any reason, retry with onboarding@resend.dev
    if (error && SENDER_EMAIL !== "onboarding@resend.dev") {
      console.warn("Primary sender failed, retrying with onboarding@resend.dev:", error);
      const fallbackRes = await resend.emails.send({
        from: "onboarding@resend.dev",
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
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      const errorMsg = typeof error === "object" ? (error.message || JSON.stringify(error)) : String(error);
      console.error("Resend API Error:", errorMsg);
      return { success: false, error: errorMsg };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Error sending receipt email:", err);
    return { success: false, error: err.message || "Failed to send receipt email." };
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
    const resend = getResendClient();
    if (!resend) {
      console.warn("RESEND_API_KEY is not set. Skipping email send.");
      return { success: false, error: "RESEND_API_KEY environment variable is missing on Vercel." };
    }

    let { data, error } = await resend.emails.send({
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

    if (error && SENDER_EMAIL !== "onboarding@resend.dev") {
      const fallbackRes = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `Your Order ${orderNumber} has been shipped!`,
        react: OrderShippedEmail({
          orderNumber,
          customerName,
          trackingUrl,
          trackingId
        }),
      });
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      const errorMsg = typeof error === "object" ? (error.message || JSON.stringify(error)) : String(error);
      console.error("Resend API Error:", errorMsg);
      return { success: false, error: errorMsg };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Error sending shipped email:", err);
    return { success: false, error: err.message || "Failed to send shipped email." };
  }
};
