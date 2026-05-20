import * as contactDao from "../dao/contactDao.js";
import { getPublicContactConfig, CONTACT_TYPES } from "../data/contactEmails.js";
import {
  allFallbackMessages,
  appendFallbackMessage,
} from "../data/contactFallback.js";
import { extractGeoFromRequest } from "../lib/analyticsGeo.js";
import { sendContactNotifications } from "../lib/mailer.js";

const VALID_TYPES = new Set(CONTACT_TYPES.map((t) => t.id));

export function getEmails(_req, res) {
  res.json(getPublicContactConfig());
}

export async function submit(req, res, next) {
  try {
    const { name, email, type, subject, message, website } = req.body ?? {};

    if (website) return res.status(201).json({ ok: true });
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "name, email, and message are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    const msgType = VALID_TYPES.has(type) ? type : "general_enquiry";

    const doc = {
      name: name.trim().slice(0, 120),
      email: email.trim().slice(0, 254),
      type: msgType,
      subject: (subject ?? "").trim().slice(0, 200),
      message: message.trim().slice(0, 5000),
      geo: extractGeoFromRequest(req),
      userAgent: req.headers["user-agent"]?.slice(0, 256) ?? null,
    };

    let saved;
    if (req.fallbackMode) {
      saved = appendFallbackMessage(doc);
    } else {
      saved = await contactDao.insertMessage(doc);
    }

    const emailResult = await sendContactNotifications({
      ...doc,
      routedTo: saved.routedTo ?? doc.routedTo,
    });

    res.status(201).json({
      ok: true,
      id: String(saved._id),
      routedTo: saved.routedTo,
      message: "Thank you — your message has been received.",
      email: emailResult,
    });
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req, res, next) {
  try {
    const status = req.query.status;
    if (req.fallbackMode) {
      let messages = allFallbackMessages();
      if (status) messages = messages.filter((m) => m.status === status);
      return res.json({ messages, counts: countStatuses(messages) });
    }
    const [messages, countsRaw] = await Promise.all([
      contactDao.listMessages({ status }),
      contactDao.countByStatus(),
    ]);
    res.json({ messages, counts: countsRaw });
  } catch (err) {
    next(err);
  }
}

export async function patchAdmin(req, res, next) {
  try {
    const { status } = req.body ?? {};
    if (!["new", "read", "archived"].includes(status)) {
      return res.status(400).json({ error: "status must be new, read, or archived" });
    }
    if (req.fallbackMode) {
      const messages = allFallbackMessages();
      const msg = messages.find((m) => String(m._id) === req.params.id);
      if (!msg) return res.status(404).json({ error: "Message not found" });
      msg.status = status;
      msg.updatedAt = new Date();
      return res.json({ message: msg });
    }
    const message = await contactDao.updateStatus(req.params.id, status);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json({ message });
  } catch (err) {
    next(err);
  }
}

function countStatuses(messages) {
  return messages.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] ?? 0) + 1;
    return acc;
  }, { new: 0, read: 0, archived: 0 });
}
