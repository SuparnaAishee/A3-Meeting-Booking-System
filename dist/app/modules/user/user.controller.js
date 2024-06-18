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
exports.userControllers = void 0;
const user_validation_1 = require("./user.validation");
const user_model_1 = require("./user.model");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const zodUserData = user_validation_1.userValidationSchema.parse(userData);
    const existingUser = yield user_model_1.User.findOne({
        name: zodUserData.name,
    });
    if (existingUser) {
        return res.status(400).json({ error: 'User already Registered' });
    }
    else {
        // Create the user
        const newUser = new user_model_1.User(zodUserData);
        const createdUser = yield newUser.save();
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: 'User is Registered Sucessfully',
            data: createdUser,
        });
    }
    // if (error.name === 'ZodError') {
    //   const errorMessage = error.errors
    //     .map((err: any) => err.message)
    //     .join(', ');
    //   return res.status(400).json({ err: errorMessage });
    // }
}));
exports.userControllers = {
    createUser,
};
