import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Car, FileText, Shield, MapPin, Wrench, ArrowRight, Star } from 'lucide-react';
import elephantImage from '../../assets/images/AutoConnectMascot.png';

const VehicleHistoryPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="tw:min-h-screen tw:bg-gradient-to-br tw:from-gray-50 tw:to-blue-50 tw:rounded-xl">
      {/* Hero Section */}
      <div className="tw:relative tw:overflow-hidden">
        {/* Background decorative elements */}
        <div className="tw:absolute tw:top-0 tw:right-0 tw:w-96 tw:h-96 tw:bg-blue-100 tw:rounded-full tw:opacity-20 tw:-translate-y-48 tw:translate-x-48"></div>
        <div className="tw:absolute tw:bottom-0 tw:left-0 tw:w-64 tw:h-64 tw:bg-green-100 tw:rounded-full tw:opacity-20 tw:translate-y-32 tw:-translate-x-32"></div>
        
        <div className="tw:max-w-7xl tw:mx-auto tw:px-4 tw:py-16 tw:relative">
          <div className="tw:grid tw:grid-cols-2 tw:gap-12 tw:items-center">
            {/* Left Column - Content */}
            <div className="tw:space-y-8">
              <div className="tw:space-y-6">
                <h1 className="tw:text-5xl lg:tw:text-6xl tw:font-bold tw:text-gray-900 tw:leading-tight">
                  Sri Lanka's most comprehensive{' '}
                  <span className="tw:text-blue-600">vehicle history report.</span>
                </h1>
                
                <div className="tw:space-y-2 tw:text-xl tw:text-gray-800">
                  Buyers, avoid costly hidden problems.
                  Sellers, build trust and sell quickly.
                </div>
              </div>

              {/* Search Section */}
              <div className="tw:space-y-4">
                <div className="tw:flex tw:flex-col sm:tw:flex-row tw:gap-3">
                  <div className="tw:flex-1 tw:text-black">
                    <input
                      type="text"
                      placeholder="Enter your registration plate"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="tw:w-full tw:px-6 tw:py-4 tw:text-lg tw:border tw:border-gray-200 tw:rounded-xl tw:focus:tw:outline-none tw:focus:tw:ring-2 tw:focus:tw:ring-blue-500 tw:focus:tw:border-transparent tw:shadow-sm tw:transition-all tw:duration-200"
                    />
                  </div>
                  <button 
                    className="tw:bg-blue-600 tw:text-white tw:px-8 tw:py-4 tw:rounded-xl tw:hover:bg-blue-800 tw:hover:cursor-pointer tw:transition-all tw:duration-200 tw:shadow-lg tw:hover:tw:shadow-xl tw:font-semibold tw:text-lg tw:flex tw:items-center tw:justify-center tw:gap-2 tw:group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    Get Report
                    <ArrowRight className={`tw:w-5 tw:h-5 tw:transition-transform tw:duration-200 ${isHovered ? 'tw:translate-x-1' : ''}`} />
                  </button>
                </div>
                
                <p className="tw:text-lg tw:text-gray-700">*LKR 1,000 per report</p>
              </div>
            </div>

            {/* Right Column - Mascot and Stats */}
            <div className="tw:flex tw:flex-col tw:items-center tw:space-y-8">
              {/* Mascot */}
              <div className="tw:relative">
                <div className="tw:w-80 tw:h-80 tw:bg-gradient-to-br tw:from-blue-100 tw:to-blue-200 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shadow-2xl">
                  <img
                    src={elephantImage}
                    alt="Elephant Mascot"
                    className="tw:w-80 tw:h-auto tw:object-contain"
                  />
                </div>
                {/* Floating icons */}
                <div className="tw:absolute tw:top-4 tw:right-4 tw:w-12 tw:h-12 tw:bg-white tw:rounded-lg tw:shadow-lg tw:flex tw:items-center tw:justify-center tw:animate-bounce">
                  <Car className="tw:w-6 tw:h-6 tw:text-blue-600" />
                </div>
                <div className="tw:absolute tw:bottom-4 tw:left-4 tw:w-12 tw:h-12 tw:bg-white tw:rounded-lg tw:shadow-lg tw:flex tw:items-center tw:justify-center tw:animate-bounce tw:animation-delay-300">
                  <Shield className="tw:w-6 tw:h-6 tw:text-green-600" />
                </div>
              </div>

              {/* Stats */}
              <div className="tw:grid tw:grid-cols-2 tw:gap-8 tw:text-center">
                <div className="tw:bg-white tw:rounded-2xl tw:p-6 tw:shadow-lg tw:border tw:border-gray-100">
                  <div className="tw:text-3xl tw:font-bold tw:text-green-600 tw:mb-2">5+ Million</div>
                  <div className="tw:text-sm tw:text-gray-600">reports sold/year</div>
                </div>
                <div className="tw:bg-white tw:rounded-2xl tw:p-6 tw:shadow-lg tw:border tw:border-gray-100">
                  <div className="tw:text-3xl tw:font-bold tw:text-green-600 tw:mb-2">30+ Billion</div>
                  <div className="tw:text-sm tw:text-gray-600">data records</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="tw:bg-white tw:py-16">
        <div className="tw:max-w-7xl tw:mx-auto tw:px-4">
          <div className="tw:text-center tw:mb-12">
            <h2 className="tw:text-3xl tw:font-bold tw:text-gray-900 tw:mb-4">
              Every Vehicle History Report + Lien Check Searches For...
            </h2>
            <p className="tw:text-lg tw:text-gray-600">Comprehensive data to help you make informed decisions</p>
          </div>

          <div className="tw:grid tw:grid-cols-1 lg:tw:grid-cols-3 tw:gap-8">
            {/* Vehicle Damage */}
            <div className="tw:bg-gray-50 tw:rounded-2xl tw:p-8 tw:relative tw:overflow-hidden">
              <div className="tw:absolute tw:top-0 tw:left-0 tw:w-full tw:h-1 tw:bg-green-500"></div>
              <h3 className="tw:text-xl tw:font-bold tw:text-gray-900 tw:mb-6">Vehicle Damage</h3>
              <div className="tw:space-y-4">
                {[
                  'Accident history',
                  'Frame or structural damage',
                  'Damage location',
                  'Weather damage',
                  'Repair estimates and costs'
                ].map((item, index) => (
                  <div key={index} className="tw:flex tw:items-start">
                    <CheckCircle className="tw:w-5 tw:h-5 tw:text-green-500 tw:mr-3 tw:mt-0.5 tw:flex-shrink-0" />
                    <span className="tw:text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Service */}
            <div className="tw:bg-gray-50 tw:rounded-2xl tw:p-8 tw:relative tw:overflow-hidden">
              <div className="tw:absolute tw:top-0 tw:left-0 tw:w-full tw:h-1 tw:bg-blue-500"></div>
              <h3 className="tw:text-xl tw:font-bold tw:text-gray-900 tw:mb-6">Safety & Service</h3>
              <div className="tw:space-y-4">
                {[
                  'Unfixed safety recalls',
                  'Service history',
                  'Tire rotation',
                  'Brake replacements',
                  'Oil changes'
                ].map((item, index) => (
                  <div key={index} className="tw:flex tw:items-start">
                    <CheckCircle className="tw:w-5 tw:h-5 tw:text-blue-500 tw:mr-3 tw:mt-0.5 tw:flex-shrink-0" />
                    <span className="tw:text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Essential Details */}
            <div className="tw:bg-gray-50 tw:rounded-2xl tw:p-8 tw:relative tw:overflow-hidden">
              <div className="tw:absolute tw:top-0 tw:left-0 tw:w-full tw:h-1 tw:bg-cyan-400"></div>
              <h3 className="tw:text-xl tw:font-bold tw:text-gray-900 tw:mb-6">Other Essential Details</h3>
              <div className="tw:space-y-4">
                {[
                  'Money owing on the vehicle (lien)',
                  'Vehicle theft',
                  'Rebuild or salvage title',
                  'Odometer reading',
                  { text: 'and more!', highlight: true }
                ].map((item, index) => (
                  <div key={index} className="tw:flex tw:items-start">
                    <CheckCircle className="tw:w-5 tw:h-5 tw:text-cyan-500 tw:mr-3 tw:mt-0.5 tw:flex-shrink-0" />
                    <span className={`${typeof item === 'object' && item.highlight ? 'tw:text-blue-600 tw:font-semibold' : 'tw:text-gray-700'}`}>
                      {typeof item === 'object' ? item.text : item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="tw:bg-gray-50 tw:py-16">
        <div className="tw:max-w-4xl tw:mx-auto tw:px-4 tw:text-center">
          <button className="tw:bg-blue-600 tw:text-white tw:px-8 tw:py-4 tw:rounded-xl tw:hover:bg-blue-800 tw:hover:cursor-pointer tw:transition-all tw:duration-200 tw:shadow-lg tw:hover:tw:shadow-xl tw:font-semibold tw:text-lg tw:mb-8">
            View Sample Report
          </button>
          
          <p className="tw:text-gray-600 tw:mb-12 tw:text-lg">
            Auto fraud, the hidden threat. AUTOCONNECT Sri Lanka's Vehicle Monitoring can detect auto fraud, unfixed recalls, and more.
          </p>
        </div>
      </div>

      {/* Why Buy Section */}
      <div className="tw:bg-white tw:py-16">
        <div className="tw:max-w-4xl tw:mx-auto tw:px-4">
          <h3 className="tw:text-3xl tw:font-bold tw:text-gray-900 tw:mb-8 tw:text-center">
            Why Buy a Vehicle History Report?
          </h3>
          
          <div className="tw:space-y-6 tw:text-lg tw:text-gray-700 tw:leading-relaxed">
            <p>
              It's more than records about a vehicle. It's a way to know you're making the right choice, a way to reinforce that your gut was correct. A sign of relief that you know the vehicle's past before you drive away with it. It shows a prospective buyer that it's what you say it is.
            </p>
            <p>
              The CARFAX Sri Lanka Vehicle History Report has the data you need to help you make the right decision for you and your car.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="tw:flex tw:justify-center tw:items-center tw:gap-8 tw:mt-12 tw:pt-8 tw:border-t tw:border-gray-200">
            <div className="tw:flex tw:items-center tw:gap-2">
              <Star className="tw:w-5 tw:h-5 tw:text-yellow-500 tw:fill-current" />
              <span className="tw:text-sm tw:text-gray-600">Trusted by millions</span>
            </div>
            <div className="tw:flex tw:items-center tw:gap-2">
              <Shield className="tw:w-5 tw:h-5 tw:text-green-500" />
              <span className="tw:text-sm tw:text-gray-600">Secure & reliable</span>
            </div>
            <div className="tw:flex tw:items-center tw:gap-2">
              <CheckCircle className="tw:w-5 tw:h-5 tw:text-blue-500" />
              <span className="tw:text-sm tw:text-gray-600">Instant results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleHistoryPage;