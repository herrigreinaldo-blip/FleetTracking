'use client';

import React from 'react';
import {
  Calendar,
  Truck,
  Building2,
  CreditCard,
  Receipt,
  ShieldAlert,
  LayoutGrid,
  Settings,
  LogOut,
  Users
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  isLoggedIn,
  onOpenAuth,
}) => {
  const navItems = [
    { id: 'analytics', label: 'Executive Dashboard', icon: LayoutGrid },
    { id: 'calendar', label: 'Roster Matrix', icon: Calendar },
    { id: 'fleet', label: 'Fleet & Escrows', icon: Truck },
    { id: 'finance', label: 'Finance & P&L', icon: Building2 },
    { id: 'payroll', label: 'Driver Payroll', icon: CreditCard },
    { id: 'vat', label: 'HMRC VAT Returns', icon: Receipt },
    { id: 'audit', label: 'Carrier Auditing', icon: ShieldAlert },
  ];

  return (
    <aside
      className="desktop-sidebar"
      style={{
        width: '74px',
        background: '#ffffff',
        borderRadius: '32px',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 30px -4px rgba(18, 24, 38, 0.05)',
        border: '1px solid #eef2f6',
        margin: '0 0 24px 24px',
        height: 'calc(100vh - 120px)',
        position: 'sticky',
        top: '100px'
      }}
    >
      {/* Top Navigation Group */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: isActive ? '#0d6942' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                boxShadow: isActive ? '0 6px 16px rgba(13, 105, 66, 0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {/* Bottom Group */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <button
          title="System Settings"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
        >
          <Settings size={20} />
        </button>

        {isLoggedIn ? (
          <button
            onClick={onLogout}
            title="Sign Out"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <LogOut size={20} />
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            title="Sign In"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              color: '#0d6942',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <LogOut size={20} style={{ transform: 'rotate(180deg)' }} />
          </button>
        )}
      </div>
    </aside>
  );
};

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const items = [
    { id: 'calendar', label: 'Roster', icon: Calendar },
    { id: 'fleet', label: 'Fleet', icon: Truck },
    { id: 'finance', label: 'Finance', icon: Building2 },
    { id: 'payroll', label: 'Payroll', icon: CreditCard },
    { id: 'vat', label: 'VAT', icon: Receipt },
    { id: 'audit', label: 'Audit', icon: ShieldAlert },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
