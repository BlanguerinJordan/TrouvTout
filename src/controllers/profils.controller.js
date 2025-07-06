import * as profils from "../models/profils.model.js";
import { CustomError } from "../utils/CustomError.util.js";

export async function getProfilInformation(req, res, next) {
  try {
    if (req.method !== "GET") {
      throw new CustomError("Méthode non autorisée", 405);
    }
    if (!req.session?.iduser || !req.session?.accessToken) {
      return res.status(401).json({ error: "Non connecté" });
    }

    const { data: user, error: userError } = await profils.getUserOwnInfos(
      req.session.accessToken
    );

    if (userError) {
      throw new CustomError(
        "Erreur lors de la récupération dans le controller",
        400
      );
    }

    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function setProfilInformation(req, res, next) {
  try {
    if (req.method !== "PUT") {
      throw new CustomError("Méthode non autorisée", 405);
    }
    if (!req.session?.iduser || !req.session?.accessToken) {
      return res.status(401).json({ error: "Non connecté" });
    }

    const { userInfos } = req.body;

    if (!userInfos) {
      throw new CustomError("Données manquantes", 400);
    }
    const { message, error: insertError } =
      await profils.setUsersInformation(userInfos, req.session.accessToken,req.session.iduser);
    if (insertError) {
      throw new CustomError(
        "Erreur lors de l'insertion dans le controller",
        400
      );
    }

    return res.status(200).json({ message: message });
  } catch (err) {
    next(err);
  }
}
