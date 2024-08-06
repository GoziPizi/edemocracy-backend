import PrismaRepository from "./PrismaRepository";
import { StandardUserCreateInputDto } from "@/types/dtos/UserDto";

class PreRegistrationRepository extends PrismaRepository {

    createPreRegistration = async (user : StandardUserCreateInputDto) => {
        let finalUser: any = { ...user }
        if(user.formationObtention) {
            finalUser = {
                ...finalUser,
                formationObtention: Number(user.formationObtention)
            }
        }
        const preRegistration = await this.prismaClient.preRegistrationUser.create({
            data: finalUser
        })
        return preRegistration
    }

    getPreRegistration = async (email: string) => {
        const preRegistration = await this.prismaClient.preRegistrationUser.findUnique({
            where: {
                email
            }
        })
        return preRegistration
    }

    deletePreRegistration = async (email: string) => {
        await this.prismaClient.preRegistrationUser.delete({
            where: {
                email
            }
        })
        return
    }
}

export default PreRegistrationRepository;