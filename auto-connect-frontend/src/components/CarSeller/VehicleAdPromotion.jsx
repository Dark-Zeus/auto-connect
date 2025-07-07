import React, { useState } from 'react';
import { Plus, X, Calendar, Clock, TrendingUp, Pin, Star, AlertCircle } from 'lucide-react';
import bumpUp from '../../assets/images/promotions/bumpUp.png';
import topAd from '../../assets/images/promotions/topAd.png';
import featured from '../../assets/images/promotions/featured.png';
import urgent from '../../assets/images/promotions/urgent.png';

const VehicleAdPromotion = () => {
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('7');
  const [selectedSchedule, setSelectedSchedule] = useState('boost-now');
  const [startDate, setStartDate] = useState('07-07-2025');
  const [startTime, setStartTime] = useState('12:30');
  const [selectedPromotions, setSelectedPromotions] = useState([]);

  const promotionOptions = {
    'bump-up': {
      icon: TrendingUp,
      image: bumpUp,
      title: 'Bump Up',
      description: 'Get a fresh start every day and get up to 10 times more responses!',
      badge: null,
      badgeColor: 'tw:bg-blue-500',
      pricing: {
        '3': 3900,
        '7': 4800,
        '15': 5800
      }
    },
    'top-ad': {
      icon: Pin,
      image: topAd,
      title: 'Top Ad',
      description: 'Get up to 5 times more views by displaying your ad at the top!',
      badge: null,
      badgeColor: '',
      pricing: {
        '3': 2800,
        '7': 3400,
        '15': 4100
      }
    },
    'featured-ad': {
      icon: Star,
      image: featured,
      title: 'Featured Ad',
      description: 'Exclusive Spot, Maximum Impact – Secure a premium position and attract more buyers.',
      badge: 'FEATURED',
      badgeColor: 'tw:bg-orange-500',
      pricing: {
        '3': 4900,
        '7': 5900,
        '15': 6900
      }
    },
    'urgent': {
      icon: AlertCircle,
      image: urgent,
      title: 'Urgent',
      description: 'Stand out from the rest by showing a bright red marker on the ad!',
      badge: 'URGENT',
      badgeColor: 'tw:bg-red-500',
      pricing: {
        '3': 1500,
        '7': 2000,
        '15': 2500
      }
    }
  };

  const handleAddPromotion = (promotionType) => {
    setSelectedPromotion(promotionType);
    setShowModal(true);
  };

  const handleContinue = () => {
    if (selectedPromotion) {
      const promotion = {
        type: selectedPromotion,
        duration: selectedDuration,
        schedule: selectedSchedule,
        price: promotionOptions[selectedPromotion].pricing[selectedDuration],
        startDate: selectedSchedule === 'schedule' ? startDate : null,
        startTime: selectedSchedule === 'schedule' ? startTime : null
      };
      setSelectedPromotions([...selectedPromotions, promotion]);
    }
    setShowModal(false);
    setSelectedPromotion(null);
  };

  const handleRemovePromotion = (index) => {
    setSelectedPromotions(selectedPromotions.filter((_, i) => i !== index));
  };

  const getTotalPrice = () => {
    return selectedPromotions.reduce((total, promo) => total + promo.price, 0);
  };

  const Modal = () => {
    if (!showModal || !selectedPromotion) return null;
    
    const promo = promotionOptions[selectedPromotion];

    return (
      <div className="tw:fixed tw:inset-0 tw:bg-black tw:bg-opacity-50 tw:flex tw:items-center tw:justify-center tw:z-50 tw:p-4">
        <div className="tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:max-w-md tw:w-full tw:max-h-[90vh] tw:overflow-y-auto">
          <div className="tw:p-6">
            <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
              <div className="tw:flex tw:items-center tw:gap-3">
                <div className="tw:w-10 tw:h-10 tw:bg-blue-100 tw:rounded-full tw:flex tw:items-center tw:justify-center">
                  <img src={promo.image} className="tw-w-5 tw-h-5 tw:text-blue-600" />
                </div>
                <h3 className="tw:text-xl tw:font-bold tw:text-gray-800">{promo.title}</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="tw:text-gray-400 hover:tw:text-gray-600 tw:transition-colors"
              >
                <X className="tw:w-6 tw:h-6" />
              </button>
            </div>

            <p className="tw:text-gray-600 tw:mb-6">{promo.description}</p>

            <div className="tw:mb-6">
              <div className="tw:bg-gray-50 tw:rounded-xl tw:p-4 tw:flex tw:items-center tw:justify-center">
                <img 
                  src={promo.image} 
                  alt={`${promo.title} example`}
                  className="tw:max-w-full tw:max-h-32 tw:object-contain"
                />
              </div>
            </div>

            <div className="tw:mb-6">
              <h4 className="tw:font-semibold tw:text-gray-800 tw:mb-4">Choose Duration</h4>
              <div className="tw:space-y-3">
                {['3', '7', '15'].map((days) => (
                  <label key={days} className="tw:flex tw:items-center tw:justify-between tw:p-3 tw:border tw:rounded-lg tw:cursor-pointer hover:tw:bg-gray-50 tw:transition-colors">
                    <div className="tw:flex tw:items-center tw:gap-3">
                      <input
                        type="radio"
                        name="duration"
                        value={days}
                        checked={selectedDuration === days}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="tw:w-4 tw:h-4 tw:text-blue-600"
                      />
                      <span className="tw:font-medium tw:text-gray-700">{days} days</span>
                    </div>
                    <span className="tw:font-bold tw:text-blue-600">LKR {promo.pricing[days].toLocaleString()}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="tw:mb-6">
              <h4 className="tw:font-semibold tw:text-gray-800 tw:mb-4">Schedule your ad boosting</h4>
              <div className="tw:space-y-3">
                <label className="tw:flex tw:items-center tw:gap-3 tw:cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    value="boost-now"
                    checked={selectedSchedule === 'boost-now'}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    className="tw:w-4 tw:h-4 tw:text-blue-600"
                  />
                  <span className="tw:font-medium tw:text-gray-700">Boost Now</span>
                </label>
                <label className="tw:flex tw:items-center tw:gap-3 tw:cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    value="schedule"
                    checked={selectedSchedule === 'schedule'}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    className="tw:w-4 tw:h-4 tw:text-blue-600"
                  />
                  <div className="tw:flex tw:items-center tw:gap-2">
                    <span className="tw:font-medium tw:text-gray-700">Schedule ad boost</span>
                    <span className="tw:bg-red-500 tw:text-white tw:text-xs tw:px-2 tw:py-1 tw:rounded tw:font-semibold">NEW</span>
                  </div>
                </label>
              </div>

              {selectedSchedule === 'schedule' && (
                <div className="tw:mt-4 tw:space-y-4">
                  <div>
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Boosting Start Date</label>
                    <div className="tw:relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="tw:w-full tw:p-3 tw:border tw:text-black tw:border-gray-300 tw:rounded-lg tw:pr-10 focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">Boosting Start Time</label>
                    <div className="tw:relative">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="tw:w-full tw:text-black tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:pr-10 focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleContinue}
              className="tw:w-full tw:bg-blue-600 tw:text-white tw:py-3 tw:px-6 tw:rounded-lg tw:font-semibold hover:tw:bg-blue-700 tw:transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tw:min-h-screen tw:bg-gray-50 tw:rounded-xl">
      <div className="tw:max-4xl tw:mx-auto tw:p-6">
        <div className="tw:text-center tw:mb-8">
          <h1 className="tw:text-3xl tw:font-bold tw:text-gray-800 tw:mb-2">Make your ad stand out!</h1>
          <p className="tw:text-gray-600">Get up to 10 times more responses by boosting your ad. Select one or more ad boosts below (optional).</p>
        </div>

      {/*   <div className="tw:mb-6">
          <div className="tw:flex tw:items-center tw:gap-2 tw:mb-4">
            <span className="tw:bg-red-500 tw:text-white tw:text-xs tw:px-2 tw:py-1 tw:rounded tw:font-semibold">NEW</span>
            <span className="tw:text-gray-700">Now you can schedule your Bump Up and Top Ad</span>
          </div>
          <h2 className="tw:text-lg tw:font-semibold tw:text-teal-600 tw:mb-4">Recommended</h2>
        </div> */}

        <div className="tw:grid tw:gap-4 tw:mb-8">
          {Object.entries(promotionOptions).map(([key, promo]) => {
            const IconComponent = promo.icon;
            const isSelected = selectedPromotions.some(p => p.type === key);
            
            return (
              <div
                key={key}
                className={`tw:bg-white tw:rounded-xl tw:p-6 tw:shadow-sm tw:border tw:transition-all ${
                  isSelected ? 'tw:border-blue-300 tw:bg-blue-50' : 'tw:border-gray-200 hover:tw:shadow-md'
                }`}
              >
                <div className="tw:flex tw:items-center tw:justify-between">
                  <div className="tw:flex tw:items-center tw:gap-4">
                    <div className="tw:w-12 tw:h-12 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:bg-gray-100 tw:overflow-hidden">
                      <img 
                        src={promo.image} 
                        alt={promo.title}
                        className="tw:w-8 tw:h-8 tw:object-contain"
                      />
                    </div>
                    <div className="tw:flex-1">
                      <div className="tw:flex tw:items-center tw:gap-2 tw:mb-1">
                        <h3 className="tw:text-xl tw:font-bold tw:text-gray-800">{promo.title}</h3>
                        {promo.badge && (
                          <span className={`tw:text-white tw:text-xs tw:px-2 tw:py-1 tw:rounded tw:font-semibold ${promo.badgeColor}`}>
                            {promo.badge}
                          </span>
                        )}
                      </div>
                      <p className="tw:text-gray-600 tw:text-sm">{promo.description}</p>
                    </div>
                  </div>
                  <div className="tw:flex tw:items-center tw:gap-4">
                    <div className="tw:text-right">
                      <div className="tw:text-sm tw:text-gray-500">From</div>
                      <div className="tw:text-lg tw:font-bold tw:text-gray-800">LKR {promo.pricing['3'].toLocaleString()}</div>
                    </div>
                    <button
                      onClick={() => handleAddPromotion(key)}
                      className="tw:w-10 tw:h-10 tw:bg-blue-600 tw:text-white tw:rounded-full tw:flex tw:items-center tw:justify-center tw:hover:bg-blue-800 tw:hover:cursor-pointer tw:transition-colors"
                    >
                      <Plus className="tw:w-5 tw:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedPromotions.length > 0 && (
          <div className="tw:bg-white tw:rounded-xl tw:p-6 tw:shadow-sm tw:border tw:mb-6">
            <h3 className="tw:text-lg tw:font-semibold tw:text-gray-800 tw:mb-4">Selected Promotions</h3>
            <div className="tw:space-y-3">
              {selectedPromotions.map((promo, index) => (
                <div key={index} className="tw:flex tw:items-center tw:justify-between tw:p-3 tw:bg-gray-50 tw:rounded-lg">
                  <div className="tw:flex tw:items-center tw:gap-3">
                    <div className="tw:w-8 tw:h-8 tw:bg-gray-100 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:overflow-hidden">
                      <img 
                        src={promotionOptions[promo.type].image} 
                        alt={promotionOptions[promo.type].title}
                        className="tw:w-5 tw:h-5 tw:object-contain"
                      />
                    </div>
                    <div>
                      <div className="tw:font-medium tw:text-gray-800">{promotionOptions[promo.type].title}</div>
                      <div className="tw:text-sm tw:text-gray-600">{promo.duration} days</div>
                    </div>
                  </div>
                  <div className="tw:flex tw:items-center tw:gap-3">
                    <span className="tw:font-bold tw:text-gray-800">LKR {promo.price.toLocaleString()}</span>
                    <button
                      onClick={() => handleRemovePromotion(index)}
                      className="tw:text-red-400 tw:hover:text-red-700 tw:hover:cursor-pointertw:transition-colors"
                    >
                      <X className="tw:w-5 tw:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="tw:bg-white tw:rounded-xl tw:p-6 tw:shadow-sm tw:border tw:border-blue-600">
          <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
            <h3 className="tw:text-lg tw:font-semibold tw:text-gray-800">Payment Summary</h3>
            <button
              onClick={() => setSelectedPromotions([])}
              className="tw:text-red-400 tw:hover:text-red-700 tw:hover:cursor-pointer tw:transition-colors"
            >
              <X className="tw:w-5 tw:h-5" />
            </button>
          </div>
          <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
            <span className="tw:text-gray-700">Total</span>
            <span className="tw:text-2xl tw:font-bold tw:text-gray-800">LKR {getTotalPrice().toLocaleString()}</span>
          </div>
          <button className="tw:w-full tw:bg-blue-600 tw:text-white tw:py-3 tw:px-6 tw:rounded-lg tw:font-semibold tw:hover:bg-blue-800 tw:hover:cursor-pointer tw:transition-colors">
            Continue
          </button>
        </div>
      </div>

      <Modal />
    </div>
  );
};

export default VehicleAdPromotion;