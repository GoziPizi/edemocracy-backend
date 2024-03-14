import { Jwt } from 'jsonwebtoken'

type JwtWithoutPayload = Omit<Jwt, 'payload'>

export type JwtPayload = {
  id: string
  lastConnexion: Date
}

export type CustomJwt = {
  payload: JwtPayload
} & JwtWithoutPayload