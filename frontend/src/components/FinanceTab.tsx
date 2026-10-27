'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send
} from 'lucide-react';

interface PayoutRecord {
  id: string;
  riderName: string;
  period: string;
  deliveries: number;
  tips: number;
  grossAmount: number;
  platformFee: number;
  netPayout: number;
  status: 'Transferred' | 'Processing';
  payoutDate: string;
}

const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: 'PO-901',
    riderName: 'Marcus Vance',
    period: 'Jun 1 - Jun 15, 2025',
    deliveries: 184,
    tips: 420.00,
    grossAmount: 3680.00,
    platformFee: 368.00,
    netPayout: 3732.00,
    status: 'Transferred',
    payoutDate: 'Jun 16, 2025'
  },
  {
    id: 'PO-902',
    riderName: 'Elena Rostova',
    period: 'Jun 1 - Jun 15, 2025',
    deliveries: 142,
    tips: 310.00,
    grossAmount: 2840.00,
    platformFee: 284.00,
    netPayout: 2866.00,
    status: 'Transferred',
    payoutDate: 'Jun 16, 2025'
  },
  {
    id: 'PO-903',
    riderName: 'Tariq Al-Mansoor',
    period: 'Jun 1 - Jun 15, 2025',
    deliveries: 230,
    tips: 580.00,
    grossAmount: 4600.00,
    platformFee: 460.00,
    netPayout: 4720.00,
    status: 'Transferred',
    payoutDate: 'Jun 16, 2025'
  },
  {
    id: 'PO-904',
    riderName: 'David Kim',
    period: 'Jun 16 - Jun 30, 2025',
    deliveries: 120,
    tips: 240.00,
    grossAmount: 2400.00,
    platformFee: 240.00,
    netPayout: 2400.00,
    status: 'Processing',
    payoutDate: 'Pending'
  }
];

export const FinanceTab: React.FC = () => {
  const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleProcessAll = () => {
    setPayouts(prev => prev.map(p => ({ ...p, status: 'Transferred', payoutDate: 'Today' })));
    showNotification('All pending rider payouts processed successfully.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
          zIndex: 2000,
          fontWeight: 600,
          fontSize: '13px'
        }}>
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#121826' }}>
            Treasury & Rider Finance Management
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Net earnings, rider compensation settlements, and cashflow distribution ledger.
          </p>
        </div>

        <button
          onClick={handleProcessAll}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '14px' }}
        >
          <Send size={16} />
          <span>Process Batch Payout</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div className="quix-card">
          <span style={{ fontSize: '12px', color: '#64748b' }}>Platform Net Liquidity</span>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#121826', margin: '6px 0 8px' }}>
            $112,480.20
          </div>
          <span className="pill-badge badge-mint">
            +18.4% monthly growth
          </span>
        </div>

        <div className="quix-card">
          <span style={{ fontSize: '12px', color: '#0d6942', fontWeight: 600 }}>Rider Payouts Disbursed</span>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#0d6942', margin: '6px 0 8px' }}>
            $68,910.00
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Across 42 active delivery partners
          </span>
        </div>

        <div className="quix-card">
          <span style={{ fontSize: '12px', color: '#64748b' }}>Platform Operating Margin</span>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#121826', margin: '6px 0 8px' }}>
            24.6%
          </div>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
            +2.1% efficiency gains
          </span>
        </div>
      </div>

      {/* Payouts Ledger Table */}
      <div className="quix-card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#121826' }}>
              Rider Compensation & Payout Ledger
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Automated bi-weekly settlements including delivery base pay and 100% rider tips.
            </p>
          </div>
          <button 
            onClick={() => showNotification("Exporting ledger to CSV...")}
            className="btn-secondary" 
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            Export Ledger
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 20px' }}>Payout ID</th>
                <th style={{ padding: '16px 20px' }}>Delivery Partner</th>
                <th style={{ padding: '16px 20px' }}>Settlement Period</th>
                <th style={{ padding: '16px 20px' }}>Orders / Tips</th>
                <th style={{ padding: '16px 20px' }}>Gross Amount</th>
                <th style={{ padding: '16px 20px' }}>Net Transfer</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px' }}>
              {payouts.map(po => (
                <tr key={po.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 800, color: '#121826' }}>
                    {po.id}
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: '#1e293b' }}>
                    {po.riderName}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#64748b' }}>
                    {po.period}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ color: '#1e293b', fontWeight: 600 }}>{po.deliveries} deliveries</div>
                    <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>+${po.tips.toFixed(2)} tips</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#64748b' }}>
                    ${po.grossAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 800, color: '#0d6942' }}>
                    ${po.netPayout.toFixed(2)} USD
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {po.status === 'Transferred' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '9999px', background: '#d1fae5', color: '#065f46', fontSize: '11px', fontWeight: 700 }}>
                        <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
                        Transferred
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '9999px', background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 700 }}>
                        <span style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }} />
                        Processing
                      </span>
                    )}
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
