import httpStatus from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserFromDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: result,
  });
});
const registrationNewUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registrationNewUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'User created successfully',
    data: result,
  });
});
const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'otp send successfully',
    data: result,
  });
});
const verifiedEmail = catchAsync(async (req, res) => {
  const {hexCode, otpCode} = req.body
  console.log("Verified email", hexCode, otpCode);
  
  const result = await AuthServices.verifyEmail(hexCode, otpCode);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'OTP verified successfully',
    data: result,
  });
});
const verifyOtpCode = catchAsync(async (req, res) => {
  const result = await AuthServices.verifyOtpCode(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'OTP verified successfully',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
const userId = req.user.id
  const password: string = req.body.password;
  const result = await AuthServices.resetPassword(userId,{  password });  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'password reset successfully',
    data: result,
  });
});
const changePassword = catchAsync(async (req, res) => {
  const id: string = req.user.id;
  const oldPassword: string = req.body.oldPassword;
  const newPassword: string = req.body.newPassword;
  const result = await AuthServices.changePassword({
    id,
    newPassword,
    oldPassword,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'password changed successfully',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  registrationNewUser,
  forgotPassword,
  verifyOtpCode,
  resetPassword,
  changePassword,
  verifiedEmail,
};
