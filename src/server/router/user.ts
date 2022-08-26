import { forgotPasswordSchema, registerSchema, resetPasswordSchema } from './../../utils/validation/auth';
import { hash } from "argon2";
import { createRouter } from "./context";
import * as trpc from "@trpc/server";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ResetPasswordRequest } from '@prisma/client';
import dayjs from 'dayjs';

export const userRouter = createRouter()
    .mutation('register', {
        input: registerSchema,
        resolve: async ({ input, ctx }) => {
            const { email, password, passwordConfirm } = input;

            if (password !== passwordConfirm) {
                throw new trpc.TRPCError({
                    code: 'CONFLICT',
                    message: 'Passwords do not match',
                })
            }

            const hashedPassword = await hash(password)

            try {
                const user = await ctx.prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                    }
                })

                return user;
            } catch (err) {
                if (err instanceof PrismaClientKnownRequestError) {
                    if (err.code === 'P2002') {
                        throw new trpc.TRPCError({
                            code: "CONFLICT",
                            message: "User already exists",
                        })
                    }
                }

                throw new trpc.TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Internal server error",
                })
            }
        }
    })
    .mutation('forgot-password', {
        input: forgotPasswordSchema,
        resolve: async ({ input, ctx }) => {
            const { email } = input;

            const user = await ctx.prisma.user.findFirst({
                where: { email },
            });

            if (!user) {
                throw new trpc.TRPCError({
                    code: "NOT_FOUND",
                    message: "Couldn't find an account for this email",
                })
            }
            console.log("USER >>> ", user)

            const hasPreviousRequest = await ctx.prisma.resetPasswordRequest.findMany({
                where: {
                    email: user.email!,
                    expires: {
                        gt: new Date(),
                    },
                }
            })

            let passwordReq: ResetPasswordRequest;

            // Return current request if it's still valid,
            // otherwise create a new one
            if (hasPreviousRequest && hasPreviousRequest.length > 0) {
                passwordReq = hasPreviousRequest[0]!;
            } else {
                const expiry = dayjs().add(6, "hours").toDate();
                const createdResetPasswordRequest = await ctx.prisma.resetPasswordRequest.create({
                    data: {
                        email: user.email!,
                        expires: expiry,
                    },
                });
                passwordReq = createdResetPasswordRequest;
            }
            console.log('passwordReq', passwordReq)
            const resetLink = `http://localhost:${process.env.PORT ?? 3000}/forgot-password/${passwordReq.id}`;

            console.log("resetLink >>> ", resetLink)
        }
    })
    .mutation('reset-password', {
        input: resetPasswordSchema,
        resolve: async ({ input, ctx }) => {
            const { password, passwordConfirm, resetToken } = input;

            console.log("INPUT", input)
            if (!resetToken) {
                throw new trpc.TRPCError({
                    code: "NOT_FOUND",
                    message: "Reset token is required",
                })
            }

            if (password !== passwordConfirm) {
                throw new trpc.TRPCError({
                    code: 'CONFLICT',
                    message: 'Passwords do not match',
                })
            }
            const all = await ctx.prisma.resetPasswordRequest.findMany();
            const allUsers = await ctx.prisma.user.findMany();
            console.log("ALLL >?>>>> ", all)
            console.log("ALLL allUsers ", allUsers)
            try {
                const maybeRequest = await ctx.prisma.resetPasswordRequest.findUnique({
                    where: {
                        id: resetToken,
                    },
                });
                console.log('maybeRequest', maybeRequest)
                if (!maybeRequest) {
                    throw new trpc.TRPCError({
                        code: "BAD_REQUEST",
                        message: "Couldn't find an account for this email",
                    })
                }

                const maybeUser = await ctx.prisma.user.findUnique({
                    where: {
                        email: maybeRequest.email,
                    },
                });
                console.log("maybeUser >>> ", maybeUser)
                if (!maybeUser) {
                    throw new trpc.TRPCError({
                        code: "BAD_REQUEST",
                        message: "Couldn't find an account for this email",
                    })
                }
                const hashedPassword = await hash(password)

                const res = await ctx.prisma.user.update({
                    where: {
                        id: maybeUser.id,
                    },
                    data: {
                        password: hashedPassword,
                    },
                });

                console.log("SUCCESSFULLY UPDATED PASSWORD", res)
            } catch (err) {
                console.error(err)
                // throw new trpc.TRPCError({
                //     code: "INTERNAL_SERVER_ERROR",
                //     message: "Unable to create password reset request",
                // })
            }
        }
    })
