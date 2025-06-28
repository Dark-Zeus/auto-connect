import React, { useState } from 'react';
import SummaryCard from '../components/atoms/SummaryCard';
import OverlayWindow from '../components/OverlayWindow';
import RegisterServiceProviderForm from '../components/RegisterServiceProviderForm';
import './ServiceProvidersPage.css';

const ServiceProvidersPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    closePopup();
  };

  return (
    <div className="service-providers-page">
      <div className="dashboard">
        <SummaryCard title="Total Service Providers" value="10" />
      </div>
      <div className="actions">
        <button className="btn" onClick={openPopup}>
          Add new
        </button>
      </div>

      {isPopupOpen && (
        <OverlayWindow closeWindowFunction={closePopup}>
          <RegisterServiceProviderForm onSubmit={handleFormSubmit} />
        </OverlayWindow>
      )}
    </div>
  );
};

export default ServiceProvidersPage;