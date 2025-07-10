import {Request,Response,NextFunction} from "express";
import { CustomError } from "../utils/CustomError.util.js";
export default function errorHandler(err:Error, req:Request, res:Response, next:NextFunction) {
  console.error("💥 Erreur API:", err.stack || err);

  const customError = err as CustomError;
  const statusCode = customError.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || "Erreur interne du serveur",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
