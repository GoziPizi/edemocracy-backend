"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class PrismaRepository {
    constructor(prismaClient = db_1.default) {
        this.nextId = (table) => __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.$queryRawUnsafe(`SELECT nextval('${table}_id_seq'::regclass);`);
            return Number(result[0].nextval);
        });
        this.prismaClient = prismaClient;
    }
}
exports.default = PrismaRepository;
