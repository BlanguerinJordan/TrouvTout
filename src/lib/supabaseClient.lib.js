import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function getSupabaseWithToken(token) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY, // anon key
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

async function getSupabaseWithActiveSessionRefresh(token, refresh_token) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
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
