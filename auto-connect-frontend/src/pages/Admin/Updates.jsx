import React from 'react';

const Updates = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">System Updates</h1>
      <p className="mb-2">Latest patches and feature updates.</p>
      <ul className="list-disc pl-5">
        <li>v2.3.0 - Improved dashboard performance</li>
        <li>v2.2.0 - Added export features for reports</li>
        <li>v2.1.5 - Bug fixes and UI enhancements</li>
      </ul>
    </div>
  );
};

export default Updates;