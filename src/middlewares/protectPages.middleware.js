const protectedPages = ["createads", "profil", "myads", "modifyads"];
const bypassPages = ["login"];

export default function protectPage(req, res, next) {
  const page = req.params.page;
  const isAuthenticated =
    req.session && (req.session.email || req.session.iduser);
  const currentPath = req.path;
  if (protectedPages.includes(page)) {
    if (!isAuthenticated) {
      console.log(
        `⛔ Accès interdit à la page ${page} sans session. Redirection vers /TrouvTout/login`
      );
      if (currentPath !== "/TrouvTout/login") {
        return res.redirect("/TrouvTout/login");
      } else {
        return next();
      }
    }
  }
  if (bypassPages.includes(page)) {
    if (isAuthenticated) {
      console.log(
        `✅ Utilisateur déjà connecté. Redirection depuis la page ${page} vers /TrouvTout/profil`
      );
      if (currentPath !== "/TrouvTout/profil" && page !== "profil") {
        return res.redirect("/TrouvTout/profil");
      } else {
        return next();
      }
    }
  }
  next();
}
