import Stripe from "stripe";
import ActivePlan from "../models/ActivePlan.model.js";
import User from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";

export const createSubscriptionCheckoutSession = async (req, res) => {
  try {
    const { amount, planLabel } = req.body;

    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount value" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "lkr", // keep consistent with your project
            product_data: { name: planLabel || "Plus Subscription Plan" },
            unit_amount: Math.round(numericAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: String(userId),
        planPrice: String(numericAmount),
        planLabel: planLabel || "plus",
      },
      success_url: `${FRONTEND_URL}/marketplace/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/marketplace/subscription?canceled=true`,
    });

    // Return both id and url for convenience
    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe subscription session error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const confirmSubscriptionPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Validate session status
    const paid = session?.payment_status === "paid" || session?.status === "complete";
    if (!paid) {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const userId = session?.metadata?.userId;
    const planPrice = Number(session?.metadata?.planPrice || 0);

    if (!userId) return res.status(400).json({ error: "Missing user id in metadata" });
    if (!Number.isFinite(planPrice) || planPrice <= 0) {
      return res.status(400).json({ error: "Invalid plan price in metadata" });
    }

    // 1) Activate subscription on the user
    // Ensure your User schema has "subscription" field (e.g., Number default 0)
    await User.findByIdAndUpdate(userId, { subscription: 1 }, { new: true });

    // 2) Upsert active plan for the user (document _id == userId)
    await ActivePlan.findByIdAndUpdate(
      userId,
      { _id: userId, planPrice, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ ok: true, message: "Subscription activated" });
  } catch (err) {
    console.error("Confirm subscription error:", err);
    return res.status(500).json({ error: err.message });
  }
};