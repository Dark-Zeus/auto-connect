import VehicleHistory from "@components/CarBuyer/VehicleHistory";
import MarketplaceNavigation from "@components/CarSeller/MarketplaceNavigation";
import React from "react";

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

const VehicleHistoryPage = () => {
  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8 tw:px-4 tw:overflow-auto">
        <MarketplaceNavigation />
            <div className="tw:w-9/10 tw:flex tw:flex-col tw:items-center tw:mx-auto">
                <VehicleHistory/>
            </div>
    </div>
  );
};

export default VehicleHistoryPage;