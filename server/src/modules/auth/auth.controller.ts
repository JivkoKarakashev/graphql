import { CookieOptions, NextFunction, Request, Response } from 'express';

import { AuthService } from './auth.service';

const COOKIE_NAME = 'refreshToken';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

const CLEAR_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

const refreshHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      res.status(401).json({ code: 'UNAUTHENTICATED', message: 'No refresh token!' });
      return;
    }

    const deviceId = req.headers['x-device-id'] as string | undefined;
    const deviceInfo = req.headers['user-agent'];

    try {
      const { accessToken, refreshToken } = await AuthService.refresh(token, deviceId, deviceInfo);
      // Rotate — set the new refresh token as httpOnly cookie
      res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
      res.json({ accessToken });
    } catch (err) {
      // Always clear the stale cookie on any refresh failure
      res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTIONS);
      throw err;
    }
  } catch (err) {
    next(err);
  }
  // res.json({ message: 'Refresh endpoint works!' });
};

const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (token) {
      await AuthService.logout(token).catch(() => { });
    }
    // Always clear cookie regardless of whether token existed
    res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTIONS);
    res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
  // res.json({ message: 'Logout endpoint works.' });
};

export {
  COOKIE_NAME,
  COOKIE_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
  refreshHandler,
  logoutHandler
}