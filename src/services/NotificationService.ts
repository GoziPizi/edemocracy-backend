import NotificationsRepository from "@/repositories/NotificationsRepository";

class NotificationService {

    private static notificationRepository: NotificationsRepository = new NotificationsRepository();

    static getNotifications = async (userId: string) => {
        return await this.notificationRepository.getNotifications(userId);
    }

    static markAsRead = async (notificationId: string, userId: string) => {
        await this.notificationRepository.markAsRead(notificationId, userId);
    }

    static deleteNotification = async (notificationId: string, userId: string) => {
        await this.notificationRepository.deleteNotification(notificationId, userId);
    }

}

export default NotificationService;