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
  auth(Role.SUPER_ADMIN, Role.ADMIN),
  UserControllers.getAllUsers
);

router.get('/me', auth(), UserControllers.getMyProfile);

router.get('/:id', auth(), UserControllers.getUserDetails);
router.put(
  '/update-profile',
  auth('USER', 'ADMIN'),
  fileUploader.uploadProfileImage,
  parseBodyData,
  UserControllers.updateMyProfile
);

router.put(
  '/update-user/:id',
  auth('ADMIN'),
  UserControllers.updateUserRoleStatus
);

export const UserRouters = router;
