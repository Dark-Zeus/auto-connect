import React from 'react';
import RegisterServiceProviderForm from '../components/RegisterServiceProviderForm';
import './RegisterServiceProvider.css';

const RegisterServiceProvider = () => {
  return (
    <div className="register-service-provider-page">
      <h1>Register New Service Provider</h1>
      <RegisterServiceProviderForm onSubmit={() => {}} />
    </div>
  );
};

export default RegisterServiceProvider;