import { z } from 'zod';
import { GraphQLError } from 'graphql';

const validate = <T>(schema: z.ZodSchema<T>, input: unknown): T => {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new GraphQLError('Validation failed!', {
      extensions: {
        code: 'VALIDATION_ERROR',
        fields: z.treeifyError(result.error),
      },
    });
  }
  return result.data;
};

export {
  validate
}