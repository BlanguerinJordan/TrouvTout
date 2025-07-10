import { redis, supabaseClient } from "../lib/index.js";

const cleanupQueue = new redis.Queue("purgeUsers", {
  connection: redis.redisConnection,
});

await cleanupQueue.add(
  "cleanupPendingUsersJob",
  {},
  {
    repeat: { every: 30 * 60 * 1000 }, // 30 min
  }
);

console.log("✅ Cron BullMQ cleanupPendingUsers programmé toutes les 30 min");

// 🔨 Worker pour consommer le job
new redis.Worker(
  "cleanupPendingUsers",
  async (job) => {
    console.log("🔔 Job cleanupPendingUsers lancé");

    try {
      const { data, error } =
        await supabaseClient.supabaseAdmin.auth.admin.listUsers();

      if (error) {
        console.error("❌ Erreur récupération utilisateurs :", error.message);
        return;
      }

      const users = data?.users || [];
      const now = Date.now();
      const delayMinutes = 60;

      const expiredUsers = users.filter((user) => {
        if (user.email_confirmed_at) return false;

        const createdAt = new Date(user.created_at).getTime();
        return now - createdAt > delayMinutes * 60 * 1000;
      });

      if (expiredUsers.length === 0) {
        console.log("✅ Aucun utilisateur à supprimer.");
        return;
      }

      for (const user of expiredUsers) {
        try {
          await supabaseClient.supabaseAdmin.auth.admin.deleteUser(user.id);

          await supabaseClient.supabaseAdmin.from("cron_logs").insert({
            cron_name: "cleanup_pending_users",
            user_id: user.id,
            status: "success",
            message: `Utilisateur ${user.email} supprimé (non confirmé).`,
          });

          console.log(`🗑️ Utilisateur ${user.email} supprimé (non confirmé).`);
        } catch (deleteError) {
          const errorMessage =
            deleteError instanceof Error
              ? deleteError.message
              : String(deleteError);
              
          console.error(
            `❌ Erreur suppression utilisateur ${user.email} :`,
            errorMessage
          );

          await supabaseClient.supabaseAdmin.from("cron_logs").insert({
            cron_name: "cleanup_pending_users",
            user_id: user.id,
            status: "error",
            message: errorMessage,
          });
        }
      }

      console.log(
        `✅ Nettoyage terminé : ${expiredUsers.length} utilisateurs supprimés.`
      );
    } catch (err) {
      console.error(
        "❌ Erreur globale dans cleanupPendingUsers via BullMQ :",
        err
      );
    }
  },
  { connection: redis.redisConnection }
);
