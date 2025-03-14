import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import { UserControllers } from './user.controller';
// import parseBodyData from '../../../helpars/parseBodyData';
import { UserRoleEnum as Role } from '@prisma/client';
import { fileUploader } from '../../middlewares/fileUploader';
import parseBodyData from '../../middlewares/parseBodyData';
const router = express.Router();

router.get(
  '/',
  auth(Role.SUPER_ADMIN, ),
  UserControllers.getAllUsers
);

router.get('/me', auth(), UserControllers.getMyProfile);

router.get('/:id', auth(), UserControllers.getUserDetails);

router.put(
  '/update-profile',
  auth('USER', 'PARTNER'),
  validateRequest(UserValidations.updateProfileSchema),
  parseBodyData,
  UserControllers.updateMyProfile
);

router.put(
  '/update-profile-image',
  auth('USER', 'PARTNER'),
  fileUploader.uploadProfileImage,
  parseBodyData,
  UserControllers.updateMyProfileImage
);

router.put(
  '/update-user/:id',
  auth('PARTNER', 'SUPER_ADMIN'),
  UserControllers.updateUserRoleStatus
);

export const UserRouters = router;
