import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Calendar, CreditCard, AlertCircle, CheckCircle, TrendingUp, Shield } from "lucide-react";
import subscriptionMgmtAPI from "../../services/subscriptionManagementApiService";
import Confirm from "../../components/atoms/Confirm"; // Changed import

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleCancelConfirm = async () => {
    setShowCancelConfirm(false);
    try {
      setCancelProcessing(true);
      const res = await subscriptionMgmtAPI.requestCancel();
      toast.info("Subscription will be cancelled at the end of the month.");
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

  const handleCancelDecline = () => {
    setShowCancelConfirm(false);
  };

  if (loading) {
    return (
      <div className="tw:min-h-screen tw:bg-gradient-to-br tw:from-gray-50 tw:to-blue-50 tw:flex tw:items-center tw:justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="tw:text-center"
        >
          <div className="tw:w-20 tw:h-20 tw:border-4 tw:border-blue-100 tw:border-t-blue-500 tw:rounded-full tw:animate-spin tw:mx-auto" />
          <p className="tw:mt-4 tw:text-gray-600 tw:font-medium">Loading your plan...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw:min-h-screen tw:bg-gradient-to-br tw:from-gray-50 tw:to-blue-50 tw:flex tw:items-center tw:justify-center tw:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tw:max-w-md tw:mx-auto tw:text-center tw:bg-white tw:p-8 tw:rounded-2xl tw:shadow-xl"
        >
          <div className="tw:w-16 tw:h-16 tw:bg-red-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-4">
            <AlertCircle className="tw:w-8 tw:h-8 tw:text-red-500" />
          </div>
          <h2 className="tw:text-2xl tw:font-bold tw:text-gray-800 tw:mb-2">Error Loading Plan</h2>
          <p className="tw:text-gray-600 tw:mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="tw:bg-blue-600 tw:hover:bg-blue-700 tw:text-white tw:px-6 tw:py-3 tw:rounded-lg tw:font-medium tw:transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="tw:min-h-screen tw:bg-gradient-to-br tw:from-gray-50 tw:to-blue-50 tw:flex tw:items-center tw:justify-center tw:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tw:max-w-2xl tw:w-full tw:mx-auto tw:text-center tw:bg-white tw:p-12 tw:rounded-2xl tw:shadow-xl"
        >
          <div className="tw:w-20 tw:h-20 tw:bg-gradient-to-r tw:from-blue-500 tw:to-blue-600 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-6">
            <CreditCard className="tw:w-10 tw:h-10 tw:text-white" />
          </div>
          <h1 className="tw:text-3xl tw:font-bold tw:text-gray-800 tw:mb-3">No Active Subscription</h1>
          <p className="tw:text-gray-600 tw:text-lg tw:mb-8">Start your journey with one of our premium plans</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/marketplace/subscription")}
            className="tw:bg-gradient-to-r tw:from-blue-500 tw:to-blue-600 tw:text-white tw:px-8 tw:py-4 tw:rounded-xl tw:font-semibold tw:shadow-lg tw:hover:shadow-xl tw:transition-all"
          >
            Browse Plans
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="tw:min-h-screen tw:bg-gradient-to-br tw:from-gray-50 tw:to-blue-50 tw:py-12 tw:px-4">
      <div className="tw:max-w-4xl tw:mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tw:mb-8"
        >
          <h1 className="tw:text-4xl tw:font-bold tw:text-gray-800 tw:mb-2">My Subscription</h1>
          <p className="tw:text-gray-600">Manage your current plan and billing</p>
        </motion.div>

        <div className="tw:grid tw:gap-6">
          {/* Main Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="tw:bg-white tw:rounded-2xl tw:shadow-xl tw:overflow-hidden"
          >
            <div className="tw:bg-gradient-to-r tw:from-blue-500 tw:to-blue-600 tw:p-6 tw:text-white">
              <div className="tw:flex tw:items-center tw:justify-between">
                <div>
                  <div className="tw:text-blue-100 tw:text-sm tw:font-medium tw:mb-1">Current Plan</div>
                  <h2 className="tw:text-3xl tw:font-bold">{plan.planLabel}</h2>
                </div>
                {!plan.cancelAtPeriodEnd ? (
                  <div className="tw:bg-white tw:bg-opacity-20 tw:backdrop-blur-sm tw:px-4 tw:py-2 tw:rounded-full tw:flex tw:items-center tw:gap-2">
                    <CheckCircle className="tw:w-5 tw:h-5 tw:text-green-700" />
                    <span className="tw:font-semibold tw:text-green-700">Active</span>
                  </div>
                ) : (
                  <div className="tw:bg-amber-500 tw:px-4 tw:py-2 tw:rounded-full tw:flex tw:items-center tw:gap-2">
                    <AlertCircle className="tw:w-5 tw:h-5 tw:text-red-700" />
                    <span className="tw:font-semibold tw:text-red-700">Cancelling</span>
                  </div>
                )}
              </div>
            </div>

            <div className="tw:p-8">
              <div className="tw:grid md:tw:grid-cols-2 tw:gap-8 tw:mb-8">
                {/* Price Info */}
                <div className="tw:flex tw:items-start tw:gap-4">
                  <div className="tw:w-12 tw:h-12 tw:bg-green-100 tw:rounded-xl tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
                    <TrendingUp className="tw:w-6 tw:h-6 tw:text-green-600" />
                  </div>
                  <div>
                    <div className="tw:text-gray-500 tw:text-sm tw:font-medium tw:mb-1">Plan Price</div>
                    <div className="tw:text-2xl tw:font-bold tw:text-gray-800">
                      LKR {Number(plan.planPrice).toLocaleString()}
                    </div>
                    <div className="tw:text-gray-600 tw:text-sm tw:mt-1">per billing period</div>
                  </div>
                </div>

                {/* Status */}
                <div className="tw:flex tw:items-start tw:gap-4">
                  <div className="tw:w-12 tw:h-12 tw:bg-blue-100 tw:rounded-xl tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
                    <Shield className="tw:w-6 tw:h-6 tw:text-blue-600" />
                  </div>
                  <div>
                    <div className="tw:text-gray-500 tw:text-sm tw:font-medium tw:mb-1">Status</div>
                    <div className="tw:text-lg tw:font-semibold tw:text-gray-800">
                      {plan.cancelAtPeriodEnd ? "Cancellation Scheduled" : "Active & Running"}
                    </div>
                    <div className="tw:text-gray-600 tw:text-sm tw:mt-1">
                      {plan.cancelAtPeriodEnd ? "Ends at period close" : "Auto-renews"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates Section */}
              <div className="tw:border-t tw:border-gray-200 tw:pt-6 tw:space-y-4">
                <div className="tw:flex tw:items-center tw:gap-3 tw:text-gray-700">
                  <Calendar className="tw:w-5 tw:h-5 tw:text-gray-400" />
                  <div>
                    <span className="tw:font-medium">Started:</span>
                    <span className="tw:ml-2">{formatDate(plan.createdAt)}</span>
                  </div>
                </div>
                <div className="tw:flex tw:items-center tw:gap-3 tw:text-gray-700">
                  <Calendar className="tw:w-5 tw:h-5 tw:text-gray-400" />
                  <div>
                    <span className="tw:font-medium">Next renewal:</span>
                    <span className="tw:ml-2">{formatDate(plan.currentPeriodEnd)}</span>
                  </div>
                </div>
              </div>

              {plan.cancelAtPeriodEnd && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="tw:mt-6 tw:bg-amber-50 tw:border tw:border-amber-200 tw:rounded-xl tw:p-4 tw:flex tw:items-start tw:gap-3"
                >
                  <AlertCircle className="tw:w-5 tw:h-5 tw:text-amber-600 tw:flex-shrink-0 tw:mt-0.5" />
                  <div>
                    <div className="tw:font-semibold tw:text-amber-900 tw:mb-1">Cancellation Notice</div>
                    <div className="tw:text-amber-800 tw:text-sm">
                      Your subscription will be cancelled at the end of the current billing period. You'll retain access until {formatDate(plan.currentPeriodEnd)}.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="tw:flex tw:flex-col sm:tw:flex-row tw:gap-4 tw:mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/marketplace/subscription")}
                  className="tw:flex-1 tw:bg-gradient-to-r tw:from-blue-500 tw:to-blue-600 tw:text-white tw:px-6 tw:py-4 tw:rounded-xl tw:font-semibold tw:shadow-lg tw:hover:shadow-xl tw:transition-all"
                >
                  Change Plan
                </motion.button>
                
                {!plan.cancelAtPeriodEnd ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelClick}
                    disabled={cancelProcessing}
                    className={`tw:flex-1 tw:bg-red-600 tw:text-white tw:px-6 tw:py-4 tw:rounded-xl tw:font-semibold tw:shadow-lg tw:hover:shadow-xl tw:hover:bg-red-700 tw:transition-all ${
                      cancelProcessing ? "tw:opacity-70 tw:cursor-not-allowed" : ""
                    }`}
                  >
                    {cancelProcessing ? "Processing..." : "Cancel Subscription"}
                  </motion.button>
                ) : (
                  <button
                    disabled
                    className="tw:flex-1 tw:bg-gray-300 tw:text-gray-600 tw:px-6 tw:py-4 tw:rounded-xl tw:font-semibold tw:cursor-not-allowed"
                  >
                    Cancellation Scheduled
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-2xl tw:p-6"
          >
            <h3 className="tw:font-semibold tw:text-gray-800 tw:mb-2 tw:flex tw:items-center tw:gap-2">
              <Shield className="tw:w-5 tw:h-5 tw:text-blue-600" />
              Need Help?
            </h3>
            <p className="tw:text-gray-700 tw:text-sm">
              Have questions about your subscription? Contact our support team or visit our help center for assistance with billing, plan changes, or cancellations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showCancelConfirm && (
        <Confirm
          title="Cancel Subscription"
          message="Are you sure you want to cancel your subscription? Your subscription will remain active until the end of the current billing period."
          onOK={handleCancelConfirm}
          onCancel={handleCancelDecline}
        />
      )}
    </div>
  );
};

export default MyPlansPage;