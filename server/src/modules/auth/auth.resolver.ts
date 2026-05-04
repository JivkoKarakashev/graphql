import { AuthService } from './auth.service';
import { CLEAR_COOKIE_OPTIONS, COOKIE_NAME, COOKIE_OPTIONS } from './auth.controller';
import { AppContext } from '../../graphql/context';
import { UnauthorizedError } from '../../errors';
import { registerSchema, loginSchema } from './auth.schema';

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: AppContext) => {
      if (!ctx.user) {
        return null;
      }
      return AuthService.getUserById(ctx.user.userId);
    }
  },

  Mutation: {
    register: async (
      _: unknown,
      args: { input: { username: string; email: string; password: string } },
      ctx: AppContext
    ) => {
      const input = registerSchema.parse(args.input);
      const deviceId = ctx.req.headers['x-device-id'] as string | undefined;
      const deviceInfo = ctx.req.headers['user-agent'];
      
      const { accessToken, refreshToken, user } = await AuthService.register(input, deviceId, deviceInfo);
      ctx.res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
      return { accessToken, user };
    },

    login: async (
      _: unknown,
      args: { input: { email: string; password: string } },
      ctx: AppContext
    ) => {
      const input = loginSchema.parse(args.input);
      const deviceId = ctx.req.headers['x-device-id'] as string | undefined;
      const deviceInfo = ctx.req.headers['user-agent'];

      const { accessToken, refreshToken, user } = await AuthService.login(input, deviceId, deviceInfo);
      ctx.res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
      return { accessToken, user };
    },

    logoutAll: async (_: unknown, __: unknown, ctx: AppContext) => {
      if (!ctx.user) {
        throw new UnauthorizedError('Not authenticated!');
      }

      await AuthService.logoutAll(ctx.user.userId);
      ctx.res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTIONS);
      return true;
    },
  },
};