import NotificationsRepository from "@/repositories/NotificationsRepository";
import EntityService from "./EntityService";
import UserRepository from "@/repositories/UserRepository";
import { sendFollowUpdateMail } from "./MailService";

class NotificationService {

    private static notificationRepository: NotificationsRepository = new NotificationsRepository();
    private static userRepository: UserRepository = new UserRepository();

    static getNotifications = async (userId: string) => {
        return await this.notificationRepository.getNotifications(userId);
    }

    static markAsRead = async (notificationId: string, userId: string) => {
        await this.notificationRepository.markAsRead(notificationId, userId);
    }

    static deleteNotification = async (notificationId: string, userId: string) => {
        await this.notificationRepository.deleteNotification(notificationId, userId);
    }

    static incrementFollowUpdate = async (entityId: string, entityType_?: string) => {
        //Add 1 update to every following relation
        //Check for all the updated follwing relations if the nb of updates is 1 10 or 50
        //If it is, create a notification

        const entityType = entityType_ || await this.notificationRepository.getEntityType(entityId);

        const name = await EntityService.getEntityName(entityId, entityType);

        await this.notificationRepository.incrementFollowUpdate(entityId);

        const readyForNotificationFollows = await this.notificationRepository.getFollowsReadyForNotification(entityId);
        for (const follow of readyForNotificationFollows) {
            await this.notificationRepository.createNotification({
                userId: follow.userId,
                entityId,
                type: 'followUpdate',
                title: `Le sujet ${name} a été mis à jour`,
                read: false
            });
            const user = await this.userRepository.getUser(follow.userId);
            if(user){
                sendFollowUpdateMail(user.email, name);
            }
        }
    }

}

export default NotificationService;