import { ironSession } from "iron-session/express";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined in environment variables.");
}
if (!process.env.COOKIE_NAME) {
  throw new Error("COOKIE_NAME is not defined in environment variables.");
}

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: process.env.COOKIE_NAME ,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};
const applySession = ironSession(sessionOptions);

export default applySession;
