import { createRouter } from "./context";
import { z } from "zod";
import { transporter } from "../../emails/emailConfig";
import { forgotPasswordEmail } from "../../emails/templates/forgotPasswordEmail";

export const exampleRouter = createRouter()
    .query("hello", {
        input: z
            .object({
                text: z.string().nullish(),
            })
            .nullish(),
        resolve({ input }) {
            return {
                greeting: `Hello ${input?.text ?? "world"}`,
            };
        },
    })
    .query("getAll", {
        async resolve({ ctx }) {
            return await ctx.prisma.example.findMany();
        },
    })
    .mutation("send-email", {
        async resolve() {
            const forgotPasswordTemplate = forgotPasswordEmail("John", "https://google.com");

            const emailRes = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: 'tyrell.hyatt21@ethereal.email',
                subject: 'Reset password instructions',
                html: forgotPasswordTemplate.html
            })

            console.log("EMAIL RES >>> ", emailRes)
        }
    })
