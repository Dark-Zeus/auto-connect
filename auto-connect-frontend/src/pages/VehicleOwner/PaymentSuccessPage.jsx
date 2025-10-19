import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import listVehicleAPI from "../../services/listVehicleApiService";

const COUNTDOWN_START = 10;

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  const [creating, setCreating] = useState(true);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_START);

  const CREATED_FLAG_KEY = sessionId
    ? `vehicle_listing_created_${sessionId}`
    : "vehicle_listing_created_unknown";

  const createListing = useCallback(async () => {
    if (!sessionId) {
      setError("Missing session id.");
      setCreating(false);
      return;
    }

    if (localStorage.getItem(CREATED_FLAG_KEY) === "true") {
      setCreated(true);
      setCreating(false);
      return;
    }

    const raw = localStorage.getItem("pendingVehicleData");
    if (!raw) {
      setError("No pending vehicle data found.");
      setCreating(false);
      return;
    }

    let vehicleData;
    try {
      vehicleData = JSON.parse(raw);
    } catch {
      setError("Corrupted vehicle data.");
      setCreating(false);
      return;
    }

    vehicleData.checkoutSessionId = sessionId;
    vehicleData.paymentStatus = "completed";

    try {
      await listVehicleAPI.createListing(vehicleData);
      localStorage.setItem(CREATED_FLAG_KEY, "true");
      localStorage.removeItem("pendingVehicleData");
      localStorage.removeItem("pendingVehicleData_created");
      // toast.success("Vehicle listed successfully!");
      setCreated(true);
    } catch (e) {
      console.error("Listing creation failed:", e);
      const msg = e?.message || "Failed to create listing.";
      setError(msg);
      // toast.error(msg);
    } finally {
      setCreating(false);
    }
  }, [sessionId, CREATED_FLAG_KEY]);

  useEffect(() => {
    createListing();
  }, [createListing]);

  useEffect(() => {
    if (!created) return;
    if (countdown <= 0) {
      navigate("/marketplace/my-ads");
      return;
    }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [created, countdown, navigate]);

  const retry = () => {
    setError(null);
    setCreating(true);
    createListing();
  };

  const goMyAds = () => navigate("/marketplace/my-ads");
  const listAnother = () => navigate("/marketplace/sell-vehicle");

  return (
    <div className="tw:min-h-screen tw:bg-gradient-to-br tw:from-slate-50 tw:via-blue-50 tw:to-indigo-50 tw:flex tw:items-center tw:justify-center tw:px-4 tw:py-8">
      <div className="tw:relative tw:max-w-md tw:w-full">
        <div className="tw:bg-white/80 tw:backdrop-blur-xl tw:rounded-3xl tw:shadow-2xl tw:border tw:border-white/50 tw:p-8 tw:text-center">
          {creating && !error && !created && (
            <div className="tw:space-y-6">
              <div className="tw:relative">
                <div className="tw:w-16 tw:h-16 tw:border-4 tw:border-blue-100 tw:border-t-blue-500 tw:rounded-full tw:animate-spin tw:mx-auto"></div>
                <div className="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center">
                  <div className="tw:w-8 tw:h-8 tw:bg-gradient-to-br tw:from-blue-400 tw:to-blue-600 tw:rounded-full tw:animate-pulse"></div>
                </div>
              </div>
              <h2 className="tw:text-xl tw:font-semibold tw:text-gray-800">Creating your listing...</h2>
              <p className="tw:text-gray-600">Please wait a moment.</p>
            </div>
          )}

          {!creating && created && !error && (
            <div className="tw:space-y-6 animate-fade-in">
              <div className="tw:flex tw:justify-center tw:mb-6">
                <div className="tw:relative">
                  <div className="tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-emerald-400 tw:to-green-500 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shadow-lg">
                    <svg className="tw:w-10 tw:h-10 tw:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="tw:absolute tw:-inset-2 tw:bg-emerald-400 tw:rounded-full tw:opacity-20 tw:animate-ping"></div>
                </div>
              </div>
              <h1 className="tw:text-3xl tw:font-bold tw:bg-gradient-to-r tw:from-emerald-600 tw:to-green-600 tw:bg-clip-text tw:text-transparent">
                Listing Created!
              </h1>
              <p className="tw:text-gray-600 tw:text-lg">Redirecting in {countdown}s...</p>
              <div className="tw:space-y-3">
                <button
                  onClick={goMyAds}
                  className="tw:w-full tw:bg-gradient-to-r tw:from-emerald-500 tw:to-green-600 tw:text-white tw:font-semibold tw:py-3 tw:px-6 tw:rounded-xl"
                >
                  View My Ads
                </button>
                <button
                  onClick={listAnother}
                  className="tw:w-full tw:bg-white tw:text-gray-700 tw:font-semibold tw:py-3 tw:px-6 tw:rounded-xl tw:border-2 tw:border-gray-200"
                >
                  List Another Vehicle
                </button>
              </div>
              {sessionId && (
                <p className="tw:text-xs tw:text-gray-400 tw:font-mono tw:bg-gray-50 tw:px-3 tw:py-2 tw:rounded-lg">
                  Session: {sessionId}
                </p>
              )}
            </div>
          )}

          {!creating && error && !created && (
            <div className="tw:space-y-6">
              <div className="tw:w-16 tw:h-16 tw:bg-red-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mx-auto">
                <svg className="tw:w-8 tw:h-8 tw:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="tw:text-xl tw:font-semibold tw:text-gray-800">Creation Failed</h2>
              <p className="tw:text-gray-600">{error}</p>
              <button
                onClick={retry}
                className="tw:w-full tw:bg-red-500 tw:text-white tw:font-semibold tw:py-3 tw:px-6 tw:rounded-xl"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.6s ease-in-out; }
        @keyframes fadeIn {
          from { opacity:0; transform: translateY(10px); }
          to { opacity:1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessPage;