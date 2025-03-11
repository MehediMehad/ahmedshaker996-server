import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import prisma from '../../config/prisma';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import sentEmailUtility from '../../utils/sentEmailUtility';
import { IPaginationOptions } from '../../interface/pagination.type';
import { paginationHelper } from '../../helpers/paginationHelper';
// import { paginationHelper } from '../../../helpars/paginationHelper';

const getAllUsersFromDB = async (
  options: IPaginationOptions & { email?: string }
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const emailFilter: any = options.email
    ? {
      email: {
        contains: options.email, // Case-insensitive search
        mode: 'insensitive',
      },
    }
    : {};

  const [result, total, totalTerms] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take: limit,
      where: {
        role: {
          not: 'SUPER_ADMIN',
        },
        ...emailFilter,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        email: true,
        isAgreed: true,
        status: true,
        createdAt: true,
        updatedAt: true,

      },
    }),
    prisma.user.count({
      where: {
        role: {
          not: 'SUPER_ADMIN',
        },
        ...emailFilter,
      },
    }),
    prisma.terms.count({}),
  ]);



  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getMyProfileFromDB = async (id: string) => {
  const Profile = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      userName: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Profile;
};

const getUserDetailsFromDB = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      phone: true,
      userName: true,
      name: true,
      role: true,
      email: true,
      isAgreed: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });




  return user;
};

const updateMyProfileIntoDB = async (id: string, payload: any, file: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // Handle profile image upload
  // const profileImage = file?.originalname
  //   ? `${prodyacess.env.BACKEND_BASE_URL}/uploads/${file.originalname}`
  //   : existingUser.profileImage;

  // Prepare the updated data object
  const updatedData = {
    ...payload, // Include fields from payload
    //profileImage, // Update or retain profile image
  };

  const result = await prisma.user.update({
    where: {
      id: id,
    },
    data: updatedData,
    select: {
      id: true,
      name: true,
      userName: true,
      phone: true,
      email: true,

      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const updateUserRoleStatusIntoDB = async (id: string, payload: any) => {
  const result = await prisma.user.update({
    where: {
      id: id,
    },
    data: payload,
  });
  return result;
};

export const UserServices = {
  getAllUsersFromDB,
  getMyProfileFromDB,
  getUserDetailsFromDB,
  updateMyProfileIntoDB,
  updateUserRoleStatusIntoDB,
};
