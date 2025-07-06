import React from 'react';

const Transactions = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
      <p className="mb-2">Overview of user and system transactions.</p>
      <table className="w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">TXN001</td>
            <td className="border px-4 py-2">Payment</td>
            <td className="border px-4 py-2">$150.00</td>
            <td className="border px-4 py-2">2025-07-02</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;