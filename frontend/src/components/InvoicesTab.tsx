'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  CheckCircle2, 
  Plus
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  deliveryCount: number;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-081',
    clientName: 'Dribbble Design Inc.',
    issueDate: '10 Jun 2025',
    dueDate: '25 Jun 2025',
    deliveryCount: 142,
    amount: 89345.23,
    status: 'Paid'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-082',
    clientName: 'Google Pay Operations',
    issueDate: '12 Jun 2025',
    dueDate: '27 Jun 2025',
    deliveryCount: 95,
    amount: 12345.89,
    status: 'Paid'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2025-083',
    clientName: 'Amazon Shopping Logistics',
    issueDate: '14 Jun 2025',
    dueDate: '29 Jun 2025',
    deliveryCount: 310,
    amount: 32123.67,
    status: 'Paid'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2025-084',
    clientName: 'FreshFarm Organic Chain',
    issueDate: '20 Jun 2025',
    dueDate: '05 Jul 2025',
    deliveryCount: 68,
    amount: 18450.00,
    status: 'Pending'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2025-085',
    clientName: 'Supreme Apparel NY',
    issueDate: '01 Jun 2025',
    dueDate: '16 Jun 2025',
    deliveryCount: 44,
    amount: 9280.50,
    status: 'Overdue'
  }
];

export const InvoicesTab: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleMarkAsPaid = (invId: string, invNum: string) => {
    setInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, status: 'Paid' } : inv));
    showNotification(`Invoice ${invNum} marked as Paid.`);
  };

  const filtered = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
                          inv.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'All' ? true : inv.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalBilled = invoices.reduce((acc, i) => acc + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);
  const totalOutstanding = invoices.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + i.amount, 0);

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
            Invoicing & Corporate Billing
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Monitor receivable balances, corporate customer settlements, and billing history.
          </p>
        </div>

        <button 
          onClick={() => showNotification("Invoice generator dialog opened.")}
          className="btn-primary" 
          style={{ padding: '12px 24px', fontSize: '14px' }}
        >
          <Plus size={18} />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Financial Metrics */}
      <div className="stat-cards-grid">
        <div className="quix-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Gross Invoiced</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#121826', marginTop: '4px' }}>
            ${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="quix-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: '#0d6942', fontWeight: 600 }}>Settled & Collected</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0d6942', marginTop: '4px' }}>
            ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="quix-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: '#d97706', fontWeight: 600 }}>Outstanding Balance</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="quix-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <input
            type="text"
            placeholder="Search invoice #, client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 14px 9px 36px',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0',
              fontSize: '13px',
              background: '#f8fafc'
            }}
          />
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Paid', 'Pending', 'Overdue'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                background: statusFilter === status ? '#0d6942' : '#f8fafc',
                color: statusFilter === status ? '#ffffff' : '#64748b',
                border: '1px solid',
                borderColor: statusFilter === status ? '#0d6942' : '#e2e8f0',
                transition: 'all 0.2s',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="quix-card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 20px' }}>Invoice ID</th>
                <th style={{ padding: '16px 20px' }}>Client</th>
                <th style={{ padding: '16px 20px' }}>Issue / Due Date</th>
                <th style={{ padding: '16px 20px' }}>Deliveries</th>
                <th style={{ padding: '16px 20px' }}>Total Amount</th>
                <th style={{ padding: '16px 20px' }}>Payment Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px' }}>
              {filtered.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#121826' }}>
                      <FileText size={16} color="#0d6942" />
                      <span>{inv.invoiceNumber}</span>
                    </div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{inv.clientName}</span>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ color: '#475569' }}>Issued: {inv.issueDate}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Due: {inv.dueDate}</div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{inv.deliveryCount} orders</span>
                  </td>

                  <td style={{ padding: '16px 20px', fontWeight: 800, color: '#121826' }}>
                    ${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    {inv.status === 'Paid' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '9999px', background: '#d1fae5', color: '#065f46', fontSize: '11px', fontWeight: 700 }}>
                        <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
                        Paid
                      </span>
                    )}
                    {inv.status === 'Pending' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '9999px', background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 700 }}>
                        <span style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }} />
                        Pending
                      </span>
                    )}
                    {inv.status === 'Overdue' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '9999px', background: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: 700 }}>
                        <span style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }} />
                        Overdue
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => handleMarkAsPaid(inv.id, inv.invoiceNumber)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            color: '#065f46',
                            fontSize: '11px',
                            fontWeight: 600
                          }}
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => showNotification(`Downloading ${inv.invoiceNumber}.pdf`)}
                        title="Download PDF"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#475569'
                        }}
                      >
                        <Download size={14} />
                      </button>
                    </div>
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
