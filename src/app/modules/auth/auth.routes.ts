import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth, {checkOTP} from '../../middlewares/auth';
const router = express.Router();



router.post('/register', AuthControllers.registrationNewUser);
router.post(
  '/login',
  validateRequest(authValidation.loginUser),
  AuthControllers.loginUser
);
router.post(
  '/forgot-password',
  // validateRequest(authValidation.loginUser),
  AuthControllers.forgotPassword
);

router.post(
  '/reset-password',
  checkOTP(),
  validateRequest(authValidation.passwordResetSchema),
  AuthControllers.resetPassword
);
router.post(
  '/verify-otp',
  validateRequest(authValidation.verifyOtpSchema),
  AuthControllers.verifyOtpCode
);

router.post(
  '/change-password',
  validateRequest(authValidation.changePasswordValidationSchema),
  auth(),
  AuthControllers.changePassword
);

export const AuthRouters = router;


// const identifier = crypto.randomBytes(16).toString('hex');