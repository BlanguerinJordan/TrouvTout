import { handleForgetPassword, handleNewPassword } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  document
    .querySelector("#forget_password_form")
    ?.addEventListener("submit", handleForgetPassword);

  document
    .querySelector("#new_password_form")
    ?.addEventListener("submit", async (e)=>{
      e.preventDefault();
     const data = await handleNewPassword()
     if(data ===true)
        window.location.href = "http://172.29.157.133/TrouvTout/confirmResetPassword";
    });
});
