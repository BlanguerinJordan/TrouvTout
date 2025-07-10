declare module "express" {
  interface Request {
    user?: SupabaseJWTPayload;
  }
}
export {}
