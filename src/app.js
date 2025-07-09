import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import "./cron/purgeUsers.cron.js";
import "./cron/cleanupPendingUsers.cron.js";
import {
  htmlRoutes,
  errorHandlerCustom,
  protectPages,
} from "./middlewares/index.js";
import router from "./routes/index.js";
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

app.get("/TrouvTout/:page", protectPages, htmlRoutes);

//API Route
app.use("/api", router);

app.use(errorHandlerCustom);

app.listen(PORT, () => {
  console.clear();
  console.log(
    `Serveur Express lancé sur http://localhost:${PORT}${BASE_PATH}/`
  );
});
