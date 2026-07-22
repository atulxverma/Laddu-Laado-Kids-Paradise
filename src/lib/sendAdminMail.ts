import { resend } from "./resend";

export async function sendAdminMail(subject: string, html: string) {
  try {
    console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

    const response = await resend.emails.send({
      from: "Laddoo Laado <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject,
      html,
    });

    console.log("ADMIN MAIL RESPONSE:", response);
  } catch (error) {
    console.error("Admin mail failed:", error);
  }
}