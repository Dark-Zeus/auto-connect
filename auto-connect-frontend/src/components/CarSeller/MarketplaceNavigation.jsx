import React, { useState } from 'react';
import { Home, Car, FileText, CreditCard, Coins, BookCheck, BookMarkedIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketplaceNavigation = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/marketplacehome', badge: null },
    { id: 'buyvehicles', label: 'Buy Vehicles', icon: Coins, href: '/buyvehicles', badge: null },
    { id: 'sell-vehicles', label: 'Sell Vehicles', icon: Car, href: '/sell', badge: null },
    { id: 'myads', label: 'My Ads', icon: FileText, href: '/myads', badge: null },
    { id: 'saved', label: 'Saved Ads', icon: BookMarkedIcon, href: '/saved', badge: null },
    { id: 'checkreports', label: 'Check Vehicle Reports', icon: BookCheck, href: '/checkreports', badge: null },
    { id: 'subscription', label: 'Subscription', icon: CreditCard, href: '/subscriptions', badge: null }
  ];

  const handleItemClick = (itemLabel, href) => {
    setActiveItem(itemLabel);
    if (href) navigate(href);
  };

  return (
    <div className="tw:bg-[linear-gradient(135deg,var(--sky-blue),var(--navy-blue))] tw:py-4 tw:mb-6 tw:rounded-3xl">
      <div className="tw:max-w-7xl tw:mx-auto tw:px-4 sm:tw:px-6 lg:tw:px-8">
        <nav className="tw:flex tw:space-x-8 tw:overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.label, item.href)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`tw:relative tw:flex tw:items-center tw:space-x-2 tw:px-3 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md tw:transition-all
                  ${isActive
                    ? 'tw:bg-[#bdelff] tw:text-[#00343f]'
                    : 'tw:text-white tw:hover:bg-[#8cc4ff33]'}
                `}
              >
                <Icon className={`tw:w-5 tw:h-5 ${isActive ? 'tw:text-[#00343f]' : 'tw:text-white'}`} />
                <span>{item.label}</span>

                {item.badge && (
                  <div className="tw-w-5 tw-h-5 tw-bg-red-500 tw-text-white tw-text-xs tw-flex tw-items-center tw-justify-center tw-rounded-full">
                    {item.badge}
                  </div>
                )}

                {item.isNew && (
                  <span className="tw-bg-white tw-text-green-600 tw-text-[10px] tw-font-semibold tw-px-2 tw-py-0.5 tw-rounded-full">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MarketplaceNavigation;
