function handleSignupSubmit() {
  const usernameinput = document.querySelector("#username");
  const birthday_dateinput = document.querySelector("#date");
  const emailinput = document.querySelector("#emailsignup");
  const passwordinput = document.querySelector("#passwordsignup");

  const username = usernameinput.value.trim();
  const birthday_date = birthday_dateinput.value.trim();
  const email = emailinput.value.trim();
  const password = passwordinput.value.trim();
  signupfront(email, password, username, birthday_date);

  return { email };
}

function handleSigninSubmit(e) {
  e.preventDefault();
  const emailInput = document.querySelector("#emailsignin");
  const passwordInput = document.querySelector("#passwordsignin");
  signinfront(emailInput.value.trim(), passwordInput.value.trim());
  emailInput.value = "";
  passwordInput.value = "";
}

function handleForgetPassword(e) {
  e.preventDefault();
  const emailInput = document.querySelector("#email_forget_password");
  sendResetPasswordEmail(emailInput.value.trim());
  emailInput.value = "";
}

async function handleNewPassword() {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("access_token");
  const refreshToken = urlParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    console.error("❌ Token de session manquant !");
    return false;
  }

  const newPasswordInput = document.querySelector("#new_password");
  const newPasswordInputConfirm = document.querySelector(
    "#new_password_confirm"
  );

  if (!newPasswordInput || !newPasswordInputConfirm) {
    console.error("Input manquants");
    return false;
  }

  if (newPasswordInput.value.trim() !== newPasswordInputConfirm.value.trim()) {
    console.error("Les mots de passes ne correspondent pas !");
    return false;
  }

  const success = await newPassword(
    accessToken,
    refreshToken,
    newPasswordInput.value.trim()
  );
  return success;
}

async function signupfront(email, password, username, birthday_date) {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur de requête signup");
    }

    const data = await res.json();
    // ✅ Stocker les infos dans le localStorage avec expiration
    const signupInfos = { username, birthday_date, email };
    const expiration = Date.now() + 15 * 60 * 1000; // 15 min

    localStorage.setItem("signupInfos", JSON.stringify({ data: signupInfos, expiration }));
    console.log(data);

    console.log("✅ Inscription réussie :", data.message);
    console.log("👉 Vérifie ta boîte mail pour confirmer ton compte.");
  } catch (err) {
    console.log("Erreur côté front:", err);
  }
}

async function signinfront(email, password) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur de requête login");
    }
    const data = await res.json();
    console.log(data);
    window.location.href = "/profil";
  } catch (err) {
    console.log("Erreur côté front:", err);
  }
}

async function sendResetPasswordEmail(email) {
  try {
    const res = await fetch("/api/auth/forgetpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Erreur reset password");

    console.log("✅ Email de reset envoyé !");
    // Affiche un message pour l'utilisateur ici
  } catch (err) {
    console.error("❌ Erreur reset password :", err.message);
    // Affiche un message d'erreur ici
  }
}

async function newPassword(accessToken, refreshToken, password) {
  try {
    const res = await fetch("/api/auth/newpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken, refreshToken, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur de requête newPassword");
    }
    const data = await res.json();
    console.log(data);
    return true;
  } catch (err) {
    console.log("Erreur côté front:", err);
    return false;
  }
}

async function handlerLogout(e) {
  e.preventDefault();
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw new Error("Erreur lors de la déconnexion");
    window.location.reload();
    console.log(result.message);
  } catch (err) {
    console.error("Erreur logout :", err);
  }
}

function startInactivityLogout(delayInMinutes) {
  let inactivityTimer;

  const logoutUser = () => {
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      window.location.href = "/timeout";
    });
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logoutUser, delayInMinutes * 60 * 1000);
  };
  resetInactivityTimer();
  [
    "click",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart",
    "input",
    "submit",
  ].forEach((event) => {
    window.addEventListener(event, resetInactivityTimer);
  });
}

async function handlerDeleteAccount(e) {
  e.preventDefault();
  try {
    const res = await fetch("/api/auth/deleteUser", {
      method: "DELETE",
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur lors de la suppression");
    }

    console.log("✅ Compte marqué comme supprimé :", result.message);
  } catch (err) {
    console.error("❌ Erreur lors de la suppression :", err);
  }
}

export {
  handleSignupSubmit,
  handleSigninSubmit,
  handleForgetPassword,
  handleNewPassword,
  handlerLogout,
  startInactivityLogout,
  handlerDeleteAccount,
};
