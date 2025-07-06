import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Car, FileText, Shield, MapPin, Wrench, LeafyGreen, Siren, Notebook } from 'lucide-react';

const VehicleHistory = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const vehicleData = {
    info: {
      yom: "2016",
      manufacturer: "Honda",
      model: "Civic",
      fuel: "Petrol",
      engineCapacity: "1500 CC",
      transmission: "Automatic",
      color: "Pearl White",
      registrationPlate: "CAC-1234",
      countryOfOrigin: "Japan",
      lastReportedOdometer: "54,129 KM"
    },
    summary: {
      accidentDamage: { found: true, count: 2 },
      lastRegistered: { location: "Ontario", status: "Normal" },
      serviceRecords: { found: true, count: 6 },
      openRecall: { found: true, count: 1 },
      stolen: { found: false },
      emissionTests: { found: true, count: 2 }
    },
    accidents: [
      {
        date: "2017 Apr 24",
        location: "Ontario, Canada",
        type: "Police Reported Accident",
        description: "Accident reported: minor damage. Involving right front impact with another motor vehicle",
        amount: null
      },
      {
        date: "2017 Apr 25",
        location: "Pickering, Ontario, Canada",
        estimate: "Right Front Corner",
        estimateDate: "2017 May 3",
        estimateAmount: "$1,699.43",
        claim: "Collision",
        claimAmount: "$2,079.00"
      },
      {
        date: "2017 Dec 1",
        location: "Pickering, Ontario, Canada",
        type: "Police Reported Accident",
        description: "Accident reported: minor damage. Vehicle involved in a sideswipe collision. Involving left front impact with another motor vehicle",
        estimate: "Left Front Side",
        estimateDate: "1 Dec 2017",
        estimateAmount: "$4,592.84",
        claim: "Collision",
        claimAmount: "$5,324.00"
      }
    ],
    serviceRecords: [
      {
        date: "2016 Aug 18",
        odometer: null,
        source: "Service Facility - Pickering, Ontario, Canada",
        details: "Pre-delivery inspection completed, Recommended maintenance performed"
      },
      {
        date: "2016 Aug 30",
        odometer: null,
        source: "Service Facility - Pickering, Ontario, Canada",
        details: "Vehicle washed/detailed"
      },
      {
        date: "2017 Sep 27",
        odometer: "16,995 KM",
        source: "Service Facility - Pickering, Ontario, Canada",
        details: "Transmission checked, Computer(s) checked"
      },
      {
        date: "2017 Oct 12",
        odometer: "18,252 KM",
        source: "Service Facility - Pickering, Ontario, Canada",
        details: "Wipers/washers checked"
      },
      {
        date: "2019 Jul 29",
        odometer: "50,329 KM",
        source: "Service Facility - Pickering, Ontario, Canada",
        details: "Two wheel alignment performed"
      },
      {
        date: "2019 Oct 12",
        odometer: "54,129 KM",
        source: "Service Facility - Pickering, Ontario, Canada",
        details: "Electrical system checked"
      }
    ],
    emissionTests: [
      {
        date: "2018 Jun 15",
        certificateNo: "CL23-1702073",
        testType: "Initial",
        result: "Pass",
        validTill: "2019 Jun 14"
      },
      {
        date: "2019 Jun 10",
        certificateNo: "CL23-1903054",
        testType: "Renewal",
        result: "Pass",
        validTill: "2020 Jun 9"
      }
    ]
  };

  const SummaryCard = ({ icon: Icon, title, subtitle, isAlert = false }) => (
    <div className="tw:group">
      <div className={`tw:relative tw:bg-white tw:rounded-2xl tw:p-4 tw:shadow-lg tw:border-2 tw:overflow-hidden tw:transition-all tw:duration-500 tw:group-hover:tw:shadow-xl tw:group-hover:-tw:translate-y-1 ${
        isAlert ? 'tw:border-red-200 tw:hover:tw:border-red-300' : 'tw:border-blue-100 tw:hover:tw:border-blue-300'
      }`}>
        <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-transparent tw:to-blue-50 tw:opacity-0 tw:group-hover:tw:opacity-100 tw:transition-opacity tw:duration-500" />
        <div className="tw:relative tw:flex tw:flex-col tw:items-center tw:text-center tw:space-y-2">
          <div className={`tw:w-12 tw:h-12 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-105 ${
            isAlert ? 'tw:bg-red-100 tw:text-red-600' : 'tw:bg-blue-100 tw:text-blue-600'
          }`}>
            <Icon className="tw:w-6 tw:h-6" />
          </div>
          <div>
            <h3 className="tw:font-semibold tw:text-gray-800 tw:text-sm tw:tracking-tight">{title}</h3>
            <p className="tw:text-gray-600 tw:text-xs tw:leading-relaxed">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="tw:min-h-screen tw:bg-gradient-to-b tw:from-gray-100 tw:via-blue-50 tw:to-indigo-50">
      {/* Header */}
      <div className="tw:bg-white tw:shadow-lg tw:border-b tw:border-gray-100 tw:sticky tw:top-0 tw:z-10">
        <div className="tw:max-w-7xl tw:mx-auto tw:px-6 tw:py-6">
          <div className="tw:flex tw:items-center tw:gap-3">
            <Notebook className="tw:w-8 tw:h-8 tw:text-blue-600" />
            <h1 className="tw:text-3xl tw:font-extrabold tw:text-gray-900 tw:tracking-tight">Vehicle History Report</h1>
          </div>
        </div>
      </div>

      <div className="tw:max-w-7xl tw:mx-auto tw:px-6 tw:py-12">
        {/* Vehicle Information */}
        <div className="tw:bg-white tw:rounded-3xl tw:p-8 tw:shadow-2xl tw:border tw:border-gray-100 tw:mb-12 tw:relative tw:overflow-hidden tw:group">
          <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-blue-50 tw:to-transparent tw:opacity-0 tw:group-hover:tw:opacity-100 tw:transition-opacity tw:duration-700" />
          <div className="tw:relative">
            <div className="tw:flex tw:items-center tw:mb-8">
              <Car className="tw:w-10 tw:h-10 tw:text-blue-600 tw:mr-4 tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-110" />
              <h2 className="tw:text-3xl tw:font-bold tw:text-gray-900 tw:tracking-tight">Vehicle Information</h2>
            </div>
            
            <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-8">
              <div className="tw:space-y-6">
                <div>
                  <p className="tw:text-sm tw:text-gray-500 tw:mb-2 tw:font-medium">Year | Manufacturer | Model | Fuel Type | Capacity</p>
                  <p className="tw:text-xl tw:font-semibold tw:text-gray-900">
                    {vehicleData.info.yom} {vehicleData.info.manufacturer} {vehicleData.info.model} {vehicleData.info.fuel} {vehicleData.info.engineCapacity}
                  </p>
                </div>
                <div>
                  <p className="tw:text-sm tw:text-gray-500 tw:mb-2 tw:font-medium">Color</p>
                  <p className="tw:text-xl tw:font-semibold tw:text-gray-900">{vehicleData.info.color}</p>
                </div>
                <div>
                  <p className="tw:text-sm tw:text-gray-500 tw:mb-2 tw:font-medium">Registration Plate</p>
                  <p className="tw:text-xl tw:font-semibold tw:text-gray-900">{vehicleData.info.registrationPlate}</p>
                </div>
              </div>
              
              <div className="tw:space-y-6">
                <div>
                  <p className="tw:text-sm tw:text-gray-500 tw:mb-2 tw:font-medium">Country of Origin</p>
                  <p className="tw:text-xl tw:font-semibold tw:text-gray-900">{vehicleData.info.countryOfOrigin}</p>
                </div>
                <div>
                  <p className="tw:text-sm tw:text-gray-500 tw:mb-2 tw:font-medium">Last Reported Odometer</p>
                  <p className="tw:text-xl tw:font-semibold tw:text-gray-900">{vehicleData.info.lastReportedOdometer}</p>
                </div>
              </div>
              
              <div className="tw:flex tw:items-center tw:justify-center tw:p-6 tw:bg-gradient-to-br tw:from-gray-50 tw:to-blue-50 tw:rounded-2xl tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-105">
                <Car className="tw:w-16 tw:h-16 tw:text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <h2 className="tw:text-3xl tw:font-bold tw:text-gray-900 tw:mb-8 tw:tracking-tight">Summary</h2>
        <div className="tw:flex tw:flex-row tw:gap-4 tw:mb-16 tw:flex-wrap">
          <SummaryCard 
            icon={AlertTriangle}
            title="Accident/Damage Records Found"
            subtitle="2 incidents reported"
            isAlert={true}
          />
          <SummaryCard 
            icon={MapPin}
            title="Last Registered In:"
            subtitle="Southern Province (Normal)"
          />
          <SummaryCard 
            icon={FileText}
            title="6 Service Records Found"
            subtitle="Regular maintenance history"
          />
          <SummaryCard 
            icon={AlertTriangle}
            title="1 Open Recall Found"
            subtitle="Manufacturer recall pending"
            isAlert={true}
          />
          <SummaryCard 
            icon={Siren}
            title="Not Actively Declared Stolen"
            subtitle="Clean theft record"
          />
          <SummaryCard 
            icon={LeafyGreen}
            title="Emission Test Passed"
            subtitle="2 tests passed"
          />
          <SummaryCard 
            icon={Shield}
            title="Insurance Coverage"
            subtitle="Insurance coverage is active and valid"
          />
        </div>        

        {/* Stolen Vehicle Check */}
        <div id="stolen-check" data-section className="tw:bg-white tw:rounded-3xl tw:p-8 tw:shadow-2xl tw:border tw:border-gray-100 tw:mb-12 tw:relative tw:overflow-hidden tw:group">
          <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-green-50 tw:to-transparent tw:opacity-0 tw:group-hover:tw:opacity-100 tw:transition-opacity tw:duration-700" />
          <div className="tw:relative">
            <div className="tw:flex tw:items-center tw:mb-6">
              <Siren className="tw:w-10 tw:h-10 tw:text-blue-600 tw:mr-4 tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-110" />
              <h2 className="tw:text-3xl tw:font-bold tw:text-gray-900 tw:tracking-tight">Stolen Vehicle Check</h2>
            </div>
            
            <div className="tw:bg-green-100 tw:border tw:border-green-200 tw:rounded-xl tw:p-6 tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-[1.02]">
              <div className="tw:flex tw:items-center">
                <CheckCircle className="tw:w-6 tw:h-6 tw:text-green-600 tw:mr-3" />
                <p className="tw:text-green-800 tw:font-semibold tw:text-lg">This vehicle is not actively declared stolen.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration */}
        <div id="registration" data-section className="tw:bg-white tw:rounded-3xl tw:p-8 tw:shadow-2xl tw:border tw:border-gray-100 tw:mb-12 tw:relative tw:overflow-hidden tw:group">
          <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-blue-50 tw:to-transparent tw:opacity-0 tw:group-hover:tw:opacity-100 tw:transition-opacity tw:duration-700" />
          <div className="tw:relative">
            <div className="tw:flex tw:items-center tw:mb-6">
              <MapPin className="tw:w-10 tw:h-10 tw:text-blue-600 tw:mr-4 tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-110" />
              <h2 className="tw:text-3xl tw:font-bold tw:text-gray-900 tw:tracking-tight">Registration</h2>
            </div>
            
            <div className="tw:bg-green-100 tw:border tw:border-green-200 tw:rounded-xl tw:p-6 tw:mb-6 tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-[1.02]">
              <div className="tw:flex tw:items-center">
                <CheckCircle className="tw:w-6 tw:h-6 tw:text-green-600 tw:mr-3" />
                <p className="tw:text-green-800 tw:font-semibold tw:text-lg">
                  This vehicle has been registered in <strong>Southern</strong> province of <strong>Sri Lanka</strong> with <strong>Normal</strong> branding.
                </p>
              </div>
            </div>
            
            <p className="tw:text-sm tw:text-gray-600 tw:font-medium">
              <strong>We checked for:</strong> Inspection Required, Normal, Non-repairable, Rebuilt, Salvage and Stolen.
            </p>
          </div>
        </div>

        {/* Insurance */}
        <div id="insurance" data-section className="tw:bg-white tw:rounded-3xl tw:p-8 tw:shadow-2xl tw:border tw:border-gray-100 tw:mb-12 tw:relative tw:overflow-hidden tw:group">
          <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-blue-50 tw:to-transparent tw:opacity-0 tw:group-hover:tw:opacity-100 tw:transition-opacity tw:duration-700" />
          <div className="tw:relative">
            <div className="tw:flex tw:items-center tw:mb-6">
              <Shield className="tw:w-10 tw:h-10 tw:text-blue-600 tw:mr-4 tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-110" />
              <h2 className="tw:text-3xl tw:font-bold tw:text-gray-900 tw:tracking-tight">Insurance</h2>
            </div>
            
            <div className="tw:bg-green-100 tw:border tw:border-green-200 tw:rounded-xl tw:p-6 tw:mb-6 tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-[1.02]">
              <div className="tw:flex tw:items-center">
                <CheckCircle className="tw:w-6 tw:h-6 tw:text-green-600 tw:mr-3" />
                <p className="tw:text-green-800 tw:font-semibold tw:text-lg">
                  This vehicle has a valid <strong>full</strong> insurance coverage until <strong>2025-12-31</strong> with <strong>ABC Insurance</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Records */}
        <div id="service-records" data-section className="tw:bg-white tw:rounded-3xl tw:p-8 tw:shadow-2xl tw:border tw:border-gray-100 tw:mb-12 tw:relative tw:overflow-hidden tw:group">
          <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-blue-50 tw:to-transparent tw:opacity-0 tw:group-hover:tw:opacity-100 tw:transition-opacity tw:duration-700" />
          <div className="tw:relative">
            <div className="tw:flex tw:items-center tw:mb-6">
              <Wrench className="tw:w-10 tw:h-10 tw:text-blue-600 tw:mr-4 tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-110" />
              <h2 className="tw:text-3xl tw:font-bold tw:text-gray-900 tw:tracking-tight">Service Records</h2>
            </div>
            
            <div className="tw:overflow-x-auto">
              <table className="tw:w-full">
                <thead>
                  <tr className="tw:border-b tw:border-gray-200 tw:bg-gray-50">
                    <th className="tw:text-left tw:py-4 tw:px-6 tw:font-semibold tw:text-gray-700 tw:text-sm">Date</th>
                    <th className="tw:text-left tw:py-4 tw:px-6 tw:font-semibold tw:text-gray-700 tw:text-sm">Odometer</th>
                    <th className="tw:text-left tw:py-4 tw:px-6 tw:font-semibold tw:text-gray-700 tw:text-sm">Source</th>
                    <th className="tw:text-left tw:py-4 tw:px-6 tw:font-semibold tw:text-gray-700 tw:text-sm">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleData.serviceRecords.map((record, index) => (
                    <tr key={index} className="tw:border-b tw:border-gray-100 tw:hover:tw:bg-blue-50 tw:transition-colors tw:duration-300">
                      <td className="tw:py-4 tw:px-6 tw:font-medium tw:text-gray-900">{record.date}</td>
                      <td className="tw:py-4 tw:px-6 tw:text-gray-600">{record.odometer || '-'}</td>
                      <td className="tw:py-4 tw:px-6 tw:text-gray-600">{record.source}</td>
                      <td className="tw:py-4 tw:px-6">
                        <div className="tw:bg-blue-100 tw:px-4 tw:py-2 tw:rounded-full tw:text-sm tw:font-semibold tw:text-blue-800 tw:inline-block tw:mb-2">
                          Vehicle serviced
                        </div>
                        <ul className="tw:mt-2 tw:text-sm tw:text-gray-600 tw:space-y-2">
                          {record.details.split(', ').map((detail, i) => (
                            <li key={i} className="tw:flex tw:items-center">
                              <div className="tw:w-2 tw:h-2 tw:bg-blue-400 tw:rounded-full tw:mr-3"></div>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Emission Test Records */}
        <div id="emission-tests" data-section className="tw:bg-white tw:rounded-3xl tw:p-8 tw:shadow-2xl tw:border tw:border-gray-100 tw:mb-12 tw:relative tw:overflow-hidden tw:group">
          <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-green-50 tw:to-transparent tw:opacity-0 tw:group-hover:tw:opacity-100 tw:transition-opacity tw:duration-700" />
          <div className="tw:relative">
            <div className="tw:flex tw:items-center tw:mb-6">
              <LeafyGreen className="tw:w-10 tw:h-10 tw:text-blue-600 tw:mr-4 tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-110" />
              <h2 className="tw:text-3xl tw:font-bold tw:text-gray-900 tw:tracking-tight">Emission Test Records</h2>
            </div>
            
            <div className="tw:overflow-x-auto">
              <table className="tw:w-full">
                <thead>
                  <tr className="tw:border-b tw:border-gray-200 tw:bg-gray-50">
                    <th className="tw:text-left tw:py-4 tw:px-6 tw:font-semibold tw:text-gray-700 tw:text-sm">Date</th>
                    <th className="tw:text-left tw:py-4 tw:px-6 tw:font-semibold tw:text-gray-700 tw:text-sm">Certificate No</th>
                    <th className="tw:text-left tw:py-4 tw:px-6 tw:font-semibold tw:text-gray-700 tw:text-sm">Test Type</th>
                    <th className="tw:text-left tw:py-4 tw:px-6 tw:font-semibold tw:text-gray-700 tw:text-sm">Result</th>
                    <th className="tw:text-left tw:py-4 tw:px-6 tw:font-semibold tw:text-gray-700 tw:text-sm">Valid Till</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleData.emissionTests.map((test, index) => (
                    <tr key={index} className="tw:border-b tw:border-gray-100 tw:hover:tw:bg-blue-50 tw:transition-colors tw:duration-300">
                      <td className="tw:py-4 tw:px-6 tw:font-medium tw:text-gray-900">{test.date}</td>
                      <td className="tw:py-4 tw:px-6 tw:text-gray-600">{test.certificateNo}</td>
                      <td className="tw:py-4 tw:px-6 tw:text-gray-600">{test.testType}</td>
                      <td className={`tw:py-4 tw:px-6 tw:font-semibold ${test.result === 'Pass' ? 'tw:text-green-600' : 'tw:text-red-600'}`}>
                        {test.result}
                      </td>
                      <td className="tw:py-4 tw:px-6 tw:text-gray-600">{test.validTill}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Accident/Damage */}
        <div id="accident-damage" data-section className="tw:bg-white tw:rounded-3xl tw:p-8 tw:shadow-2xl tw:border tw:border-gray-100 tw:mb-12 tw:relative tw:overflow-hidden tw:group">
          <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-r tw:from-red-50 tw:to-transparent tw:opacity-0 tw:group-hover:tw:opacity-100 tw:transition-opacity tw:duration-700" />
          <div className="tw:relative">
            <div className="tw:flex tw:items-center tw:mb-6">
              <AlertTriangle className="tw:w-10 tw:h-10 tw:text-red-600 tw:mr-4 tw:transition-transform tw:duration-500 tw:group-hover:tw:scale-110" />
              <h2 className="tw:text-3xl tw:font-bold tw:text-gray-900 tw:tracking-tight">Accident/Damage</h2>
            </div>
            
            <div className="tw:space-y-8">
              {vehicleData.accidents.map((accident, index) => (
                <div key={index} className="tw:border tw:border-red-200 tw:rounded-xl tw:p-6 tw:bg-red-50 tw:transition-transform tw:duration-500 tw:hover:tw:scale-[1.02]">
                  <div className="tw:flex tw:items-start tw:justify-between tw:mb-4">
                    <div className="tw:flex tw:items-center">
                      <AlertTriangle className="tw:w-6 tw:h-6 tw:text-red-600 tw:mr-3" />
                      <div>
                        <h3 className="tw:font-semibold tw:text-red-900 tw:text-lg">{accident.date}</h3>
                        <p className="tw:text-red-700 tw:text-sm">{accident.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  {accident.type && (
                    <div className="tw:mb-4">
                      <p className="tw:font-semibold tw:text-red-900">{accident.type}:</p>
                      <p className="tw:text-red-800 tw:text-sm tw:mt-2">{accident.description}</p>
                    </div>
                  )}
                  
                  {accident.estimate && (
                    <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6 tw:mt-4">
                      <div>
                        <p className="tw:font-semibold tw:text-red-900">Estimate:</p>
                        <p className="tw:text-red-800 tw:text-sm">{accident.estimate} | Estimate Date: {accident.estimateDate}</p>
                        {accident.estimateAmount && (
                          <p className="tw:font-bold tw:text-red-900 tw:text-right tw:text-lg">{accident.estimateAmount}</p>
                        )}
                      </div>
                      <div>
                        <p className="tw:font-semibold tw:text-red-900">Claim:</p>
                        <p className="tw:text-red-800 tw:text-sm">{accident.claim}</p>
                        {accident.claimAmount && (
                          <p className="tw:font-bold tw:text-red-900 tw:text-right tw:text-lg">{accident.claimAmount}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleHistory;