import { Request, Response } from 'express';

export const refreshHandler = async (req: Request, res: Response) => {
  res.json({ message: 'refresh endpoint works' });
};

export const logoutHandler = async (req: Request, res: Response) => {
  res.json({ message: 'logout endpoint works' });
};