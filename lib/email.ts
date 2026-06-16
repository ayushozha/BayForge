const RESEND_API_URL = "https://api.resend.com/emails";

const resendApiKey = process.env.RESEND_API_KEY?.trim() || "";

export const emailFrom = process.env.EMAIL_FROM?.trim() || "Bay Forge <onboarding@resend.dev>";

// Supports comma or semicolon-separated list of addresses (e.g. "a@b.com,c@d.com")
const rawNotifyEmail = process.env.NOTIFY_EMAIL?.trim() || "outreach@bayforge.ai";
const notifyEmail: string | string[] = /[,;]/.test(rawNotifyEmail)
  ? rawNotifyEmail.split(/[,;]/).map((e) => e.trim()).filter(Boolean)
  : rawNotifyEmail;

// Matches bayforge.events and bayforge.ai (and their subdomains)
const senderDomainVerified = /@(?:[a-z0-9-]+\.)*bayforge\.(events|ai)>?$/i.test(emailFrom);

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<boolean> {
  if (!resendApiKey) return false;
  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      const toStr = Array.isArray(to) ? to.join(", ") : to;
      console.error(`[email] send to ${toStr} failed (${response.status}): ${detail.slice(0, 200)}`);
      return false;
    }
    const data = (await response.json().catch(() => ({}))) as { id?: string };
    const toStr = Array.isArray(to) ? to.join(", ") : to;
    console.log(`[email] sent ${data.id ?? "?"} to ${toStr} (${subject})`);
    return true;
  } catch (err) {
    const toStr = Array.isArray(to) ? to.join(", ") : to;
    console.error(`[email] send to ${toStr} errored:`, err);
    return false;
  }
}

export function notifyNewSubscriber(email: string, source?: string): void {
  void sendEmail({
    to: notifyEmail,
    subject: `New Bay Forge signup: ${email}`,
    html: `<p><strong>${escapeHtml(email)}</strong> just joined the Bay Forge list${
      source ? ` via <em>${escapeHtml(source)}</em>` : ""
    }.</p>`,
  });
}

export function sendWelcomeEmail(email: string): void {
  // Resend rejects sends to arbitrary recipients until the sending domain is
  // verified, so the welcome email stays off until EMAIL_FROM moves to
  // bayforge.events.
  if (!senderDomainVerified) return;
  void sendEmail({
    to: email,
    subject: "Welcome to Bay Forge",
    replyTo: Array.isArray(notifyEmail) ? notifyEmail[0] : notifyEmail,
    html: [
      "<div style=\"font-family:Inter,system-ui,sans-serif;max-width:520px;margin:0 auto;color:#1a1a2e\">",
      "<h2 style=\"margin:0 0 12px\">You're on the Bay Forge list</h2>",
      "<p>Thanks for signing up. We bring Bay Area builders, designers, and dreamers together to build, ship, and launch impactful projects.</p>",
      "<p>We'll send you the next event drop soon. Until then, you can reply to this email with questions or ideas.</p>",
      "<p style=\"color:#6b7280\">— The Bay Forge team · <a href=\"https://bayforge.events\">bayforge.events</a></p>",
      "</div>",
    ].join(""),
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
