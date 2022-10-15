import { NextApiRequest } from 'next';
import { forgotPasswordSchema, registerSchema, resetPasswordSchema } from './../../utils/validation/auth';
import { createRouter } from "./context";
import { TRPCError } from '@trpc/server';
import { stripe } from '../../utils/stripe';

export const stripeRouter = createRouter()
    .middleware(({ ctx, next }) => {
        if (!ctx?.session?.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }

        return next({
            ctx: {
                ...ctx,
                user: ctx.session.user,
            },
        });
    })
    .mutation('upgrade', {
        input: registerSchema,
        resolve: async ({ input, ctx }) => {
            const user = await ctx.prisma.user.findUnique({
                rejectOnNotFound: true,
                where: {
                    id: ctx.user.id
                },
                select: {
                    email: true,
                    stripeCustomerId: true,
                },
            });

            let customerId: string | null = null;
            // Check if user has a strpe customer id
            if (user.stripeCustomerId) {
                customerId = user.stripeCustomerId;
            } else {
                // Create a new custome on stripe and save id to db
                const customer = await stripe.customers.create({
                    email: user.email!,
                })
                customerId = customer.id;

                await ctx.prisma.user.update({
                    where: {
                        email: user.email!,
                    },
                    data: {
                        stripeCustomerId: customerId,
                    },
                })
            }

            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    billing_address_collection: 'required',
                    customer: customerId,
                    line_items: [
                        {
                            price: 'price_1LbDyQKbB6dHVhmkg8HnBL2O',
                            quantity: 1
                        }
                    ],
                    mode: 'subscription',
                    allow_promotion_codes: true,
                    subscription_data: {
                        trial_from_plan: true,
                    },
                    success_url: `/account`,
                    cancel_url: `/`
                })
                if (session.url) {
                    ctx.res.redirect(303, session.url);
                }
            } catch (err) {
                console.error(err);
            }

        }
    })
