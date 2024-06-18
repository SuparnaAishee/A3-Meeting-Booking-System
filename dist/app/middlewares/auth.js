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
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHead = req.headers.authorization;
        //checking if the token is sent
        if (!authHead) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User is not Authorized!');
        }
        // Splitting the Authorization header to get the Bearer token
        const [bearer, token] = authHead.split(' ');
        // Checking if the Authorization header has Bearer and token parts
        if (!(bearer === 'Bearer' && token)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid authorization header format');
        }
        //checking token is valid or not
        jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret, function (err, decoded) {
            if (err) {
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Not Authorized!');
            }
            //check user role
            const role = decoded.role;
            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You have no access to this route');
            }
            //decoded undefined
            req.user = decoded;
            next();
        });
    }));
};
exports.default = auth;
