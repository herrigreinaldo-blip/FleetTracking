'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  FileText, 
  Download, 
  Send, 
  X, 
  Copy, 
  Building, 
  Calendar,
  Filter,
  DollarSign,
  TrendingDown,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface CarrierAuditRecord {
  id: string;
  carrier: 'DPD' | 'Amazon Logistics' | 'DHL Express' | 'DX';
  depotFranchise: string;
  routeCode: string;
  weekNumber: string;
  assignedDriver: string;
  stopsCompleted: number;
  contractedAgreedRate: number;
  carrierRemittedRate: number;
  discrepancy: number;
  status: 'Underpaid' | 'Match' | 'Disputed' | 'Resolved';
  reason?: string;
}

const AUDIT_RECORDS: CarrierAuditRecord[] = [
  {
    id: 'AUD-593',
    carrier: 'DPD',
    depotFranchise: 'FD 12354 (Birmingham Central)',
    routeCode: 'Route 593',
    weekNumber: 'Week 41 (12/10 - 18/10)',
    assignedDriver: 'Ronaldo Luiz Silva (DR 85899)',
    stopsCompleted: 820,
    contractedAgreedRate: 1045.00,
    carrierRemittedRate: 987.58,
    discrepancy: -57.42,
    status: 'Underpaid',
    reason: 'DPD depot stop count mismatch (-28 stops unauthorized clawback)'
  },
  {
    id: 'AUD-104',
    carrier: 'DPD',
    depotFranchise: 'FD 14902 (Solihull West)',
    routeCode: 'Route 104',
    weekNumber: 'Week 41 (12/10 - 18/10)',
    assignedDriver: 'Douglas Santos (DR 85901)',
    stopsCompleted: 910,
    contractedAgreedRate: 1100.00,
    carrierRemittedRate: 1020.00,
    discrepancy: -80.00,
    status: 'Disputed',
    reason: 'Claimed failed timed window penalty'
  },
  {
    id: 'AUD-214',
    carrier: 'DPD',
    depotFranchise: 'FD 12354 (Birmingham Central)',
    routeCode: 'Route 214',
    weekNumber: 'Week 42 (19/10 - 25/10)',
    assignedDriver: 'Ronaldo Luiz Silva (DR 85899)',
    stopsCompleted: 790,
    contractedAgreedRate: 1045.00,
    carrierRemittedRate: 1045.00,
    discrepancy: 0.00,
    status: 'Match'
  },
  {
    id: 'AUD-302',
    carrier: 'Amazon Logistics',
    depotFranchise: 'BHX4 (Coventry Hub)',
    routeCode: 'Route AMZ-C12',
    weekNumber: 'Week 42 (19/10 - 25/10)',
    assignedDriver: 'Alex Moreira (DR 85902)',
    stopsCompleted: 640,
    contractedAgreedRate: 990.00,
    carrierRemittedRate: 945.00,
    discrepancy: -45.00,
    status: 'Underpaid',
    reason: 'Overtime hour deduction'
  },
  {
    id: 'AUD-401',
    carrier: 'DHL Express',
    depotFranchise: 'EMA Hub (East Midlands)',
    routeCode: 'Route DHL-44',
    weekNumber: 'Week 43 (26/10 - 01/11)',
    assignedDriver: 'Claudio Oliveira (DR 85903)',
    stopsCompleted: 880,
    contractedAgreedRate: 1120.00,
    carrierRemittedRate: 1120.00,
    discrepancy: 0.00,
    status: 'Match'
  }
];

