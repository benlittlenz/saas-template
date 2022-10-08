import { loginSchema } from './../../../utils/validation/auth';
import NextAuth, { type NextAuthOptions } from "next-auth";
import { prisma } from "../../../server/db/client";
import Credentials from "next-auth/providers/credentials";
import { verify } from 'argon2';

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "jsmith@gmail.com",
                },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials, request) => {
                const creds = await loginSchema.parseAsync(credentials);

                const user = await prisma.user.findFirst({
                    where: { email: creds.email },
                });

                if (!user) {
                    return null;
                }

                const isValidPassword = await verify(user.password!, creds.password);

                if (!isValidPassword) {
                    return null;
                }

                return user;
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }

            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.id = token.id;
            }

            return session;
        },
    },
    jwt: {
        secret: "super-secret",
        maxAge: 15 * 24 * 30 * 60, // 15 days
    },
    pages: {
        signIn: "/login",
        newUser: "/register",
    },
};

export default NextAuth(authOptions);
