'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Download, 
  Printer, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Building, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Percent, 
  Truck, 
  Fuel, 
  ArrowDownLeft,
  ExternalLink
} from 'lucide-react';

interface DriverPayrollRecord {
  id: string;
  driverCode: string;
  driverName: string;
  bankDetails: string;
  franchise: string;
  vanType: 'Company Van' | 'Own Van';
  totalDeliveries: number;
  grossAgreed: number;
  adminFee: number;
  vanRent: number;
  fuelCard: number;
  vanDeposit: number;
  cashAdvance: number;
  netExVat: number;
  vatAmount: number;
  totalNetPaid: number;
  status: 'Ready' | 'Transferred' | 'Pending Audit';
}

const PAYROLL_DRIVERS: DriverPayrollRecord[] = [
  {
    id: 'PAY-85899',
    driverCode: 'DR 85899',
    driverName: 'Ronaldo Luiz Silva',
    bankDetails: 'Monzo • 04-00-04 • ••••8912',
    franchise: 'FD 12354 (Birmingham Central)',
    vanType: 'Company Van',
    totalDeliveries: 3420,
    grossAgreed: 4180.00,
    adminFee: 158.87,
    vanRent: 1300.00,
    fuelCard: 220.00,
    vanDeposit: 200.00,
    cashAdvance: 0.00,
    netExVat: 2488.97,
    vatAmount: 497.79,
    totalNetPaid: 2986.76,
    status: 'Ready'
  },
  {
    id: 'PAY-85901',
    driverCode: 'DR 85901',
    driverName: 'Douglas Santos',
    bankDetails: 'Lloyds • 30-98-97 • ••••3419',
    franchise: 'FD 14902 (Solihull West)',
    vanType: 'Own Van',
    totalDeliveries: 3610,
    grossAgreed: 4400.00,
    adminFee: 264.00,
    vanRent: 0.00,
    fuelCard: 310.00,
    vanDeposit: 0.00,
    cashAdvance: 0.00,
    netExVat: 3826.00,
    vatAmount: 765.20,
    totalNetPaid: 4591.20,
    status: 'Ready'
  },
  {
    id: 'PAY-85902',
    driverCode: 'DR 85902',
    driverName: 'Alex Moreira',
    bankDetails: 'Barclays • 20-00-00 • ••••1102',
    franchise: 'FD 12354 (Birmingham Central)',
    vanType: 'Company Van',
    totalDeliveries: 3150,
    grossAgreed: 3960.00,
    adminFee: 148.20,
    vanRent: 1300.00,
    fuelCard: 195.00,
    vanDeposit: 200.00,
    cashAdvance: 250.00,
    netExVat: 1866.80,
    vatAmount: 373.36,
    totalNetPaid: 2240.16,
    status: 'Ready'
  },
  {
    id: 'PAY-85903',
    driverCode: 'DR 85903',
    driverName: 'Claudio Oliveira',
    bankDetails: 'Santander • 09-01-28 • ••••9931',
    franchise: 'FD 16031 (Coventry North)',
    vanType: 'Company Van',
    totalDeliveries: 3380,
    grossAgreed: 4180.00,
    adminFee: 162.50,
    vanRent: 1300.00,
    fuelCard: 210.00,
    vanDeposit: 200.00,
    cashAdvance: 0.00,
    netExVat: 2307.50,
    vatAmount: 461.50,
    totalNetPaid: 2769.00,
    status: 'Ready'
  },
  {
    id: 'PAY-85904',
    driverCode: 'DR 85904',
    driverName: 'Tiago Fernandes',
    bankDetails: 'Revolut • 04-00-75 • ••••4521',
    franchise: 'FD 12354 (Birmingham Central)',
    vanType: 'Company Van',
    totalDeliveries: 2890,
    grossAgreed: 3520.00,
    adminFee: 132.00,
    vanRent: 1300.00,
    fuelCard: 180.00,
    vanDeposit: 200.00,
    cashAdvance: 0.00,
    netExVat: 1708.00,
    vatAmount: 341.60,
    totalNetPaid: 2049.60,
    status: 'Ready'
  },
  {
    id: 'PAY-85905',
    driverCode: 'DR 85905',
    driverName: 'Eduardo Martins',
    bankDetails: 'NatWest • 60-00-01 • ••••8290',
    franchise: 'FD 14902 (Solihull West)',
    vanType: 'Own Van',
    totalDeliveries: 3520,
    grossAgreed: 4400.00,
    adminFee: 264.00,
    vanRent: 0.00,
    fuelCard: 290.00,
    vanDeposit: 0.00,
    cashAdvance: 0.00,
    netExVat: 3846.00,
    vatAmount: 769.20,
    totalNetPaid: 4615.20,
    status: 'Ready'
  }
];

