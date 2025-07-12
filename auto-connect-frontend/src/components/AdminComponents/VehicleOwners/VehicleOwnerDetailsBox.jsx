import React from "react";
import {
  ExpandMore,
  ExpandLess,
  DirectionsCar,
  Info,
  Person,
  Phone,
  Home,
  Badge,
} from "@mui/icons-material";

function VehicleOwnerCard({ owner, isExpanded, onToggle }) {
  return (
    <div className="tw:rounded-3xl tw:shadow-xl tw:bg-gradient-to-br tw:from-white tw:to-blue-50 tw:p-6 tw:border-l-8 tw:border-blue-500 hover:tw:shadow-xl hover:tw:scale-[1.03] tw-transition tw-duration-300 tw-ease-in-out tw-space-y-5 tw:cursor-pointer">
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
        <div className="tw:flex tw:items-center tw:space-x-4">
          <div className="tw:p-4 tw:bg-blue-200 tw:rounded-full tw:text-blue-700 tw:flex tw:items-center tw:justify-center tw:shadow-md">
            <Person style={{ fontSize: 32 }} />
          </div>
          <div>
            <h2 className="tw:text-2xl tw:font-extrabold tw:text-blue-900">
              {owner.name}
            </h2>
            <p className="tw:text-sm tw:text-blue-700 tw:font-medium">{owner.email}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
          className="tw:text-blue-600 tw:rounded-full hover:tw:bg-blue-100 tw:p-2 tw-shadow-md tw-transition tw-duration-200"
          onFocus={(e) => e.currentTarget.classList.add("tw-outline", "tw-outline-2", "tw-outline-blue-400")}
          onBlur={(e) => e.currentTarget.classList.remove("tw-outline", "tw-outline-2", "tw-outline-blue-400")}
        >
          {isExpanded ? <ExpandLess fontSize="large" /> : <ExpandMore fontSize="large" />}
        </button>
      </div>

      <div className="tw:grid tw:grid-cols-2 tw:gap-6 tw:text-blue-900 tw:font-semibold tw:tracking-wide">
        <InfoItem icon={<Phone className="tw:text-blue-400" />} label={owner.mobile} />
        <InfoItem icon={<Badge className="tw:text-blue-400" />} label={owner.nic} />
        <InfoItem icon={<Home className="tw:text-blue-400" />} label={owner.address} />
        <InfoItem
          icon={<DirectionsCar className="tw:text-blue-400" />}
          label={`${owner.vehicleName} – ${owner.vehicleModel}`}
        />
      </div>

      {isExpanded && (
        <div className="tw:mt-6 tw:border-t tw:border-blue-300 tw:pt-6 tw:grid tw:grid-cols-2 tw:gap-6 tw:text-blue-900 tw:font-semibold tw:text-sm">
          <InfoBlock label="Ongoing Leasing" value={owner.leasing} />
          <InfoBlock label="Manufacturer" value={owner.manufacturer} />
          <InfoBlock label="Model" value={owner.vehicleModel} />
          <InfoBlock label="Model Year" value={owner.modelYear} />
          <InfoBlock label="Registered Year" value={owner.registeredYear} />
          <InfoBlock label="Condition" value={owner.condition} />
          <InfoBlock label="Transmission" value={owner.transmission} />
          <InfoBlock label="Fuel Type" value={owner.fuelType} />
          <InfoBlock label="Engine Capacity" value={`${owner.engineCapacity} cc`} />
          <InfoBlock label="Mileage" value={`${owner.mileage} km`} />
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon, label }) {
  return (
    <div className="tw:flex tw:items-center tw:space-x-3 tw:text-base tw:font-semibold">
      <div className="tw:bg-blue-100 tw:p-2 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:text-blue-500">
        {icon}
      </div>
      <span>{label}</span>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="tw:bg-blue-100 tw:rounded-lg tw:p-4 tw:shadow-inner tw:shadow-blue-200 tw:flex tw:flex-col tw:gap-1">
      <p className="tw:text-xs tw:font-semibold tw:text-blue-700 tw:uppercase">{label}</p>
      <p className="tw:text-sm tw:font-bold tw:text-blue-900">{value}</p>
    </div>
  );
}

export default VehicleOwnerCard;
