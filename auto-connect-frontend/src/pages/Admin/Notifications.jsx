import React from 'react';

const Notifications = () => {
  return (
    <div className="tw:p-6">
      <h1 className="tw:text-2xl tw:font-semibold tw:mb-4">Notifications</h1>
      <p className="tw:mb-2">Here you can view and manage user notifications.</p>
      <ul className="tw:list-disc tw:pl-5">
        <li>Email Alerts</li>
        <li>Push Notifications</li>
        <li>System Warnings</li>
      </ul>
    </div>
  );
};

export default Notifications;
