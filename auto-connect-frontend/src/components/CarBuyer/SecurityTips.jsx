import React from 'react';
import { Shield } from 'lucide-react';

const SecurityTips = () => {
  return (
    <div className="tw:max-w-4xl tw:mx-auto tw:p-4">
      <div className="tw:bg-red-50 tw:border tw:border-red-200 tw:rounded-lg tw:overflow-hidden">
        {/* Header */}
        <div className="tw:p-6 tw:border-b tw:border-red-200 tw:bg-red-100">
          <div className="tw:flex tw:items-center tw:gap-3">
            <Shield className="tw:text-red-600 tw:w-5 tw:h-5" />
            <h2 className="tw:text-red-800 tw:text-lg tw:font-semibold">
              Security Tips
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="tw:p-6">
          <p className="tw:text-red-800 tw:leading-relaxed tw:text-base">
            <span className="tw:font-semibold">Do not make any payments to advertiser before inspecting the vehicle.</span> AutoConnect.lk shall not be held responsible for any transaction or agreement reached between the advertiser and you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityTips;