import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { createPromotionCheckoutSession } from "../../services/adPromotionApiService";
import bumpUp from "../../assets/images/promotions/bumpUp.png";

const VehicleAdPromotion = () => {
  const { id: vehicleId } = useParams();

  const { defaultDate, defaultTime } = useMemo(() => {
    const now = new Date();
    return {
      defaultDate: now.toISOString().split("T")[0],
      defaultTime: now.toTimeString().slice(0, 5),
    };
  }, []);

  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("7");
  const [selectedSchedule, setSelectedSchedule] = useState("boost-now");
  const [startDate, setStartDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState(defaultTime);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const promotionOptions = {
    "bump-up": {
      title: "Bump Up",
      description:
        "Get a fresh start every day and get up to 10 times more responses!",
      image: bumpUp,
      pricing: {
        "3": 3900,
        "7": 4800,
        "15": 5800,
      },
    },
  };

  const handleAddPromotion = (promotionType) => {
    setSelectedPromotion(promotionType);
    setShowModal(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleRemovePromotion = (index) => {
    setSelectedPromotions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    if (!selectedPromotion) return;

    if (!vehicleId) {
      setErrorMessage("Vehicle identifier is missing.");
      return;
    }

    const durationDays = Number.parseInt(selectedDuration, 10);
    if (!Number.isInteger(durationDays) || durationDays <= 0) {
      setErrorMessage("Select a valid duration.");
      return;
    }

    const payload = {
      remainingBumps: durationDays,
      intervalHours: 24,
    };

    if (selectedSchedule === "schedule") {
      const startDateTime = new Date(`${startDate}T${startTime}:00`);
      if (Number.isNaN(startDateTime.getTime())) {
        setErrorMessage("Invalid start date or time.");
        return;
      }
      payload.startAt = startDateTime.toISOString();
    }

    const price = promotionOptions[selectedPromotion].pricing[selectedDuration];

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Save pending promotion to be finalized on promotion success page
      const pending = {
        type: selectedPromotion,
        adId: vehicleId,
        payload,
        price,
      };
      localStorage.setItem("pendingPromotionData", JSON.stringify(pending));

      // Create Stripe checkout session via separate promotion payments API
      const { data } = await createPromotionCheckoutSession(
        price,
        promotionOptions[selectedPromotion].title || "Ad Bump Promotion",
        { adId: vehicleId, promoType: selectedPromotion, durationDays }
      );

      const sessionUrl = data?.sessionUrl;
      const sessionId = data?.sessionId;

      if (sessionUrl) {
        window.location.href = sessionUrl;
        return;
      }
      if (sessionId) {
        window.location.href = `/promotion-payment-success?session_id=${encodeURIComponent(sessionId)}`;
        return;
      }

      throw new Error("Failed to create payment session.");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to start payment. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const Modal = () => {
    if (!showModal || !selectedPromotion) return null;

    const promo = promotionOptions[selectedPromotion];
    const price = promo.pricing[selectedDuration];

    return (
      <div className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:z-50 tw:p-4">
        <div className="tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:max-w-md tw:w-full tw:max-h-[90vh] tw:overflow-y-auto">
          <div className="tw:p-6 tw:space-y-6">
            <div className="tw:flex tw:items-center tw:justify-between">
              <div className="tw:flex tw:items-center tw:gap-3">
                <div className="tw:w-10 tw:h-10 tw:bg-blue-100 tw:rounded-full tw:flex tw:items-center tw:justify-center">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="tw:w-6 tw:h-6 tw:object-contain"
                  />
                </div>
                <h3 className="tw:text-xl tw:font-bold tw:text-gray-800">
                  {promo.title}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="tw:text-gray-400 tw:hover:text-red-600 tw:transition-all tw:hover:cursor-pointer"
              >
                <X className="tw:w-5 tw:h-5" />
              </button>
            </div>

            <p className="tw:text-gray-600">{promo.description}</p>

            <div className="tw:bg-gray-50 tw:rounded-xl tw:p-4 tw:flex tw:items-center tw:justify-center">
              <img
                src={promo.image}
                alt={`${promo.title} preview`}
                className="tw:max-w-full tw:max-h-32 tw:object-contain"
              />
            </div>

            <div>
              <h4 className="tw:font-semibold tw:text-gray-800 tw:mb-3">
                Choose Duration
              </h4>
              <div className="tw:space-y-3">
                {["3", "7", "15"].map((days) => (
                  <label
                    key={days}
                    className="tw:flex tw:items-center tw:justify-between tw:p-3 tw:border tw:border-blue-200 tw:rounded-lg tw:cursor-pointer tw:hover:bg-blue-50 tw:transition-colors"
                  >
                    <div className="tw:flex tw:items-center tw:gap-3">
                      <input
                        type="radio"
                        name="duration"
                        value={days}
                        checked={selectedDuration === days}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="tw:w-4 tw:h-4 tw:text-blue-600"
                      />
                      <span className="tw:font-medium tw:text-gray-700">
                        {days} days
                      </span>
                    </div>
                    <span className="tw:font-bold tw:text-blue-600">
                      LKR {promo.pricing[days].toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="tw:font-semibold tw:text-gray-800 tw:mb-3">
                Schedule your ad boost
              </h4>
              <div className="tw:space-y-3">
                <label className="tw:flex tw:items-center tw:gap-3 tw:cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    value="boost-now"
                    checked={selectedSchedule === "boost-now"}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    className="tw:w-4 tw:h-4 tw:text-blue-600"
                  />
                  <span className="tw:font-medium tw:text-gray-700">
                    Boost now
                  </span>
                </label>

                {/*
                <label className="tw:flex tw:items-center tw:gap-3 tw:cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    value="schedule"
                    checked={selectedSchedule === "schedule"}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    className="tw:w-4 tw:h-4 tw:text-blue-600"
                  />
                  <span className="tw:font-medium tw:text-gray-700">
                    Schedule bump
                  </span>
                </label>
                */}
              </div>

              {selectedSchedule === "schedule" && (
                <div className="tw:mt-4 tw:space-y-4">
                  <div>
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleContinue}
              disabled={isSubmitting}
              className="tw:w-full tw:bg-blue-600 tw:text-white tw:py-3 tw:px-6 tw:rounded-lg tw:font-semibold tw:hover:bg-blue-700 tw:disabled:opacity-60 tw:transition-colors tw:hover:cursor-pointer"
            >
              {isSubmitting
                ? "Redirecting to payment..."
                : `Activate • LKR ${price.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tw:min-h-4xl tw:bg-gray-50 tw:rounded-xl">
      <div className="tw:max-w-4xl tw:mx-auto tw:p-6 tw:space-y-6">
        <div className="tw:flex tw:justify-center tw:items-center tw:py-8">
          <div className="tw:bg-gradient-to-br tw:from-blue-50 tw:to-blue-100 tw:rounded-2xl tw:shadow-lg tw:p-8 tw:flex tw:flex-col tw:items-center tw:max-w-xl tw:w-full">
            <div className="tw:flex tw:items-center tw:gap-3 tw:mb-4">
              {/* <span className="tw:inline-block tw:bg-yellow-400 tw:text-white tw:font-bold tw:px-3 tw:py-1 tw:rounded-full tw:text-xs tw:shadow">
                NEW
              </span> */}
              <span className="tw:text-blue-700 tw:font-semibold tw:text-2xl">
                Bump Up Promotion
              </span>
            </div>
            <img
              src={bumpUp}
              alt="Bump Up"
              className="tw:w-24 tw:h-24 tw:object-contain tw:mb-4 tw:drop-shadow"
            />
            <h1 className="tw:text-2xl md:tw:text-3xl tw:font-extrabold tw:text-gray-800 tw:mb-2 tw:text-center">
              Boost your ad to the top!
            </h1>
            <p className="tw:text-gray-600 tw:text-base md:tw:text-lg tw:mb-2 tw:text-center">
              Instantly get up to{" "}
              <span className="tw:font-bold tw:text-blue-600">10x</span> more
              responses by bumping your ad daily.
            </p>
            <p className="tw:text-gray-500 tw:text-sm tw:text-center">
              Your ad will appear at the top of search results every day for the
              duration you choose.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="tw:rounded-lg tw:bg-red-50 tw:border tw:border-red-200 tw:p-3 tw:text-sm tw:text-red-600">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="tw:rounded-lg tw:bg-green-50 tw:border tw:border-green-200 tw:p-3 tw:text-sm tw:text-green-600">
            {successMessage}
          </div>
        )}

        <div className="tw:grid tw:gap-4">
          {Object.entries(promotionOptions).map(([key, promo]) => {
            const isSelected = selectedPromotions.some((p) => p.type === key);

            return (
              <div
                key={key}
                className={`tw:bg-white tw:rounded-xl tw:p-6 tw:shadow-sm tw:border tw:transition-all ${
                  isSelected
                    ? "tw:border-blue-300 tw:bg-blue-50"
                    : "tw:border-gray-200 hover:tw:shadow-md"
                }`}
              >
                <div className="tw:flex tw:items-center tw:justify-between">
                  <div className="tw:flex tw:items-center tw:gap-4">
                    <div className="tw:w-12 tw:h-12 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:bg-gray-100 tw:overflow-hidden">
                      <img
                        src={promo.image}
                        alt={promo.title}
                        className="tw:w-8 tw:h-8 tw:object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="tw:text-xl tw:font-bold tw:text-gray-800">
                        {promo.title}
                      </h3>
                      <p className="tw:text-sm tw:text-gray-600">
                        {promo.description}
                      </p>
                    </div>
                  </div>
                  <div className="tw:flex tw:items-center tw:gap-4">
                    <div className="tw:text-right">
                      <div className="tw:text-sm tw:text-gray-500">From</div>
                      <div className="tw:text-lg tw:font-bold tw:text-gray-800">
                        LKR {promo.pricing["3"].toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddPromotion(key)}
                      className="tw:w-10 tw:h-10 tw:bg-blue-600 tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center tw:hover:bg-blue-700 tw:transition-all tw:hover:cursor-pointer"
                    >
                      <Plus className="tw:w-5 tw:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedPromotions.length > 0 && (
          <div className="tw:bg-white tw:rounded-xl tw:p-6 tw:shadow-sm tw:border">
            <h3 className="tw:text-lg tw:font-semibold tw:text-gray-800 tw:mb-4">
              Active Promotions
            </h3>
            <div className="tw:space-y-3">
              {selectedPromotions.map((promo, index) => (
                <div
                  key={`${promo.type}-${index}`}
                  className="tw:flex tw:items-center tw:justify-between tw:p-3 tw:bg-gray-50 tw:rounded-lg"
                >
                  <div className="tw:flex tw:items-center tw:gap-3">
                    <div className="tw:w-8 tw:h-8 tw:bg-gray-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:overflow-hidden">
                      <img
                        src={promotionOptions[promo.type].image}
                        alt={promotionOptions[promo.type].title}
                        className="tw:w-5 tw:h-5 tw:object-contain"
                      />
                    </div>
                    <div>
                      <div className="tw:font-medium tw:text-gray-800">
                        {promotionOptions[promo.type].title}
                      </div>
                      <div className="tw:text-sm tw:text-gray-600">
                        {promo.duration} days •{" "}
                        {promo.schedule === "boost-now"
                          ? "Boost now"
                          : "Scheduled"}
                      </div>
                    </div>
                  </div>
                  <div className="tw:flex tw:items-center tw:gap-3">
                    <span className="tw:font-bold tw:text-gray-800">
                      LKR {promo.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRemovePromotion(index)}
                      className="tw:text-red-400 tw:hover:text-red-600 tw:transition-colors"
                    >
                      <X className="tw:w-5 tw:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal />
    </div>
  );
};

export default VehicleAdPromotion;