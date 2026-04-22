import axios from "axios";
import * as dao from "../dao/contentDao.js";

function mapOpenLibraryDoc(doc) {
  return {
    source: "openLibrary",
    title: doc.title,
    authors: doc.author_name ?? [],
    firstPublishYear: doc.first_publish_year ?? null,
    isbn: doc.isbn?.[0] ?? null,
    openLibraryKey: doc.key ?? null,
    summary: doc.subtitle ?? null,
  };
}

export async function librarySearch(req, res, next) {
  try {
    const q = String(req.query.q ?? "").trim();
    const source = String(req.query.source ?? "all").toLowerCase();

    if (!q) {
      return res.json({ query: q, internal: [], openLibrary: [] });
    }

    const base = process.env.OPEN_LIBRARY_BASE ?? "https://openlibrary.org";

    const tasks = [];

    if (source === "all" || source === "internal") {
      tasks.push(
        dao.searchResources(q, 20).then((rows) => ({ key: "internal", rows }))
      );
    } else {
      tasks.push(Promise.resolve({ key: "internal", rows: [] }));
    }

    if (source === "all" || source === "openlibrary" || source === "open_library") {
      tasks.push(
        axios
          .get(`${base.replace(/\/$/, "")}/search.json`, {
            params: { q, limit: 20 },
            timeout: 12_000,
          })
          .then((r) => ({
            key: "openLibrary",
            rows: (r.data?.docs ?? []).map(mapOpenLibraryDoc),
          }))
          .catch(() => ({ key: "openLibrary", rows: [] }))
      );
    } else {
      tasks.push(Promise.resolve({ key: "openLibrary", rows: [] }));
    }

    const results = await Promise.all(tasks);
    const payload = { query: q, internal: [], openLibrary: [] };
    for (const block of results) {
      if (block.key === "internal") {
        payload.internal = block.rows.map((r) => ({
          source: "internal",
          slug: r.slug,
          title: r.title,
          summary: r.summary ?? null,
          tags: r.tags ?? [],
        }));
      }
      if (block.key === "openLibrary") {
        payload.openLibrary = block.rows;
      }
    }

    res.json(payload);
  } catch (err) {
    next(err);
  }
}
