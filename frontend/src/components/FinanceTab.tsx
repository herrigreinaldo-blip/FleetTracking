'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  Receipt,
  Truck,
  UserCheck,
  TrendingUp,
  CreditCard,
  FileSpreadsheet,
  X,
  UploadCloud,
  ChevronDown,
  Layers
} from 'lucide-react';

interface BankTransaction {
  id: string;
  date: string;
  company: 'MS Herrig Ltd' | 'TGB Services and Solutions Ltd' | 'GoConnect';
  description: string;
  category: 'DPD Inflow' | 'Driver Payment' | 'Vehicle Maintenance' | 'Fuel Card' | 'Director Drawing' | 'Insurance' | 'Office & Admin';
  amount: number;
  type: 'Inflow' | 'Outflow';
  vatAmount: number;
  linkedEntity?: string;
  receiptAttached: boolean;
}

const INITIAL_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'TXN-1089',
    date: '2026-09-28',
    company: 'MS Herrig Ltd',
    description: 'DPD Gross Settlement - Week 39 (Depot FD 12354 & 14902)',
    category: 'DPD Inflow',
    amount: 16470.10,
    type: 'Inflow',
    vatAmount: 2745.02,
    receiptAttached: true
  },
  {
    id: 'TXN-1088',
    date: '2026-09-27',
    company: 'MS Herrig Ltd',
    description: 'Driver Fortnightly Payroll Run (13 Subcontractors)',
    category: 'Driver Payment',
    amount: 9667.96,
    type: 'Outflow',
    vatAmount: 0,
    receiptAttached: true
  },
  {
    id: 'TXN-1087',
    date: '2026-09-26',
    company: 'MS Herrig Ltd',
    description: 'Mercedes-Benz Birmingham: Full B-Service & Brake Discs',
    category: 'Vehicle Maintenance',
    amount: 1060.00,
    type: 'Outflow',
    vatAmount: 176.67,
    linkedEntity: 'KR23 XYZ (Mercedes Sprinter)',
    receiptAttached: true
  },
  {
    id: 'TXN-1086',
    date: '2026-09-25',
    company: 'TGB Services and Solutions Ltd',
    description: 'Allstar Fuel Card Monthly Direct Debit Invoice',
    category: 'Fuel Card',
    amount: 2150.00,
    type: 'Outflow',
    vatAmount: 358.33,
    receiptAttached: true
  },
  {
    id: 'TXN-1085',
    date: '2026-09-24',
    company: 'MS Herrig Ltd',
    description: 'Director Drawing - Reinaldo Herrig (Sept Allocation)',
    category: 'Director Drawing',
    amount: 4200.00,
    type: 'Outflow',
    vatAmount: 0,
    linkedEntity: 'Director Reinaldo',
    receiptAttached: false
  },
  {
    id: 'TXN-1084',
    date: '2026-09-22',
    company: 'TGB Services and Solutions Ltd',
    description: 'Director Drawing - Tulio (Sept Allocation)',
    category: 'Director Drawing',
    amount: 4500.00,
    type: 'Outflow',
    vatAmount: 0,
    linkedEntity: 'Director Tulio',
    receiptAttached: false
  },
  {
    id: 'TXN-1083',
    date: '2026-09-20',
    company: 'MS Herrig Ltd',
    description: 'Tyre City Ltd: 2x Continental VanContact Tyres',
    category: 'Vehicle Maintenance',
    amount: 380.00,
    type: 'Outflow',
    vatAmount: 63.33,
    linkedEntity: 'VN71 DPD (Ford Transit)',
    receiptAttached: true
  },
  {
    id: 'TXN-1082',
    date: '2026-09-18',
    company: 'MS Herrig Ltd',
    description: 'Emergency Driver Cash Advance (Deducted from Oct Payroll)',
    category: 'Driver Payment',
    amount: 250.00,
    type: 'Outflow',
    vatAmount: 0,
    linkedEntity: 'Ronaldo Luiz Silva (DR 85899)',
    receiptAttached: false
  }
];

