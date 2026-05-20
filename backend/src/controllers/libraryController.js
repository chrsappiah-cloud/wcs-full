import axios from "axios";
import * as dao from "../dao/contentDao.js";
import * as siteContent from "../data/siteContent.js";

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

function mapInternalRows(rows) {
  return rows.map((r) => ({
    source: "internal",
    slug: r.slug,
    title: r.title,
    summary: r.summary ?? null,
    tags: r.tags ?? [],
  }));
}

export async function librarySearch(req, res, next) {
  try {
    const q = String(req.query.q ?? "").trim();
    const source = String(req.query.source ?? "all").toLowerCase();

    if (!q) {
      return res.json({ query: q, internal: [], openLibrary: [] });
    }

    const base = process.env.OPEN_LIBRARY_BASE ?? "https://openlibrary.org";
    const payload = { query: q, internal: [], openLibrary: [] };

    if (source === "all" || source === "internal") {
      try {
        if (req.fallbackMode) {
          payload.internal = mapInternalRows(siteContent.searchResourcesLocal(q, 20));
        } else {
          const rows = await dao.searchResources(q, 20);
          payload.internal = mapInternalRows(rows);
        }
      } catch (err) {
        console.error("Internal library search failed:", err.message);
        payload.internal = mapInternalRows(siteContent.searchResourcesLocal(q, 20));
      }
    }

    if (source === "all" || source === "openlibrary" || source === "open_library") {
      try {
        const r = await axios.get(`${base.replace(/\/$/, "")}/search.json`, {
          params: { q, limit: 20 },
          timeout: 12_000,
        });
        payload.openLibrary = (r.data?.docs ?? []).map(mapOpenLibraryDoc);
      } catch {
        payload.openLibrary = [];
      }
    }

    res.json(payload);
  } catch (err) {
    next(err);
  }
}
