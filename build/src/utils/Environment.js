"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsOrigin = exports.isProdEnvironment = exports.isDevEnvironment = void 0;
const isDevEnvironment = () => process.env.NODE_ENV === 'development';
exports.isDevEnvironment = isDevEnvironment;
const isProdEnvironment = () => process.env.NODE_ENV === 'prod';
exports.isProdEnvironment = isProdEnvironment;
const getCorsOrigin = () => JSON.parse(process.env.CORS_ORIGIN || '[]');
exports.getCorsOrigin = getCorsOrigin;
