import {
  ADMIN_EMAIL,
  SUPPORT_EMAIL,
} from "../data/contactEmails.js";

const FROM = (process.env.EMAIL_FROM || "World Class Scholars <noreply@myworldclass.org>").trim();
const NOTIFY = (process.env.NOTIFY_EMAIL || "chrsappiah@gmail.com").trim();

export function emailConfigStatus() {
  const resend = !!(process.env.RESEND_API_KEY || "").trim();
  const smtp = !!(process.env.SMTP_HOST || "").trim();
  return {
    enabled: resend || smtp,
    provider: resend ? "resend" : smtp ? "smtp" : "none",
    from: FROM,
    notifyEmail: NOTIFY,
    adminEmail: ADMIN_EMAIL,
    supportEmail: SUPPORT_EMAIL,
  };
}

async function sendResend({ to, subject, html, text, replyTo }) {
  const key = process.env.RESEND_API_KEY.trim();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      reply_to: replyTo,
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.message || `Resend API ${response.status}`);
  }
  return { sent: true, provider: "resend", id: body.id };
}

async function sendSmtp({ to, subject, html, text, replyTo }) {
  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const info = await transport.sendMail({
    from: FROM,
    to,
    subject,
    html,
    text,
    replyTo,
  });
  return { sent: true, provider: "smtp", id: info.messageId };
}

export async function sendMail(payload) {
  const status = emailConfigStatus();
  if (!status.enabled) {
    console.warn("[mailer] Email not configured — set RESEND_API_KEY or SMTP_HOST");
    return { sent: false, provider: "none", reason: "not_configured" };
  }
  try {
    if (status.provider === "resend") return await sendResend(payload);
    return await sendSmtp(payload);
  } catch (err) {
    console.error("[mailer]", err.message);
    return { sent: false, provider: status.provider, reason: err.message };
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactNotifications(msg) {
  const inbox = msg.routedTo;
  const typeLabel = msg.type?.replace(/_/g, " ") ?? "enquiry";
  const subject = `[WCS ${typeLabel}] ${msg.subject || "New message"}`;
  const html = `
    <h2>New contact message</h2>
    <p><strong>From:</strong> ${escapeHtml(msg.name)} &lt;${escapeHtml(msg.email)}&gt;</p>
    <p><strong>Type:</strong> ${escapeHtml(typeLabel)}</p>
    <p><strong>Routed to:</strong> ${escapeHtml(inbox)}</p>
    <hr />
    <pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(msg.message)}</pre>
  `;
  const text = `From: ${msg.name} <${msg.email}>\nType: ${typeLabel}\n\n${msg.message}`;

  const toInbox = await sendMail({
    to: [inbox, NOTIFY].filter((e, i, a) => a.indexOf(e) === i),
    subject,
    html,
    text,
    replyTo: msg.email,
  });

  const confirmation = await sendMail({
    to: msg.email,
    subject: "We received your message — World Class Scholars",
    html: `<p>Hi ${escapeHtml(msg.name)},</p><p>Thank you for contacting World Class Scholars. We received your ${escapeHtml(typeLabel)} and will respond within 2 business days.</p><p>Support: ${SUPPORT_EMAIL}<br />Admin: ${ADMIN_EMAIL}</p>`,
    text: `Hi ${msg.name},\n\nThank you for your message. We will respond within 2 business days.\n\nSupport: ${SUPPORT_EMAIL}`,
  });

  return { inbox: toInbox, confirmation };
}

export async function sendAdminAlert({ subject, body }) {
  return sendMail({
    to: [ADMIN_EMAIL, NOTIFY],
    subject: `[WCS Admin] ${subject}`,
    html: `<pre>${escapeHtml(body)}</pre>`,
    text: body,
  });
}
