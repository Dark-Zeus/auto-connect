import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

const SecurityTips = () => {
  return (
    <div className="tw:w-full tw:max-w-4xl tw:mx-auto tw:p-4">
      <div className="tw:relative tw:rounded-2xl tw:overflow-hidden tw:shadow-2xl tw:bg-gradient-to-br tw:from-blue-600 tw:to-purple-600">
        
        {/* Decorative background elements */}
        <div className="tw:absolute tw:inset-0 tw:opacity-10">
          <div className="tw:absolute tw:top-0 tw:left-0 tw:w-20 tw:h-20 tw:bg-white tw:rounded-full tw:-translate-y-10 tw:-translate-x-10"></div>
          <div className="tw:absolute tw:bottom-0 tw:right-0 tw:w-16 tw:h-16 tw:bg-white tw:rounded-full tw:translate-y-8 tw:translate-x-8"></div>
          <div className="tw:absolute tw:top-1/3 tw:right-1/4 tw:w-2 tw:h-2 tw:bg-white tw:rounded-full tw:opacity-40"></div>
          <div className="tw:absolute tw:bottom-1/3 tw:left-1/4 tw:w-1 tw:h-1 tw:bg-white tw:rounded-full tw:opacity-50"></div>
        </div>

        <div className="tw:relative tw:z-10 tw:p-6">
          {/* Header */}
          <div className="tw:flex tw:items-center tw:gap-3 tw:mb-6">
            <div className="tw:p-3 tw:bg-white tw:bg-opacity-20 tw:rounded-xl tw:backdrop-blur-sm tw:border tw:border-white tw:border-opacity-20">
              <Shield className="tw:text-red-600 tw:w-6 tw:h-6" />
            </div>
            <h2 className="tw:text-white tw:text-2xl tw:font-bold tw:tracking-wide tw:drop-shadow-sm">
              Security Tips
            </h2>
            <div className="tw:ml-auto tw:p-2 tw:bg-white tw:bg-opacity-20 tw:rounded-lg tw:backdrop-blur-sm">
              <AlertTriangle className="tw:text-red-600 tw:w-5 tw:h-5" />
            </div>
          </div>

          {/* Glass-like container with the security message */}
          <div className="tw:bg-white tw:bg-opacity-10 tw:backdrop-blur-md tw:rounded-2xl tw:p-6 tw:shadow-lg tw:border tw:border-white tw:border-opacity-20">
            <div className="tw:text-white tw:leading-relaxed tw:text-base">
              <p className="tw:mb-4">
                <span className="tw:font-bold tw:text-black">Do not make any payments to advertiser before inspecting the vehicle. AutoConnect.lk shall not be held responsible for any transaction or agreement reached between the advertiser and you.</span>
              </p>
            </div>

            {/* Additional visual elements */}
            <div className="tw:mt-4 tw:flex tw:items-center tw:gap-2">
              <div className="tw:flex-1 tw:h-px tw:bg-gradient-to-r tw:from-transparent tw:via-white tw:to-transparent tw:opacity-30"></div>
              <div className="tw:w-2 tw:h-2 tw:bg-white tw:rounded-full tw:opacity-40"></div>
              <div className="tw:flex-1 tw:h-px tw:bg-gradient-to-r tw:from-transparent tw:via-white tw:to-transparent tw:opacity-30"></div>
            </div>

            {/* Bottom accent */}
            <div className="tw:mt-4 tw:flex tw:justify-center">
              <div className="tw:bg-white tw:bg-opacity-20 tw:backdrop-blur-sm tw:rounded-full tw:px-4 tw:py-1 tw:border tw:border-white tw:border-opacity-20">
                <span className="tw:text-white tw:text-xs tw:font-medium tw:tracking-wide">
                  STAY SAFE
                </span>
              </div>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div className="tw:mt-4 tw:h-px tw:bg-gradient-to-r tw:from-transparent tw:via-white tw:to-transparent tw:opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTips;