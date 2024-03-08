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

    findById = async (id: string) => {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id
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
}

export default UserRepository;