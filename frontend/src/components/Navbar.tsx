'use client';

import React, { useState } from 'react';
import { Search, Bell, LogIn, LogOut, ChevronDown, Building2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: { email: string; fullName: string; roles: string[] } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [selectedEntity, setSelectedEntity] = useState('MS Herrig Ltd');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const tabs = [
    { id: 'analytics', label: 'Overview' },
    { id: 'calendar', label: 'Roster Matrix' },
    { id: 'fleet', label: 'Fleet & Escrow' },
    { id: 'finance', label: 'Finance & P&L' },
    { id: 'payroll', label: 'Driver Payroll' },
    { id: 'vat', label: 'HMRC VAT' },
    { id: 'audit', label: 'DPD Auditing' },
  ];

  return (
    <header
      className="app-navbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        border: '1px solid #eef2f6',
        boxShadow: '0 8px 24px -6px rgba(18, 24, 38, 0.04)',
        padding: '12px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      {/* Brand Logo & Multi-Company Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div
          onClick={() => setActiveTab('calendar')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0d6942 0%, #15803d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(13, 105, 66, 0.25)',
            position: 'relative',
            flexShrink: 0
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              border: '3px solid #ffffff',
              borderRadius: '50%',
              borderTopColor: 'transparent'
            }} />
            <div style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              background: '#34d399',
              borderRadius: '50%'
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontSize: '17px',
              fontWeight: 800,
              letterSpacing: '-0.3px',
              color: '#102a1c',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              lineHeight: 1.2
            }}>
              Delivery Finance
            </span>
            <span style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              color: '#0d6942'
            }}>
              DPD Multi-Franchise Platform
            </span>
          </div>
        </div>

        {/* Company Switcher Pill */}
        <div className="desktop-only" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#f8fafc',
          padding: '4px 10px',
          borderRadius: '9999px',
          border: '1px solid #e2e8f0'
        }}>
          <Building2 size={13} color="#0d6942" />
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '11px',
              fontWeight: 700,
              color: '#1e293b',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="MS Herrig Ltd">MS Herrig Ltd (Primary)</option>
            <option value="TGB Services and Solutions Ltd">TGB Services and Solutions Ltd</option>
            <option value="GoConnect">GoConnect Partnership</option>
            <option value="Consolidated">Consolidated (All 3 Entities)</option>
          </select>
        </div>
      </div>

      {/* Pill Navigation Bar - Desktop only */}
      <nav
        className="desktop-only"
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f8fafc',
          borderRadius: '9999px',
          padding: '4px 6px',
          border: '1px solid #e2e8f0',
          gap: '2px'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0d6942' : '#64748b',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Tools & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Compliance Alert Bell */}
        <div style={{ position: 'relative' }}>
          <button
            title="Compliance Alerts"
            onClick={() => setIsAlertOpen(!isAlertOpen)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <Bell size={16} />
            <span style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              width: '16px',
              height: '16px',
              background: '#ef4444',
              borderRadius: '50%',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              2
            </span>
          </button>

          {/* Quick Alert Dropdown */}
          {isAlertOpen && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '280px',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0',
              padding: '14px',
              zIndex: 100
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Active Compliance Alerts
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                <div style={{ padding: '8px', background: '#fff1f2', borderRadius: '8px', border: '1px solid #fecaca', color: '#991b1b' }}>
                  <strong>VN71 DPD:</strong> MOT due in 18 days (Expires: 15-Nov)
                </div>
                <div style={{ padding: '8px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', color: '#92400e' }}>
                  <strong>Route 593:</strong> DPD underpayment -£57.42 pending dispute
                </div>
              </div>
            </div>
          )}
        </div>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              title={`Logged in as ${currentUser.email}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                padding: '4px 10px 4px 5px',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: '#0d6942',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px'
              }}>
                {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'R'}
              </div>
              <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', lineHeight: 1.1 }}>
                  {currentUser.fullName || 'Reinaldo'}
                </span>
                <span style={{ fontSize: '10px', color: '#0d6942', fontWeight: 700 }}>
                  Director Admin
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 12px',
                borderRadius: '9999px',
                background: '#fee2e2',
                color: '#b91c1c',
                fontSize: '11px',
                fontWeight: 700,
                border: '1px solid #fecaca',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <LogOut size={12} />
              <span className="desktop-only">Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '9999px',
              background: '#0d6942',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(13, 105, 66, 0.2)'
            }}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
