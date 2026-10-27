'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, Shield, Bike, User } from 'lucide-react';
import { api, AuthResponse } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (authData: AuthResponse) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('Customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.login({ email, password });
        onAuthSuccess(res);
        onClose();
      } else {
        const res = await api.register({
          email,
          password,
          firstName,
          lastName,
          role,
        });
        onAuthSuccess(res);
        onClose();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="modal-animate"
        style={{
          background: '#ffffff',
          borderRadius: '28px',
          width: '100%',
          maxWidth: '460px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '30px 24px',
          boxShadow: '0 25px 60px -12px rgba(13, 105, 66, 0.25)',
          border: '1px solid #e2e8f0',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Fleet Tracking Management System Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d6942 0%, #15803d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(13, 105, 66, 0.25)',
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2.5px solid #ffffff',
              borderRadius: '50%',
              borderTopColor: 'transparent'
            }} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#102a1c', lineHeight: 1.2 }}>
              Fleet Tracking
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#0d6942', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Management System
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          {isLogin 
            ? 'Sign in to access your financial analytics, rider fleet, and invoices.' 
            : 'Join Fleet Tracking to manage logistics and finance seamlessly.'}
        </p>

        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: '9999px',
          padding: '4px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              color: isLogin ? '#0d6942' : '#64748b',
              background: isLogin ? '#ffffff' : 'transparent',
              boxShadow: isLogin ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              color: !isLogin ? '#0d6942' : '#64748b',
              background: !isLogin ? '#ffffff' : 'transparent',
              boxShadow: !isLogin ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '14px',
            fontSize: '12px',
            fontWeight: 500,
            marginBottom: '16px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isLogin && (
            <>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      background: '#f8fafc',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      background: '#f8fafc',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  User Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                    background: '#f8fafc',
                    color: '#1e293b'
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
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 38px',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  background: '#f8fafc',
                }}
              />
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 38px',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  background: '#f8fafc',
                }}
              />
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
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
              marginTop: '6px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Accounts Quick Login */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textAlign: 'center', marginBottom: '10px' }}>
            QUICK DEMO ROLES
          </span>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('herrigreinaldo@gmail.com', '132Careras@!')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '9999px',
                background: '#f0fdf4',
                color: '#15803d',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid #bbf7d0'
              }}
            >
              <Shield size={13} color="#15803d" />
              <span>Admin (Reinaldo)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('delivery@deliveryfinance.com', 'Delivery@123!')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '9999px',
                background: '#ecfdf5',
                color: '#065f46',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid #a7f3d0'
              }}
            >
              <Bike size={13} color="#065f46" />
              <span>Delivery</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('customer@deliveryfinance.com', 'Customer@123!')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '9999px',
                background: '#f8fafc',
                color: '#475569',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid #e2e8f0'
              }}
            >
              <User size={13} color="#475569" />
              <span>Customer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
