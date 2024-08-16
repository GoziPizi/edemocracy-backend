import { Prisma, User } from '@prisma/client'

export type FreeUserCreateInputDto = Omit<Prisma.UserCreateInput,
    'follows' | 'isVerified' | 'role'> & { diplomas?: string}
export type StandardUserCreateInputDto = FreeUserCreateInputDto & 
    { 
        idNumber1: string ; idNationality1 : string ;
        idNumber2?: string ; idNationality2?: string ;
        idNumber3?: string ; idNationality3?: string ;
    }

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
    | 'postalCode'
    | 'city'
    | 'idNationality1'
    | 'idNationality2'
    | 'idNationality3'
    | 'profession' 
    | 'yearsOfExperience'
    | 'telephone' 
    | 'follows' 
    | 'religion'
    | 'birthSex'
    | 'actualSex'
    | 'sexualOrientation'
    | 'religion'>