import { Affiliation, Role } from "@prisma/client";
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

    updatePassword = async (id: string, password: string) => {
        const hashedPassword = await this.RawQueryRepository.getSha256(password)
        await this.prismaClient.user.update({
            where: {
                id
            },
            data: {
                password: hashedPassword
            }
        })
        return
    }

    //Updates the contribution field to true, based on the email to clarify on Stripe.
    updateContribution = async (email: string) => {
        await this.prismaClient.user.update({
            where: {
                email
            },
            data: {
                contribution: true
            }
        })
        return
    }

    deleteUserById = async (id: string) => {
        //Updates all the filds to "deleted"
        await this.prismaClient.user.update({
            where: {
                id
            },
            data: {
                email: "deleted",
                name: "deleted",
                firstName: "deleted",
                telephone: "deleted",
                profession: "deleted",
                politicSide: Affiliation.CENTER,
                password: "deleted",
                role: Role.USER,
                profilePicture: "deleted",
                isVerified: false,
                address: "deleted",
                description: "deleted",
            }
        })
    }

    updateProfilePicture = async (id: string, imageUrl: string) => {
        const updatedUser = await this.prismaClient.user.update({
            where: {
                id
            },
            data: {
                profilePicture: imageUrl
            }
        })
        return updatedUser
    }

    delete = async (id: string) => {
        await this.prismaClient.user.delete({
            where: {
                id
            }
        })
        return
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

    getAdmins = async () => {
        const admins = await this.prismaClient.user.findMany({
            where: {
                role: Role.ADMIN
            }
        })
        return admins
    }

    setRole = async (id: string, role: Role) => {
        const updatedUser = await this.prismaClient.user.update({
            where: {
                id
            },
            data: {
                role
            }
        })
        return updatedUser
    }

    setRoleByEmail = async (email: string, role: Role) => {
        const updatedUser = await this.prismaClient.user.update({
            where: {
                email
            },
            data: {
                role
            }
        })
        return updatedUser
    }

    //Verification methods

    getVerificationList = async () => {
        const users = await this.prismaClient.verifyUser.findMany()
        return users
    }

    getVerificationRequest = async (id: string) => {
        const user = await this.prismaClient.verifyUser.findUnique({
            where: {
                id
            }
        })
        return user
    }

    createVerificationRequest = async (userId: string, recto: string, verso: string) => {
        const verification = await this.prismaClient.verifyUser.create({
            data: {
                userId,
                recto,
                verso
            }
        })
        return verification
    }

    deleteVerificationRequest = async (id: string) => {
        await this.prismaClient.verifyUser.delete({
            where: {
                id
            }
        })
        return
    }

    setUserVerified = async (userId: string) => {
        await this.prismaClient.user.update({
            where: {
                id: userId
            },
            data: {
                isVerified: true
            }
        })
        return
    }
}

export default UserRepository;