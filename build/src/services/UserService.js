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
const UserMapper_1 = require("../mappers/UserMapper");
const OpinionRepository_1 = __importDefault(require("../repositories/OpinionRepository"));
const PartyRepository_1 = __importDefault(require("../repositories/PartyRepository"));
const PersonalityRepository_1 = __importDefault(require("../repositories/PersonalityRepository"));
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
class UserService {
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = yield UserService.userRepository.create(user);
            return createdUser;
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserService.userRepository.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return (0, UserMapper_1.toUserOutput)(user);
        });
    }
    static updateUserById(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserService.userRepository.update(id, user);
        });
    }
    static getPublicUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserService.userRepository.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return (0, UserMapper_1.toPublicUserOutput)(user);
        });
    }
    static updateUserLastLogin(id, date) {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserService.userRepository.updateLastLogin(id, date);
            return true;
        });
    }
    static getUserPersonalityById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserService.personalityRepository.findPersonalityByUserId(id);
        });
    }
    static getUserPartyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserService.partyRepository.findPartyByUserId(id);
        });
    }
    static getUserOpinions(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserService.opinionRepository.findOpinionsWithTitleByUserId(id);
        });
    }
    static postOpinion(userId, topicId, opinion) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserService.opinionRepository.createOpinion(userId, topicId, opinion);
        });
    }
}
UserService.userRepository = new UserRepository_1.default();
UserService.personalityRepository = new PersonalityRepository_1.default();
UserService.partyRepository = new PartyRepository_1.default();
UserService.opinionRepository = new OpinionRepository_1.default();
exports.default = UserService;
