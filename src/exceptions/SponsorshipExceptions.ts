import HttpStatus from "@/enum/HttpStatus";
import BaseException from "./BaseExceptions";

abstract class SponsorshipException extends BaseException {
    constructor(message: string, httpCode: HttpStatus) {
      super(message, httpCode)
    }
}

export class JackpotNotFoundException extends SponsorshipException {
    constructor() {
        super('Jackpot not found', HttpStatus.NOT_FOUND)
    }
}

export class JackpotAlreadyRequestedException extends SponsorshipException {
    constructor() {
        super('Jackpot already requested', HttpStatus.BAD_REQUEST)
    }
}

export class JackpotAmountIsZeroException extends SponsorshipException {
    constructor() {
        super('Jackpot amount is zero', HttpStatus.BAD_REQUEST)
    }
}

export class JackpotIbanNullException extends SponsorshipException {
    constructor() {
        super('Jackpot iban is null', HttpStatus.BAD_REQUEST)
    }
}