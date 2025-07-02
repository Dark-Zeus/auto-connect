import ImageViewer from "@components/CarBuyer/ImageViewer";
import VehicleDetails from "@components/CarBuyer/VehicleDetails";
import SecurityTips from "@components/CarBuyer/SecurityTips";
import VehicleDescriptionBox from "@components/CarBuyer/VehicleDescriptionBox";
import VehicleHeader from "@components/CarBuyer/VehicleHeader";
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

const VehicleViewPage = () => {
  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8 tw:px-4 tw:overflow-auto">
        <div className="tw:w-full sm:tw:w-11/12 md:tw:w-4/5 lg:tw:w-[70%] tw:mx-auto tw:flex tw:flex-row">
            <div className="tw:w-full sm:tw:w-11/12 md:tw:w-4/5 lg:tw:w-[70%] tw:mx-auto tw:flex tw:flex-col">
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
                <SecurityTips />
            </div>
            <VehicleDetails />
        </div>
    </div>
  );
};

export default VehicleViewPage;