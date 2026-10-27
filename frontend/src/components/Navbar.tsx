'use client';

import React from 'react';
import { Search, Bell, LogIn, LogOut, ChevronDown } from 'lucide-react';

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
  const tabs = [
    { id: 'analytics', label: 'Dashboard' },
    { id: 'riders', label: 'Delivery Riders' },
    { id: 'packages', label: 'Packages' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'finance', label: 'Finance' },
    { id: 'sales', label: 'Sales' },
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
        boxShadow: '0 8px 24px -6px rgba(18, 24, 38, 0.04)'
      }}
    >
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab('analytics')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
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
            fontWeight: '800',
            letterSpacing: '-0.3px',
            color: '#102a1c',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            lineHeight: 1.2
          }}>
            Fleet Tracking
          </span>
          <span style={{
            fontSize: '9px',
            fontWeight: '700',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            color: '#0d6942'
          }}>
            Management System
          </span>
        </div>
      </div>

      {/* Pill Navigation Bar - Desktop only */}
      <nav 
        className="desktop-only"
        style={{
          alignItems: 'center',
          background: '#f8fafc',
          borderRadius: '9999px',
          padding: '5px 8px',
          border: '1px solid #e2e8f0',
          gap: '4px'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#0d6942' : '#64748b',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Tools & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          title="Search"
          className="desktop-only"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            transition: 'background 0.2s',
          }}
        >
          <Search size={16} />
        </button>

        <button 
          title="Notifications"
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
            position: 'relative'
          }}
        >
          <Bell size={16} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '7px',
            width: '7px',
            height: '7px',
            background: '#10b981',
            borderRadius: '50%',
            border: '1.5px solid #ffffff'
          }} />
        </button>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '2px' }}>
            <div 
              onClick={onLogout}
              title={`Logged in as ${currentUser.email} (${currentUser.roles.join(', ') || 'User'}). Click to Sign Out.`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                padding: '4px 10px 4px 5px',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer'
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
                {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="desktop-only" style={{ flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                  {currentUser.fullName || currentUser.email.split('@')[0]}
                </span>
                <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 600 }}>
                  {currentUser.roles[0] || 'Member'}
                </span>
              </div>
              <ChevronDown size={14} color="#94a3b8" />
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
                fontWeight: 600,
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
              fontWeight: 600,
              fontSize: '12px',
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
