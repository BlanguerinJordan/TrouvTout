import { ironSession } from "iron-session/express";
import dotenv from "dotenv";
dotenv.config();

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: process.env.COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};
const applySession = ironSession(sessionOptions);

export default applySession;
