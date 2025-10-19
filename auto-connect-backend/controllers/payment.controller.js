import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (req, res) => {
  try {
    let { amount } = req.body;
    amount = Number(amount);
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount value" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "lkr", // change if you have another enabled currency
            product_data: { name: "Vehicle Listing Fee" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL || "http://localhost:3001"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3001"}/marketplace/sell?canceled=true`,
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ error: err.message });
  }
};