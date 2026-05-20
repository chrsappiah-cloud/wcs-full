import * as dao from "../dao/contentDao.js";
import * as siteContent from "../data/siteContent.js";

export async function getPlatform(req, res, next) {
  try {
    if (req.fallbackMode) return res.json(siteContent.platform);
    const doc = await dao.findPlatform();
    if (!doc) return res.status(404).json({ error: "Platform not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function getAbout(req, res, next) {
  try {
    if (req.fallbackMode) return res.json(siteContent.aboutPage);
    const page = await dao.findPageBySlug("about");
    if (!page) return res.status(404).json({ error: "About page not found" });
    res.json(page);
  } catch (err) {
    next(err);
  }
}

export async function getCourses(req, res, next) {
  try {
    if (req.fallbackMode) return res.json(siteContent.courses);
    res.json(await dao.listCourses());
  } catch (err) {
    next(err);
  }
}

export async function getLabs(req, res, next) {
  try {
    if (req.fallbackMode) return res.json(siteContent.labs);
    res.json(await dao.listLabs());
  } catch (err) {
    next(err);
  }
}

export async function getArtVerse(req, res, next) {
  try {
    if (req.fallbackMode) return res.json(siteContent.artCollections);
    res.json(await dao.listArtCollections());
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedResources(req, res, next) {
  try {
    if (req.fallbackMode) return res.json(siteContent.listFeaturedResources());
    res.json(await dao.listFeaturedResources());
  } catch (err) {
    next(err);
  }
}

export async function getResourceBySlug(req, res, next) {
  try {
    if (req.fallbackMode) {
      const doc = siteContent.findResourceBySlug(req.params.slug);
      if (!doc) return res.status(404).json({ error: "Resource not found" });
      return res.json(doc);
    }
    const doc = await dao.findResourceBySlug(req.params.slug);
    if (!doc) return res.status(404).json({ error: "Resource not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}
