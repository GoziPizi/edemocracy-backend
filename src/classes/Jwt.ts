import * as jwt from 'jsonwebtoken'

import { JwtCheckException, JwtMalfomedException } from '@/exceptions/JwtExceptions'
import { CustomJwt } from '@/types/JwtPayload'

/**
 * Structured data was sent to the user and received
 */
interface JwtObject {
  key: string
  created: string
  expiration: number
}

class Jwt {
  private static readonly secret = String(process.env.TOKEN_SECRET_KEY)
  private readonly created: string
  private readonly expiration: number
  private readonly payload: object | string
  readonly jwt: JwtObject

  /**
   * @param {Any} payload Object contains data payload of the token
   * @param {Number} timeExpiration *Optional* = **3600** (1 hour)
   * number of seconds before the token will be expired
   */
  constructor(payload: object | string, timeExpiration = 0) {
    this.created = new Date().toString()
    this.payload = payload

    // Calculate the expiration of the token
    const dateOfExpiration = new Date()
    dateOfExpiration.setSeconds(dateOfExpiration.getSeconds() + timeExpiration)
    const expirationInSeconds = Math.floor((dateOfExpiration.getTime() - new Date().getTime()) / 1000)
    this.expiration = expirationInSeconds
    this.jwt = this.getJWT()
  }

  private getJWT(): JwtObject {
    return {
      key: this.sign(),
      created: this.created,
      expiration: this.expiration
    }
  }

  /**
   * This function create the JSON Web Token (String)
   */
  private sign(): string {
    return jwt.sign(this.payload, Jwt.secret, {
      expiresIn: this.expiration
    })
  }

  public static checkToken(token: string): string | jwt.JwtPayload {
    try {
      return jwt.verify(token, this.secret)
    } catch (error) {
      throw new JwtCheckException()
    }
  }

  /**
 * This object will have **3 properties**, here is an example :
 ```js
  {
    header: { alg: 'HS256', typ: 'JWT' },
    payload: { id: z67bd..., update: 13245698736, iat: 1659537319, exp: 1659540919 },
    signature: 'Tmskyec8JxNX9FgP0xyyCJ0X3ptW2hVZy0vSWYQAnWg'
  }
 ```
 */
  static decode(token: string): CustomJwt {
    const decodedToken = jwt.decode(token, { complete: true }) as CustomJwt
    if (!decodedToken.payload) throw new JwtMalfomedException()
    return decodedToken
  }
}

export default Jwt
