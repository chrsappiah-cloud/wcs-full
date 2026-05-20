<script setup>
import { onMounted, ref } from "vue";
import { api } from "../services/api.js";
import { ADMIN_EMAIL, SUPPORT_EMAIL } from "../config/contactEmails.js";

const config = ref(null);
const name = ref("");
const email = ref("");
const type = ref("general_enquiry");
const subject = ref("");
const message = ref("");
const website = ref("");
const loading = ref(false);
const error = ref(null);
const success = ref(null);

onMounted(async () => {
  try {
    config.value = await api.getContactConfig();
  } catch {
    config.value = {
      adminEmail: ADMIN_EMAIL,
      supportEmail: SUPPORT_EMAIL,
      types: [
        { id: "general_enquiry", label: "General enquiry" },
        { id: "feedback", label: "Feedback" },
        { id: "support", label: "Technical or account support" },
        { id: "partnership", label: "Partnership or media" },
      ],
      responseTime: "We aim to reply within 2 business days.",
    };
  }
});

async function submit() {
  error.value = null;
  success.value = null;
  loading.value = true;
  try {
    const res = await api.submitContact({
      name: name.value,
      email: email.value,
      type: type.value,
      subject: subject.value,
      message: message.value,
      website: website.value,
    });
    api.track("contact_submit", "/contact", { type: type.value, routedTo: res.routedTo });
    const emailed = res.email?.inbox?.sent || res.email?.confirmation?.sent;
    success.value = emailed
      ? `${res.message} A confirmation email was sent.`
      : `${res.message} Email delivery is pending server configuration — we saved your message for the admin inbox.`;
    name.value = "";
    email.value = "";
    subject.value = "";
    message.value = "";
    type.value = "general_enquiry";
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Could not send your message. Please try again or email us directly.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Contact</span>
        <h1>Feedback & enquiries</h1>
        <p>Send a message to our team. General enquiries and feedback go to support; partnership requests go to administration.</p>
      </div>

      <div class="grid-2" style="margin-bottom:28px">
        <div class="card">
          <span class="tag">Support</span>
          <h3>General enquiries & feedback</h3>
          <p class="small muted">Questions about courses, library, subscriptions, or the website.</p>
          <a class="accent-link" :href="`mailto:${config?.supportEmail ?? SUPPORT_EMAIL}`">
            {{ config?.supportEmail ?? SUPPORT_EMAIL }}
          </a>
        </div>
        <div class="card">
          <span class="tag">Administration</span>
          <h3>Administrator inbox</h3>
          <p class="small muted">Partnerships, press, and organisation-level requests.</p>
          <a class="accent-link" :href="`mailto:${config?.adminEmail ?? ADMIN_EMAIL}`">
            {{ config?.adminEmail ?? ADMIN_EMAIL }}
          </a>
        </div>
      </div>

      <div class="card narrow" style="max-width:640px;margin:0 auto">
        <span class="tag">Send a message</span>
        <h3 style="margin-top:8px">Contact form</h3>
        <p v-if="config?.responseTime" class="small muted">{{ config.responseTime }}</p>

        <p v-if="error" class="alert" style="margin-top:16px">{{ error }}</p>
        <p v-if="success" class="hint-box" style="margin-top:16px;color:var(--accent)">{{ success }}</p>

        <form class="contact-form" style="margin-top:20px" @submit.prevent="submit">
          <input
            v-model="website"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
            style="position:absolute;left:-9999px;height:0;width:0;opacity:0"
          />

          <label class="field">
            <span class="small">Your name</span>
            <input v-model="name" class="input" type="text" required maxlength="120" aria-label="Your name" />
          </label>

          <label class="field">
            <span class="small">Email</span>
            <input v-model="email" class="input" type="email" required maxlength="254" aria-label="Email" />
          </label>

          <label class="field">
            <span class="small">Type</span>
            <select v-model="type" class="input">
              <option
                v-for="t in config?.types"
                :key="t.id"
                :value="t.id"
              >
                {{ t.label }}
              </option>
            </select>
          </label>

          <label class="field">
            <span class="small">Subject (optional)</span>
            <input v-model="subject" class="input" type="text" maxlength="200" />
          </label>

          <label class="field">
            <span class="small">Message</span>
            <textarea
              v-model="message"
              class="input"
              rows="6"
              required
              maxlength="5000"
              placeholder="How can we help?"
            />
          </label>

          <button class="btn primary" type="submit" :disabled="loading">
            {{ loading ? "Sending…" : "Send message" }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
