import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpendSense AI - Smart Expense Policy Enforcement',
  description: `Value Proposition: An AI-powered tool that automatically analyzes expense reports and receipts, flagging questionable or 'zanier' expenses, unusual spending patterns, or potential policy violations *before* approval. It reduces manual review time for finance teams, prevents non-compliant spending, and provides clear justifications for flagged items, ensuring greater financial compliance and control.

Target Customer: Mid-sized companies (50-500 employees), legal firms, consulting companies, and any organization with complex expense policies where detailed justification and compliance are critical. Primary users are Finance Departments, Accounting Teams, and Legal Operations.

---
Category: Fintech
Target Market: Mid-sized companies (50-500 employees), legal firms, consulting companies, and any organization with complex expense policies where detailed justification and compliance are critical. Primary users ar
Source Hypothesis ID: c31f6842-6eea-4404-a4a0-248cb52941be
Promotion Type: automatic`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <nav className="border-b">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              <a href="/" className="font-bold text-lg">SpendSense AI - Smart Expense Policy Enforcement</a>
              <div className="flex items-center gap-4">
                <a href="/dashboard" className="text-sm hover:text-blue-600">Dashboard</a>
                <a href="/pricing" className="text-sm hover:text-blue-600">Pricing</a>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