export const FinanceTab: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<'All' | 'MS Herrig Ltd' | 'TGB Services and Solutions Ltd' | 'GoConnect'>('All');
  const [transactions, setTransactions] = useState<BankTransaction[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Transaction Form State
  const [newCompany, setNewCompany] = useState<'MS Herrig Ltd' | 'TGB Services and Solutions Ltd' | 'GoConnect'>('MS Herrig Ltd');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Vehicle Maintenance' | 'Driver Payment' | 'Fuel Card' | 'Director Drawing' | 'Insurance' | 'Office & Admin'>('Vehicle Maintenance');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'Outflow' | 'Inflow'>('Outflow');
  const [newLinkedVehicle, setNewLinkedVehicle] = useState('KR23 XYZ (Mercedes Sprinter)');
  const [newLinkedDriver, setNewLinkedDriver] = useState('Ronaldo Luiz Silva (DR 85899)');
  const [newReceiptName, setNewReceiptName] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRecordTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    const amt = parseFloat(newAmount);
    const vat = newCategory === 'Vehicle Maintenance' || newCategory === 'Fuel Card' ? +(amt * 0.2 / 1.2).toFixed(2) : 0;
    
    let linked: string | undefined = undefined;
    if (newCategory === 'Vehicle Maintenance') linked = newLinkedVehicle;
    if (newCategory === 'Driver Payment') linked = newLinkedDriver;

    const newTxn: BankTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      company: newCompany,
      description: newDesc,
      category: newCategory,
      amount: amt,
      type: newType,
      vatAmount: vat,
      linkedEntity: linked,
      receiptAttached: !!newReceiptName
    };

    setTransactions([newTxn, ...transactions]);
    setIsRecordModalOpen(false);
    setNewDesc('');
    setNewAmount('');
    setNewReceiptName(null);
    showNotification(`Transaction recorded and automatically linked to ${linked || newCategory}.`);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesCompany = selectedCompany === 'All' || t.company === selectedCompany;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.linkedEntity && t.linkedEntity.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCompany && matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0d6942',
          color: '#ffffff',
          padding: '12px 22px',
          borderRadius: '9999px',
          boxShadow: '0 8px 24px rgba(13, 105, 66, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000,
          fontWeight: 600,
          fontSize: '13px'
        }}>
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Header with Title and Multi-Company Switcher */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid #eef2f6',
        boxShadow: '0 8px 24px -4px rgba(18, 24, 38, 0.04)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              background: '#ecfdf5',
              color: '#065f46',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '9999px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Sprint 3 • Multi-Company Finance Engine
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Accounting Period: September 2026 (Active)</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
            Multi-Entity Banking & P&L Hub
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: 0 }}>
            Automated bank ledger separation, director drawings reconciliation, and smart relational expense auto-routing.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Company Filter Tabs */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0'
          }}>
            {(['All', 'MS Herrig Ltd', 'TGB Services and Solutions Ltd', 'GoConnect'] as const).map(comp => (
              <button
                key={comp}
                onClick={() => setSelectedCompany(comp)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: selectedCompany === comp ? '#0d6942' : 'transparent',
                  color: selectedCompany === comp ? '#ffffff' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {comp === 'All' ? 'Consolidated (All 3)' : comp.replace(' and Solutions Ltd', '')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsRecordModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 18px',
              borderRadius: '9999px',
              background: '#0d6942',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(13, 105, 66, 0.25)'
            }}
          >
            <Plus size={16} />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* 3 Bank Account Cards with Real Balances from Spreadsheet */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {/* Account 1: MS Herrig Ltd */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid #bbf7d0',
          boxShadow: '0 6px 18px rgba(13, 105, 66, 0.05)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0d6942', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Building2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>MS Herrig Ltd</div>
                <div style={{ fontSize: '11px', color: '#0d6942', fontWeight: 600 }}>NatWest Bus. Current • •4920</div>
              </div>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', background: '#dcfce7', color: '#166534' }}>
              PRIMARY
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Available Live Balance</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginTop: '2px' }}>
            £1,757.81
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #dcfce7', fontSize: '11px', color: '#475569' }}>
            <span>Monthly Inflow: <strong>£65,880.38</strong></span>
            <span style={{ color: '#059669', fontWeight: 700 }}>+12.4% vs Aug</span>
          </div>
        </div>

        {/* Account 2: TGB Services and Solutions Ltd */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid #bfdbfe',
          boxShadow: '0 6px 18px rgba(37, 99, 235, 0.05)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <CreditCard size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>TGB Services and Solutions Ltd</div>
                <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>NatWest Bus. Reserve • •8812</div>
              </div>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', background: '#dbeafe', color: '#1e40af' }}>
              SECONDARY
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Available Live Balance</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginTop: '2px' }}>
            £3,794.50
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #dbeafe', fontSize: '11px', color: '#475569' }}>
            <span>Monthly Inflow: <strong>£14,210.00</strong></span>
            <span style={{ color: '#2563eb', fontWeight: 700 }}>Fuel & Van Leases</span>
          </div>
        </div>

        {/* Account 3: GoConnect Partnership */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fdf4ff 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid #f5d0fe',
          boxShadow: '0 6px 18px rgba(192, 38, 211, 0.05)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Layers size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>GoConnect Partnership</div>
                <div style={{ fontSize: '11px', color: '#a21caf', fontWeight: 600 }}>Monzo Business • •1049</div>
              </div>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', background: '#fae8ff', color: '#86198f' }}>
              RESERVE
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Available Live Balance</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginTop: '2px' }}>
            £0.00
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #fae8ff', fontSize: '11px', color: '#475569' }}>
            <span>Monthly Inflow: <strong>£0.00</strong></span>
            <span style={{ color: '#9333ea', fontWeight: 700 }}>Dormant / Holding</span>
          </div>
        </div>
      </div>

      {/* Director Drawings Trackers (Target £5,000 / month from Excel) */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '22px',
        border: '1px solid #eef2f6',
        boxShadow: '0 8px 24px -4px rgba(18, 24, 38, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Director Drawings Target Tracker (September 2026)
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
              Ensures monthly director personal payouts adhere to the agreed £5,000.00 cap to safeguard corporate liquidity.
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '9999px', background: '#f0fdf4', color: '#166534' }}>
            Target: £5,000.00 / Director
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Director 1: Reinaldo Herrig */}
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0d6942', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                  RH
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Director Reinaldo Herrig</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>MS Herrig Ltd Account</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0d6942' }}>£4,200.00</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>of £5,000.00 (84%)</div>
              </div>
            </div>
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: '84%', height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #0d6942 100%)', borderRadius: '9999px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#64748b' }}>
              <span>Remaining allowance: <strong>£800.00</strong></span>
              <span style={{ color: '#059669', fontWeight: 700 }}>Within Limit</span>
            </div>
          </div>

          {/* Director 2: Tulio */}
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1d4ed8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                  TS
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Director Tulio</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>TGB Services Account</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1d4ed8' }}>£4,500.00</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>of £5,000.00 (90%)</div>
              </div>
            </div>
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: '90%', height: '100%', background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '9999px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#64748b' }}>
              <span>Remaining allowance: <strong>£500.00</strong></span>
              <span style={{ color: '#2563eb', fontWeight: 700 }}>Within Limit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly P&L Ledger (Extracted directly from SETEMBRO-26 sheet) */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '22px',
        border: '1px solid #eef2f6',
        boxShadow: '0 8px 24px -4px rgba(18, 24, 38, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Live P&L Breakdown (September 2026 Audit)
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
              Direct reconciliation of DPD gross carrier income vs subcontractor payroll, fleet leases, and net company profit.
            </p>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '9999px', background: '#f1f5f9', color: '#475569' }}>
            <FileSpreadsheet size={14} /> Sheet: SETEMBRO-26
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Total DPD Inflow</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '3px' }}>£65,880.38</div>
            <div style={{ fontSize: '10px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>100% of Gross Revenue</div>
          </div>

          <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Drivers Subcontractor Pay</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626', marginTop: '3px' }}>-£38,671.84</div>
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>58.7% Cost of Sales</div>
          </div>

          <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Gross Fleet Margin</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0d6942', marginTop: '3px' }}>£27,208.54</div>
            <div style={{ fontSize: '10px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>41.3% Gross Margin</div>
          </div>

          <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Fleet & Fuel Expenses</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#d97706', marginTop: '3px' }}>-£7,040.20</div>
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Maintenance & Leases</div>
          </div>

          <div style={{ padding: '14px', background: '#ecfdf5', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '11px', color: '#065f46', fontWeight: 700 }}>Net Retained Profit</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#065f46', marginTop: '3px' }}>£15,465.48</div>
            <div style={{ fontSize: '10px', color: '#0d6942', fontWeight: 700, marginTop: '2px' }}>23.5% Net Margin</div>
          </div>
        </div>
      </div>

      {/* Transactions Ledger Table with Smart Linkage */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '22px',
        border: '1px solid #eef2f6',
        boxShadow: '0 8px 24px -4px rgba(18, 24, 38, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Smart Banking Ledger & Relational Links
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
              Every transaction auto-syncs with VAT returns, fleet logbooks, or upcoming driver payslips.
            </p>
          </div>

          {/* Search & Filters */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search transactions, vehicles, drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px 8px 34px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  width: '240px'
                }}
              />
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '11px', top: '10px' }} />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
                background: '#ffffff',
                color: '#334155'
              }}
            >
              <option value="All">All Categories</option>
              <option value="DPD Inflow">DPD Inflow</option>
              <option value="Driver Payment">Driver Payment</option>
              <option value="Vehicle Maintenance">Vehicle Maintenance</option>
              <option value="Fuel Card">Fuel Card</option>
              <option value="Director Drawing">Director Drawing</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>DATE / TXN</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>COMPANY ENTITY</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>DESCRIPTION</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>CATEGORY</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>SMART LINKAGE</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>VAT PORTION</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>AMOUNT</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center' }}>RECEIPT</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(txn => (
                <tr key={txn.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{txn.date}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{txn.id}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: txn.company === 'MS Herrig Ltd' ? '#f0fdf4' : '#eff6ff',
                      color: txn.company === 'MS Herrig Ltd' ? '#166534' : '#1e40af'
                    }}>
                      {txn.company.replace(' and Solutions Ltd', '')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1e293b', maxWidth: '280px' }}>
                    {txn.description}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: txn.category === 'DPD Inflow' ? '#dcfce7' : 
                                  txn.category === 'Vehicle Maintenance' ? '#ffedd5' :
                                  txn.category === 'Fuel Card' ? '#e0e7ff' : '#f1f5f9',
                      color: txn.category === 'DPD Inflow' ? '#15803d' : 
                             txn.category === 'Vehicle Maintenance' ? '#c2410c' :
                             txn.category === 'Fuel Card' ? '#4338ca' : '#475569'
                    }}>
                      {txn.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {txn.linkedEntity ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: txn.linkedEntity.includes('KR23') || txn.linkedEntity.includes('VN71') ? '#0d6942' : '#2563eb'
                      }}>
                        {txn.linkedEntity.includes('KR23') || txn.linkedEntity.includes('VN71') ? <Truck size={13} /> : <UserCheck size={13} />}
                        {txn.linkedEntity}
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>General Ledger</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748b' }}>
                    {txn.vatAmount > 0 ? `£${txn.vatAmount.toFixed(2)}` : '—'}
                  </td>
                  <td style={{
                    padding: '12px 14px',
                    textAlign: 'right',
                    fontWeight: 800,
                    color: txn.type === 'Inflow' ? '#059669' : '#0f172a'
                  }}>
                    {txn.type === 'Inflow' ? '+' : '-'}£{txn.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    {txn.receiptAttached ? (
                      <span title="Receipt Verified & Linked to VAT Return" style={{ color: '#059669', cursor: 'pointer' }}>
                        <Receipt size={16} />
                      </span>
                    ) : (
                      <span title="No Receipt Uploaded" style={{ color: '#cbd5e1' }}>
                        <Receipt size={16} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Bank Transaction with Relational Auto-Router */}
      {isRecordModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Record Bank Transaction
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
                  Smart relational router auto-links fleet costs and driver advance deductions.
                </p>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Company Entity & Transaction Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Company Entity
                  </label>
                  <select
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="MS Herrig Ltd">MS Herrig Ltd</option>
                    <option value="TGB Services and Solutions Ltd">TGB Services and Solutions Ltd</option>
                    <option value="GoConnect">GoConnect Partnership</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Cash Flow Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="Outflow">Expense / Outflow (-)</option>
                    <option value="Inflow">Income / Inflow (+)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Transaction Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brake Pads Replacement, Fuel Direct Debit..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              {/* Amount & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Gross Amount (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Expense Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                    <option value="Driver Payment">Driver Cash Advance / Pay</option>
                    <option value="Fuel Card">Fuel Card Invoice</option>
                    <option value="Director Drawing">Director Drawing</option>
                    <option value="Insurance">Fleet Insurance</option>
                    <option value="Office & Admin">Office & Admin</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Relational Auto-Router Section */}
              {newCategory === 'Vehicle Maintenance' && (
                <div style={{ padding: '14px', background: '#fff7ed', borderRadius: '14px', border: '1px solid #fed7aa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9a3412', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    <Truck size={15} />
                    <span>Auto-Link to Fleet Telemetry Logbook</span>
                  </div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#431407', marginBottom: '4px' }}>
                    Select Vehicle to append repair cost & update lifecycle depreciation:
                  </label>
                  <select
                    value={newLinkedVehicle}
                    onChange={(e) => setNewLinkedVehicle(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #fdba74', fontSize: '12px', background: '#fff' }}
                  >
                    <option value="KR23 XYZ (Mercedes Sprinter)">KR23 XYZ (Mercedes Sprinter - Purchased £24.6k)</option>
                    <option value="VN71 DPD (Ford Transit)">VN71 DPD (Ford Transit Custom)</option>
                    <option value="BW22 VNZ (Vauxhall Vivaro)">BW22 VNZ (Vauxhall Vivaro)</option>
                    <option value="LO70 DPD (Mercedes Sprinter)">LO70 DPD (Mercedes Sprinter)</option>
                  </select>
                </div>
              )}

              {newCategory === 'Driver Payment' && (
                <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '14px', border: '1px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e40af', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    <UserCheck size={15} />
                    <span>Auto-Schedule Deductions on Next 4-Week Payslip</span>
                  </div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#1e3a8a', marginBottom: '4px' }}>
                    Select Driver to receive cash advance:
                  </label>
                  <select
                    value={newLinkedDriver}
                    onChange={(e) => setNewLinkedDriver(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #93c5fd', fontSize: '12px', background: '#fff' }}
                  >
                    <option value="Ronaldo Luiz Silva (DR 85899)">Ronaldo Luiz Silva (DR 85899 - Monzo)</option>
                    <option value="Douglas (DR 85901)">Douglas (DR 85901 - Lloyds)</option>
                    <option value="Alex (DR 85902)">Alex (DR 85902 - Barclays)</option>
                    <option value="Claudio (DR 85903)">Claudio (DR 85903 - Santander)</option>
                  </select>
                </div>
              )}

              {/* Receipt Attachment Upload Dropzone */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Receipt / Invoice Attachment (Required for HMRC VAT Proof)
                </label>
                <div 
                  onClick={() => setNewReceiptName('receipt_inv_sep2026.pdf')}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '14px',
                    padding: '16px',
                    textAlign: 'center',
                    background: newReceiptName ? '#ecfdf5' : '#f8fafc',
                    borderColor: newReceiptName ? '#10b981' : '#cbd5e1',
                    cursor: 'pointer'
                  }}
                >
                  <UploadCloud size={24} color={newReceiptName ? '#059669' : '#94a3b8'} style={{ margin: '0 auto 6px' }} />
                  {newReceiptName ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} color="#065f46" /> {newReceiptName} Attached
                      </span>
                      <div style={{ fontSize: '10px', color: '#059669' }}>20% VAT portion will be auto-tallied into quarterly return</div>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Click to attach VAT receipt or garage invoice</span>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Supports PDF, JPG, PNG up to 10MB</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '9999px',
                  background: '#0d6942',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '8px',
                  boxShadow: '0 4px 14px rgba(13, 105, 66, 0.25)'
                }}
              >
                Commit & Route Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
