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
            message: 'User registered successfully',
            data: result
        })
    }
});

// login user
const loginUser: RequestHandler = catchAsync(async(req, res) =>{
    const {accessToken,userDetails} = await UserServices.loginUser(req.body);
    if(accessToken && userDetails){
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logged in successfully",
            token: accessToken,
            data: userDetails
        })
    }
})

export const UserControllers = {
    createUser,
    loginUser
}