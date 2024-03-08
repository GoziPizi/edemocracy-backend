import HttpStatus from "@/enum/HttpStatus"

export default abstract class BaseException extends Error {
  public httpCode: HttpStatus

  constructor(message: string, httpCode: HttpStatus) {
    super(message)
    this.httpCode = httpCode
    this.name = this.constructor.name
  }
}

export class EndpointNotFoundException extends BaseException {
  constructor(endpoint: string, method: string) {
    const message = `The endpoint "${endpoint}" with method "${method}" doesn't exist`
    super(message, HttpStatus.NOT_FOUND)
  }
}
