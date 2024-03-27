import PrismaRepository from "./PrismaRepository";

class NotificationsRepository extends PrismaRepository {

    getNotifications = async (userId: string) => {
        return await this.prismaClient.notifications.findMany({
            where: {
                userId
            }
        });
    }

    createNotification = async (data: any) => {
        await this.prismaClient.notifications.create({data});
    }

    markAsRead = async (notificationId: string, userId?: string) => {
        await this.prismaClient.notifications.update({
            where: {
                id: notificationId,
                userId
            },
            data: {
                read: true
            }
        });
    }

    deleteNotification = async (notificationId: string, userId?: string) => {
        await this.prismaClient.notifications.delete({
            where: {
                id: notificationId,
                userId
            }
        });
    }

}

export default NotificationsRepository;