import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { activateVehicleBump } from "../../services/adPromotionApiService";

const COUNTDOWN_START = 8;

const PromotionPaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  const [finalizing, setFinalizing] = useState(true);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_START);

  const PROMO_FLAG_KEY = sessionId
    ? `vehicle_promo_activated_${sessionId}`
    : "vehicle_promo_activated_unknown";

  const finalizePromotion = useCallback(async () => {
    const promoRaw = localStorage.getItem("pendingPromotionData");
    if (!promoRaw) {
      setDone(true);
      setFinalizing(false);
      return;
    }
    if (!sessionId) {
      setError("Missing session id.");
      setFinalizing(false);
      return;
    }
    if (localStorage.getItem(PROMO_FLAG_KEY) === "true") {
      setDone(true);
      setFinalizing(false);
      return;
    }

    let promoData;
    try {
      promoData = JSON.parse(promoRaw);
    } catch {
      setError("Corrupted promotion data.");
      setFinalizing(false);
      return;
    }

    try {
      await activateVehicleBump(promoData.adId, {
        ...promoData.payload,
        checkoutSessionId: sessionId,
        paymentStatus: "completed",
      });
      localStorage.setItem(PROMO_FLAG_KEY, "true");
      localStorage.removeItem("pendingPromotionData");
      toast.success("Promotion activated successfully!");
      setDone(true);
    } catch (e) {
      console.error("Promotion activation failed:", e);
      const msg = e?.response?.data?.message || e?.message || "Failed to activate promotion.";
      setError(msg);
      toast.error(msg);
    } finally {
      setFinalizing(false);
    }
  }, [sessionId, PROMO_FLAG_KEY]);

  useEffect(() => {
    finalizePromotion();
  }, [finalizePromotion]);

  useEffect(() => {
    if (!done) return;
    if (countdown <= 0) {
      navigate("/marketplace/my-ads");
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [done, countdown, navigate]);

  const goMyAds = () => navigate("/marketplace/my-ads");

  return (
    <div className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:px-4">
      <div className="tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-8 tw:max-w-md tw:w-full tw:text-center">
        {finalizing && !error && !done && (
          <>
            <div className="tw:w-16 tw:h-16 tw:border-4 tw:border-blue-100 tw:border-t-blue-500 tw:rounded-full tw:animate-spin tw:mx-auto"></div>
            <h2 className="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mt-6">Finalizing your promotion...</h2>
            <p className="tw:text-gray-600">Please wait a moment.</p>
          </>
        )}

        {!finalizing && done && !error && (
          <>
            <div className="tw:w-16 tw:h-16 tw:bg-green-500 tw:text-white tw:flex tw:items-center tw:justify-center tw:rounded-full tw:mx-auto">
              <svg className="tw:w-10 tw:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="tw:text-2xl tw:font-bold tw:text-gray-800 tw:mt-6">Promotion Activated</h1>
            <p className="tw:text-gray-600 tw:mt-2">Redirecting in {countdown}s...</p>
            <button onClick={goMyAds} className="tw:mt-6 tw:w-full tw:bg-green-600 tw:text-white tw:py-3 tw:rounded-lg tw:font-semibold">
              Go to My Ads
            </button>
            {sessionId && (
              <p className="tw:text-xs tw:text-gray-400 tw:font-mono tw:bg-gray-50 tw:px-3 tw:py-2 tw:rounded-lg tw:mt-4">
                Session: {sessionId}
              </p>
            )}
          </>
        )}

        {!finalizing && error && !done && (
          <>
            <div className="tw:w-16 tw:h-16 tw:bg-red-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mx-auto">
              <svg className="tw:w-8 tw:h-8 tw:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mt-6">Activation Failed</h2>
            <p className="tw:text-gray-600 tw:mt-2">{error}</p>
            <button onClick={goMyAds} className="tw:mt-6 tw:w-full tw:bg-gray-800 tw:text-white tw:py-3 tw:rounded-lg tw:font-semibold">
              Back to My Ads
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PromotionPaymentSuccessPage;