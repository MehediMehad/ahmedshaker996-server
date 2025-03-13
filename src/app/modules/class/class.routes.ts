import express from 'express';
import auth from '../../middlewares/auth';
import { UserRoleEnum as Role } from '@prisma/client';
import { ClassControllers } from './class.controller';
import validateRequest from '../../middlewares/validateRequest';
import { classesValidations } from './class.validation';
const router = express.Router();

router.post('/',
    validateRequest(classesValidations.crateClassesSchema),
    // auth(Role.SUPER_ADMIN, Role.PARTNER),
    ClassControllers.createClass
)


export const ClassRouters = router;
