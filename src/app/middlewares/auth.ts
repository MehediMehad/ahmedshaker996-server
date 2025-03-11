import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import httpStatus from 'http-status';
import { user_status as UserStatus } from '@prisma/client';
import { jwtHelpers } from '../helpers/jwtHelpers';
import ApiError from '../errors/ApiError';
import prisma from '../config/prisma';

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_secret as Secret
      );

      if (!verifiedUser?.email) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }
      const { id } = verifiedUser;

      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
      }

      // if (user.isDeleted == true) {
      //   throw new ApiError(httpStatus.BAD_REQUEST, "This user is deleted ! ");
      // }

      if (user.user_status === UserStatus.BLOCKED) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Your account is blocked!');
      }

      req.user = verifiedUser as JwtPayload;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden!');
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
export const checkOTP = () => {
  return async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'we cannot authenticate you ');
    }

    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.reset_pass_secret as Secret
    );

    console.log(verifiedUser);

    if (!verifiedUser?.id) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    const { id } = verifiedUser;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // if (user.isDeleted == true) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, "This user is deleted ! ");
    // }

    if (user.user_status === UserStatus.BLOCKED) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Your account is blocked!');
    }

    req.user = verifiedUser as JwtPayload;
    next();
  } catch (err) {
    next(err);
  }
}

};


export const optionalAuth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        // No token provided, proceed without authentication
        return next();
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_secret as Secret
      );

      if (!verifiedUser?.email) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }
      const { id } = verifiedUser;

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
      }

      if (user.user_status === UserStatus.BLOCKED) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Your account is blocked!');
      }

      req.user = verifiedUser as JwtPayload;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden!');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
