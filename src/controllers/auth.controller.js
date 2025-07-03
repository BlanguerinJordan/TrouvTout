import { CustomError } from "../utils/CustomError.util.js";
import * as auth from "../models/auth.model.js";

async function signupHandler(req, res, next) {
  try {
    if (req.method !== "POST") {
      throw new CustomError("Méthode non autorisée", 405);
    }

    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError("Données manquantes", 400);
    }

    const result = await auth.signupUserHandler(email, password);

    return res.status(200).json({
      message: "Inscription réussie, veuillez confirmer votre email.",
      emailConfirmed: result.emailConfirmed,
    });
  } catch (err) {
    next(err);
  }
}

async function confirmSignUpHandler(req, res, next) {
  try {
    if (req.method !== "GET") {
      throw new CustomError("Méthode non autorisée", 405);
    }

    const { token_hash, type, redirectUrl } = req.query;

    if (!token_hash || type !== "signup" || !redirectUrl) {
      throw new CustomError("Paramètres manquants ou invalides", 400);
    }

    const { accessToken, refreshToken } = await auth.verifyUserTokenSignUp(
      token_hash
    );

    return res.redirect(
      302,
      `${redirectUrl}#access_token=${accessToken}&refresh_token=${refreshToken}`
    );
  } catch (err) {
    next(err);
  }
}

async function confirmSignUpFinalizeHandler(req, res, next) {
  try {
    if (req.method !== "POST")
      throw new CustomError("Méthode non autorisée", 405);

    const { username, birthday_date, email, accessToken, refreshToken } =
      req.body;

    if (
      !username ||
      !birthday_date ||
      !email ||
      !accessToken ||
      !refreshToken
    ) {
      throw new CustomError("Données manquantes", 400);
    }

    const user = await auth.insertUserDataWithSession(
      accessToken,
      refreshToken,
      username,
      birthday_date,
      email
    );

    req.session.iduser = user.id;
    req.session.email = user.email;
    req.session.email = username;
    req.session.accessToken = accessToken;
    await req.session.save();

    return res.status(200).json({
      message: "Compte créé avec succès !",
      user: { iduser: user.id, email, username },
      sessions: { iduser: user.id, email, username },
    });
  } catch (err) {
    next(err);
  }
}

async function loginHandler(req, res, next) {
  try {
    if (req.method !== "POST") {
      throw new CustomError("Méthode non autorisée", 405);
    }

    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError("Email et mot de passe requis", 400);
    }

    const { user, profile, accessToken } = await auth.loginUserHandler(
      email,
      password
    );
    req.session.email = profile.email;
    req.session.iduser = user.id;
    req.session.username = profile.username;
    req.session.accessToken = accessToken;

    await req.session.save();

    return res.status(200).json({
      message: "Compte connecté avec succès !",
      user: {
        iduser: user.id,
        email: profile.email || null,
        username: profile.username || null,
      },
      sessions: {
        iduser: req.session.iduser,
        email: req.session.email,
        username: req.session.username,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function meHandler(req, res, next) {
  try {
    if (req.session.email && req.session.iduser) {
      return res.status(200).json({
        user: {
          email: req.session.email,
        },
        iduser: req.session.iduser,
        username: req.session.username,
      });
    }

    throw new CustomError("Non connecté", 401);
  } catch (err) {
    next(err);
  }
}

async function logoutHandler(req, res, next) {
  try {
    if (req.method !== "POST") {
      throw new CustomError("Méthode non autorisée", 405);
    }

    await req.session.destroy();

    return res.status(200).json({ message: "Déconnexion avec succès" });
  } catch (err) {
    next(err);
  }
}

async function deleteUserHandler(req, res, next) {
  try {
    if (!req.session.iduser) {
      throw new CustomError("Non connecté", 401);
    }

    const result = await auth.softDeleteUserHandler(req.session.iduser);

    return res.status(200).json({ message: result.message });
  } catch (err) {
    next(err);
  }
}

async function forgotPasswordHandler(req, res, next) {
  try {
    if (req.method !== "POST") {
      throw new CustomError("Méthode non autorisée", 405);
    }
    const { email } = req.body;

    if (!email) {
      throw new CustomError("Email requis", 400);
    }

    await auth.sendEmailResetPasswordHandler(email);

    return res
      .status(200)
      .json({ message: "Email de réinitialisation envoyé" });
  } catch (err) {
    next(err);
  }
}

async function confirmRecoveryHandler(req, res) {
  try {
    if (req.method !== "GET") {
      throw new CustomError("Méthode non autorisée", 405);
    }

    const { token_hash, type, redirectUrl } = req.query;

    if (!token_hash || !type) {
      throw new CustomError("Paramètres invalides", 400);
    }

    console.log("🔑 Token reçu pour vérification :", token_hash);

    const session = await auth.confirmEmailOtpHandler(token_hash, type);

    console.log("✅ Email vérifié avec succès.");

    return res.redirect(
      302,
      `${redirectUrl}?access_token=${session.access_token}&refresh_token=${session.refresh_token}`
    );
  } catch (err) {
    if (err instanceof CustomError) {
      console.warn(`❌ Erreur personnalisée : ${err.message}`);
    } else {
      console.error("❌ Erreur inconnue :", err.message);
    }

    return res.redirect(
      302,
      `/TrouvTout/forgetpassword?errormessage=${encodeURIComponent(
        err.message
      )}`
    );
  }
}

async function newPasswordHandler(req, res, next) {
  try {
    if (req.method !== "POST") {
      throw new CustomError("Méthode non autorisée", 405);
    }

    const { accessToken, refreshToken, password } = req.body;

    if (!accessToken || !refreshToken || !password) {
      throw new CustomError("Tokens et mot de passe requis", 400);
    }

    const result = await auth.updatePasswordHandler(
      accessToken,
      refreshToken,
      password
    );

    return res
      .status(200)
      .json({ message: "Mot de passe changé avec succès", result });
  } catch (err) {
    next(err);
  }
}

export {
  signupHandler,
  confirmSignUpHandler,
  confirmSignUpFinalizeHandler,
  loginHandler,
  meHandler,
  logoutHandler,
  deleteUserHandler,
  forgotPasswordHandler,
  confirmRecoveryHandler,
  newPasswordHandler,
};
