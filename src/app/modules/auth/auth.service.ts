import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/ApiError";
// import { generateResetPasswordToken, generateToken } from '../../helpers/generateToken';
import prisma from "../../config/prisma";

import crypto from "crypto";

import sentEmailUtility from "../../utils/sentEmailUtility";
import { emailText } from "../../utils/emailTemplate";
import { User, user_status_enum, UserRoleEnum } from "@prisma/client";
import { jwtHelpers } from "../../helpers/jwtHelpers";

const loginUserFromDB = async (payload: {
  email: string;
  password: string;
  fcmToken: string;
}) => {
  // Find the user by email
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  // Check if the password is correct
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password as string
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password incorrect");
  }

  // Update the FCM token if provided
  if (payload?.fcmToken) {
    await prisma.user.update({
      where: {
        email: payload.email, // Use email as the unique identifier for updating
      },
      data: {
        fcmToken: payload.fcmToken,
      },
    });
  }

  // Generate an access token
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email as string,
      role: userData.role,
    },
    config.jwt.access_secret as Secret,
    config.jwt.access_expires_in
  );

  // Return user details and access token
  return {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    accessToken: accessToken,
  };
};

const registrationNewUser = async (payload: User) => {


  // Check if email is already registered
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, `This email is already registered`);
  }

  // Hash the password
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );


  const createUser = await prisma.user.create({
    data: {
      name: payload.name,
      password: hashPassword,
      email: payload.email,
      age: payload.age,
      gender: payload.gender,
      address: payload.address,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return createUser;
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found! with this email " + payload.email
    );
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  const identifier = crypto.randomBytes(16).toString("hex");

  // Save OTP to database
  const userData = await prisma.otp.upsert({
    where: { email: user.email },
    update: {
      email: user.email,
      otp: otpCode,
      expiry: expiry,
      hexCode: identifier,
    },
    create: {
      email: user.email,
      otp: otpCode,
      expiry: expiry,
      hexCode: identifier,
    },
  });

  // Send OTP via email
  const result = await sentEmailUtility(
    user.email,
    "Reset Your Password",
    emailText(otpCode)
  );
  return {
    messageId: result.messageId,
    hexCode: userData.hexCode,
  };
};

const verifyOtpCode = async (payload: { hexCode: string; otpCode: string }) => {
  const otpRecord = await prisma.otp.findFirst({
    where: {
      hexCode: payload.hexCode,
      otp: payload.otpCode,
    },
  });

  if (!otpRecord) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid OTP");
  }

  // Check if OTP is expired
  if (new Date() > otpRecord.expiry) {
    // If valid, delete the OTP from the database
    await prisma.otp.delete({
      where: {
        id: otpRecord.id,
      },
    });

    throw new AppError(
      httpStatus.GONE,
      "The OTP has expired. Please request a new one."
    );
  }
  // If OTP is valid, delete the OTP from the database
  const [user, record] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { email: otpRecord.email },
      select: {
        id: true,
        email: true,
      },
    }),
    prisma.otp.delete({
      where: {
        id: otpRecord.id,
      },
    }),
  ]);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found! user is possibly deleted by mistake please register"
    );
  }
  // Generate an access token
  const accessToken = jwtHelpers.generateToken(
    {
      id: user.id,
    },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_expires_in as string
  );
  // Hash the new password
  return { accessToken };
};
const resetPassword = async (
  userId: string,
  payload: {
    password: string;
  }
) => {
  const userToUpdate = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userToUpdate) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found in the database.");
  }

  // If valid, delete the OTP from the database
  const updatedUser = await prisma.user.update({
    where: { id: userToUpdate.id },
    data: {
      password: await bcrypt.hash(
        payload.password,
        Number(config.bcrypt_salt_rounds)
      ),
    },
  });

  if (!updatedUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User not found in the database."
    );
  }
  return {
    message: "password updated successfully",
  };
};
const changePassword = async (payload: {
  id: string;
  newPassword: string;
  oldPassword: string;
}) => {
  const userData = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      password: true,
      email: true,
      id: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!userData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found!, If you have already have account please reset your password"
    );
  }

  // Check if the user status is BLOCKED
  if (userData.status === user_status_enum.blocked) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been blocked. Please contact support."
    );
  }

  // Check if the password is correct
  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password as string
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password incorrect");
  }
  // Hash the user's password

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  // Update the user's password in the database template
  const updatedUser = await prisma.user.update({
    where: { id: payload.id },
    data: {
      password: hashedPassword,
    },
  });
  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found in the database.");
  }
  return {
    message: "password updated successfully",
  };
};

export const AuthServices = {
  loginUserFromDB,
  registrationNewUser,
  forgotPassword,
  verifyOtpCode,
  resetPassword,
  changePassword,
};
