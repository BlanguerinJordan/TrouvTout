import { Request,Response,NextFunction } from "express";

export default function htmlRoutes(req:Request, res:Response, next:NextFunction) {
  const page = req.params.page;

  res.sendFile(`${page}.html`, { root: "public" }, (err:Error) => {
    if (err) {
      next();
    }
  });
}
