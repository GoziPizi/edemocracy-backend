import UserRepository from "@/repositories/UserRepository";
import PreRegistrationRepository from "@/repositories/PreRegistrationRepository";
import UserService from "./UserService";
import { JwtPayload } from "@/types/JwtPayload";
import Jwt from "@/classes/Jwt";
import { JwtCheckException } from "@/exceptions/JwtExceptions";
import { MembershipStatus, Role } from "@prisma/client";
import AwsService from "./AwsService";
import { sendReinitPasswordMail } from "./MailService";
import { FreeUserCreateInputDto, StandardUserCreateInputDto } from "@/types/dtos/UserDto";
import StripeService from "./StripeService";
import SponsorshipRepository from "@/repositories/SponsorshipRepository";

class AuthentificationService {
    private static userRepository: UserRepository = new UserRepository()
    private static preRegistrationRepository: PreRegistrationRepository = new PreRegistrationRepository()
    private static sponsorshipRepository: SponsorshipRepository = new SponsorshipRepository()

    private static timeExpiration = 60 * 60 * 24 * 7 // 7 days

    static async login(email: string, password: string) {
        const user = await this.userRepository.checkUser(email,password)
        if(!user) {
            throw new Error('User not found')
        }
        const currentDate = new Date()
        UserService.updateUserLastLogin(user.id, currentDate)
        const payload: JwtPayload = {id: user.id, lastConnexion: currentDate, isVerified: user.isVerified}
        return new Jwt(payload, this.timeExpiration).jwt
    }

    static async registerFree(userInput: FreeUserCreateInputDto) {

        try {

            let finalUser = {
                ...userInput,
                role: Role.USER,
            }

            let diplomas = ''

            if(userInput.diplomas) {
                diplomas = userInput.diplomas
                delete finalUser.diplomas
            }

            if(userInput.yearsOfExperience) {
                finalUser = {
                    ...finalUser,
                    yearsOfExperience: Number(userInput.yearsOfExperience)
                }
            }

            if(userInput.sponsorshipCode) {
                delete finalUser.sponsorshipCode
            }

            let user = await this.userRepository.create(finalUser)

            if(diplomas && user) {
                let finalDiplomas : {name: string; obtention: number}[] = JSON.parse(diplomas)
                for (let diploma of finalDiplomas) {
                    await this.userRepository.createDiploma(user.id, diploma.name, diploma.obtention)
                }
            }

        } catch (error) {
            throw new Error('Error while creating user')
        }
    }

    //Returns the checkout session url.
    static async preRegisterStandard(
        userInput: StandardUserCreateInputDto,
        recto1: Express.Multer.File,
        verso1: Express.Multer.File,
        recto2: Express.Multer.File | undefined,
        verso2: Express.Multer.File | undefined,
        recto3: Express.Multer.File | undefined,
        verso3: Express.Multer.File | undefined    
    )
    {

        try {

            let data : any = { }

            const recto1Url = await AwsService.uploadIdentityPicture(recto1)
            const verso1Url = await AwsService.uploadIdentityPicture(verso1)

            data.email = userInput.email
            data.recto1 = recto1Url
            data.verso1 = verso1Url
            data.idNumber1 = userInput.idNumber1
            data.idNationality1 = userInput.idNationality1

            let recto2Url: string | undefined = undefined
            let verso2Url: string | undefined = undefined
            if(recto2 && verso2) {
                recto2Url = await AwsService.uploadIdentityPicture(recto2)
                verso2Url = await AwsService.uploadIdentityPicture(verso2)
                data.recto2 = recto2Url
                data.verso2 = verso2Url
                data.idNumber2 = userInput.idNumber2
                data.idNationality2 = userInput.idNationality2
            }

            let recto3Url: string | undefined = undefined
            let verso3Url: string | undefined = undefined
            if(recto3 && verso3) {
                recto3Url = await AwsService.uploadIdentityPicture(recto3)
                verso3Url = await AwsService.uploadIdentityPicture(verso3)
                data.recto3 = recto3Url
                data.verso3 = verso3Url
                data.idNumber3 = userInput.idNumber3
                data.idNationality3 = userInput.idNationality3
            }

        
            await this.userRepository.createVerificationRequest(data)
        
            let finalInput : any = {...userInput}
            delete finalInput.idNumber1
            delete finalInput.idNumber2
            delete finalInput.idNumber3

            let diplomas : {name:string; obtention: number}[] | undefined = undefined

            if(finalInput.diplomas) {
                diplomas = JSON.parse(finalInput.diplomas)
                delete finalInput.diplomas
            }

            if(finalInput.yearsOfExperience) {
                finalInput.yearsOfExperience = Number(finalInput.yearsOfExperience)
            }

            let preRegistration = await this.preRegistrationRepository.getPreRegistration(userInput.email)
            if(preRegistration) {
                await this.preRegistrationRepository.deletePreRegistration(userInput.email)
            }

            preRegistration = await this.preRegistrationRepository.createPreRegistration(finalInput)

            if(!preRegistration) {
                throw new Error('Error while creating preRegistration')
            }

            if(diplomas && preRegistration) {
                for (let diploma of diplomas) {
                    await this.preRegistrationRepository.createPreregistrationDiploma(preRegistration.id, diploma.name, diploma.obtention)
                }
            }

            const session = await StripeService.createCheckoutSessionForStandard(userInput.email)
            return session.url;

        } catch (error) {

            console.log(error)
            throw new Error('Error while registering user')

        }
    }

    static async preRegisterPremium(
        userInput: any,
        recto1: Express.Multer.File,
        verso1: Express.Multer.File,
        recto2: Express.Multer.File | undefined,
        verso2: Express.Multer.File | undefined,
        recto3: Express.Multer.File | undefined,
        verso3: Express.Multer.File | undefined
    )
    {
        try {
            let data : any = { }

            const recto1Url = await AwsService.uploadIdentityPicture(recto1)
            const verso1Url = await AwsService.uploadIdentityPicture(verso1)

            data.email = userInput.email
            data.recto1 = recto1Url
            data.verso1 = verso1Url
            data.idNumber1 = userInput.idNumber1
            data.idNationality1 = userInput.idNationality1

            let recto2Url: string | undefined = undefined
            let verso2Url: string | undefined = undefined
            if(recto2 && verso2) {
                recto2Url = await AwsService.uploadIdentityPicture(recto2)
                verso2Url = await AwsService.uploadIdentityPicture(verso2)
                data.recto2 = recto2Url
                data.verso2 = verso2Url
                data.idNumber2 = userInput.idNumber2
                data.idNationality2 = userInput.idNationality2
            }

            let recto3Url: string | undefined = undefined
            let verso3Url: string | undefined = undefined

            if(recto3 && verso3) {
                recto3Url = await AwsService.uploadIdentityPicture(recto3)
                verso3Url = await AwsService.uploadIdentityPicture(verso3)
                data.recto3 = recto3Url
                data.verso3 = verso3Url
                data.idNumber3 = userInput.idNumber3
                data.idNationality3 = userInput.idNationality3
            }

            await this.userRepository.createVerificationRequest(data)

            let finalInput : any = {...userInput}
            delete finalInput.idNumber1
            delete finalInput.idNumber2
            delete finalInput.idNumber3

            if(finalInput.yearsOfExperience) {
                finalInput.yearsOfExperience = Number(finalInput.yearsOfExperience)
            }

            const preRegistration = await this.preRegistrationRepository.getPreRegistration(userInput.email)
            if(preRegistration) {
                await this.preRegistrationRepository.deletePreRegistration(userInput.email)
            }

            this.preRegistrationRepository.createPreRegistration(finalInput)
            const session = await StripeService.createCheckoutSessionForPremium(userInput.email)
            return session.url;
        } catch (error) {
            console.log(error)
            throw new Error('Error while registering user')
        }
    }

