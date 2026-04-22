<script setup>
import { ref, watch } from "vue";
import { api } from "../services/api.js";

const q = ref("dementia care design");
const source = ref("all");
const loading = ref(false);
const results = ref({ internal: [], openLibrary: [] });
const error = ref(null);

async function runSearch() {
  if (!q.value.trim()) {
    results.value = { internal: [], openLibrary: [] };
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    results.value = await api.librarySearch({ q: q.value.trim(), source: source.value });
  } catch (e) {
    error.value = e;
  } finally {
    loading.value = false;
  }
}

let t;
watch([q, source], () => { clearTimeout(t); t = setTimeout(runSearch, 300); });
</script>

<template>
  <section class="section">
    <div class="container grid-2">
      <!-- Left: search -->
      <div>
        <h1>Library intelligence hub</h1>
        <p>
          Federated search across Open Library, Google Books, Internet Archive, and
          Gutendex integrations, with expandable support for institutional knowledge feeds.
        </p>

        <div class="search-ui">
          <input v-model="q" class="input" type="search" aria-label="Search query" placeholder="Try: dementia care design" />
          <select v-model="source" class="select" aria-label="Source selector">
            <option value="all">All sources</option>
            <option value="internal">Internal only</option>
            <option value="openlibrary">Open Library</option>
          </select>
          <button class="btn primary" @click="runSearch">Search</button>
        </div>

        <!-- Static source capability list -->
        <div class="list">
          <div class="result">
            <div><strong>Open Library connector</strong><p class="small">Edition metadata, cover imagery, authors, subjects, and lending-linked references.</p></div>
            <span class="pill">Books API</span>
          </div>
          <div class="result">
            <div><strong>Google Books connector</strong><p class="small">Preview links, descriptions, identifiers, categories, and indexed discovery.</p></div>
            <span class="pill">Preview API</span>
          </div>
          <div class="result">
            <div><strong>Internet Archive connector</strong><p class="small">Digitized texts, scans, OCR-linked media and archival records.</p></div>
            <span class="pill">Archive API</span>
          </div>
          <div class="result">
            <div><strong>Gutendex connector</strong><p class="small">Open-domain texts for learning pathways, curriculum bundles and humanities reading packs.</p></div>
            <span class="pill">Open texts</span>
          </div>
        </div>
      </div>

      <!-- Right: results card -->
      <aside class="card">
        <span class="tag">Search results</span>
        <h3>
          <template v-if="loading">Searching…</template>
          <template v-else-if="q.trim()">Results for "{{ q }}"</template>
          <template v-else>Search workflow blueprint</template>
        </h3>

        <p v-if="error" class="alert">Search failed. Is the backend running on port 3001?</p>

        <template v-if="!loading && !error">
          <!-- Internal results -->
          <div v-if="results.internal.length" class="block">
            <div class="sub-heading">Internal</div>
            <div class="list">
              <RouterLink
                v-for="item in results.internal"
                :key="item.slug"
                class="result result-link"
                :to="`/resources/${item.slug}`"
              >
                <div>
                  <strong>{{ item.title }}</strong>
                  <p class="small">{{ item.summary }}</p>
                </div>
                <span class="pill">Internal</span>
              </RouterLink>
            </div>
          </div>

          <!-- Open Library results -->
          <div v-if="results.openLibrary.length" class="block">
            <div class="sub-heading">Open Library</div>
            <div class="list">
              <div v-for="(item, idx) in results.openLibrary.slice(0, 8)" :key="idx" class="result">
                <div>
                  <strong>{{ item.title }}</strong>
                  <p class="small">{{ item.authors?.join(", ") || "Unknown author" }}
                    <template v-if="item.firstPublishYear"> · {{ item.firstPublishYear }}</template>
                  </p>
                </div>
                <span class="pill">Book</span>
              </div>
            </div>
          </div>

          <!-- Empty state / blueprint -->
          <template v-if="!results.internal.length && !results.openLibrary.length && q.trim()">
            <p class="muted">No results found.</p>
          </template>

          <template v-if="!q.trim()">
            <p>Query orchestration, source adapters, response normalization, ranking, caching, and enrichment sit behind a clean service layer.</p>
            <ul class="small" style="line-height:1.8">
              <li>Source adapters isolate each third-party API.</li>
              <li>Normalized schemas unify title, creator, subjects, preview, and identifiers.</li>
              <li>Future AI enrichment can summarize, cluster, and recommend reading pathways.</li>
              <li>Admin curation can spotlight collections relevant to dementia care, justice, education, and creative healing.</li>
            </ul>
          </template>
        </template>
      </aside>
    </div>
  </section>
</template>
