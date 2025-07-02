import React from 'react';

const Notifications = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <p className="mb-2">Here you can view and manage user notifications.</p>
      <ul className="list-disc pl-5">
        <li>Email Alerts</li>
        <li>Push Notifications</li>
        <li>System Warnings</li>
      </ul>
    </div>
  );
};

export default Notifications;