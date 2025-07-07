import jwt from "jsonwebtoken";

function verifySessionJWT(req, res, next) {
  const sessionToken = req.session?.accessToken;

  if (!sessionToken) {
    return res.status(401).json({ error: "Non connecté : token manquant" });
  }

  try {
    const decoded = jwt.verify(sessionToken, process.env.SUPABASE_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Token JWT de session invalide ou expiré" });
  }
}

export default verifySessionJWT;