export const PayrollTab: React.FC = () => {
  const [payPeriod, setPayPeriod] = useState('12-10-2026 to 08-11-2026 (4-Week Cycle)');
  const [paymentDate, setPaymentDate] = useState('13-11-2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<DriverPayrollRecord | null>(null);
  const [drivers, setDrivers] = useState<DriverPayrollRecord[]>(PAYROLL_DRIVERS);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleProcessBatch = () => {
    setDrivers(prev => prev.map(d => ({ ...d, status: 'Transferred' })));
    showNotification('BACS Payout batch generated. All 13 drivers set to Transferred.');
  };

  const filteredDrivers = drivers.filter(d => 
    d.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.driverCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.franchise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGross = drivers.reduce((acc, d) => acc + d.grossAgreed, 0);
  const totalAdminFees = drivers.reduce((acc, d) => acc + d.adminFee, 0);
  const totalVanRent = drivers.reduce((acc, d) => acc + d.vanRent, 0);
  const totalNet = drivers.reduce((acc, d) => acc + d.totalNetPaid, 0);

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

      {/* Header with Title and Pay Period Selector */}
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
              Sprint 6 • Automated Subcontractor Remittance
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Matched with sample tab: RONALDO</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
            4-Week Driver Payroll & Remittance Engine
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: 0 }}>
            Automated 6% commission fee deduction, van hire recovery (£1,300), damage escrow (£200), and HMRC 20% VAT calculations.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Period Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '6px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Calendar size={15} color="#0d6942" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Period:</span>
            <select
              value={payPeriod}
              onChange={(e) => setPayPeriod(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: 700, color: '#0f172a', cursor: 'pointer', outline: 'none' }}
            >
              <option value="12-10-2026 to 08-11-2026 (4-Week Cycle)">12-10-2026 to 08-11-2026 (Pay: 13-11)</option>
              <option value="14-09-2026 to 11-10-2026 (4-Week Cycle)">14-09-2026 to 11-10-2026 (Pay: 16-10)</option>
              <option value="17-08-2026 to 13-09-2026 (4-Week Cycle)">17-08-2026 to 13-09-2026 (Pay: 18-09)</option>
            </select>
          </div>

          <button
            onClick={handleProcessBatch}
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
            <CreditCard size={16} />
            <span>Process BACS Payout Batch</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '18px', border: '1px solid #eef2f6', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Total Agreed Route Gross</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
            £{totalGross.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>13 Active Subcontractors</div>
        </div>

        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '18px', border: '1px solid #eef2f6', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>6% Admin Fees Retained</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0d6942', marginTop: '2px' }}>
            £{totalAdminFees.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11px', color: '#0d6942', fontWeight: 700, marginTop: '2px' }}>Company Management Revenue</div>
        </div>

        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '18px', border: '1px solid #eef2f6', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Van Rental Deductions</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
            £{totalVanRent.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginTop: '2px' }}>Fleet Cost Recovery (£325/wk)</div>
        </div>

        <div style={{ background: '#ecfdf5', padding: '18px', borderRadius: '18px', border: '1px solid #bbf7d0', boxShadow: '0 4px 12px rgba(13,105,66,0.04)' }}>
          <div style={{ fontSize: '11px', color: '#065f46', fontWeight: 700 }}>Total Net Remittance</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#065f46', marginTop: '2px' }}>
            £{totalNet.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>Due via BACS on 13-Nov</div>
        </div>
      </div>

      {/* Driver Remittance Table */}
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
              Driver Remittance Summaries (12-Oct to 08-Nov)
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
              Click any driver row to inspect their formal itemized DPD Remittance Advice with daily breakdowns.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search driver name, code, franchise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px 8px 34px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
                width: '260px'
              }}
            />
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '11px', top: '10px' }} />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>DRIVER DETAILS</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>FRANCHISE / DEPOT</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>VAN TYPE</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>GROSS AGREED</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>ADMIN FEE (6%)</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>VAN RENT</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>DEPOSIT / FUEL</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>NET (+VAT)</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map(drv => (
                <tr 
                  key={drv.id} 
                  onClick={() => setSelectedDriver(drv)}
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{drv.driverName}</div>
                    <div style={{ fontSize: '11px', color: '#0d6942', fontWeight: 600 }}>{drv.driverCode} • {drv.bankDetails}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>{drv.franchise}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: drv.vanType === 'Company Van' ? '#eff6ff' : '#f0fdf4',
                      color: drv.vanType === 'Company Van' ? '#1e40af' : '#166534'
                    }}>
                      {drv.vanType}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                    £{drv.grossAgreed.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>
                    -£{drv.adminFee.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: drv.vanRent > 0 ? '#dc2626' : '#94a3b8', fontWeight: 600 }}>
                    {drv.vanRent > 0 ? `-£${drv.vanRent.toFixed(2)}` : '£0.00'}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748b' }}>
                    -£{(drv.vanDeposit + drv.fuelCard + drv.cashAdvance).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#0d6942', fontSize: '13px' }}>
                      £{drv.totalNetPaid.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>inc. 20% VAT (£{drv.vatAmount.toFixed(2)})</div>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDriver(drv);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        background: '#f1f5f9',
                        color: '#0d6942',
                        border: '1px solid #e2e8f0',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FileText size={13} />
                      <span>Advice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Remittance Advice Modal (Matching RONALDO sheet from Excel) */}
      {selectedDriver && (
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
            maxWidth: '720px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
            border: '1px solid #e2e8f0',
            fontFamily: "'Inter', sans-serif"
          }}>
            {/* Modal Actions Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px', textTransform: 'uppercase' }}>
                  Official DPD Remittance Advice
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Period Ref: 12-10-26_08-11-26</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={14} /> Print
                </button>
                <button
                  onClick={() => setSelectedDriver(null)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Formal Printable Document Layout */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', background: '#fafbfc' }}>
              {/* Company & Driver Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0d6942', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#0d6942' }}>MS HERRIG LTD</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Logistics Contractor • DPD Franchise Network</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>VAT Reg: GB 412 8990 12 • Company: 13982711</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>PAYMENT DATE</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#0d6942' }}>13-11-2026</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Cycle: 12-10-26 to 08-11-26</div>
                </div>
              </div>

              {/* Driver Beneficiary Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Beneficiary Subcontractor</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedDriver.driverName}</div>
                  <div style={{ fontSize: '12px', color: '#0d6942', fontWeight: 700 }}>Driver Code: {selectedDriver.driverCode}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Bank Account Details</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedDriver.bankDetails}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Depot / Franchise: {selectedDriver.franchise}</div>
                </div>
              </div>

              {/* Daily Delivery Routes Breakdown Table (from sample sheet) */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  ROUTE PERFORMANCE & RECONCILIATION SUMMARY
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '8px 10px' }}>WEEK / DATE</th>
                      <th style={{ padding: '8px 10px' }}>ROUTE CODE</th>
                      <th style={{ padding: '8px 10px' }}>TYPE</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>AGREED RATE</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>DPD REMITTED</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>DISCREPANCY</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px' }}>Week 41 (12/10 - 18/10)</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700 }}>Route 593</td>
                      <td style={{ padding: '8px 10px' }}>Standard Parcel Delivery</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>£1,045.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>£987.58</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#dc2626', fontWeight: 800 }}>-£57.42</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px' }}>Week 42 (19/10 - 25/10)</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700 }}>Route 593</td>
                      <td style={{ padding: '8px 10px' }}>Standard Parcel Delivery</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>£1,045.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>£1,045.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#059669', fontWeight: 700 }}>£0.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px' }}>Week 43 (26/10 - 01/11)</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700 }}>Route 214</td>
                      <td style={{ padding: '8px 10px' }}>Sunday Coverage Bonus</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>£1,045.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>£1,045.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#059669', fontWeight: 700 }}>£0.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px' }}>Week 44 (02/11 - 08/11)</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700 }}>Route 593</td>
                      <td style={{ padding: '8px 10px' }}>Standard Parcel Delivery</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>£1,045.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>£1,045.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#059669', fontWeight: 700 }}>£0.00</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                      <td colSpan={3} style={{ padding: '8px 10px' }}>Gross Route Subtotal</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0f172a' }}>£{selectedDriver.grossAgreed.toFixed(2)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>£{(selectedDriver.grossAgreed - 57.42).toFixed(2)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#dc2626' }}>-£57.42</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Deductions Breakdown */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                  ITEMIZED AUTHORIZED DEDUCTIONS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                    <span>6% Administration & Management Commission Fee</span>
                    <strong style={{ color: '#dc2626' }}>-£{selectedDriver.adminFee.toFixed(2)}</strong>
                  </div>
                  {selectedDriver.vanRent > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                      <span>Company Van Rental Lease (4 Weeks @ £325.00/wk)</span>
                      <strong style={{ color: '#dc2626' }}>-£{selectedDriver.vanRent.toFixed(2)}</strong>
                    </div>
                  )}
                  {selectedDriver.fuelCard > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                      <span>Allstar Fuel Card Usage Deductions</span>
                      <strong style={{ color: '#dc2626' }}>-£{selectedDriver.fuelCard.toFixed(2)}</strong>
                    </div>
                  )}
                  {selectedDriver.vanDeposit > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                      <span>Van Damage Escrow Deposit Installment (Cap: £1,000.00)</span>
                      <strong style={{ color: '#dc2626' }}>-£{selectedDriver.vanDeposit.toFixed(2)}</strong>
                    </div>
                  )}
                  {selectedDriver.cashAdvance > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                      <span>Prior Mid-Period Emergency Cash Advance Recovery</span>
                      <strong style={{ color: '#dc2626' }}>-£{selectedDriver.cashAdvance.toFixed(2)}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Final Net & 20% VAT Callout */}
              <div style={{ background: '#ecfdf5', borderRadius: '14px', border: '2px solid #bbf7d0', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#166534', marginBottom: '6px' }}>
                  <span>Net Earnings Ex. VAT:</span>
                  <strong>£{selectedDriver.netExVat.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#166534', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #86efac' }}>
                  <span>UK VAT @ 20% (Subcontractor Output Tax):</span>
                  <strong>+£{selectedDriver.vatAmount.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#065f46', fontWeight: 800 }}>Total Net Payment Transfer Amount</div>
                    <div style={{ fontSize: '9px', color: '#047857' }}>Ref: BACS-MSH-{selectedDriver.driverCode}-NOV26</div>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#065f46' }}>
                    £{selectedDriver.totalNetPaid.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
