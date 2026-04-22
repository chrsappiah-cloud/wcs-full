<script setup>
import { onMounted, ref } from "vue";
import { api } from "../services/api.js";
import { useAuthStore } from "../stores/auth.js";
import { useRouter } from "vue-router";

const router = useRouter();
const auth   = useAuthStore();

const courses     = ref([]);
const enrollments = ref([]);
const enrolling   = ref(null);
const error       = ref(null);

onMounted(async () => {
  if (!auth.isLoggedIn) return router.push("/login");
  error.value = null;
  try {
    [courses.value, enrollments.value] = await Promise.all([
      api.getCourses(),
      api.myEnrollments(),
    ]);
  } catch (e) { error.value = "Could not load course data."; }
});

function enrollmentFor(slug) {
  return enrollments.value.find(e => e.courseSlug === slug) ?? null;
}

async function enroll(slug) {
  enrolling.value = slug;
  error.value = null;
  try {
    const e = await api.enroll(slug);
    enrollments.value.push(e);
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Enrolment failed.";
  } finally { enrolling.value = null; }
}

async function setProgress(enrollment, val) {
  try {
    const updated = await api.updateProgress(enrollment._id, val);
    const idx = enrollments.value.findIndex(e => e._id === enrollment._id);
    if (idx !== -1) enrollments.value[idx] = updated;
  } catch { /* silent */ }
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Course platform</span>
        <h1>My courses</h1>
        <p>Enrol in courses and track your progress.</p>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>

      <div class="grid-3">
        <article v-for="course in courses" :key="course.slug" class="card feature">
          <span class="tag">{{ course.level }}</span>
          <h3>{{ course.title }}</h3>
          <p>{{ course.summary }}</p>

          <template v-if="enrollmentFor(course.slug)">
            <div style="margin-top:16px">
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" :style="{ width: enrollmentFor(course.slug).progress + '%' }"></div>
              </div>
              <div style="display:flex;justify-content:space-between;margin-top:6px">
                <span class="small">Progress: {{ enrollmentFor(course.slug).progress }}%</span>
                <span class="pill" style="font-size:11px">Enrolled</span>
              </div>
              <input
                type="range" min="0" max="100"
                :value="enrollmentFor(course.slug).progress"
                style="width:100%;margin-top:10px;accent-color:var(--accent)"
                @change="setProgress(enrollmentFor(course.slug), $event.target.value)"
              />
            </div>
          </template>

          <template v-else>
            <button
              class="btn primary"
              style="margin-top:16px;width:100%"
              :disabled="enrolling === course.slug"
              @click="enroll(course.slug)"
            >
              {{ enrolling === course.slug ? 'Enrolling…' : 'Enrol now' }}
            </button>
          </template>
        </article>
      </div>
    </div>
  </section>
</template>
