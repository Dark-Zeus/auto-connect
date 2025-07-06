import React from 'react';

const Systemdata = () => {
  return (
    <div className="tw:p-6">
      <h1 className="tw:text-2xl tw:font-semibold tw:mb-4">System Data</h1>
      <p className="tw:mb-2">Explore and manage core system data.</p>
      <ul className="tw:list-disc tw:pl-5">
        <li>User Roles and Permissions</li>
        <li>Configuration Settings</li>
        <li>Database Sync Status</li>
      </ul>
    </div>
  );
};

export default Systemdata;
