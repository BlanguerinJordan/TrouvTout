import { startInactivityLogout, handlerLogout } from "./auth.js";
import checkSession from "./session.js";
let session = null;
let currentuser = null;
let email = "";

document.addEventListener("DOMContentLoaded", async () => {
  const sessionData = await checkSession();

  if (sessionData.session === true) {
    startInactivityLogout(10);
  }
  session = sessionData.session;
  email = sessionData.email || "";
  currentuser = sessionData.currentuser || null;

  document
    .querySelector("#disconnect")
    ?.addEventListener("click", handlerLogout);

  const profilForm = document.querySelector("#profil_form");
  const emailForm = document.querySelector("#email_form");
  const passwordForm = document.querySelector("#password_form");

  const username = profilForm.querySelector("#username");
  const lastname = profilForm.querySelector("#lastname");
  const firstname = profilForm.querySelector("#firstname");
  const birthdayDate = profilForm.querySelector("#birthday_date");
  const phoneNumber = profilForm.querySelector("#phone_number");
  const location = profilForm.querySelector("#location");

  const emailInput = emailForm.querySelector("#email");
  // const emailConfirmInput = emailForm.querySelector("#email_confirm");

  // const passwordInput = passwordForm.querySelector("#password");
  // const passwordInputConfirm = passwordForm.querySelector("#password_confirm");

  await getProfilInfo();

  async function getProfilInfo() {
    try {
      const res = await fetch("/api/profils/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erreur lors du fetch des informations du profil");
      }
      const user = await res.json();
      if (!user) {
        throw new Error("Erreur lors de la récupération des infos côté front");
      }

      username.placeholder = user.data.username;
      lastname.placeholder = user.data.lastname || "non défini";
      firstname.placeholder = user.data.firstname || "non défini";
      birthdayDate.value = user.data.birthday_date;
      phoneNumber.placeholder = user.data.number_phone || "non défini";
      location.placeholder = user.data.location || "non défini";
      emailInput.placeholder = user.data.email;
    } catch (err) {
      console.error(err.message);
    }
  }

  profilForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userInfos = {};
    if (username?.value) userInfos.username = username.value;
    if (lastname?.value) userInfos.lastname = lastname.value;
    if (firstname?.value) userInfos.firstname = firstname.value;
    if (birthdayDate?.value) userInfos.birthdayDate = birthdayDate.value;
    if (phoneNumber?.value) userInfos.phoneNumber = phoneNumber.value;
    if (location?.value) userInfos.location = location.value;
    try {
      const res = await fetch("/api/profils/addInfos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userInfos }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error);
      }
      if (result.changeConfirmed === true) window.location.reload();

      console.log(result.message);
    } catch (err) {
      console.log(err.message);
    }
  });

  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  });
});
