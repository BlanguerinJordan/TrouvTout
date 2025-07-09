import {supabaseClient} from "../lib/index.js";

export async function getCronStatus(userId) {
  try {
    const { data, error } = await supabaseClient.supabaseAdmin
      .from("cron_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Erreur récupération cron log :", error.message);
      return { error: "Erreur lors de la récupération du log" };
    }

    if (!data) {
      return { data: { status: "not_requested", message: "Aucune suppression en cours" } };
    }

    if (data.status === "pending") {
      return { data: { status: "pending", message: "Suppression en attente" } };
    }

    return {
      data: {
        status: data.status,
        message: data.message,
        created_at: data.created_at,
      },
    };
  } catch (err) {
    console.error("Erreur dans getCronStatus :", err);
    return { error: "Erreur serveur interne" };
  }
}
