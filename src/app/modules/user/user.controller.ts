import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import { UserServices } from "./user.service";
import sendResponse from "../../utility/sendResponse";
import httpStatus from 'http-status';
const createUser: RequestHandler = catchAsync(async (req, res) =>{
    const result = await UserServices.createUserIntoDB(req.body);
    if(result){
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'User created successfully!',
            data: result
        })
    }
});

export const UserControllers = {
    createUser,
}