'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { AnalyticsTab } from '../components/AnalyticsTab';
import { RidersTab } from '../components/RidersTab';
import { PackagesTab } from '../components/PackagesTab';
import { InvoicesTab } from '../components/InvoicesTab';
import { FinanceTab } from '../components/FinanceTab';
import { SalesTab } from '../components/SalesTab';
import { AuthModal } from '../components/AuthModal';
import { AuthResponse, api } from '../services/api';
import { Lock, Mail, ArrowRight, ShieldCheck, Truck, Package, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Login form state for gated landing screen
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [roleInput, setRoleInput] = useState('Customer');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<{
    email: string;
    fullName: string;
    roles: string[];
    token: string;
  } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedToken = localStorage.getItem('fleet_token');
      const savedUser = localStorage.getItem('fleet_user');
      if (savedToken && savedUser) {
        return { ...JSON.parse(savedUser), token: savedToken };
      }
    } catch {
      return null;
    }
    return null;
  });

  // Verify active token asynchronously with backend API
  useEffect(() => {
    if (!currentUser?.token) return;

    api.getCurrentUser(currentUser.token)
      .then(info => {
        const adminName = info.email.toLowerCase().includes('reinaldo') ? 'Reinaldo' : `${info.firstName || ''} ${info.lastName || ''}`.trim() || info.email.split('@')[0];
        setCurrentUser({
          token: currentUser.token,
          email: info.email,
          fullName: adminName,
          roles: info.roles
        });
      })
      .catch(() => {
        // Token verification failed or server offline; preserve current session
      });
  }, [currentUser?.token]);

  const handleAuthSuccess = (res: AuthResponse) => {
    const isReinaldo = res.email.toLowerCase().includes('reinaldo');
    const userSession = {
      token: res.token,
      email: res.email,
      fullName: isReinaldo ? 'Reinaldo' : (res.fullName || res.email.split('@')[0]),
      roles: res.roles,
    };
    setCurrentUser(userSession);
    try {
      localStorage.setItem('fleet_token', res.token);
      localStorage.setItem('fleet_user', JSON.stringify(userSession));
    } catch {
      // Storage error
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('fleet_token');
      localStorage.removeItem('fleet_user');
    } catch {
      // Storage error
    }
  };

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      if (isLoginMode) {
        const res = await api.login({ email: emailInput, password: passwordInput });
        handleAuthSuccess(res);
      } else {
        const res = await api.register({
          email: emailInput,
          password: passwordInput,
          firstName: firstNameInput,
          lastName: lastNameInput,
          role: roleInput,
        });
        handleAuthSuccess(res);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const setGateCredentials = (email: string, pass: string) => {
    setEmailInput(email);
    setPasswordInput(pass);
    setLoginError(null);
  };

  // =========================================================================
  // GATED VIEW: If NOT logged in, show dedicated full-screen Sign In Portal
  // =========================================================================
  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a1d13',
        backgroundImage: 'radial-gradient(circle at 50% 20%, #0d6942 0%, #062b1a 65%, #04160d 100%)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Geometry */}
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.05)',
          filter: 'blur(80px)',
          top: '-100px',
          left: '-100px',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(52, 211, 153, 0.04)',
          filter: 'blur(90px)',
          bottom: '-100px',
          right: '-100px',
          pointerEvents: 'none'
        }} />

        {/* Central Sign-In Card */}
        <div style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '28px',
          padding: '36px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 40px rgba(13, 105, 66, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Logo & Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d6942 0%, #15803d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(13, 105, 66, 0.35)',
              position: 'relative'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
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
            <div>
              <div style={{
                fontSize: '20px',
                fontWeight: 800,
                letterSpacing: '-0.3px',
                color: '#102a1c',
                lineHeight: 1.2
              }}>
                Fleet Tracking
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#0d6942'
              }}>
                Management System
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
            {isLoginMode ? 'Sign In to Fleet Portal' : 'Create Staff Account'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
            {isLoginMode
              ? 'Access real-time fleet telemetry, rider dispatch, packages, and finance modules.'
              : 'Register an authorized account to operate delivery logistics.'}
          </p>

          {/* Mode Switcher */}
          <div style={{
            display: 'flex',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '9999px',
            padding: '4px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => { setIsLoginMode(true); setLoginError(null); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                color: isLoginMode ? '#0d6942' : '#64748b',
                background: isLoginMode ? '#ffffff' : 'transparent',
                boxShadow: isLoginMode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLoginMode(false); setLoginError(null); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                color: !isLoginMode ? '#0d6942' : '#64748b',
                background: !isLoginMode ? '#ffffff' : 'transparent',
                boxShadow: !isLoginMode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {loginError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleGateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!isLoginMode && (
              <>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstNameInput}
                      onChange={(e) => setFirstNameInput(e.target.value)}
                      placeholder="e.g. Reinaldo"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastNameInput}
                      onChange={(e) => setLastNameInput(e.target.value)}
                      placeholder="e.g. Vance"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Role Assignment
                  </label>
                  <select
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      background: '#ffffff'
                    }}
                  >
                    <option value="Customer">Customer</option>
                    <option value="Delivery">Delivery Rider</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="herrigreinaldo@gmail.com"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px'
                  }}
                />
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px'
                  }}
                />
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '9999px',
                background: '#0d6942',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 18px rgba(13, 105, 66, 0.25)',
                border: 'none',
                cursor: 'pointer',
                marginTop: '6px',
                opacity: loginLoading ? 0.7 : 1,
              }}
            >
              {loginLoading ? 'Authenticating...' : isLoginMode ? 'Sign In to Portal' : 'Create Account'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Logins for Instant Access */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', color: '#94a3b8', textAlign: 'center', marginBottom: '10px' }}>
              QUICK DEMO ACCESS
            </span>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setGateCredentials('herrigreinaldo@gmail.com', '132Careras@!')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  background: '#f0fdf4',
                  color: '#15803d',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: '1px solid #bbf7d0',
                  cursor: 'pointer'
                }}
              >
                <ShieldCheck size={14} color="#15803d" />
                <span>Admin (Reinaldo)</span>
              </button>
              <button
                type="button"
                onClick={() => setGateCredentials('delivery@deliveryfinance.com', 'Delivery@123!')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  background: '#ecfdf5',
                  color: '#065f46',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: '1px solid #a7f3d0',
                  cursor: 'pointer'
                }}
              >
                <Truck size={14} color="#065f46" />
                <span>Delivery Rider</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Status Indicators */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginTop: '24px',
          color: '#a7f3d0',
          fontSize: '12px',
          fontWeight: 500,
          opacity: 0.85
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="#34d399" /> 256-Bit SSL Enforced
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="#34d399" /> Clean Layered Architecture
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="#34d399" /> Real-time Fleet Telemetry
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // UNLOCKED AUTHENTICATED VIEW: Full Fleet Tracking & Finance Dashboard
  // =========================================================================
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#eff2f6' }}>
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Layout with Floating Left Sidebar */}
      <div style={{ display: 'flex', flex: 1, paddingRight: '24px', gap: '20px' }}>
        {/* Floating Left Sidebar Dock */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          isLoggedIn={!!currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Tab Content Display */}
        <main style={{ flex: 1, paddingBottom: '40px', minWidth: 0 }}>
          {activeTab === 'analytics' && (
            <AnalyticsTab 
              userName={currentUser?.fullName || 'Reinaldo'} 
              onOpenWalletModal={() => setIsAuthModalOpen(true)}
            />
          )}
          {activeTab === 'riders' && <RidersTab />}
          {activeTab === 'packages' && <PackagesTab />}
          {activeTab === 'invoices' && <InvoicesTab />}
          {activeTab === 'finance' && <FinanceTab />}
          {activeTab === 'sales' && <SalesTab />}
        </main>
      </div>

      {/* Auth Modal for in-app credential updates */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