export const AuditTab: React.FC = () => {
  const [selectedCarrier, setSelectedCarrier] = useState<string>('All');
  const [records, setRecords] = useState<CarrierAuditRecord[]>(AUDIT_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [disputeRecord, setDisputeRecord] = useState<CarrierAuditRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredRecords = records.filter(r => {
    const matchesCarrier = selectedCarrier === 'All' || r.carrier === selectedCarrier;
    const matchesSearch = r.routeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.depotFranchise.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.assignedDriver.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCarrier && matchesSearch;
  });

  const totalDiscrepancy = records
    .filter(r => r.discrepancy < 0)
    .reduce((acc, r) => acc + r.discrepancy, 0);

  const handleDisputeSubmitted = () => {
    if (disputeRecord) {
      setRecords(prev => prev.map(r => r.id === disputeRecord.id ? { ...r, status: 'Disputed' } : r));
      setDisputeRecord(null);
      showNotification(`Dispute demand letter generated and dispatched for ${disputeRecord.routeCode}.`);
    }
  };

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

      {/* Header */}
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
              background: '#fee2e2',
              color: '#991b1b',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '9999px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <AlertTriangle size={12} /> Sprint 4 • Carrier Remittance Reconciliation
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>DPD Self-Billed Invoice Audit</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
            DPD Carrier Billing & Discrepancy Auditing
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: 0 }}>
            Automated comparison between contractual agreed route rates and carrier remittances with 1-click dispute generation.
          </p>
        </div>

        {/* Carrier Filter */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '14px',
          border: '1px solid #e2e8f0'
        }}>
          {['All', 'DPD', 'Amazon Logistics', 'DHL Express'].map(c => (
            <button
              key={c}
              onClick={() => setSelectedCarrier(c)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: 'none',
                background: selectedCarrier === c ? '#0d6942' : 'transparent',
                color: selectedCarrier === c ? '#ffffff' : '#64748b',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Discrepancy Alert Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #fff1f2 0%, #fee2e2 100%)',
        borderRadius: '20px',
        padding: '20px 24px',
        border: '1px solid #fecaca',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#991b1b' }}>
              Identified Carrier Underpayments: £{Math.abs(totalDiscrepancy).toFixed(2)} Across Active Cycles
            </div>
            <div style={{ fontSize: '12px', color: '#7f1d1d', marginTop: '2px' }}>
              DPD Depot Birmingham Central (FD 12354) underpaid <strong>Route 593 by -£57.42</strong> on Week 41.
            </div>
          </div>
        </div>

        <button
          onClick={() => setDisputeRecord(records.find(r => r.id === 'AUD-593') || null)}
          style={{
            padding: '10px 18px',
            borderRadius: '9999px',
            background: '#dc2626',
            color: '#ffffff',
            border: 'none',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Send size={14} />
          <span>Generate Dispute for Route 593 (-£57.42)</span>
        </button>
      </div>

      {/* Audit Table */}
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
              Carrier Remittance Line-Item Reconciliation
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
              Formula: (Carrier Remittance Amount) - (Agreed Contractual Rate) = Discrepancy
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search route code, depot, driver..."
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

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>ROUTE / DEPOT</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>PERIOD / DRIVER</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>STOPS</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>AGREED RATE</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>DPD REMITTED</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>DISCREPANCY</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(rec => (
                <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{rec.routeCode}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{rec.depotFranchise}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{rec.weekNumber}</div>
                    <div style={{ fontSize: '11px', color: '#0d6942' }}>{rec.assignedDriver}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                    {rec.stopsCompleted} stops
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                    £{rec.contractedAgreedRate.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#334155' }}>
                    £{rec.carrierRemittedRate.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    {rec.discrepancy < 0 ? (
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        fontWeight: 800
                      }}>
                        -£{Math.abs(rec.discrepancy).toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ color: '#059669', fontWeight: 700 }}>£0.00</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: rec.status === 'Underpaid' ? '#fee2e2' :
                                  rec.status === 'Disputed' ? '#ffedd5' : '#dcfce7',
                      color: rec.status === 'Underpaid' ? '#b91c1c' :
                             rec.status === 'Disputed' ? '#c2410c' : '#15803d'
                    }}>
                      {rec.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    {rec.discrepancy < 0 ? (
                      <button
                        onClick={() => setDisputeRecord(rec)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '9999px',
                          background: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Dispute
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Reconciled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Formal DPD Dispute Demand Letter Generator */}
      {disputeRecord && (
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
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Generate Formal Carrier Dispute Letter
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
                  Pre-filled contractual rate dispute to demand payment for {disputeRecord.routeCode}.
                </p>
              </div>
              <button
                onClick={() => setDisputeRecord(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Generated Letter Body */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: 1.6,
              color: '#1e293b',
              marginBottom: '20px',
              whiteSpace: 'pre-wrap'
            }}>
{`TO: DPD UK Accounts Payable & Depot Franchise Finance (Depot FD 12354)
FROM: MS Herrig Ltd (Subcontractor Logistics Provider)
DATE: 28 October 2026
SUBJECT: CONTRACT RATE DISCREPANCY & CLAWBACK DISPUTE - ${disputeRecord.routeCode}

Dear Depot Finance Manager,

We are writing to formally dispute the underpayment on our self-billed remittance invoice for the following route:

• Franchise Depot: ${disputeRecord.depotFranchise}
• Route Identifier: ${disputeRecord.routeCode}
• Operating Week: ${disputeRecord.weekNumber}
• Subcontractor Driver: ${disputeRecord.assignedDriver}
• Completed Stops Audited: ${disputeRecord.stopsCompleted} stops

FINANCIAL VARIANCE BREAKDOWN:
- Contracted Agreed Route Rate:  £${disputeRecord.contractedAgreedRate.toFixed(2)}
- Remitted Self-Billed Rate:     £${disputeRecord.carrierRemittedRate.toFixed(2)}
------------------------------------------------------------
OUTSTANDING BALANCE DUE:         £${Math.abs(disputeRecord.discrepancy).toFixed(2)} + 20% VAT

REASON FOR DISPUTE:
The carrier remittance reflects an unauthorized deduction of £${Math.abs(disputeRecord.discrepancy).toFixed(2)}. Telematics logs confirm 100% route parcel coverage was fulfilled without driver breach.

Kindly issue a supplementary remittance self-billing invoice for £${Math.abs(disputeRecord.discrepancy).toFixed(2)} on the upcoming weekly cycle.

Yours sincerely,
Reinaldo Herrig
Director, MS Herrig Ltd`}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`DPD Dispute Letter for ${disputeRecord.routeCode}`);
                  showNotification('Dispute letter text copied to clipboard.');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '9999px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Copy size={15} /> Copy Letter Text
              </button>

              <button
                onClick={handleDisputeSubmitted}
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '9999px',
                  background: '#dc2626',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)'
                }}
              >
                <Send size={15} /> Transmit Dispute to DPD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
