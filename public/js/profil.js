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
});
