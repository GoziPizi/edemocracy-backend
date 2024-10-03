import HttpStatus from "@/enum/HttpStatus";
import BaseException from "./BaseExceptions";

abstract class RegisterException extends BaseException {
    constructor(message: string, httpCode: HttpStatus) {
      super(message, httpCode)
    }
}

export class InvalidRegisterTypeException extends RegisterException {
    constructor() {
        super('Invalid register type', HttpStatus.BAD_REQUEST)
    }
}

export class PreRegistrationNotFoundException extends RegisterException {
    constructor() {
        super('Pre registration not found', HttpStatus.BAD_REQUEST)
    }
}