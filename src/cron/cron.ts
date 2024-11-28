import cron from 'node-cron';
import PopularityService from '../services/PopularityService';

export function startCronJobs() {
    cron.schedule('0 0 * * *', async () => {
        console.log('Lancement de la mise à jour quotidienne de la popularité...');
        try {
            await PopularityService.dailyUpdate();
            console.log('Mise à jour quotidienne terminée avec succès !');
        } catch (error) {
            console.error('Erreur lors de la mise à jour quotidienne de la popularité :', error);
        }
    });

    console.log('Cron jobs configurés avec succès.');
}