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

    getEntityType = async (entityId: string) => {
        const follow = await this.prismaClient.follow.findFirst({
            where: {
                entityId
            }
        });
        return follow?.entityType || '';
    }

    resetNbUpdatesSinceLastView = async (entityId: string, userId: string) => {
        await this.prismaClient.follow.updateMany({
            where: {
                entityId,
                userId
            },
            data: {
                nbUpdatesSinceLastView: 0
            }
        });
    }

    incrementFollowUpdate = async (entityId: string) => {
        await this.prismaClient.follow.updateMany({
            where: {
                entityId
            },
            data: {
                nbUpdatesSinceLastView: {
                    increment: 1
                }
            }
        });
    }

    //Returns the follows that have 1, 10 or 50 updates since the last view
    getFollowsReadyForNotification = async (entityId: string) => {
        return await this.prismaClient.follow.findMany({
            where: {
                entityId,
                nbUpdatesSinceLastView: {
                    in: [1, 10, 50]
                }
            }
        });
    }
}

export default NotificationsRepository;