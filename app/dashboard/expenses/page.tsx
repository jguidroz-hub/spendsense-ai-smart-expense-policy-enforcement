'use client';

import { useState } from 'react';
import Link from 'next/link';

type Expense = {
  id: string;
  vendor: string;
  amount: number;
  category: string;
  date: string;
  status: 'approved' | 'pending' | 'flagged' | 'rejected';
  violation?: string;
  receipt: boolean;
};

const DEMO_EXPENSES: Expense[] = [
  { id: '1', vendor: 'Delta Airlines', amount: 423.50, category: 'Travel', date: '2026-02-13', status: 'approved', receipt: true },
  { id: '2', vendor: 'The Capital Grille', amount: 187.30, category: 'Meals', date: '2026-02-12', status: 'flagged', violation: 'Exceeds $75 meal limit per person (2 attendees)', receipt: true },
  { id: '3', vendor: 'Uber', amount: 34.20, category: 'Transport', date: '2026-02-12', status: 'approved', receipt: true },
  { id: '4', vendor: 'Hilton Hotels', amount: 289.00, category: 'Lodging', date: '2026-02-11', status: 'approved', receipt: true },
  { id: '5', vendor: 'Office Depot', amount: 67.99, category: 'Supplies', date: '2026-02-10', status: 'pending', receipt: false },
  { id: '6', vendor: 'AWS', amount: 1240.00, category: 'Software', date: '2026-02-01', status: 'approved', receipt: true },
  { id: '7', vendor: 'WeWork', amount: 450.00, category: 'Office', date: '2026-02-01', status: 'flagged', violation: 'Requires manager pre-approval for coworking > $300', receipt: true },
  { id: '8', vendor: 'Best Buy', amount: 899.99, category: 'Equipment', date: '2026-01-28', status: 'rejected', violation: 'Equipment purchases over $500 require IT approval', receipt: true },
];

const CATEGORIES = ['All', 'Travel', 'Meals', 'Transport', 'Lodging', 'Supplies', 'Software', 'Office', 'Equipment'];

const statusColors: Record<string, string> = {
  approved: 'bg-green-50 text-green-700',
  pending: 'bg-yellow-50 text-yellow-700',
  flagged: 'bg-orange-50 text-orange-700',
  rejected: 'bg-red-50 text-red-700',
};

export default function ExpensesPage() {
  const [filter, setFilter] = useState('All');
  const [showSubmit, setShowSubmit] = useState(false);
  const filtered = filter === 'All' ? DEMO_EXPENSES : DEMO_EXPENSES.filter(e => e.category === filter);

  const total = DEMO_EXPENSES.reduce((s, e) => s + e.amount, 0);
  const flagged = DEMO_EXPENSES.filter(e => e.status === 'flagged').length;
  const pending = DEMO_EXPENSES.filter(e => e.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">← Dashboard</Link>
          <h1 className="font-bold text-lg">Expense Tracker</h1>
        </div>
        <button onClick={() => setShowSubmit(!showSubmit)} className="px-4 py-2 bg-black text-white text-sm rounded-lg">
          + Submit Expense
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-400 uppercase">This Month</p>
            <p className="text-2xl font-bold">${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-400 uppercase">Expenses</p>
            <p className="text-2xl font-bold">{DEMO_EXPENSES.length}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-orange-500 uppercase">Flagged</p>
            <p className="text-2xl font-bold text-orange-600">{flagged}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-yellow-500 uppercase">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          </div>
        </div>

        {/* Submit Form */}
        {showSubmit && (
          <div className="bg-white rounded-xl border p-6 mb-6">
            <h3 className="font-semibold mb-4">Submit New Expense</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div><label className="text-xs text-gray-500">Vendor</label><input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="Vendor name" /></div>
              <div><label className="text-xs text-gray-500">Amount</label><input type="number" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="0.00" /></div>
              <div><label className="text-xs text-gray-500">Category</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm mt-1">
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="text-xs text-gray-500">Date</label><input type="date" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
              <div><label className="text-xs text-gray-500">Receipt</label><input type="file" className="w-full border rounded-lg px-3 py-1.5 text-sm mt-1" /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-black text-white text-sm rounded-lg">Check Policy & Submit</button>
              <button onClick={() => setShowSubmit(false)} className="px-4 py-2 border text-sm rounded-lg">Cancel</button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium ${filter === cat ? 'bg-black text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Vendor</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(exp => (
                <tr key={exp.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{exp.vendor}</td>
                  <td className="px-4 py-3 text-gray-600">{exp.category}</td>
                  <td className="px-4 py-3 text-right font-mono">${exp.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{exp.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[exp.status]}`}>
                      {exp.status}
                    </span>
                    {exp.violation && (
                      <p className="text-xs text-orange-600 mt-1">⚠️ {exp.violation}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{exp.receipt ? '📎' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
