import PrismaRepository from "./PrismaRepository";
import { StandardUserCreateInputDto } from "@/types/dtos/UserDto";

class PreRegistrationRepository extends PrismaRepository {

    createPreRegistration = async (user : StandardUserCreateInputDto) => {
        let finalUser: any = { ...user }
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

    createPreregistrationDiploma = async (preRegistrationId: string, name: string, obtention: number) => {
        await this.prismaClient.preRegistrationDiploma.create
    }

    getPreRegistrationDiplomas = async (preRegistrationId: string) => {
        const preRegistrationDiploma = await this.prismaClient.preRegistrationDiploma.findMany({
            where: {
                preRegistrationId
            }
        })
        return preRegistrationDiploma
    }

    deletePreRegistrationDiplomas = async (preRegistrationId: string) => {
        await this.prismaClient.preRegistrationDiploma.deleteMany({
            where: {
                preRegistrationId
            }
        })
        return
    }
}

export default PreRegistrationRepository;