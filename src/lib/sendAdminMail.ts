import { resend } from "./resend";

export async function sendAdminMail(subject: string, html: string) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      throw new Error("ADMIN_EMAIL is missing in .env");
    }

    console.log("📧 Sending admin mail to:", adminEmail);

    const response = await resend.emails.send({
      from: "Laddoo Laado <orders@laddoolaado.com>",
      to: adminEmail,
      subject,
      html,
    });

    console.log("✅ ADMIN MAIL RESPONSE:", response);

    return response;
  } catch (error) {
    console.error("❌ Admin mail failed:", error);
    throw error;
  }
}