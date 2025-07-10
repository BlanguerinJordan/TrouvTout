import { redis, supabaseClient } from "../lib/index.js";

const purgeQueue = new redis.Queue("purgeUsers", {
  connection: redis.redisConnection,
});

await purgeQueue.add(
  "purgeUsersJob",
  {},
  {
    repeat: { every: 60 * 1000 }, // 1 min
  }
);

console.log("✅ Cron BullMQ purgeUsers programmé toutes les 1 min");
// 🔨 Worker pour consommer le job
new redis.Worker(
  "purgeUsers",
  async (job) => {
    console.log("⏰ Job purgeUsers lancé");

    try {
      const { data: users, error } = await supabaseClient.supabaseAdmin
        .from("Users")
        .select("id, delete_at")
        .eq("is_deleted", true);

      if (error) {
        console.error("❌ Erreur fetch users :", error);
        return;
      }

      const now = new Date();

      for (const user of users) {
        const deletedAt = new Date(user.delete_at);
        const diff = (now.getTime() - deletedAt.getTime()) / 1000;

        if (diff > 60) {
          console.log(`🧹 Suppression de ${user.id}`);

          try {
            await supabaseClient.supabaseAdmin.auth.admin.deleteUser(user.id);
            await supabaseClient.supabaseAdmin
              .from("users")
              .delete()
              .eq("id", user.id);

            await supabaseClient.supabaseAdmin.from("Cron_logs").insert({
              cron_name: "purge_users",
              user_id: user.id,
              status: "success",
              message: "Suppression réussie via BullMQ",
            });
          } catch (err) {
            const errMsg = err instanceof Error ? err.message : String(err);

            console.error(`❌ Erreur suppression user ${user.id} :`, err);

            await supabaseClient.supabaseAdmin.from("Cron_logs").insert({
              cron_name: "purge_users",
              user_id: user.id,
              status: "error",
              message: errMsg || "Erreur inconnue",
            });
          }
        }
      }

      console.log("✅ Job purgeUsers terminé");
    } catch (err) {
      console.error("❌ Erreur globale dans purgeUsers via BullMQ :", err);
    }
  },
  { connection: redis.redisConnection }
);
