export default function errorHandler(err, req, res, next) {
  console.error("💥 Erreur API:", err.stack || err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || "Erreur interne du serveur",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
