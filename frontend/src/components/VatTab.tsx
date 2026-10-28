'use client';

import React, { useState } from 'react';
import { 
  Receipt, 
  FileCheck, 
  UploadCloud, 
  Download, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  ExternalLink, 
  Search, 
  X, 
  FileSpreadsheet,
  ArrowRight,
  Eye
} from 'lucide-react';

interface VatMonthBreakdown {
  month: string;
  grossSales: number;
  outputVat: number;
  grossPurchases: number;
  inputVat: number;
  netDue: number;
}

interface StoredReceipt {
  id: string;
  date: string;
  supplier: string;
  category: 'Fuel' | 'Vehicle Repair' | 'Driver Subcontractor' | 'Software & Leases';
  invoiceNumber: string;
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
  status: 'HMRC Verified' | 'Pending Review';
  fileType: string;
}

const VAT_MONTHS: VatMonthBreakdown[] = [
  {
    month: 'July 2026',
    grossSales: 44473.80,
    outputVat: 7412.30,
    grossPurchases: 38240.25,
    inputVat: 6373.38,
    netDue: 1038.92
  },
  {
    month: 'August 2026',
    grossSales: 45062.40,
    outputVat: 7510.40,
    grossPurchases: 39110.80,
    inputVat: 6518.47,
    netDue: 991.93
  },
  {
    month: 'September 2026',
    grossSales: 46225.68,
    outputVat: 7704.28,
    grossPurchases: 39711.75,
    inputVat: 6618.63,
    netDue: 1085.65
  }
];

const INITIAL_RECEIPTS: StoredReceipt[] = [
  {
    id: 'REC-901',
    date: '2026-09-26',
    supplier: 'Mercedes-Benz Birmingham Central',
    category: 'Vehicle Repair',
    invoiceNumber: 'MB-88491',
    netAmount: 883.33,
    vatAmount: 176.67,
    grossAmount: 1060.00,
    status: 'HMRC Verified',
    fileType: 'PDF'
  },
  {
    id: 'REC-902',
    date: '2026-09-25',
    supplier: 'Allstar Business Solutions (Fuel Cards)',
    category: 'Fuel',
    invoiceNumber: 'ALL-2026-09',
    netAmount: 1791.67,
    vatAmount: 358.33,
    grossAmount: 2150.00,
    status: 'HMRC Verified',
    fileType: 'PDF'
  },
  {
    id: 'REC-903',
    date: '2026-09-20',
    supplier: 'Tyre City Solihull Ltd',
    category: 'Vehicle Repair',
    invoiceNumber: 'TC-10492',
    netAmount: 316.67,
    vatAmount: 63.33,
    grossAmount: 380.00,
    status: 'HMRC Verified',
    fileType: 'PNG'
  },
  {
    id: 'REC-904',
    date: '2026-09-18',
    supplier: 'Ronaldo Luiz Silva (DR 85899)',
    category: 'Driver Subcontractor',
    invoiceNumber: 'INV-RLS-SEP26',
    netAmount: 2488.97,
    vatAmount: 497.79,
    grossAmount: 2986.76,
    status: 'HMRC Verified',
    fileType: 'PDF'
  },
  {
    id: 'REC-905',
    date: '2026-09-14',
    supplier: 'Northgate Vehicle Hire UK',
    category: 'Software & Leases',
    invoiceNumber: 'NG-77102',
    netAmount: 1083.33,
    vatAmount: 216.67,
    grossAmount: 1300.00,
    status: 'HMRC Verified',
    fileType: 'PDF'
  }
];

