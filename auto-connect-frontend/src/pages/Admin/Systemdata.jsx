import React from 'react';

const Systemdata = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">System Data</h1>
      <p className="mb-2">Explore and manage core system data.</p>
      <ul className="list-disc pl-5">
        <li>User Roles and Permissions</li>
        <li>Configuration Settings</li>
        <li>Database Sync Status</li>
      </ul>
    </div>
  );
};

export default Systemdata;