import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  Search
} from 'lucide-react';
import { DBTTransaction } from '../types';

interface ReportsLogsViewProps {
  transactions: DBTTransaction[];
}

export const ReportsLogsView: React.FC<ReportsLogsViewProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(
    (t) =>
      t.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.aadhaarMasked.includes(searchTerm)
  );

  const totalSubsidy = transactions.reduce((acc, curr) => acc + curr.subsidyAmount, 0);
  const totalBags = transactions.reduce((acc, curr) => acc + curr.bagsIssued, 0);
  const totalFarmerPaid = transactions.reduce((acc, curr) => acc + curr.farmerPaidAmount, 0);

  // Real CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Transaction Ref',
      'Timestamp',
      'Farmer Name',
      'Aadhaar UID',
      'Urea Bags Issued',
      'Nano Urea Bottles',
      'Govt Subsidy (INR)',
      'Farmer Paid (INR)',
      'POS Terminal',
      'Operator',
      'Status',
    ];

    const rows = transactions.map((t) => [
      t.transactionRef,
      `"${t.timestamp}"`,
      `"${t.farmerName}"`,
      t.aadhaarMasked,
      t.bagsIssued,
      t.nanoUreaIssued,
      t.subsidyAmount,
      t.farmerPaidAmount,
      t.posTerminalId,
      `"${t.operatorName}"`,
      t.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DBT_Fertilizer_Settlement_Log_Meerut_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded text-[10.5px] font-bold uppercase border border-emerald-200">
                AUDIT COMPTROLLER & DBT SETTLEMENT REGISTER
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-xs text-stone-600 font-medium">Session Kharif/Rabi 2025</span>
            </div>
            <h2 className="text-2xl font-black text-[#1b431c] tracking-tight">
              रिपोर्ट्स व डीबीटी लॉग / Reports & DBT Logs
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              Daily electronic fertilizer distribution ledger, Aadhaar authentication audit trail, and subsidy claims.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#1b5e20] hover:bg-[#144919] text-white px-4 py-2 rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Official CSV Register</span>
          </button>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-stone-100">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3">
            <span className="text-[10.5px] font-bold text-emerald-900 uppercase">
              Total Central Subsidy Settled
            </span>
            <p className="text-xl font-black text-emerald-950 mt-0.5">
              ₹{totalSubsidy.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
            <span className="text-[10.5px] font-bold text-stone-600 uppercase">
              Total Neem Urea Bags Dispensed
            </span>
            <p className="text-xl font-black text-stone-900 mt-0.5">
              {totalBags} Bags ({(totalBags * 45).toLocaleString()} Kg)
            </p>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3">
            <span className="text-[10.5px] font-bold text-blue-900 uppercase">
              Farmer Co-Pay Collected at POS
            </span>
            <p className="text-xl font-black text-blue-950 mt-0.5">
              ₹{totalFarmerPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search DBT records by Farmer, Txn Ref, or Aadhaar..."
              className="w-full bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Table of DBT Logs */}
      <div className="bg-white rounded-lg border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10.5px]">
                <th className="py-3 px-4">Transaction Ref & Date</th>
                <th className="py-3 px-4">Beneficiary (Aadhaar UID)</th>
                <th className="py-3 px-4">Bags & Nano Urea</th>
                <th className="py-3 px-4">Govt Subsidy Paid</th>
                <th className="py-3 px-4">Farmer Paid Amount</th>
                <th className="py-3 px-4">POS & Operator</th>
                <th className="py-3 px-4">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded text-[11px] block w-fit">
                      {item.transactionRef}
                    </span>
                    <span className="text-[10px] text-stone-500 block mt-0.5">{item.timestamp}</span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-stone-900">{item.farmerName}</p>
                    <p className="font-mono text-stone-500 text-[10.5px]">{item.aadhaarMasked}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-extrabold text-[#1b5e20]">{item.bagsIssued} Bags</span>
                    <span className="text-stone-400 mx-1">•</span>
                    <span className="text-emerald-700 font-semibold">{item.nanoUreaIssued} Bottles</span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                    ₹{item.subsidyAmount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-stone-900">
                    ₹{item.farmerPaidAmount.toFixed(2)}
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-medium text-stone-800">{item.posTerminalId}</p>
                    <p className="text-[10px] text-stone-500">{item.operatorName}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
