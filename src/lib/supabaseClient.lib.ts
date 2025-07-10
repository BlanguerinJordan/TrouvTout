import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

function getSupabaseWithToken(token:string) {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string, // anon key
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  return supabase;
}

async function getSupabaseWithActiveSessionRefresh(token:string, refresh_token:string) {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
  );

  await supabase.auth.setSession({
    access_token: token,
    refresh_token: refresh_token, // facultatif, peut être vide si tu n’as pas besoin de refresh
  });

  return supabase;
}

export {
  supabase,
  supabaseAdmin,
  getSupabaseWithToken,
  getSupabaseWithActiveSessionRefresh
};
