/**
 * Resend (email) stub.
 *
 * In demo mode: logs the email to the console instead of sending.
 * In production: sends via the Resend SDK with React Email templates.
 */

import { isDemoMode } from "./demo";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendEmail(message: EmailMessage): Promise<{ id: string }> {
  const from = message.from ?? process.env.EMAIL_FROM ?? "hello@reklu.app";

  if (isDemoMode()) {
    // eslint-disable-next-line no-console
    console.log(`\n📧 [demo email] from=${from} to=${message.to}\n  subject: ${message.subject}\n  ${(message.text ?? message.html).slice(0, 200)}...\n`);
    return { id: `demo_email_${Date.now()}` };
  }

  // Real Resend call (only if package is installed)
  try {
    const resendModule = await import("resend" as string).catch(() => null);
    if (!resendModule) {
      throw new Error("resend package not installed — run: npm install resend");
    }
    const resend = new resendModule.Resend(process.env.RESEND_API_KEY!);
    const result = await resend.emails.send({
      from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
    return { id: result.data?.id ?? "unknown" };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[resend] falling back to demo mode:", err);
    return { id: `demo_email_${Date.now()}` };
  }
}