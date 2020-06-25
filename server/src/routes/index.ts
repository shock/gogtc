import { Router } from 'express';
import UserRouter from './Users';
import AuthRouter from './Auth';
import FormCalcsRouter from './FormCalcs';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/form_calcs', FormCalcsRouter);

// Export the base-router
export default router;
