import ImageViewer from "@components/CarBuyer/ImageViewer";
import VehicleDetails from "@components/CarBuyer/VehicleDetails";
import SecurityTips from "@components/CarBuyer/SecurityTips";
import VehicleDescriptionBox from "@components/CarBuyer/VehicleDescriptionBox";
import VehicleHeader from "@components/CarBuyer/VehicleHeader";
import SimilarAds from "@components/CarBuyer/SimilarAds";
import MarketplaceNavigation from "@components/CarSeller/MarketplaceNavigation";
import React from "react";
import OwnershipHistoryCheck from "@components/CarBuyer/OwnershipHistoryCheck";
import OverlayWindow from "@components/OverlayWindow";

const vehicleData = {
  name: 'lomitha',
  mobile: '0767120123',
  district: 'Matara',
  city: 'Matara',
  email: 'lomitha@gmail.com',
  vehicleType: 'Suv',
  condition: 'Used',
  make: 'Toyota',
  model: 'Land Cruiser 150',
  year: '2015',
  registeredYear: '2015',
  price: '2565000',
  ongoingLease: false,
  transmission: 'Manual',
  fuelType: 'Petrol',
  engineCapacity: '1500',
  mileage: '272000',
  description: 'A well-maintained car with good fuel efficiency.',
  views: '2164',
  date: '2024-07-02',
};

const VehicleViewPage = () => {
  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8 tw:px-4 tw:overflow-auto">
        {/* <MarketplaceNavigation /> */}
        <div className="tw:w-4/5 sm:tw:w-11/12 md:tw:w-4/5 lg:tw:w-[70%] tw:mx-auto tw:flex tw:flex-row tw:gap-1 tw:items-start tw:bg-gray-50 tw:py-8 tw:rounded-xl">
            <div className="tw:w-2/3 tw:flex tw:flex-col">
                <VehicleHeader
                    make={vehicleData.make}
                    model={vehicleData.model}
                    year={vehicleData.year}
                    name={vehicleData.name}
                    date={vehicleData.date}
                    district={vehicleData.district}
                    city={vehicleData.city}
                />
                <ImageViewer />
                <VehicleDescriptionBox /> 
                <OwnershipHistoryCheck /> 
                <SecurityTips />
            </div>
            <div className="tw:w-1/3 tw:flex tw:flex-col">
            <VehicleDetails />
            </div>
        </div>
        <div className="tw:w-4/5 sm:tw:w-11/12 md:tw:w-4/5 lg:tw:w-[70%] tw:mx-auto tw:mt-8  tw:bg-gray-50 tw:rounded-xl">
          <SimilarAds />
        </div>
    </div>
  );
};

export default VehicleViewPage;