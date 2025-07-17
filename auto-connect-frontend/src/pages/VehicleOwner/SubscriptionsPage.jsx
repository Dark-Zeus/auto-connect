import SubscriptionPlans from "@components/CarSeller/SubscriptionPlans";
import MarketplaceNavigation from "@components/CarSeller/MarketplaceNavigation";
import React from "react";

const SubscriptionsPage = () => {
  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8 tw:px-4 tw:overflow-auto">
        {/* <MarketplaceNavigation /> */}
            <div className="tw:w-9/10 tw:flex tw:flex-col tw:items-center tw:mx-auto">
                <SubscriptionPlans />
            </div>
    </div>
  );
};

export default SubscriptionsPage;