    static async registerFromPreRegistration(email: string, isPremium: boolean) {

        try {

            const preRegistration = await this.preRegistrationRepository.getPreRegistration(email)
            if(!preRegistration) {
                throw new Error('PreRegistration not found')
            }

            const contributionStatus = isPremium ? MembershipStatus.PREMIUM : MembershipStatus.STANDARD

            let sponsorshipCode = preRegistration.sponsorshipCode

            let user : any = {
                ...preRegistration,
                role: Role.USER,
                contributionStatus,
                isVerified: false
            }

            delete user.id
            delete user.sponsorshipCode

            let createdUser = await this.userRepository.create(user)

            if(createdUser && sponsorshipCode) {
                //handeling sponsorship code
                let sponsor = await this.userRepository.getUserBySponsorshipCode(sponsorshipCode)
                if(sponsor) {
                    await this.sponsorshipRepository.incrementJackpotOfUser(sponsor.id, 1)
                }
            }

            //diploma handeling

            let diplomas = await this.preRegistrationRepository.getPreRegistrationDiplomas(preRegistration.id)

            if(diplomas) {
                for (let diploma of diplomas) {
                    await this.userRepository.createDiploma(createdUser.id, diploma.name, diploma.obtention)
                }

                await this.preRegistrationRepository.deletePreRegistrationDiplomas(preRegistration.id)
            }

            await this.preRegistrationRepository.deletePreRegistration(email)

            return
        } catch (error) {
            console.log(error)
            throw new Error('Error while registering user')
        }
    }

    static async checkToken(token: string): Promise<boolean> {
        try {
            Jwt.checkToken(token)
            return true
        } catch (error) {
            throw JwtCheckException
        }
    }

    static checkVerified(token: string): boolean {
        const isVerified = Jwt.decode(token).payload.isVerified
        return isVerified
    }

    static async isEmailTaken(email: string): Promise<boolean> {
        const user = await this.userRepository.getUserByEmail(email)
        if(user) {
            return true
        }
        return false
    }

    static getUserId(token: string): string {
        const payload = Jwt.decode(token).payload
        const id = payload.id
        return id
    }

    static async getUserRole(token: string): Promise<Role> {
        const userId = this.getUserId(token)
        const user = await UserService.getUserById(userId)
        return user.role
    }

    static async getAdmins() {
        return this.userRepository.getAdmins()
    }

    static async setRoleToUserByEmail(email: string, role: Role) {
        await this.userRepository.setRoleByEmail(email, role)
        return
    }

    static async setRoleToUser(userId: string, role: Role) {
        await this.userRepository.setRole(userId, role)
        return
    }

    static async getVerificationRequests() {
        return this.userRepository.getVerificationList()
    }

    static async acceptVerificationRequest(requestId: string, verified: boolean) {
        const request = await this.userRepository.getVerificationRequest(requestId)
        if(!request) {
            throw new Error('Request not found')
        }
        const user = await UserService.getUserByEmail(request.email)
        if(verified) {
            await UserService.setUserVerified(request.email)
        } else {
            await UserService.deleteUser(user!.id)
        }
        await this.userRepository.deleteVerificationRequest(requestId)

        //Delete the files for RGPD
        await AwsService.deleteFile(request.recto1)
        await AwsService.deleteFile(request.verso1)

        if(request.recto2) {
            await AwsService.deleteFile(request.recto2)
        }
        if(request.verso2) {
            await AwsService.deleteFile(request.verso2)
        }
        return
    }

    static async resetPassword(email: string) {
        const user = await this.userRepository.getUserByEmail(email)
        if(!user) {
            throw new Error('User not found')
        }
        const token = new Jwt({id: user.id}, 60 * 60).jwt
        sendReinitPasswordMail(email, token.key)
        return
    }

    static async changePassword(email: string, password: string, token: string) {
        const user = await this.userRepository.getUserByEmail(email)
        if(!user) {
            throw new Error('User not found')
        }
        Jwt.checkToken(token)
        await UserService.updateUserPassword(user.id, password)
        return
    }
}

export default AuthentificationService;