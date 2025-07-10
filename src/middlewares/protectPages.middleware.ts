import {Request,Response,NextFunction} from "express";
const protectedPages = ["createads", "profil", "myads", "modifyads"];
const bypassPages = ["login"];

export default function protectPage(req:Request, res:Response, next:NextFunction) {
  const page = req.params.page;
  const isAuthenticated =
    req.session && (req.session.email || req.session.iduser);
  const currentPath = req.path;
  if (protectedPages.includes(page)) {
    if (!isAuthenticated) {
      console.log(
        `⛔ Accès interdit à la page ${page} sans session. Redirection vers /login`
      );
      if (currentPath !== "/login") {
        return res.redirect("/login");
      } else {
        return next();
      }
    }
  }
  if (bypassPages.includes(page)) {
    if (isAuthenticated) {
      console.log(
        `✅ Utilisateur déjà connecté. Redirection depuis la page ${page} vers /profil`
      );
      if (currentPath !== "/profil" && page !== "profil") {
        return res.redirect("/profil");
      } else {
        return next();
      }
    }
  }
  next();
}
