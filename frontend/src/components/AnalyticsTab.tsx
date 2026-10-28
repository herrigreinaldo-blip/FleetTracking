'use client';

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Calendar, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Wifi, 
  CreditCard as CreditCardIcon,
  User,
  Package,
  TrendingUp,
  Truck,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface AnalyticsTabProps {
  userName?: string;
  onOpenWalletModal?: () => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  userName = 'Reinaldo',
  onOpenWalletModal,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'monthly' | 'weekly'>('monthly');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Welcome & Action Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#121826',
              letterSpacing: '-0.5px'
            }}>
              Welcome Back, <span style={{ fontWeight: 400 }}>{userName}</span>
            </h1>
            <span style={{
              background: '#dcfce7',
              color: '#15803d',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldCheck size={13} />
              Admin
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Fleet Tracking, Dispatch Logistics & Financial Operations
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Date Range Selector Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            padding: '10px 18px',
            borderRadius: '9999px',
            border: '1px solid #e2e8f0',
            fontSize: '13px',
            fontWeight: 500,
            color: '#334155',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
          }}>
            <Calendar size={15} color="#64748b" />
            <span>29 Jun, 2025 - 29 August, 2025</span>
            <ChevronDown size={13} color="#94a3b8" />
          </div>

          {/* Add New Wallet Button */}
          <button
            onClick={onOpenWalletModal}
            className="btn-secondary"
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 600,
              gap: '6px'
            }}
          >
            <Plus size={16} />
            <span>Fleet Fuel Card</span>
          </button>
        </div>
      </div>

      {/* Top Cards Row: 3 Columns */}
      <div className="analytics-top-grid">
        {/* Card 1: Fleet Operations & Corporate Fuel Card */}
        <div className="quix-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#171c26' }}>Fleet Fuel & Ops Budget</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Operational expenditure balance</p>
              </div>
              <button 
                title="View goal"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
              >
                <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Emerald Green VISA Card */}
            <div style={{
              background: 'linear-gradient(135deg, #0d6942 0%, #107548 60%, #064e3b 100%)',
              borderRadius: '20px',
              padding: '20px',
              color: '#ffffff',
              boxShadow: '0 12px 24px -4px rgba(13, 105, 66, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '1px', fontStyle: 'italic' }}>
                  VISA
                </span>
                <Wifi size={20} style={{ transform: 'rotate(90deg)', opacity: 0.85 }} />
              </div>

              <span style={{ fontSize: '11px', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Fleet Corporate Expense Card
              </span>
              <div style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '4px', marginBottom: '18px' }}>
                $ 78,989.09
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#d1fae5' }}>
                <span style={{ letterSpacing: '2px' }}>•••• 909090</span>
                <span>EXP 09/26</span>
              </div>
            </div>
          </div>

          {/* Weekly Fuel & Rider Payout Sub-widget */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Weekly Fuel & Payouts</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#111827' }}>
                +3,945 USD
              </span>
              <span className="pill-badge badge-mint">
                +12.8%
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Packages Delivered & Fleet Fulfillment */}
        <div className="quix-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#15803d'
                }}>
                  <Package size={17} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#171c26' }}>Packages Delivered</h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>14,820 parcels fulfilled this cycle</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Switcher Pill */}
                <div style={{
                  display: 'flex',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '3px'
                }}>
                  <button
                    onClick={() => setChartPeriod('monthly')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: chartPeriod === 'monthly' ? '#ffffff' : '#64748b',
                      background: chartPeriod === 'monthly' ? '#0d6942' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setChartPeriod('weekly')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: chartPeriod === 'weekly' ? '#ffffff' : '#64748b',
                      background: chartPeriod === 'weekly' ? '#0d6942' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    Weekly
                  </button>
                </div>

                <button 
                  title="Expand"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b'
                  }}
                >
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            {/* Peak Indicator on APR Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <div style={{
                background: '#0d6942',
                color: '#ffffff',
                padding: '3px 9px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: '30px'
              }}>
                <span style={{ width: '5px', height: '5px', background: '#34d399', borderRadius: '50%' }} />
                +17.8% Peak
              </div>
            </div>

            {/* Bar Chart Area */}
            <div style={{ display: 'flex', height: '180px', alignItems: 'flex-end', gap: '14px', position: 'relative' }}>
              {/* Y Axis Grid Labels */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                fontSize: '11px',
                color: '#94a3b8',
                paddingRight: '6px'
              }}>
                <span>15k</span>
                <span>12k</span>
                <span>9k</span>
                <span>6k</span>
                <span>3k</span>
                <span>0</span>
              </div>

              {/* Bars container */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '100%',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '4px',
                gap: '8px'
              }}>
                {/* JAN */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className="bar-striped" style={{ width: '100%', height: '85px' }} />
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>JAN</span>
                </div>

                {/* FEB */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className="bar-striped" style={{ width: '100%', height: '125px' }} />
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>FEB</span>
                </div>

                {/* MAR */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className="bar-striped" style={{ width: '100%', height: '105px' }} />
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>MAR</span>
                </div>

                {/* APR (Active Peak Bar) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className="bar-active" style={{ width: '100%', height: '165px' }} />
                  <span style={{ fontSize: '11px', color: '#0d6942', fontWeight: 700 }}>APR</span>
                </div>

                {/* MAY */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className="bar-striped" style={{ width: '100%', height: '130px' }} />
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>MAY</span>
                </div>

                {/* JUN */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className="bar-striped" style={{ width: '100%', height: '145px' }} />
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>JUN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Delivery Success Rate */}
        <div className="quix-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}>
                  <CheckCircle2 size={17} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#171c26' }}>Success Rate</h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>First-attempt delivery rate</p>
                </div>
              </div>
              <button 
                title="View delivery details"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
              >
                <ArrowUpRight size={16} />
              </button>
            </div>

            <div style={{ textAlign: 'center', margin: '10px 0 16px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Fulfillment Efficiency</span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#0d6942', marginTop: '2px' }}>
                98.6%
              </div>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                Target: 95.0% (+3.6% above goal)
              </span>
            </div>

            {/* Smooth SVG Line Chart */}
            <div style={{ width: '100%', height: '80px', position: 'relative' }}>
              <svg viewBox="0 0 300 80" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="rateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 45 Q 30 20, 60 40 T 120 25 T 180 35 T 240 18 T 300 22 L 300 80 L 0 80 Z"
                  fill="url(#rateGrad)"
                />
                <path
                  d="M 0 45 Q 30 20, 60 40 T 120 25 T 180 35 T 240 18 T 300 22"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Action Buttons: Dispatch Route & Live Tracking */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              className="btn-primary"
              style={{ flex: 1, padding: '10px', fontSize: '13px' }}
            >
              <span>Dispatch</span>
              <Navigation size={14} />
            </button>
            <button
              className="btn-secondary"
              style={{ flex: 1, padding: '10px', fontSize: '13px' }}
            >
              <span>Live Map</span>
              <Truck size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Cards Row: 2 Columns */}
      <div className="analytics-bottom-grid">
        {/* Card 4: Recent Fleet Dispatch & Delivery Log */}
        <div className="quix-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#171c26' }}>Recent Fleet Dispatch & Deliveries</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Real-time parcel fulfillment log</p>
            </div>
            <button 
              title="Full dispatch log"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}
            >
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: 600 }}>
                  <th style={{ padding: '8px 12px 12px 0' }}>Consignment / Client</th>
                  <th style={{ padding: '8px 12px 12px' }}>Rider / Vehicle</th>
                  <th style={{ padding: '8px 12px 12px' }}>Time</th>
                  <th style={{ padding: '8px 12px 12px' }}>Status</th>
                  <th style={{ padding: '8px 0 12px 12px', textAlign: 'right' }}>Billing / Value</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '13px', color: '#334155' }}>
                {/* Row 1 */}
                <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '14px 12px 14px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#ecfdf5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0d6942',
                      }}>
                        <Package size={17} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>Amazon Logistics Hub</div>
                        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>TRK-9821 • Express</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px', color: '#475569', fontWeight: 500 }}>Carlos Ramos (Bike #12)</td>
                  <td style={{ padding: '14px 12px', color: '#64748b' }}>10:30 PM</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0d6942', fontWeight: 600, fontSize: '12px' }}>
                      <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
                      Delivered
                    </span>
                  </td>
                  <td style={{ padding: '14px 0 14px 12px', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>
                    $185.00 USD
                  </td>
                </tr>

                {/* Row 2 */}
                <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '14px 12px 14px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#e0f2fe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0284c7',
                      }}>
                        <Truck size={17} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>MediCare Cold-Chain Cargo</div>
                        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>TRK-9784 • Priority</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px', color: '#475569', fontWeight: 500 }}>David Kim (Van #04)</td>
                  <td style={{ padding: '14px 12px', color: '#64748b' }}>11:45 PM</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0d6942', fontWeight: 600, fontSize: '12px' }}>
                      <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
                      Delivered
                    </span>
                  </td>
                  <td style={{ padding: '14px 0 14px 12px', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>
                    $420.50 USD
                  </td>
                </tr>

                {/* Row 3 */}
                <tr>
                  <td style={{ padding: '14px 12px 14px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#fef3c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#d97706',
                      }}>
                        <Package size={17} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>FreshMart Grocery Consignment</div>
                        <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 600 }}>TRK-9750 • Same-Day</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px', color: '#475569', fontWeight: 500 }}>Sofia Patel (Scooter #09)</td>
                  <td style={{ padding: '14px 12px', color: '#64748b' }}>10:15 PM</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#d97706', fontWeight: 600, fontSize: '12px' }}>
                      <span style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }} />
                      In Transit
                    </span>
                  </td>
                  <td style={{ padding: '14px 0 14px 12px', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>
                    $312.20 USD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 5: Active Riders on Duty (Replaces Amount of Credit) */}
        <div className="quix-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0d6942'
              }}>
                <Truck size={16} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#171c26' }}>Active Riders on Duty</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '38px' }}>Riders dispatched & tracking live</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0 16px' }}>
              <span style={{ fontSize: '34px', fontWeight: 800, color: '#121826', letterSpacing: '-0.5px' }}>
                142 Riders
              </span>
              <span className="pill-badge badge-mint" style={{ padding: '4px 8px' }}>
                +14 on shift
              </span>
            </div>

            {/* Fleet Composition Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                89 Bikes
              </span>
              <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                34 Vans
              </span>
              <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                19 Trucks
              </span>
            </div>
          </div>

          {/* Active Dispatchers & Riders Avatars */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Top Shift Riders</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>High fulfillment rate today</p>
              </div>
              <button 
                title="View riders"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
              >
                <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Avatar Stack */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[
                  { bg: '#0d6942' },
                  { bg: '#0284c7' },
                  { bg: '#d97706' },
                  { bg: '#7c3aed' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: item.bg,
                      border: '2.5px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: idx === 0 ? 0 : '-10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                  >
                    <User size={18} color="#ffffff" />
                  </div>
                ))}
              </div>

              {/* +138 Pill Badge */}
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#0d6942',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(13, 105, 66, 0.25)'
              }}>
                +138
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
