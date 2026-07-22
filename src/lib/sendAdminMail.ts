import { resend } from "./resend";

export async function sendAdminMail(
  subject: string,
  html: string
) {
  try {
    await resend.emails.send({
      from: "Laddoo Laado <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject,
      html,
    });
  } catch (error) {
    console.error("Admin mail failed", error);
  }
}