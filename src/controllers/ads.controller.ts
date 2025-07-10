import {Request,Response,NextFunction} from "express"
import {ads,images} from "../models/index.js";
import { CustomError } from "../utils/CustomError.util.js";

export async function getCategories(req:Request, res:Response) {
  try {
    if (req.method !== "GET") {
      throw new CustomError("Méthode non autorisée", 405);
    }
    const categories = await ads.getCategoriesModel();
    res.status(200).json(categories);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message: String(error)
    console.error("Erreur dans le controller :", errMsg);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function createAd(req:Request, res:Response) {
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

    // Création de l'annonce
    const newAd = await ads.createAdModel({
      title,
      description,
      price,
      location,
      user_id: req.session.iduser as string,
      category_id,
      token: req.session.accessToken as string,
    });

    const publicUrl = await images.uploadImage({
      file,
      ad_id: newAd.id,
      token: req.session.accessToken as string,
    });

    await images.insertImageRecord({
      ad_id: newAd.id,
      url: publicUrl,
      token: req.session.accessToken as string,
    });

    return res.status(201).json({
      message: "Annonce créée avec succès.",
      ad: newAd,
      imageUrl: publicUrl,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message:String(error)
    console.error("Erreur création annonce :", errMsg);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function myAds(req:Request, res:Response, next:NextFunction) {
  try {
    if (req.method !== "GET") {
      throw new CustomError("Méthode non autorisée", 405);
    }
    // On suppose ici que tu veux la première image pour chaque annonce :
    const adsList = await ads.getUserAdsWithImage(req.session.iduser as string, req.session.accessToken as string);
    res.json({ ads: adsList });
  } catch (err) {
    next(err);
  }
}

export async function allAds(req:Request, res:Response, next:NextFunction) {
  try {
    if (req.method !== "GET") {
      throw new CustomError("Méthode non autorisée", 405);
    }
    const adsList = await ads.getAllAdsWithImage();
    res.json({ ads: adsList });
  } catch (err) {
    next(err);
  }
}
