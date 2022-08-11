import { Router } from 'express';
import CoworkersRoute from './coworker/coworkers.route';

const router = Router();

router.use('/', CoworkersRoute);

export default router;
