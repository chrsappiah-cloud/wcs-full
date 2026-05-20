import { ADMIN_EMAIL, SUPPORT_EMAIL, inboxForType } from "./contactEmails.js";

export const fallbackContactMessages = [
  {
    _id: "demo-1",
    name: "Alex Morgan",
    email: "alex@example.com",
    type: "general_enquiry",
    subject: "Course access question",
    message: "How do I enrol in the trauma-informed care pathway?",
    routedTo: SUPPORT_EMAIL,
    status: "read",
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    _id: "demo-2",
    name: "Jordan Lee",
    email: "jordan@example.com",
    type: "feedback",
    subject: "Library search",
    message: "Love the federated search — would be great to filter by open access only.",
    routedTo: SUPPORT_EMAIL,
    status: "new",
    createdAt: new Date(Date.now() - 86400000),
  },
];

export const runtimeContactMessages = [];

export function appendFallbackMessage(doc) {
  const entry = {
    _id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...doc,
    routedTo: inboxForType(doc.type),
    status: "new",
    createdAt: new Date(),
  };
  runtimeContactMessages.unshift(entry);
  if (runtimeContactMessages.length > 200) runtimeContactMessages.pop();
  return entry;
}

export function allFallbackMessages() {
  return [...runtimeContactMessages, ...fallbackContactMessages];
}
