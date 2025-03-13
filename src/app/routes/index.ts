import express from 'express';
import { AuthRouters } from '../modules/auth/auth.routes';

import { UserRouters } from '../modules/user/user.routes';
import { ClassRouters } from '../modules/class/class.routes';
import { SubscriptionRouters } from '../modules/Subscription/subscription.routes';



const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRouters,
  },
  {
    path: '/users',
    route: UserRouters,
  },
  {
    path: '/classes',
    route: ClassRouters,
  },
  {
    path: '/subscriptions',
    route: SubscriptionRouters,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
