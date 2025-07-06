import React from 'react';

const Transactions = () => {
  return (
    <div className="tw:p-6">
      <h1 className="tw:text-2xl tw:font-semibold tw:mb-4">Transactions</h1>
      <p className="tw:mb-2">Overview of user and system transactions.</p>
      <table className="tw:w-full tw:border tw:mt-4">
        <thead>
          <tr>
            <th className="tw:border tw:px-4 tw:py-2">ID</th>
            <th className="tw:border tw:px-4 tw:py-2">Type</th>
            <th className="tw:border tw:px-4 tw:py-2">Amount</th>
            <th className="tw:border tw:px-4 tw:py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="tw:border tw:px-4 tw:py-2">TXN001</td>
            <td className="tw:border tw:px-4 tw:py-2">Payment</td>
            <td className="tw:border tw:px-4 tw:py-2">$150.00</td>
            <td className="tw:border tw:px-4 tw:py-2">2025-07-02</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
