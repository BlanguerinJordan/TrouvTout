import { Request, Response, NextFunction } from "express";
import { profils } from "../models/index.js";
import { CustomError } from "../utils/CustomError.util.js";

export async function getProfilInformation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.method !== "GET") {
      throw new CustomError("Méthode non autorisée", 405);
    }

    const { data: user } = await profils.getUserOwnInfos(
      req.session.accessToken ?? "",
      req.session.iduser ?? ""
    );

    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function setProfilInformation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.method !== "PUT") {
      throw new CustomError("Méthode non autorisée", 405);
    }

    const { userInfos } = req.body;

    if (!userInfos) {
      throw new CustomError("Données manquantes", 400);
    }
    const { message, changeConfirmed } = await profils.setUsersInformation(
      userInfos,
      req.session.accessToken ?? "",
      req.session.iduser ?? ""
    );

    return res
      .status(200)
      .json({ message: message, changeConfirmed: changeConfirmed });
  } catch (err) {
    next(err);
  }
}
