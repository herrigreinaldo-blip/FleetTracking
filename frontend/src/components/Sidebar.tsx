'use client';

import React from 'react';
import { 
  LayoutGrid, 
  Wallet, 
  Package, 
  FileText, 
  Percent, 
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
  return (
    <aside 
      className="desktop-sidebar"
      style={{
        width: '74px',
        background: '#ffffff',
        borderRadius: '32px',
        padding: '20px 0',
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {/* Main Dashboard / Analytics */}
        <button
          onClick={() => setActiveTab('analytics')}
          title="Dashboard"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: activeTab === 'analytics' ? '#0d6942' : 'transparent',
            color: activeTab === 'analytics' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: activeTab === 'analytics' ? '0 6px 16px rgba(13, 105, 66, 0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <LayoutGrid size={20} />
        </button>

        {/* Delivery Riders */}
        <button
          onClick={() => setActiveTab('riders')}
          title="Delivery Riders"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: activeTab === 'riders' ? '#0d6942' : 'transparent',
            color: activeTab === 'riders' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: activeTab === 'riders' ? '0 6px 16px rgba(13, 105, 66, 0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <Users size={20} />
        </button>

        {/* Packages */}
        <button
          onClick={() => setActiveTab('packages')}
          title="Packages"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: activeTab === 'packages' ? '#0d6942' : 'transparent',
            color: activeTab === 'packages' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: activeTab === 'packages' ? '0 6px 16px rgba(13, 105, 66, 0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <Package size={20} />
        </button>

        {/* Invoices */}
        <button
          onClick={() => setActiveTab('invoices')}
          title="Invoices"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: activeTab === 'invoices' ? '#0d6942' : 'transparent',
            color: activeTab === 'invoices' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: activeTab === 'invoices' ? '0 6px 16px rgba(13, 105, 66, 0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <FileText size={20} />
        </button>

        {/* Divider */}
        <div style={{ width: '32px', height: '1px', background: '#e2e8f0', margin: '4px 0' }} />

        {/* Finance */}
        <button
          onClick={() => setActiveTab('finance')}
          title="Finance & Payouts"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: activeTab === 'finance' ? '#0d6942' : 'transparent',
            color: activeTab === 'finance' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: activeTab === 'finance' ? '0 6px 16px rgba(13, 105, 66, 0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <Wallet size={20} />
        </button>

        {/* Sales */}
        <button
          onClick={() => setActiveTab('sales')}
          title="Sales Analytics"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: activeTab === 'sales' ? '#0d6942' : 'transparent',
            color: activeTab === 'sales' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: activeTab === 'sales' ? '0 6px 16px rgba(13, 105, 66, 0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <Percent size={20} />
        </button>
      </div>

      {/* Bottom Group */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <button
          title="Settings"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
    { id: 'analytics', label: 'Dashboard', icon: LayoutGrid },
    { id: 'riders', label: 'Riders', icon: Users },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'sales', label: 'Sales', icon: Percent },
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

