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
const PrismaRepository_1 = __importDefault(require("./PrismaRepository"));
const RawQueryRepository_1 = __importDefault(require("./RawQueryRepository"));
class UserRepository extends PrismaRepository_1.default {
    constructor() {
        super(...arguments);
        this.RawQueryRepository = new RawQueryRepository_1.default();
        this.create = (user) => __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield this.RawQueryRepository.getSha256(user.password);
            const createdUser = yield this.prismaClient.user.create({
                data: Object.assign(Object.assign({}, user), { password: hashedPassword })
            });
            return createdUser;
        });
        this.update = (id, user) => __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.prismaClient.user.update({
                where: {
                    id
                },
                data: Object.assign({}, user)
            });
            return updatedUser;
        });
        this.findById = (id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prismaClient.user.findUnique({
                where: {
                    id
                }
            });
            return user;
        });
        this.getUserByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prismaClient.user.findFirst({
                where: {
                    email
                }
            });
            return user;
        });
        this.checkUser = (email, password) => __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield this.RawQueryRepository.getSha256(password);
            const user = yield this.prismaClient.user.findFirst({
                where: {
                    email,
                    password: hashedPassword
                }
            });
            return user;
        });
        this.updateLastLogin = (id, date) => __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.user.update({
                where: {
                    id
                },
                data: {
                    updatedAt: date
                }
            });
            return true;
        });
    }
}
exports.default = UserRepository;
