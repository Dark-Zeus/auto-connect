// ...existing code...
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPromotionStripeSession = async (req, res) => {
  try {
    let { amount, productName = "Ad Bump Promotion", metadata = {} } = req.body;
    amount = Number(amount);
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount value" });
    }

    // ensure string metadata for Stripe
    const safeMetadata = {};
    for (const [k, v] of Object.entries(metadata || {})) {
      safeMetadata[k] = String(v);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: { name: productName, metadata: safeMetadata },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      // FIX: send to the promotion success page
      success_url: `${process.env.FRONTEND_URL || "http://localhost:3001"}/promotion-payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3001"}/marketplace/my-ads?promo=canceled`,
    });

    return res.status(200).json({ sessionId: session.id, sessionUrl: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ error: err.message });
  }
};
// ...existing code...