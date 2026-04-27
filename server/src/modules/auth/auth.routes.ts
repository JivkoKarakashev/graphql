import { Router } from 'express';

import { refreshHandler, logoutHandler } from './auth.controller';

const router = Router();

// REST endpoints
router.post('/refresh', refreshHandler);
router.post('/logout', logoutHandler);

export default router;