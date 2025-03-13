import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SubscriptionControllers } from './subscription.controller';
import { subscriptionValidations } from './subscription.validation';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post('/',
    validateRequest(subscriptionValidations.createSubscriptionSchema),
    auth("PARTNER"),
    SubscriptionControllers.createSubscription
)


export const SubscriptionRouters = router;
