<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "../../services/api.js";
import { ADMIN_EMAIL, SUPPORT_EMAIL } from "../../config/contactEmails.js";

const messages = ref([]);
const counts = ref({ new: 0, read: 0, archived: 0 });
const filter = ref("");
const error = ref(null);
const loading = ref(true);

const filtered = computed(() => {
  if (!filter.value) return messages.value;
  return messages.value.filter((m) => m.status === filter.value);
});

onMounted(load);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const data = await api.adminListContactMessages(filter.value || undefined);
    messages.value = data.messages ?? [];
    counts.value = { new: 0, read: 0, archived: 0, ...data.counts };
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Could not load enquiries.";
  } finally {
    loading.value = false;
  }
}

async function setStatus(id, status) {
  try {
    await api.adminPatchContactMessage(id, status);
    await load();
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Update failed.";
  }
}

function typeLabel(id) {
  const labels = {
    general_enquiry: "General enquiry",
    feedback: "Feedback",
    support: "Support",
    partnership: "Partnership",
  };
  return labels[id] ?? id;
}

function replyMailto(msg) {
  const subject = `Re: ${msg.subject || typeLabel(msg.type)} — World Class Scholars`;
  const body = `\n\n---\nYour message (${new Date(msg.createdAt).toLocaleString()}):\n${msg.message}`;
  return `mailto:${msg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Admin</span>
        <h1>Enquiries inbox</h1>
        <p>
          Feedback and general enquiries from the public.
          Routed to <strong>{{ SUPPORT_EMAIL }}</strong> or <strong>{{ ADMIN_EMAIL }}</strong>.
        </p>
      </div>

      <div class="kpis" style="grid-template-columns:repeat(3,1fr);max-width:480px;margin-bottom:20px">
        <button class="card kpi" type="button" :class="{ 'tab-btn active': !filter }" @click="filter = ''; load()">
          <strong>{{ (counts.new ?? 0) + (counts.read ?? 0) + (counts.archived ?? 0) }}</strong>
          <span class="small">all</span>
        </button>
        <button class="card kpi" type="button" @click="filter = 'new'; load()">
          <strong>{{ counts.new ?? 0 }}</strong>
          <span class="small">new</span>
        </button>
        <button class="card kpi" type="button" @click="filter = 'read'; load()">
          <strong>{{ counts.read ?? 0 }}</strong>
          <span class="small">read</span>
        </button>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>
      <p v-else-if="loading" class="muted">Loading…</p>

      <div v-else class="list">
        <article v-for="msg in filtered" :key="msg._id" class="card" style="margin-bottom:16px">
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between">
            <div>
              <span class="tag">{{ typeLabel(msg.type) }}</span>
              <span class="pill">{{ msg.status }}</span>
              <span class="small muted"> → {{ msg.routedTo }}</span>
            </div>
            <span class="small muted">{{ new Date(msg.createdAt).toLocaleString() }}</span>
          </div>
          <h3 style="margin:12px 0 4px">{{ msg.subject || "(No subject)" }}</h3>
          <p class="small"><strong>{{ msg.name }}</strong> · <a :href="`mailto:${msg.email}`" class="accent-link">{{ msg.email }}</a></p>
          <p style="margin-top:12px;white-space:pre-wrap">{{ msg.message }}</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">
            <a class="btn primary" :href="replyMailto(msg)">Reply by email</a>
            <button v-if="msg.status !== 'read'" class="btn" type="button" @click="setStatus(msg._id, 'read')">Mark read</button>
            <button v-if="msg.status !== 'archived'" class="btn" type="button" @click="setStatus(msg._id, 'archived')">Archive</button>
            <button v-if="msg.status !== 'new'" class="btn" type="button" @click="setStatus(msg._id, 'new')">Mark new</button>
          </div>
        </article>
        <p v-if="!filtered.length" class="muted">No messages in this folder.</p>
      </div>
    </div>
  </section>
</template>
