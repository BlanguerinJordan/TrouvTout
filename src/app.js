import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import "./cron/purgeUsers.cron.js";
import "./cron/cleanupPendingUsers.cron.js";
import htmlRoutes from "./middlewares/htmlRoutes.middleware.js";
import authRouter from "./routes/auth.routes.js";
import adsRouter from "./routes/ads.routes.js";
import profilsRouter from "./routes/profils.routes.js";
import errorHandlerCustom from "./middlewares/errorHandler.middleware.js";
import protectPage from "./middlewares/protectPages.middleware.js";
import applySession from "./lib/session.lib.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(applySession);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_PATH = process.env.BASE_PATH;
const PORT = process.env.PORT_SERVER;

app.use(BASE_PATH, express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.get("/TrouvTout/:page", protectPage, htmlRoutes);

//API Route for Authentification
app.use("/api", authRouter);

//API Route for Ads
app.use("/api", adsRouter);

//API Route for profils
app.use("/api", profilsRouter);

app.use(errorHandlerCustom);

app.listen(PORT, () => {
  console.clear();
  console.log(
    `Serveur Express lancé sur http://localhost:${PORT}${BASE_PATH}/`
  );
});
