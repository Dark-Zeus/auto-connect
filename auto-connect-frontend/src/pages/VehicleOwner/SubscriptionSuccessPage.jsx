import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import subscriptionPaymentAPI from "../../services/subscriptionPaymentApiService";

const COUNTDOWN = 8;

const SubscriptionSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(COUNTDOWN);

  useEffect(() => {
    const confirm = async () => {
      if (!sessionId) {
        setStatus("error");
        setError("Missing session id.");
        return;
      }
      try {
        await subscriptionPaymentAPI.confirm(sessionId);
        toast.success("Subscription activated!");
        setStatus("success");
      } catch (e) {
        console.error(e);
        setStatus("error");
        setError(e?.message || "Failed to confirm subscription.");
      }
    };
    confirm();
  }, [sessionId]);

  useEffect(() => {
    if (status !== "success") return;
    if (countdown <= 0) {
      navigate("/marketplace/subscription"); // or your subscriptions dashboard
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, navigate]);

  return (
    <div className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:px-4 tw:py-8">
      <div className="tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-8 tw:max-w-md tw:w-full tw:text-center">
        {status === "loading" && (
          <>
            <div className="tw:w-16 tw:h-16 tw:border-4 tw:border-blue-100 tw:border-t-blue-500 tw:rounded-full tw:animate-spin tw:mx-auto" />
            <h2 className="tw:mt-6 tw:text-xl tw:font-semibold">Confirming payment...</h2>
          </>
        )}
        {status === "success" && (
          <>
            <div className="tw:w-20 tw:h-20 tw:bg-green-500 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mx-auto">
              <svg className="tw:w-10 tw:h-10 tw:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="tw:mt-6 tw:text-2xl tw:font-bold">Subscription Activated</h1>
            <p className="tw:text-gray-600 tw:mt-2">Redirecting in {countdown}s...</p>
            <button
              onClick={() => navigate("/marketplace/subscriptions")}
              className="tw:mt-6 tw:w-full tw:bg-blue-600 tw:text-white tw:py-3 tw:rounded-lg"
            >
              Go Home
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <div className="tw:w-16 tw:h-16 tw:bg-red-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mx-auto">
              <svg className="tw:w-8 tw:h-8 tw:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="tw:mt-6 tw:text-xl tw:font-semibold">Activation Failed</h2>
            <p className="tw:text-gray-600 tw:mt-2">{error}</p>
            <button
              onClick={() => navigate("/marketplace/subscription")}
              className="tw:mt-6 tw:w-full tw:bg-gray-200 tw:text-gray-800 tw:py-3 tw:rounded-lg"
            >
              Back to Plans
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;