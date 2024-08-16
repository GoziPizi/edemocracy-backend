import { UserOutputDto, UserPublicOutputDto } from '@/types/dtos/UserDto'
import { User } from '@prisma/client'

export const toUserOutput = (user: User): UserOutputDto => {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        telephone: user.telephone,
        address: user.address,
        postalCode: user.postalCode,
        city: user.city,
        profession: user.profession,
        yearsOfExperience: user.yearsOfExperience,
        birthSex: user.birthSex,
        actualSex: user.actualSex,
        sexualOrientation: user.sexualOrientation,
        religion: user.religion,
        description: user.description,
        politicSide: user.politicSide,
        language: user.language,
        contributionStatus: user.contributionStatus,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profilePicture: user.profilePicture
    }
}

export const toPublicUserOutput = (user: User): UserPublicOutputDto => {
    return {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        politicSide: user.politicSide,
        contributionStatus: user.contributionStatus,
        language: user.language,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profilePicture: user.profilePicture
    }
}