import z from "zod";

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long!'),
    email: z.email('Invalid email!'),
    password: z.string().min(6, 'Password must be at least 6 characters long!'),
    rePassword: z.string()
}).refine((data) => {
    if (!data.rePassword || !data.password) {
        return true;
    }
    return data.password === data.rePassword;
}, {
    message: 'Passwords do not match!',
    path: ['rePassword'],
});

// const publicRegisterSchema = registerSchema.omit({ rePassword: true });
type RegisterUser = z.infer<typeof registerSchema>;
type PublicRegisterUser = Omit<RegisterUser, 'rePassword'>;

export {
    type RegisterUser,
    type PublicRegisterUser,
    registerSchema
}