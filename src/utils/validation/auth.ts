import { z } from "zod";

export const loginSchema = z
    .object({
        email: z.string().min(1, "Email is required").email("Email is invalid"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters")
            .max(32, "Password must be less than 32 characters"),

    })

export const registerSchema = loginSchema.extend({
    name: z.string(),
    passwordConfirm: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
})

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Email is invalid"),
})

export const resetPasswordSchema = loginSchema.pick({ password: true }).extend({
    passwordConfirm: z.string().min(1, "Please confirm your password"),
    resetToken: z.string().min(1, "Reset token is required"),
}).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
})

export const profileSchema = z
    .object({
        email: z.string().min(1, "Email is required").email("Email is invalid"),
        name: z.string(),
    })

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be less than 32 characters"),
    newPassword: z.string().min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be less than 32 characters"),
})

export type ILogin = z.infer<typeof loginSchema>;
export type IRegister = z.infer<typeof registerSchema>;
export type IResetPassword = z.infer<typeof resetPasswordSchema>;
export type IProfile = z.infer<typeof profileSchema>;
export type IChangePassword = z.infer<typeof changePasswordSchema>;
