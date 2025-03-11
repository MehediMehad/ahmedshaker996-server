import { gender_enum, user_status_enum, UserRoleEnum } from '@prisma/client';
import z from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.number().int().positive("Age must be a positive integer"),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional(),
    image: z.string().url().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    gender: z.nativeEnum(gender_enum).refine(
      (val) => Object.values(gender_enum).includes(val),
      (val) => ({
        message: `Invalid gender value: '${val}', expected one of [${Object.values(gender_enum).join(", ")}]`,
      })
    ),
    address: z.string().optional(),
    role: z.nativeEnum(UserRoleEnum).default("USER"),
    status: z.nativeEnum(user_status_enum).default("in_progress"),
  }),
});
const loginUser = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email({
        message: 'Invalid email format!',
      }),
    password: z.string({
      required_error: 'Password is required!',
    }),
  }),
});
const passwordResetSchema = z.object({
  body: z.object({   
    password: z.string({
      required_error: 'Password is required!',
    }).min(6, 'Password must be at least 6 characters long')
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6),
    newPassword: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters long'),
  }),
});
const verifyOtpSchema = z.object({
  body: z.object({
    otpCode: z.string().length(6, 'Please enter a 6-character OTP code'),
    hexCode: z
      .string({
        required_error: 'hexCode is required',
      })
      .length(32, 'hexCode must be exactly 32 characters long'),
  }),
});

export const authValidation = {
  loginUser,
  registerUserSchema,
  passwordResetSchema,
  changePasswordValidationSchema,
  verifyOtpSchema
};
