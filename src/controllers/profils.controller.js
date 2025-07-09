import {profils} from "../models/index.js";
import { CustomError } from "../utils/CustomError.util.js";

export async function getProfilInformation(req, res, next) {
  try {
    if (req.method !== "GET") {
      throw new CustomError("Méthode non autorisée", 405);
    }

    const { data: user, error: userError } = await profils.getUserOwnInfos(
      req.session.accessToken,req.session.iduser
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

    const { userInfos } = req.body;

    if (!userInfos) {
      throw new CustomError("Données manquantes", 400);
    }
    const {
      message,
      changeConfirmed,
      error: insertError,
    } = await profils.setUsersInformation(
      userInfos,
      req.session.accessToken,
      req.session.iduser
    );
    if (insertError) {
      throw new CustomError(
        "Erreur lors de l'insertion dans le controller",
        400
      );
    }

    return res
      .status(200)
      .json({ message: message, changeConfirmed: changeConfirmed });
  } catch (err) {
    next(err);
  }
}
