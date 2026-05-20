/** Organisation inboxes for admin and public support. */
export const ADMIN_EMAIL = "admin@myworldclass.org";
export const SUPPORT_EMAIL = "support@myworldclass.org";

export const CONTACT_TYPES = [
  { id: "general_enquiry", label: "General enquiry", inbox: "support" },
  { id: "feedback", label: "Feedback", inbox: "support" },
  { id: "support", label: "Technical or account support", inbox: "support" },
  { id: "partnership", label: "Partnership or media", inbox: "admin" },
];

export function inboxForType(typeId) {
  const t = CONTACT_TYPES.find((x) => x.id === typeId);
  return t?.inbox === "admin" ? ADMIN_EMAIL : SUPPORT_EMAIL;
}

export function getPublicContactConfig() {
  return {
    adminEmail: ADMIN_EMAIL,
    supportEmail: SUPPORT_EMAIL,
    types: CONTACT_TYPES,
    responseTime: "We aim to reply within 2 business days.",
  };
}
