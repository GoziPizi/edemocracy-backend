import { Affiliation, MembershipStatus, Role, VerifyUser } from "@prisma/client";
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

    createDiploma = async (userId : string, name : string, obtention: number) => {
        const diploma = await this.prismaClient.userDiploma.create({
            data: {
                name,
                obtention,
                userId
            }
        })
        return diploma
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
        if(user.contributionStatus) {
            delete user.contributionStatus
        }
        if(user.role) {
            delete user.role
        }
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

    updateContributionStatus = async (id: string, contributionStatus: MembershipStatus) => {
        await this.prismaClient.user.update({
            where: {
                id
            },
            data: {
                contributionStatus
            }
        })
        return
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

    follow = async (userId: string, entityType: string, entityId: string) => {
        await this.prismaClient.follow.create({
            data: {
                userId,
                entityType,
                entityId
            }
        })
        return  
    }

    deleteFollow = async (userId: string, entityId: string) =>
    {
        await this.prismaClient.follow.deleteMany({
            where: {
                userId,
                entityId
            }
        })
        return
    }

    findFollowsByUserId = async (id: string) => {
        const follows = await this.prismaClient.follow.findMany({
            where: {
                userId: id
            }
        })
        return follows
    }

    findSingleFollowByUserId = async (id: string, entityId: string) => {
        const follows = await this.prismaClient.follow.findFirst({
            where: {
                userId: id,
                entityId
            }
        })
        return follows
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

    createVerificationRequest = async ( data: VerifyUser ) => {
        const verification = await this.prismaClient.verifyUser.create({
            data: data
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

    setUserVerified = async (email: string) => {
        await this.prismaClient.user.update({
            where: {
                email
            },
            data: {
                isVerified: true
            }
        })
        return
    }

    //Sponsorship methods
    setSponsorshipCodeToUser = async (userId: string, code: string) => {
        //fetch the user to check if it exists and if it has a code
        const user = await this.prismaClient.user.findFirst({
            where: {
                id: userId
            }
        })
        if(!user) {
            throw new Error('User not found')
        }
        if(user.sponsorshipCode) {
            throw new Error('User already has a sponsorship code')
        }
        console.log(user)
        //update the user with the code
        await this.prismaClient.user.update({
            where: {
                id: userId
            },
            data: {
                sponsorshipCode: code
            }
        })
    }

    getUserBySponsorshipCode = async (code: string) => {
        const user = await this.prismaClient.user.findFirst({
            where: {
                sponsorshipCode: code
            }
        })
        return user
    }
}

export default UserRepository;