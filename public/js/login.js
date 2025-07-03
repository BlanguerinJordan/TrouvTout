import * as auth from "./auth.js";
import checkSession from "./session.js";
import cleanupIfExpired from "./cleanupLocalStorage.js";
let session = null;
let currentuser = null;
let email = "";

cleanupIfExpired();
document.addEventListener("DOMContentLoaded", async () => {
  const sessionData = await checkSession();
  if (sessionData.session) {
    auth.startInactivityLogout(10);
  }
  session = sessionData.session;
  email = sessionData.email || "";
  currentuser = sessionData.currentuser || null;

  document.querySelector("#formsignup")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = auth.handleSignupSubmit();
    email = data.email;
  });

  document
    .querySelector("#formsignin")
    ?.addEventListener("submit", auth.handleSigninSubmit);

  document
    .querySelector("#disconnect")
    ?.addEventListener("click", auth.handlerLogout);

  document
    .querySelector("#delete_account")
    ?.addEventListener("click", async (e) => {
      await auth.handlerDeleteAccount(e);
      await auth.handlerLogout(e);
    });
});
