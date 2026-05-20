export const ADMIN_EMAIL = "admin@myworldclass.org";
export const SUPPORT_EMAIL = "support@myworldclass.org";

export const CONTACT_TYPES = [
  { id: "general_enquiry", label: "General enquiry" },
  { id: "feedback", label: "Feedback" },
  { id: "support", label: "Technical or account support" },
  { id: "partnership", label: "Partnership or media" },
];

export function mailtoForType(typeId, subject, body) {
  const inbox =
    typeId === "partnership" ? ADMIN_EMAIL : SUPPORT_EMAIL;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const q = params.toString();
  return `mailto:${inbox}${q ? `?${q}` : ""}`;
}
