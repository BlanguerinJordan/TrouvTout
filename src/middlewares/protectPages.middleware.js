const protectedPages = ['createads', 'profil','modifyads'];
const bypassPages = ["login"];
export default function protectPage(req, res, next) {
    const page = req.params.page;

    if (protectedPages.includes(page)) {
        if (!req.session || (!req.session.email && !req.session.iduser)) {
            console.log(`⛔ Accès interdit à la page ${page} sans session`);
            return res.redirect('/TrouvTout/login');
        }
    }else if(bypassPages.includes(page)){
        if(req.session)
            return res.redirect("/TrouvTout/profil");
    }

    next();
}
