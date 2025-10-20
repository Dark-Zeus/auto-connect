import ActivePlan from "../models/activePlan.model.js";
import User from "../models/user.model.js";

// Map plan price to cycle months
function cycleMonthsFromPrice(planPrice) {
  switch (Number(planPrice)) {
    case 12000: return 1;     // monthly
    case 24000: return 3;     // quarterly
    case 48000: return 12;    // yearly
    default: return 1;
  }
}

function labelFromPrice(planPrice) {
  switch (Number(planPrice)) {
    case 12000: return "Monthly";
    case 24000: return "Quarterly";
    case 48000: return "Yearly";
    default: return "Custom";
  }
}

// Compute current period end from createdAt + cycle months
function computePeriodEnd(createdAt, planPrice) {
  const months = cycleMonthsFromPrice(planPrice);
  const d = new Date(createdAt);
  const end = new Date(d);
  end.setMonth(end.getMonth() + months);
  return end;
}

// GET /api/v1/my-plan
export const getMyActivePlan = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const plan = await ActivePlan.findById(userId).lean();
    if (!plan) return res.status(200).json({ active: false });

    const currentPeriodEnd = computePeriodEnd(plan.createdAt, plan.planPrice);

    return res.status(200).json({
      active: true,
      planPrice: plan.planPrice,
      planLabel: labelFromPrice(plan.planPrice),
      createdAt: plan.createdAt,
      currentPeriodEnd,
      cancelAtPeriodEnd: !!plan.cancelAtPeriodEnd,
      cancelAt: plan.cancelAt,
      status: plan.status || "active"
    });
  } catch (err) {
    console.error("getMyActivePlan error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/v1/my-plan/cancel
export const requestCancelAtPeriodEnd = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const plan = await ActivePlan.findById(userId);
    if (!plan) return res.status(404).json({ error: "No active plan" });

    // Already scheduled
    if (plan.cancelAtPeriodEnd) {
      return res.status(200).json({
        ok: true,
        message: "Cancellation already scheduled at period end",
        cancelAt: plan.cancelAt
      });
    }

    const cancelAt = computePeriodEnd(plan.createdAt, plan.planPrice);

    plan.cancelAtPeriodEnd = true;
    plan.cancelAt = cancelAt;
    plan.status = "cancelling";
    await plan.save();

    // Keep users.subscription = 1 until cancelAt passes (optional scheduler not included)
    // If you later automate cancellation, set users.subscription = 0 when cancel executes.

    return res.status(200).json({
      ok: true,
      message: "Subscription will be cancelled at the end of the current billing period",
      cancelAt
    });
  } catch (err) {
    console.error("requestCancelAtPeriodEnd error:", err);
    return res.status(500).json({ error: err.message });
  }
};