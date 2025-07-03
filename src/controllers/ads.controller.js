import * as ads from "../models/ads.model.js";
import * as images from "../models/images.model.js";

export async function getCategories(req, res) {
  try {
    if (req.method !== "GET") {
      throw new CustomError("Méthode non autorisée", 405);
    }
    const categories = await ads.getCategoriesModel();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Erreur dans le controller :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function createAd(req, res) {
  try {
    if (req.method !== "POST") {
      throw new CustomError("Méthode non autorisée", 405);
    }
    const { title, description, price, location, category_id } = req.body;
    const file = req.file;

    // Vérification basique
    if (!title || !description || !price || !location || !category_id) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    if (!file) return res.status(400).json({ error: "Image requise." });

    // Vérification session
    if (!req.session?.iduser || !req.session?.accessToken) {
      return res.status(401).json({ error: "Non connecté" });
    }

    // Création de l'annonce
    const newAd = await ads.createAdModel({
      title,
      description,
      price,
      location,
      user_id: req.session.iduser,
      category_id,
      token: req.session.accessToken,
    });

    const publicUrl = await images.uploadImage({
      file,
      ad_id: newAd.id,
      token: req.session.accessToken,
    });

    await images.insertImageRecord({
      ad_id: newAd.id,
      url: publicUrl,
      token: req.session.accessToken,
    });

    return res.status(201).json({
      message: "Annonce créée avec succès.",
      ad: newAd,
      imageUrl: publicUrl,
    });
  } catch (error) {
    console.error("Erreur création annonce :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function myAds(req, res, next) {
  try {
    if (req.method !== "GET") {
      throw new Error("Méthode non autorisée", 405);
    }
    if (!req.session || !req.session.iduser) {
      return res.status(401).json({ error: "Non authentifié" });
    }
    // On suppose ici que tu veux la première image pour chaque annonce :
    const adsList = await ads.getUserAdsWithImage(req.session.iduser, req.session.accessToken);
    res.json({ ads: adsList });
  } catch (err) {
    next(err);
  }
}

export async function allAds(req, res, next) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }
    const adsList = await ads.getAllAdsWithImage();
    res.json({ ads: adsList });
  } catch (err) {
    next(err);
  }
}
