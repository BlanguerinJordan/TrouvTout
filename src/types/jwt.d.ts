declare interface SupabaseJWTPayload {
  sub: string;
  email?: string;
  role?: string;
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}
export {}