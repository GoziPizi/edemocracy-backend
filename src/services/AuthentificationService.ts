import UserRepository from "@/repositories/UserRepository";
import UserService from "./UserService";
import { JwtPayload } from "@/types/JwtPayload";
import Jwt from "@/classes/Jwt";
import { JwtCheckException } from "@/exceptions/JwtExceptions";
import { Role } from "@prisma/client";
import AwsService from "./AwsService";
import { sendReinitPasswordMail } from "./MailService";
import { FreeUserCreateInputDto, StandardUserCreateInputDto } from "@/types/dtos/UserDto";

class AuthentificationService {
    private static userRepository: UserRepository = new UserRepository()

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

    static async register(userInput: any, recto: Express.Multer.File, verso: Express.Multer.File) {
        let finalUser = {
            ...userInput,
            role: Role.USER,
            isVerified: false
        }
        const user = await this.userRepository.create(finalUser)
        const rectoUrl = await AwsService.uploadIdentityPicture(recto)
        const versoUrl = await AwsService.uploadIdentityPicture(verso)
        await this.userRepository.createVerificationRequest(user.id, rectoUrl, versoUrl)
        return
    }

    static async registerFree(userInput: FreeUserCreateInputDto) {
        let finalUser = {
            ...userInput,
            role: Role.USER,
        }
        await this.userRepository.create(finalUser)
    }

    static async registerStandard(
        userInput: StandardUserCreateInputDto,
        recto1: Express.Multer.File,
        verso1: Express.Multer.File,
        recto2: Express.Multer.File | undefined,
        verso2: Express.Multer.File | undefined)
    {
        //TODO
    }

    static async registerPremium(
        userInput: any,
        recto1: Express.Multer.File,
        verso1: Express.Multer.File,
        recto2: Express.Multer.File | undefined,
        verso2: Express.Multer.File | undefined)
    {
        //TODO
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
        if(verified) {
            await UserService.setUserVerified(request.userId)
        } else {
            await UserService.deleteUser(request.userId)
        }
        await this.userRepository.deleteVerificationRequest(requestId)

        //Delete the files for RGPD
        await AwsService.deleteFile(request.recto)
        await AwsService.deleteFile(request.verso)
        return
    }

    static async resetPassword(email: string) {
        const user = await this.userRepository.getUserByEmail(email)
        if(!user) {
            throw new Error('User not found')
        }
        const token = new Jwt({id: user.id}, 60 * 60).jwt
        sendReinitPasswordMail(email, token.toString())
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