import React, { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";

export default function SubscriptionBox() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = () => {
    if (email.trim() !== "") {
      setSubmitted(true);
      // Handle actual subscription logic here (e.g., API call)
    }
  };

  return (
    <div className="tw:max-w-md tw:mx-auto tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-8 tw:border tw:border-blue-200">
      <h2 className="tw-text-2xl tw-font-bold tw-text-blue-800 tw-mb-4 text-center">
        Stay Updated!
      </h2>
      <p className="tw-text-blue-700 tw-text-sm tw-text-center tw-mb-6">
        Subscribe to get the latest updates, promotions, and service center news.
      </p>

      {!submitted ? (
        <div className="tw-space-y-4">
          <div className="tw-flex tw-items-center tw-border tw-border-blue-300 tw-rounded-lg tw-overflow-hidden">
            <div className="tw-bg-blue-100 tw-px-3">
              <EmailIcon className="tw-text-blue-600" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="tw-flex-1 tw-p-2 tw-outline-none"
            />
          </div>
          <button
            onClick={handleSubscribe}
            className="tw-w-full tw-bg-blue-600 tw-text-white tw-py-2 tw-rounded-lg hover:tw-bg-blue-700 tw-transition"
          >
            Subscribe
          </button>
        </div>
      ) : (
        <div className="tw-text-center tw-text-green-600 tw-font-semibold">
          ✅ Thank you for subscribing!
        </div>
      )}
    </div>
  );
}
