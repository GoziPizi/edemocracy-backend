import { Prisma, User } from '@prisma/client'

export type UserCreateInputDto = Omit<Prisma.UserCreateInput,
    'follows' | 'isVerified' | 'role'>
export type UserUpdateInputDto = Prisma.UserUpdateInput
export type UserOutputDto = Omit<User, 'password' | 'isVerified'>
export type UserPublicOutputDto = Omit<User, 'isVerified' | 'role' | 'email' | 'password' | 'address' | 'profession' | 'telephone' | 'follows' | 'affiliation'>