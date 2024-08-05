import { Prisma, User } from '@prisma/client'

export type FreeUserCreateInputDto = Omit<Prisma.UserCreateInput,
    'follows' | 'isVerified' | 'role'>
export type StandardUserCreateInputDto = FreeUserCreateInputDto & { idNumber1: string ; idNumber2?: string }
export type PremiumUserCreateInputDto = StandardUserCreateInputDto
export type UserUpdateInputDto = Prisma.UserUpdateInput
export type UserOutputDto = Omit<User, 'password' | 'isVerified'>
export type UserPublicOutputDto = Omit<
    User,
    'isVerified' 
    | 'description' 
    | 'role' 
    | 'email' 
    | 'password' 
    | 'address' 
    | 'profession' 
    | 'formationName'
    | 'formationDuration'
    | 'telephone' 
    | 'follows' 
    | 'religion'
    | 'birthSex'
    | 'actualSex'
    | 'sexualOrientation'
    | 'religion'>