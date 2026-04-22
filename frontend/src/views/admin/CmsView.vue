<script setup>
import { onMounted, ref } from "vue";
import { adminApi } from "../../services/api.js";

const tab       = ref("resources");
const items     = ref([]);
const error     = ref(null);
const saving    = ref(false);
const showForm  = ref(false);
const editItem  = ref(null);
const form      = ref({});

const TABS = [
  { key: "resources", label: "Resources" },
  { key: "courses",   label: "Courses" },
  { key: "labs",      label: "Labs" },
];

async function load() {
  error.value = null;
  items.value = [];
  try {
    if (tab.value === "resources") items.value = await adminApi.getResources();
    if (tab.value === "courses")   items.value = await adminApi.getCourses();
    if (tab.value === "labs")      items.value = await adminApi.getLabs();
  } catch (e) { error.value = e?.response?.data?.error ?? "Load failed."; }
}

function openCreate() {
  editItem.value = null;
  form.value = tab.value === "resources"
    ? { title: "", slug: "", summary: "", body: "", category: "Guide", featured: false, order: 0 }
    : tab.value === "courses"
    ? { title: "", slug: "", summary: "", level: "Foundation", order: 0 }
    : { title: "", slug: "", summary: "", stage: "Exploration", order: 0 };
  showForm.value = true;
}

function openEdit(item) {
  editItem.value = item;
  form.value = { ...item };
  showForm.value = true;
}

async function save() {
  saving.value = true;
  error.value  = null;
  try {
    const id = editItem.value?._id;
    if (tab.value === "resources") id ? await adminApi.updateResource(id, form.value) : await adminApi.createResource(form.value);
    if (tab.value === "courses")   id ? await adminApi.updateCourse(id, form.value)   : await adminApi.createCourse(form.value);
    if (tab.value === "labs")      id ? await adminApi.updateLab(id, form.value)      : await adminApi.createLab(form.value);
    showForm.value = false;
    await load();
  } catch (e) { error.value = e?.response?.data?.error ?? "Save failed."; }
  finally { saving.value = false; }
}

async function remove(item) {
  if (!confirm(`Delete "${item.title}"?`)) return;
  try {
    if (tab.value === "resources") await adminApi.deleteResource(item._id);
    if (tab.value === "courses")   await adminApi.deleteCourse(item._id);
    if (tab.value === "labs")      await adminApi.deleteLab(item._id);
    await load();
  } catch (e) { error.value = e?.response?.data?.error ?? "Delete failed."; }
}

function switchTab(key) { tab.value = key; showForm.value = false; load(); }

onMounted(load);
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Admin</span>
        <h1>CMS</h1>
        <p>Create, edit, and delete content records in MongoDB.</p>
      </div>

      <!-- Tab bar -->
      <div class="tab-bar">
        <button
          v-for="t in TABS" :key="t.key"
          class="tab-btn"
          :class="{ active: tab === t.key }"
          @click="switchTab(t.key)"
        >{{ t.label }}</button>
        <button class="btn primary" style="margin-left:auto" @click="openCreate">+ New</button>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>

      <!-- Form -->
      <div v-if="showForm" class="card" style="margin-bottom:20px">
        <h3>{{ editItem ? 'Edit' : 'New' }} {{ tab }}</h3>
        <form @submit.prevent="save" class="stack">
          <label class="field"><span class="small">Title</span>
            <input v-model="form.title" class="input" required />
          </label>
          <label class="field"><span class="small">Slug</span>
            <input v-model="form.slug" class="input" required />
          </label>
          <label class="field"><span class="small">Summary</span>
            <input v-model="form.summary" class="input" />
          </label>
          <template v-if="tab === 'resources'">
            <label class="field"><span class="small">Body</span>
              <textarea v-model="form.body" class="input" rows="4" style="height:auto;padding:10px"></textarea>
            </label>
            <label class="field"><span class="small">Category</span>
              <input v-model="form.category" class="input" />
            </label>
            <label class="field" style="flex-direction:row;align-items:center;gap:10px">
              <input type="checkbox" v-model="form.featured" />
              <span class="small">Featured</span>
            </label>
          </template>
          <template v-if="tab === 'courses'">
            <label class="field"><span class="small">Level</span>
              <input v-model="form.level" class="input" />
            </label>
          </template>
          <template v-if="tab === 'labs'">
            <label class="field"><span class="small">Stage</span>
              <input v-model="form.stage" class="input" />
            </label>
          </template>
          <label class="field"><span class="small">Order</span>
            <input v-model.number="form.order" class="input" type="number" />
          </label>
          <div style="display:flex;gap:10px">
            <button class="btn primary" type="submit" :disabled="saving">
              {{ saving ? 'Saving…' : 'Save' }}
            </button>
            <button class="btn" type="button" @click="showForm = false">Cancel</button>
          </div>
        </form>
      </div>

      <!-- List -->
      <div class="list">
        <div v-for="item in items" :key="item._id" class="result">
          <div>
            <strong>{{ item.title }}</strong>
            <p class="small">{{ item.slug }}
              <span v-if="item.level"> · {{ item.level }}</span>
              <span v-if="item.stage"> · {{ item.stage }}</span>
              <span v-if="item.category"> · {{ item.category }}</span>
              <span v-if="item.featured" class="pill" style="margin-left:8px">Featured</span>
            </p>
          </div>
          <div style="display:flex;gap:8px;flex-shrink:0">
            <button class="btn" style="padding:0 12px;min-height:34px" @click="openEdit(item)">Edit</button>
            <button class="btn" style="padding:0 12px;min-height:34px;color:var(--danger,#f87171)" @click="remove(item)">Delete</button>
          </div>
        </div>
        <p v-if="!items.length && !error" class="muted small">No records yet.</p>
      </div>
    </div>
  </section>
</template>
