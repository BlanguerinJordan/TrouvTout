import checkSession from "./session.js";
let session = null;
let currentuser = null;
let email = "";
document.addEventListener("DOMContentLoaded", async () => {
  const sessionData = await checkSession();
  if (sessionData.session) {
    auth.startInactivityLogout(10);
  }
  session = sessionData.session;
  email = sessionData.email || "";
  currentuser = sessionData.currentuser || null;

  await confirmAccountIfTokenPresent();

  async function confirmAccountIfTokenPresent() {
    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.substring(1)).get(
      "access_token"
    );
    const refreshToken = new URLSearchParams(hash.substring(1)).get(
      "refresh_token"
    );

    if (!accessToken || !refreshToken) {
      console.error("❌ Tokens non trouvés dans l'URL.");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("signupInfos"));

    if (!stored || Date.now() > stored.expiration) {
      console.warn("⏰ Les informations de confirmation ont expiré.");
      localStorage.removeItem("signupInfos")
      return;
    }

    const infos = stored.data;

    try {
      const response = await fetch("/api/auth/finalizesignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...infos, accessToken, refreshToken}),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("✅ Compte confirmé :", result);
        localStorage.removeItem("signupInfos");
        setTimeout(() => {
          window.location.href = "/profil";
        }, 250); // Redirection après succès
      } else {
        console.warn("❌ Erreur confirmation :", result.error);
      }
    } catch (err) {
      console.error("Erreur côté client :", err);
    }
  }
});
