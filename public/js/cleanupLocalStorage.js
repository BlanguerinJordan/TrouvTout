export default async function cleanupIfExpired() {
  const stored = JSON.parse(localStorage.getItem("signupInfos"));

  if (stored && Date.now() > stored.expiration) {
    console.warn("⏰ Session expirée détectée au chargement du site.");

    localStorage.removeItem("signupInfos");
    console.log("🧹 signupInfos supprimé du localStorage (au chargement du site).");
  }
}
