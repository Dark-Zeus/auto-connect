import SellVehicleForm from "@components/SellVehicleForm";

const SellVehiclePage = () => {
  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8 tw:px-4 tw:overflow-auto">
      <div className="tw:w-full sm:tw:w-11/12 md:tw:w-4/5 lg:tw:w-[70%] tw:mx-auto">
        <SellVehicleForm />
      </div>
    </div>
  );
};

export default SellVehiclePage;