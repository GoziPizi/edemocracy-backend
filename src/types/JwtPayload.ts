import { Jwt } from 'jsonwebtoken'

type JwtWithoutPayload = Omit<Jwt, 'payload'>

export type JwtPayload = {
  id: number
  lastConnexion: Date
}

export type CustomJwt = {
  payload: JwtPayload
} & JwtWithoutPayload