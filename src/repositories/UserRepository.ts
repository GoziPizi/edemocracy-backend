import PrismaRepository from "./PrismaRepository";
import RawQueryRepository from "./RawQueryRepository";


class UserRepository extends PrismaRepository {
    private RawQueryRepository = new RawQueryRepository()

    create = async (user: any) => {
        const hashedPassword = await this.RawQueryRepository.getSha256(user.password)
        const createdUser = await this.prismaClient.user.create({
            data: {
                ...user,
                password: hashedPassword
            }
        })
        return createdUser
    }

    update = async (id: string, user: any) => {
        const updatedUser = await this.prismaClient.user.update({
            where: {
                id
            },
            data: {
                ...user
            }
        })
        return updatedUser
    }

    findById = async (id: string) => {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id
            }
        })
        return user
    }

    getUserByEmail = async (email: string) => {
        const user = await this.prismaClient.user.findFirst({
            where: {
                email
            }
        })
        return user
    }

    checkUser = async (email: string, password: string) => {
        const hashedPassword = await this.RawQueryRepository.getSha256(password)
        const user = await this.prismaClient.user.findFirst({
            where: {
                email,
                password: hashedPassword
            }
        })
        return user
    }

    updateLastLogin = async (id: string, date: Date) => {
        await this.prismaClient.user.update({
            where: {
                id
            },
            data: {
                updatedAt: date
            }
        })
        return true
    }

    findRoleById = async (id: string) => {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id
            },
            select: {
                role: true
            }
        })
        return user!.role
    }
}

export default UserRepository;