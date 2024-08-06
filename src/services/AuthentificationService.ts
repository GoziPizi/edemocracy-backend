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

class AuthentificationService {
    private static userRepository: UserRepository = new UserRepository()
    private static preRegistrationRepository: PreRegistrationRepository = new PreRegistrationRepository()   
    private static stripeService: StripeService;

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
        let finalUser = {
            ...userInput,
            role: Role.USER,
        }
        await this.userRepository.create(finalUser)
    }

    //Returns the checkout session url.
    static async preRegisterStandard(
        userInput: StandardUserCreateInputDto,
        recto1: Express.Multer.File,
        verso1: Express.Multer.File,
        recto2: Express.Multer.File | undefined,
        verso2: Express.Multer.File | undefined)
    {
        const recto1Url = await AwsService.uploadIdentityPicture(recto1)
        const verso1Url = await AwsService.uploadIdentityPicture(verso1)
        let recto2Url: string | undefined = undefined
        let verso2Url: string | undefined = undefined
        if(recto2 && verso2) {
            recto2Url = await AwsService.uploadIdentityPicture(recto2)
            verso2Url = await AwsService.uploadIdentityPicture(verso2)
        }

        try { 
            await this.userRepository.createVerificationRequest(userInput.email, recto1Url, verso1Url, userInput.idNumber1, recto2Url, verso2Url, userInput.idNumber2)
        } catch (error) {
            console.log(error)
        }
        let finalInput : any = {...userInput}
        delete finalInput.idNumber1
        delete finalInput.idNumber2

        const preRegistration = await this.preRegistrationRepository.getPreRegistration(userInput.email)
        if(preRegistration) {
            await this.preRegistrationRepository.deletePreRegistration(userInput.email)
        }

        this.preRegistrationRepository.createPreRegistration(finalInput)

        const session = await StripeService.createCheckoutSessionForStandard(userInput.email)
        return session.url;
    }

    static async preRegisterPremium(
        userInput: any,
        recto1: Express.Multer.File,
        verso1: Express.Multer.File,
        recto2: Express.Multer.File | undefined,
        verso2: Express.Multer.File | undefined)
    {
        const recto1Url = await AwsService.uploadIdentityPicture(recto1)
        const verso1Url = await AwsService.uploadIdentityPicture(verso1)
        let recto2Url: string | undefined = undefined
        let verso2Url: string | undefined = undefined
        if(recto2 && verso2) {
            recto2Url = await AwsService.uploadIdentityPicture(recto2)
            verso2Url = await AwsService.uploadIdentityPicture(verso2)
        }

        await this.userRepository.createVerificationRequest(userInput.email, recto1Url, verso1Url, userInput.idNumber1, recto2Url, verso2Url, userInput.idNumber2)

        let finalInput : any = {...userInput}
        delete finalInput.idNumber1
        delete finalInput.idNumber2

        const preRegistration = await this.preRegistrationRepository.getPreRegistration(userInput.email)
        if(preRegistration) {
            await this.preRegistrationRepository.deletePreRegistration(userInput.email)
        }

        this.preRegistrationRepository.createPreRegistration(finalInput)
        const session = await StripeService.createCheckoutSessionForPremium(userInput.email)
        return session.url;
    }

    static async registerFromPreRegistration(email: string, isPremium: boolean) {
        const preRegistration = await this.preRegistrationRepository.getPreRegistration(email)
        if(!preRegistration) {
            throw new Error('PreRegistration not found')
        }

        const contributionStatus = isPremium ? MembershipStatus.PREMIUM : MembershipStatus.STANDARD

        const user = {
            ...preRegistration,
            role: Role.USER,
            contributionStatus,
            isVerified: false
        }
        await this.userRepository.create(user)
        await this.preRegistrationRepository.deletePreRegistration(email)
        return
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