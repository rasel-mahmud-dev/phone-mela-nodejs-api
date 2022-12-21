import {Request, Response} from "express";

// This is your test secret API key.
const stripe = require("stripe")(process.env["STRIPE_SECRET_KEY"]);

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {

        const { items,  price,  } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price,
            items: items,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    } finally {
    }
};
