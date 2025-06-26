import React from 'react';
import SellVehicleForm from '../components/SellVehicleForm';

const SellVehiclePage = () => {
  return (
    <div className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8">
      <div className="tw:w-11/12 md:tw:w-7/12 lg:tw:w-7/12">
        <SellVehicleForm />
      </div>
    </div>
  );
};

export default SellVehiclePage;
// This page serves as a container for the SellVehicleForm component, providing a styled layout for the form.
// It uses Tailwind CSS for styling and ensures the form is centered on the page with a responsive design.