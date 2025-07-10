import React from 'react';
import LatestUpdatesTable from '@components/AdminComponents/UpdateTable';
const updates = [
    {
    serviceCenter: "CityFix Motors",
    date: "2025-07-09",
    time: "10:30 AM",
    district: "Colombo",
    vehicleNumber: "CAX-1234",
  },
  {
    serviceCenter: "AutoCare Lanka",
    date: "2025-07-08",
    time: "2:00 PM",
    district: "Gampaha",
    vehicleNumber: "BKC-4567",
  },
  {
    serviceCenter: "Speedy Repairs",
    date: "2025-07-07",
    time: "9:15 AM",
    district: "Kandy",
    vehicleNumber: "KDL-9876",
  },
  {
    serviceCenter: "Highway Auto",
    date: "2025-07-07",
    time: "11:45 AM",
    district: "Matara",
    vehicleNumber: "MAT-1122",
  },
  {
    serviceCenter: "DriveTech Garage",
    date: "2025-07-06",
    time: "1:30 PM",
    district: "Negombo",
    vehicleNumber: "NEG-5566",
  },
  {
    serviceCenter: "QuickFix Workshop",
    date: "2025-07-05",
    time: "4:20 PM",
    district: "Kurunegala",
    vehicleNumber: "KUR-0099",
  },
  {
    serviceCenter: "AutoXpress",
    date: "2025-07-05",
    time: "10:00 AM",
    district: "Galle",
    vehicleNumber: "GAL-2233",
  },
  {
    serviceCenter: "MotorMate",
    date: "2025-07-04",
    time: "3:10 PM",
    district: "Ratnapura",
    vehicleNumber: "RAT-3344",
  },
  {
    serviceCenter: "RoadStar Service",
    date: "2025-07-03",
    time: "12:00 PM",
    district: "Badulla",
    vehicleNumber: "BAD-7788",
  },
  {
    serviceCenter: "Elite AutoZone",
    date: "2025-07-02",
    time: "5:00 PM",
    district: "Anuradhapura",
    vehicleNumber: "ANU-8899",
  },
  // ...
      {
    serviceCenter: "CityFix Motors",
    date: "2025-07-09",
    time: "10:30 AM",
    district: "Colombo",
    vehicleNumber: "CAX-1234",
  },
  {
    serviceCenter: "AutoCare Lanka",
    date: "2025-07-08",
    time: "2:00 PM",
    district: "Gampaha",
    vehicleNumber: "BKC-4567",
  },
  {
    serviceCenter: "Speedy Repairs",
    date: "2025-07-07",
    time: "9:15 AM",
    district: "Kandy",
    vehicleNumber: "KDL-9876",
  },
  {
    serviceCenter: "Highway Auto",
    date: "2025-07-07",
    time: "11:45 AM",
    district: "Matara",
    vehicleNumber: "MAT-1122",
  },
  {
    serviceCenter: "DriveTech Garage",
    date: "2025-07-06",
    time: "1:30 PM",
    district: "Negombo",
    vehicleNumber: "NEG-5566",
  },
  {
    serviceCenter: "QuickFix Workshop",
    date: "2025-07-05",
    time: "4:20 PM",
    district: "Kurunegala",
    vehicleNumber: "KUR-0099",
  },
  {
    serviceCenter: "AutoXpress",
    date: "2025-07-05",
    time: "10:00 AM",
    district: "Galle",
    vehicleNumber: "GAL-2233",
  },
  {
    serviceCenter: "MotorMate",
    date: "2025-07-04",
    time: "3:10 PM",
    district: "Ratnapura",
    vehicleNumber: "RAT-3344",
  },
  {
    serviceCenter: "RoadStar Service",
    date: "2025-07-03",
    time: "12:00 PM",
    district: "Badulla",
    vehicleNumber: "BAD-7788",
  },
  {
    serviceCenter: "Elite AutoZone",
    date: "2025-07-02",
    time: "5:00 PM",
    district: "Anuradhapura",
    vehicleNumber: "ANU-8899",
  },
];
const Updates = () => {
  return (
    <LatestUpdatesTable latestUpdates={updates} />
  );
};

export default Updates;
