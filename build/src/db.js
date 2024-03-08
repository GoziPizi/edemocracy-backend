"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const Environment_1 = require("./utils/Environment");
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new client_1.PrismaClient({ log: ['query'] });
if ((0, Environment_1.isProdEnvironment)())
    globalForPrisma.prisma = prisma;
exports.default = prisma;
