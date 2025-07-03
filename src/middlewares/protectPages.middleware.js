const protectedPages = ['createads', 'profil','modifyads']; // Les pages qui nécessitent une session

export default function protectPage(req, res, next) {
    const page = req.params.page;

    if (protectedPages.includes(page)) {
        if (!req.session || (!req.session.email && !req.session.iduser)) {
            console.log(`⛔ Accès interdit à la page ${page} sans session`);
            return res.redirect('/TrouvTout/login'); // Redirection si pas connecté
        }
    }

    next(); // Sinon on continue normalement
}
