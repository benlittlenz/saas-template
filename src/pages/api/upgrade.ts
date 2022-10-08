// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "./auth/[...nextauth]";
import { prisma } from "../../server/db/client";
import { stripe } from "../../utils/stripe";

const upgrade = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);

    if (!session || !session.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await prisma.user.findUnique({
        rejectOnNotFound: true,
        where: {
            email: session.user.email!,
        },
        select: {
            email: true,
            stripeCustomerId: true,
        },
    });

    let customerId: string | null = null;
    // Check if user has a strpe customer id
    // Otherwise create a new customer on stripe and save id to db
    if (user.stripeCustomerId) {
        customerId = user.stripeCustomerId;
    } else {
        const customer = await stripe.customers.create({
            email: user.email!,
        })
        customerId = customer.id;

        await prisma.user.update({
            where: {
                email: user.email!,
            },
            data: {
                stripeCustomerId: customerId,
            },
        })
    }

    try {
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: customerId,
            line_items: [
                {
                    price: 'price_1LbDyQKbB6dHVhmkg8HnBL2O',
                    quantity: 1
                }
            ],
            mode: 'subscription',
            allow_promotion_codes: false,
            subscription_data: {
                trial_from_plan: true,
            },
            success_url: `http://localhost:3000/dashboard`,
            cancel_url: `http://localhost:3000/`
        })

        if (!stripeSession.url) return res.status(401).json({ message: "Failed to generate session url" });

        res.redirect(303, stripeSession.url);

    } catch (err) {
        console.error(err);
    }
};

export default upgrade;