export const VatTab: React.FC = () => {
  const [quarter, setQuarter] = useState('01-07-26 TO 30-09-26 (Q3 2026)');
  const [receipts, setReceipts] = useState<StoredReceipt[]>(INITIAL_RECEIPTS);
  const [searchReceipt, setSearchReceipt] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<StoredReceipt | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Upload Form State
  const [uploadSupplier, setUploadSupplier] = useState('');
  const [uploadAmount, setUploadAmount] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'Fuel' | 'Vehicle Repair' | 'Driver Subcontractor' | 'Software & Leases'>('Vehicle Repair');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUploadReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadSupplier || !uploadAmount) return;

    const gross = parseFloat(uploadAmount);
    const vat = +(gross * 0.2 / 1.2).toFixed(2);
    const net = +(gross - vat).toFixed(2);

    const newRec: StoredReceipt = {
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      supplier: uploadSupplier,
      category: uploadCategory,
      invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      netAmount: net,
      vatAmount: vat,
      grossAmount: gross,
      status: 'HMRC Verified',
      fileType: 'PDF'
    };

    setReceipts([newRec, ...receipts]);
    setIsUploadModalOpen(false);
    setUploadSupplier('');
    setUploadAmount('');
    setUploadedFileName(null);
    showNotification('Receipt uploaded, OCR verified, and automatically linked to Box 4 Input VAT.');
  };

  const totalOutputVat = 22626.98;
  const totalInputVat = 19510.48;
  const netVatDue = 3116.50;
  const actualPaidHMRC = 3420.00;
  const variance = 303.50; // Overpayment credit

  const filteredReceipts = receipts.filter(r =>
    r.supplier.toLowerCase().includes(searchReceipt.toLowerCase()) ||
    r.invoiceNumber.toLowerCase().includes(searchReceipt.toLowerCase()) ||
    r.category.toLowerCase().includes(searchReceipt.toLowerCase())
  );

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

      {/* Header with Title and Quarter Selector */}
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
              Sprint 5 • HMRC Making Tax Digital (MTD)
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Matched with sample tab: 01-07-26 TO 30-09-26</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
            HMRC Quarterly VAT Engine & Digital Receipt Vault
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: 0 }}>
            Automated 9-Box VAT return calculation, monthly comparative tally, and receipt compliance storage.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '6px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Calendar size={15} color="#0d6942" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Quarter:</span>
            <select
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: 700, color: '#0f172a', cursor: 'pointer', outline: 'none' }}
            >
              <option value="01-07-26 TO 30-09-26 (Q3 2026)">01-07-26 to 30-09-26 (Q3 2026)</option>
              <option value="01-04-26 TO 30-06-26 (Q2 2026)">01-04-26 to 30-06-26 (Q2 2026)</option>
              <option value="01-01-26 TO 31-03-26 (Q1 2026)">01-01-26 to 31-03-26 (Q1 2026)</option>
            </select>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
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
            <UploadCloud size={16} />
            <span>Upload VAT Receipt</span>
          </button>
        </div>
      </div>

      {/* Official HMRC 9-Box Calculation Summary Card */}
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
              Quarterly VAT Reconciliation (01-07-2026 to 30-09-2026)
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
              MS Herrig Ltd • VAT Registration: GB 412 8990 12 • Filing Deadline: 07-11-2026
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '9999px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> MTD Compliant
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '9999px', background: '#eff6ff', color: '#1e40af' }}>
              Status: Filed & Paid
            </span>
          </div>
        </div>

        {/* 5 Box Metric Cards directly mirroring the spreadsheet */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>BOX 1: OUTPUT VAT</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              £{totalOutputVat.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '10px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>Charged to DPD & Clients</div>
          </div>

          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>BOX 4: INPUT VAT</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              £{totalInputVat.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '10px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>Reclaimed from Purchases</div>
          </div>

          <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '11px', color: '#065f46', fontWeight: 700 }}>BOX 5: NET DUE TO HMRC</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#065f46', marginTop: '4px' }}>
              £{netVatDue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '10px', color: '#047857', fontWeight: 700, marginTop: '2px' }}>Box 1 minus Box 4</div>
          </div>

          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>PAID TO HMRC</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              £{actualPaidHMRC.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>Direct Debit Settlement</div>
          </div>

          <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '14px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 700 }}>VARIANCE / CREDIT</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>
              +£{variance.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '10px', color: '#1e40af', fontWeight: 700, marginTop: '2px' }}>Rolled Over as HMRC Credit</div>
          </div>
        </div>

        {/* 3-Month Comparative Breakdown Table (July, August, September) */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            3-Month Comparative Ledger (Spreadsheet Tab: 01-07-26 TO 30-09-26)
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>ACCOUNTING MONTH</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>GROSS SALES</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>OUTPUT VAT (20%)</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>GROSS PURCHASES</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>INPUT VAT RECLAIM</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>NET MONTHLY DUE</th>
                </tr>
              </thead>
              <tbody>
                {VAT_MONTHS.map(m => (
                  <tr key={m.month} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>{m.month}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>£{m.grossSales.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>£{m.outputVat.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>£{m.grossPurchases.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>£{m.inputVat.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>£{m.netDue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f8fafc', fontWeight: 900, borderTop: '2px solid #cbd5e1' }}>
                  <td style={{ padding: '10px 12px' }}>QUARTER TOTAL</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>£135,761.88</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#059669' }}>£22,626.98</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>£117,062.80</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#2563eb' }}>£19,510.48</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0d6942' }}>£3,116.50</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Digital Receipt Vault (HMRC 6-Year Retention) */}
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
              HMRC Digital Receipt Vault & Purchase Audit Trail
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
              Every receipt is OCR scanned, categorized, and backed up for mandatory 6-year HMRC audit compliance.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search supplier, invoice no, category..."
              value={searchReceipt}
              onChange={(e) => setSearchReceipt(e.target.value)}
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

        {/* Receipt Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {filteredReceipts.map(rec => (
            <div
              key={rec.id}
              onClick={() => setSelectedReceipt(rec)}
              style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0d6942';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 700,
                    background: rec.category === 'Fuel' ? '#e0e7ff' : 
                                rec.category === 'Vehicle Repair' ? '#ffedd5' : '#f0fdf4',
                    color: rec.category === 'Fuel' ? '#4338ca' : 
                           rec.category === 'Vehicle Repair' ? '#c2410c' : '#166534',
                    marginBottom: '4px'
                  }}>
                    {rec.category}
                  </span>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{rec.supplier}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{rec.invoiceNumber} • {rec.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>£{rec.grossAmount.toFixed(2)}</div>
                  <div style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>VAT: £{rec.vatAmount.toFixed(2)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', fontSize: '11px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 600 }}>
                  <CheckCircle2 size={13} /> {rec.status}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#0d6942', fontWeight: 700 }}>
                  <Eye size={13} /> View Invoice
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: View Receipt Document */}
      {selectedReceipt && (
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
            padding: '28px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt size={20} color="#0d6942" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  HMRC Verified Purchase Receipt
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', background: '#f8fafc', marginBottom: '18px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{selectedReceipt.supplier}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Invoice: {selectedReceipt.invoiceNumber} • Date: {selectedReceipt.date}</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Net Purchase Value:</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>£{selectedReceipt.netAmount.toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>20% VAT Reclaim Portion:</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#059669' }}>£{selectedReceipt.vatAmount.toFixed(2)}</div>
                </div>
              </div>

              <div style={{ marginTop: '14px', padding: '10px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#065f46', fontWeight: 700 }}>
                <CheckCircle2 size={16} />
                <span>Audited: Automatically linked to Box 4 Input VAT in Q3 Return</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '9999px',
                background: '#0d6942',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Close Receipt Inspector
            </button>
          </div>
        </div>
      )}

      {/* Modal: Upload & OCR Receipt */}
      {isUploadModalOpen && (
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
            maxWidth: '520px',
            padding: '28px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Upload & Auto-OCR VAT Receipt
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
                  Extracts supplier, date, and 20% VAT portion automatically.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadReceipt} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Supplier / Vendor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shell UK, Mercedes Garage, KwikFit..."
                  value={uploadSupplier}
                  onChange={(e) => setUploadSupplier(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

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
                    value={uploadAmount}
                    onChange={(e) => setUploadAmount(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="Vehicle Repair">Vehicle Repair</option>
                    <option value="Fuel">Fuel Card / Diesel</option>
                    <option value="Driver Subcontractor">Driver Subcontractor</option>
                    <option value="Software & Leases">Software & Leases</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Receipt File (PDF, PNG, JPG)
                </label>
                <div
                  onClick={() => setUploadedFileName('garage_receipt_scan.pdf')}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '14px',
                    padding: '18px',
                    textAlign: 'center',
                    background: uploadedFileName ? '#ecfdf5' : '#f8fafc',
                    borderColor: uploadedFileName ? '#10b981' : '#cbd5e1',
                    cursor: 'pointer'
                  }}
                >
                  <UploadCloud size={24} color={uploadedFileName ? '#059669' : '#94a3b8'} style={{ margin: '0 auto 6px' }} />
                  {uploadedFileName ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} color="#065f46" /> {uploadedFileName} Attached
                      </span>
                      <div style={{ fontSize: '10px', color: '#059669' }}>OCR parser detected 20% VAT Rate</div>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Click to select receipt document</span>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Max file size: 15MB</div>
                    </div>
                  )}
                </div>
              </div>

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
                  marginTop: '6px'
                }}
              >
                Upload & Verify into Box 4
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
