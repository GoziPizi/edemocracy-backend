import { Jwt } from 'jsonwebtoken'

type JwtWithoutPayload = Omit<Jwt, 'payload'>

export type JwtPayload = {
  id: string
  lastConnexion: Date
  isVerified: boolean
}

export type CustomJwt = {
  payload: JwtPayload
} & JwtWithoutPayload