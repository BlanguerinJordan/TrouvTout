import * as redis from '../lib/redisClient.lib.js';
import { supabaseAdmin } from "../lib/supabaseClient.lib.js";

const purgeQueue = new redis.Queue('purgeUsers', { connection: redis.redisConnection });

await purgeQueue.add('purgeUsersJob', {}, {
  repeat: { every: 60 * 1000 } // 1 min
});

console.log('✅ Cron BullMQ purgeUsers programmé toutes les 1 min');
// 🔨 Worker pour consommer le job
new redis.Worker('purgeUsers', async job => {
  console.log('⏰ Job purgeUsers lancé');

  try {
    const { data: users, error } = await supabaseAdmin
      .from('Users')
      .select('id, delete_at')
      .eq('is_deleted', true);

    if (error) {
      console.error('❌ Erreur fetch users :', error);
      return;
    }

    const now = new Date();

    for (const user of users) {
      const deletedAt = new Date(user.delete_at);
      const diff = (now - deletedAt) / 1000;

      if (diff > 60) {
        console.log(`🧹 Suppression de ${user.id}`);

        try {
          await supabaseAdmin.auth.admin.deleteUser(user.id);
          await supabaseAdmin.from('users').delete().eq('id', user.id);

          await supabaseAdmin.from('Cron_logs').insert({
            cron_name: 'purge_users',
            user_id: user.id,
            status: 'success',
            message: 'Suppression réussie via BullMQ',
          });
        } catch (err) {
          console.error(`❌ Erreur suppression user ${user.id} :`, err);

          await supabaseAdmin.from('Cron_logs').insert({
            cron_name: 'purge_users',
            user_id: user.id,
            status: 'error',
            message: err.message || 'Erreur inconnue',
          });
        }
      }
    }

    console.log('✅ Job purgeUsers terminé');

  } catch (err) {
    console.error('❌ Erreur globale dans purgeUsers via BullMQ :', err);
  }
}, { connection: redis.redisConnection });
