export default async function checkSession() {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || "Erreur inconnue");
    }

    const data = await res.json();
    const email = data.user.email;
    const currentuser = data.iduser;
    const username = data.username;

    console.log("✅ Session active :", email, currentuser, username);

    return { session: true, email, currentuser, username };
  } catch (err) {
    console.error("❌ Erreur dans checkSession :", err.message);
    return { session: false };
  }
}
