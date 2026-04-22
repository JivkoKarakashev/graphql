import z from "zod";

const loginSchema = z.object({
    email: z.email('Invalid email!'),
    password: z.string().min(6, 'Password must be at least 6 characters long!'),
});

type LoginUser = z.infer<typeof loginSchema>;

export {
  type LoginUser,
  loginSchema
}