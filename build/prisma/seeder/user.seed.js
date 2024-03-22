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
const RawQueryRepository_1 = __importDefault(require("../../src/repositories/RawQueryRepository"));
const client_1 = require("@prisma/client");
const default_password = 'password';
function seedUser(prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedDefaultPassword = yield new RawQueryRepository_1.default().getSha256(default_password);
        yield prisma.user.createMany({
            data: [
                {
                    id: '7896161d-4e22-4244-8c07-3e09699baab4',
                    email: 'pierre.dujean@gmail.com',
                    password: hashedDefaultPassword,
                    firstName: 'Pierre',
                    name: 'Dujean',
                    role: 'ADMIN',
                    telephone: '0606060606',
                    address: '1 rue des fleurs',
                    profession: 'Développeur',
                    politicSide: client_1.Affiliation.CENTER,
                    language: 'FR',
                },
                {
                    id: '7896161d-4e22-4244-8c07-3e09699baab5',
                    email: 'jean.marc@yahoo.fr',
                    password: hashedDefaultPassword,
                    firstName: 'Jean-Marc',
                    name: 'Dupont',
                    role: 'USER',
                    telephone: '0606060606',
                    address: '1 rue des fleurs',
                    profession: 'Développeur',
                    politicSide: client_1.Affiliation.RIGHT,
                    language: 'FR',
                }
            ]
        });
    });
}
exports.default = seedUser;
