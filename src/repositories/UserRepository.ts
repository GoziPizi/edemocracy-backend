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
}

export default UserRepository;