import { PreRegistrationNotFoundException } from "@/exceptions/RegisterException";
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
        try {
            let preregistration =  await this.prismaClient.preRegistrationUser.findUnique({
                where: {
                    email
                }
            })
            if (!preregistration) {
                throw new PreRegistrationNotFoundException()
            }
            await this.deletePreRegistrationDiplomas(preregistration.id);
            await this.prismaClient.preRegistrationUser.delete({
                where: {
                    email
                }
            })
            return;
        }
        catch (error:any) {
            if (error instanceof PreRegistrationNotFoundException) {
                throw error;
            }
            throw new Error('Could not delete the pre registration');
        }
        return
    }

    createPreregistrationDiploma = async (preRegistrationId: string, name: string, obtention: number) => {
        await this.prismaClient.preRegistrationDiploma.create({
            data: {
                preRegistrationId,
                name,
                obtention
            }
        })
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