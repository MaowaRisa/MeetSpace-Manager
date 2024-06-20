import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { roomRoutes } from '../modules/room/room.route';

const router = Router();

const moduleRoutes = [
    {
        path:'/auth',
        route: userRoutes
    },
    {
        path:'/rooms',
        route: roomRoutes
    },
];
moduleRoutes.map((route) => router.use(route.path, route.route));
export default router;
