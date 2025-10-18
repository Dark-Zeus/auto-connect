import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import subscriptionMgmtAPI from "../../services/subscriptionManagementApiService";

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  } catch {
    return "-";
  }
}

const MyPlansPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [cancelProcessing, setCancelProcessing] = useState(false);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const data = await subscriptionMgmtAPI.getMyPlan();
      if (!data.active) {
        setPlan(null);
      } else {
        setPlan(data);
      }
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to load plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const onCancel = async () => {
    const ok = window.confirm("Are you sure you want to cancel? Your subscription will remain active until the end of the current billing period.");
    if (!ok) return;
    try {
      setCancelProcessing(true);
      const res = await subscriptionMgmtAPI.requestCancel();
      toast.info("Subscription will be cancelled at the end of the month.");
      // Update local state
      setPlan((prev) => prev ? {
        ...prev,
        cancelAtPeriodEnd: true,
        cancelAt: res.cancelAt || prev.cancelAt,
        status: "cancelling",
      } : prev);
    } catch (e) {
      console.error(e);
      toast.error(e?.message || "Failed to request cancellation");
    } finally {
      setCancelProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="tw:min-h-screen tw:flex tw:items-center tw:justify-center">
        <div className="tw:w-16 tw:h-16 tw:border-4 tw:border-blue-100 tw:border-t-blue-500 tw:rounded-full tw:animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw:max-w-xl tw:mx-auto tw:mt-12 tw:text-center">
        <h2 className="tw:text-xl tw:font-semibold">Error</h2>
        <p className="tw:text-gray-600 tw:mt-2">{error}</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="tw:max-w-2xl tw:mx-auto tw:mt-12 tw:text-center tw:bg-white tw:p-8 tw:rounded-2xl tw:shadow">
        <h1 className="tw:text-2xl tw:font-bold tw:mb-2">My Plan</h1>
        <p className="tw:text-gray-600">No active subscription.</p>
        <button
          onClick={() => navigate("/marketplace/subscription")}
          className="tw:mt-6 tw:bg-blue-600 tw:text-white tw:px-6 tw:py-3 tw:rounded-lg"
        >
          Browse Plans
        </button>
      </div>
    );
  }

  return (
    <div className="tw:min-h-screen tw:bg-gray-50 tw:py-10 tw:px-4">
      <div className="tw:max-w-3xl tw:mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tw:bg-white tw:rounded-2xl tw:shadow-lg tw:p-8"
        >
          <h1 className="tw:text-2xl tw:font-bold tw:mb-6">My Plan</h1>

          <div className="tw:flex tw:flex-col md:tw:flex-row tw:justify-between tw:items-start tw:gap-6">
            <div>
              <div className="tw:text-gray-500">Current Plan</div>
              <div className="tw:text-3xl tw:font-bold tw:mt-1">{plan.planLabel}</div>
              <div className="tw:text-gray-700 tw:mt-2">LKR {Number(plan.planPrice).toLocaleString()}</div>
              <div className="tw:text-sm tw:text-gray-500 tw:mt-4">
                Started: {formatDate(plan.createdAt)}
              </div>
              <div className="tw:text-sm tw:text-gray-500">
                Next renewal: {formatDate(plan.currentPeriodEnd)}
              </div>
              {plan.cancelAtPeriodEnd && (
                <div className="tw:mt-3 tw:text-amber-600 tw:text-sm tw:font-medium">
                  Subscription will be cancelled at the end of the month.
                </div>
              )}
            </div>

            <div className="tw:flex tw:flex-col tw:items-stretch tw:gap-3 tw:mt-4 md:tw:mt-0">
              {!plan.cancelAtPeriodEnd ? (
                <button
                  onClick={onCancel}
                  disabled={cancelProcessing}
                  className={`tw:bg-red-600 tw:hover:cursor-pointer tw:text-white tw:px-6 tw:py-3 tw:hover:bg-red-800 tw:rounded-lg ${cancelProcessing ? "tw:opacity-70 tw:cursor-not-allowed" : ""}`}
                >
                  {cancelProcessing ? "Cancelling..." : "Cancel Subscription"}
                </button>
              ) : (
                <button
                  disabled
                  className="tw:bg-gray-200 tw:text-gray-700 tw:px-6 tw:py-3 tw:rounded-lg"
                >
                  Cancellation Scheduled
                </button>
              )}
              <button
                onClick={() => navigate("/marketplace/subscription")}
                className="tw:bg-gray-100 tw:hover:bg-gray-400 tw:hover:cursor-pointer tw:text-gray-800 tw:px-6 tw:py-3 tw:rounded-lg"
              >
                Change Plan
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyPlansPage;