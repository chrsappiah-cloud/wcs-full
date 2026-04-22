import * as dao from "../dao/contentDao.js";

export async function getPlatform(_req, res, next) {
  try {
    const doc = await dao.findPlatform();
    if (!doc) return res.status(404).json({ error: "Platform not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function getAbout(_req, res, next) {
  try {
    const page = await dao.findPageBySlug("about");
    if (!page) return res.status(404).json({ error: "About page not found" });
    res.json(page);
  } catch (err) {
    next(err);
  }
}

export async function getCourses(_req, res, next) {
  try {
    res.json(await dao.listCourses());
  } catch (err) {
    next(err);
  }
}

export async function getLabs(_req, res, next) {
  try {
    res.json(await dao.listLabs());
  } catch (err) {
    next(err);
  }
}

export async function getArtVerse(_req, res, next) {
  try {
    res.json(await dao.listArtCollections());
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedResources(_req, res, next) {
  try {
    res.json(await dao.listFeaturedResources());
  } catch (err) {
    next(err);
  }
}

export async function getResourceBySlug(req, res, next) {
  try {
    const doc = await dao.findResourceBySlug(req.params.slug);
    if (!doc) return res.status(404).json({ error: "Resource not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}
