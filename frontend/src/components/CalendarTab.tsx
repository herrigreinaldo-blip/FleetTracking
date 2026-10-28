'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  User, 
  Truck, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Filter, 
  ChevronRight,
  ChevronLeft,
  X,
  BadgeAlert,
  ArrowRight
} from 'lucide-react';

interface ShiftItem {
  id: string;
  day: string;
  date: string;
  driver: string;
  franchise: string;
  route: string;
  stopMultiplier: string;
  postcode: string;
  extraPay: string;
  comments: string;
  status: 'active' | 'holiday' | 'off' | 'sick' | 'mot';
  van: string;
}

export const CalendarTab: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State for Allocation Modal
  const [modalDriver, setModalDriver] = useState('Ronaldo Luiz Silva');
  const [modalFranchise, setModalFranchise] = useState('FD12354 (Crawley Bulk)');
  const [modalRoute, setModalRoute] = useState('593');
  const [modalVan, setModalVan] = useState('KR23 XYZ (Mercedes Sprinter)');
  const [modalRate, setModalRate] = useState('250.00');
  const [modalMultiplier, setModalMultiplier] = useState('3.0');
  const [modalDate, setModalDate] = useState('2026-10-12');
  const [modalArea, setModalArea] = useState('BN 1 BULK');

  // Realistic sample data matching 12-10 TO 08-11 and July spreadsheets
  const shifts: ShiftItem[] = [
    { id: '1', day: 'MONDAY', date: '2026-10-12', driver: 'Tulio', franchise: 'FD45028', route: '598', stopMultiplier: '1.2', postcode: 'BULK', extraPay: '£0.00', comments: 'DAY RATE £250', status: 'active', van: 'DA20 XYZ' },
    { id: '2', day: 'MONDAY', date: '2026-10-12', driver: 'Reinaldo', franchise: 'FD49693', route: '202', stopMultiplier: '1.2', postcode: 'BN1.2', extraPay: '£0.00', comments: 'DAY RATE £250', status: 'active', van: 'EF22 VVV' },
    { id: '3', day: 'MONDAY', date: '2026-10-12', driver: 'Ronaldo', franchise: 'FD72458', route: '593', stopMultiplier: '3.0', postcode: 'BN 1 BULK', extraPay: '£0.00', comments: 'DAY RATE £250', status: 'active', van: 'KR23 XYZ' },
    { id: '4', day: 'MONDAY', date: '2026-10-12', driver: 'Octavio', franchise: 'FD54328', route: '211', stopMultiplier: '2.0', postcode: 'BN1.9', extraPay: '£112.50', comments: 'DAY RATE £250 OR £2.50', status: 'active', van: 'WX16 RRR' },
    { id: '5', day: 'MONDAY', date: '2026-10-12', driver: 'Thiago', franchise: 'FD54330', route: '205', stopMultiplier: '1.3', postcode: 'BN1.6/7 SECOND', extraPay: '£0.00', comments: '', status: 'active', van: 'EA22 RRR' },
    { id: '6', day: 'MONDAY', date: '2026-10-12', driver: 'Kauann', franchise: 'FD71764', route: '401', stopMultiplier: '2.0', postcode: 'BN1.6/7/5', extraPay: '£0.00', comments: '', status: 'active', van: 'NX21 XXA' },
    { id: '7', day: 'MONDAY', date: '2026-10-12', driver: 'Henrry', franchise: 'FD72356', route: '243', stopMultiplier: '1.1', postcode: 'BN11.3/4', extraPay: '£270.00', comments: '', status: 'active', van: 'HX72 XYZ' },
    { id: '8', day: 'MONDAY', date: '2026-10-12', driver: 'Luciano', franchise: 'FD72458', route: '587', stopMultiplier: '3.0', postcode: 'MPB', extraPay: '£0.00', comments: 'DAY RATE £250', status: 'active', van: 'MA22 TTT' },
    { id: '9', day: 'MONDAY', date: '2026-10-12', driver: 'Jaderson', franchise: 'FD74820', route: '208', stopMultiplier: '2.0', postcode: 'BN3.1/2 SECOND', extraPay: '£0.00', comments: '', status: 'active', van: 'EO73 XYZ' },
    { id: '10', day: 'MONDAY', date: '2026-10-12', driver: 'Emanuel', franchise: 'FD77686', route: '207', stopMultiplier: '1.3', postcode: 'BN1.5', extraPay: '£0.00', comments: '', status: 'active', van: 'KN22 MMM' },
    { id: '11', day: 'MONDAY', date: '2026-10-12', driver: 'Daniel K', franchise: 'FD77890', route: '242', stopMultiplier: '1.45', postcode: 'BN11.1/2', extraPay: '£0.00', comments: '', status: 'active', van: 'KR23 XYZ' },
    { id: '12', day: 'MONDAY', date: '2026-10-12', driver: 'Lucas', franchise: 'FD77891', route: '203', stopMultiplier: '1.45', postcode: 'BN1.3', extraPay: '£0.00', comments: '', status: 'active', van: 'EF22 VVV' },
    { id: '13', day: 'MONDAY', date: '2026-10-12', driver: 'Rafael', franchise: 'FD51406', route: 'OFF', stopMultiplier: '1.3', postcode: 'Rest Day', extraPay: '£0.00', comments: 'Scheduled Rest Day', status: 'off', van: 'N/A' },
    { id: '14', day: 'MONDAY', date: '2026-10-12', driver: 'Natalie', franchise: 'FD52639', route: 'OFF', stopMultiplier: '3.0', postcode: 'Holiday', extraPay: '£0.00', comments: 'Approved Annual Leave', status: 'holiday', van: 'N/A' },
  ];

  const getStatusBadge = (status: ShiftItem['status']) => {
    switch (status) {
      case 'active':
        return (
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px', 
            background: '#ecfdf5', 
            color: '#065f46', 
            padding: '3px 8px', 
            borderRadius: '9999px', 
            fontSize: '11px', 
            fontWeight: 700 
          }}>
            <CheckCircle2 size={12} color="#10b981" /> Active Route
          </span>
        );
      case 'holiday':
        return (
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px', 
            background: '#f3e8ff', 
            color: '#6b21a8', 
            padding: '3px 8px', 
            borderRadius: '9999px', 
            fontSize: '11px', 
            fontWeight: 700 
          }}>
            <CalendarIcon size={12} color="#9333ea" /> Annual Leave
          </span>
        );
      case 'off':
        return (
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px', 
            background: '#f1f5f9', 
            color: '#64748b', 
            padding: '3px 8px', 
            borderRadius: '9999px', 
            fontSize: '11px', 
            fontWeight: 600 
          }}>
            Day OFF
          </span>
        );
      case 'mot':
        return (
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px', 
            background: '#fef3c7', 
            color: '#92400e', 
            padding: '3px 8px', 
            borderRadius: '9999px', 
            fontSize: '11px', 
            fontWeight: 700 
          }}>
            <Truck size={12} color="#d97706" /> Van MOT
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '0 24px 32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner: Period Overview & Action Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #0d6942 0%, #115e59 100%)',
        borderRadius: '24px',
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: '0 12px 30px rgba(13, 105, 66, 0.2)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              background: 'rgba(255, 255, 255, 0.18)', 
              padding: '4px 10px', 
              borderRadius: '9999px', 
              fontSize: '12px', 
              fontWeight: 700,
              letterSpacing: '0.5px' 
            }}>
              4-WEEK OPERATIONAL CYCLE (12-10 TO 08-11)
            </span>
            <span style={{ fontSize: '13px', color: '#a7f3d0' }}>DPD & Multi-Carrier Dispatch</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
            Operations & Route Scheduling Calendar
          </h1>
          <p style={{ fontSize: '13px', color: '#d1fae5', margin: 0 }}>
            Replaces the 155-row dispatch spreadsheet with real-time route coverage, absence tracking, and DPD franchise allocation.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              color: '#0d6942',
              fontWeight: 700,
              fontSize: '13px',
              padding: '10px 18px',
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Plus size={16} />
            <span>Allocate Driver / Route</span>
          </button>
        </div>
      </div>

      {/* KPI Ticker Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="quix-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} color="#0d6942" />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TODAY'S COVERAGE</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>12 / 14 Routes</span>
          </div>
        </div>

        <div className="quix-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={22} color="#d97706" />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ACTIVE VANS DEPLOYED</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>10 Vans Active</span>
          </div>
        </div>

        <div className="quix-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarIcon size={22} color="#9333ea" />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>DRIVER ABSENCES</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>1 Holiday • 1 Rest</span>
          </div>
        </div>

        <div className="quix-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={22} color="#2563eb" />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>PROJECTED DAILY REVENUE</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>£3,120.00</span>
          </div>
        </div>
      </div>

      {/* Week Selector & Company Filter Ribbon */}
      <div className="quix-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        {/* 4-Week Cycle Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginRight: '6px' }}>CYCLE WEEK:</span>
          {[
            { num: 1, label: 'W1 (12-18 Oct)' },
            { num: 2, label: 'W2 (19-25 Oct)' },
            { num: 3, label: 'W3 (26 Oct-01 Nov)' },
            { num: 4, label: 'W4 (02-08 Nov)' },
          ].map((w) => (
            <button
              key={w.num}
              onClick={() => setSelectedWeek(w.num)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                background: selectedWeek === w.num ? '#0d6942' : '#f1f5f9',
                color: selectedWeek === w.num ? '#ffffff' : '#475569',
                boxShadow: selectedWeek === w.num ? '0 4px 10px rgba(13,105,66,0.2)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              {w.label}
            </button>
          ))}
        </div>

        {/* Company Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} color="#64748b" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Entity:</span>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              fontWeight: 600,
              color: '#1e293b',
              background: '#ffffff'
            }}
          >
            <option value="all">All Companies (Consolidated)</option>
            <option value="ms_herrig">MS Herrig Ltd (Reinaldo)</option>
            <option value="tgb">TGB Services and Solutions Ltd (Tulio)</option>
            <option value="goconnect">GoConnect Partnership</option>
          </select>
        </div>
      </div>

      {/* Main Roster Matrix Table */}
      <div className="quix-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #eef2f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon size={18} color="#0d6942" />
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Monday, 12 October 2026 — Daily Route Allocations
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
            Showing 14 driver assignments (Matches sheet <code>12-10 TO 08-11</code>)
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>DRIVER</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>DPD FRANCHISE</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>ROUTE</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>ASSIGNED VAN</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>STOP TIME / RATE</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>POSTCODE AREA</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>EXTRA £</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>COMMENTS</th>
                <th style={{ padding: '12px 18px', fontWeight: 700 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((s, idx) => (
                <tr 
                  key={s.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                    transition: 'background 0.15s'
                  }}
                >
                  <td style={{ padding: '12px 18px', fontWeight: 700, color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 800
                      }}>
                        {s.driver.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{s.driver}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <span style={{
                      display: 'inline-block',
                      background: '#f1f5f9',
                      color: '#0f172a',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      fontFamily: 'monospace'
                    }}>
                      {s.franchise}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', fontWeight: 800, color: s.route === 'OFF' ? '#94a3b8' : '#0d6942' }}>
                    {s.route}
                  </td>
                  <td style={{ padding: '12px 18px', color: '#334155', fontWeight: 600 }}>
                    {s.van !== 'N/A' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Truck size={13} color="#64748b" /> {s.van}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>None</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 18px', fontWeight: 700, color: '#334155' }}>
                    {s.stopMultiplier}x
                  </td>
                  <td style={{ padding: '12px 18px', color: '#475569' }}>
                    {s.postcode}
                  </td>
                  <td style={{ padding: '12px 18px', fontWeight: 700, color: s.extraPay !== '£0.00' ? '#0d6942' : '#94a3b8' }}>
                    {s.extraPay}
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: '11px', color: '#64748b', fontStyle: s.comments ? 'normal' : 'italic' }}>
                    {s.comments || 'Standard run'}
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    {getStatusBadge(s.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Absence & Leave Card (Replaces July Spreadsheet Grid) */}
      <div className="quix-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Driver Leave & Absence Watch (Replaces July Calendar)
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0 0' }}>
              Tracks upcoming annual leave, sickness, and scheduled van maintenance.
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0d6942', background: '#ecfdf5', padding: '4px 10px', borderRadius: '9999px' }}>
            Holidays Synced with Dispatch
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <div style={{ border: '1px solid #f1f5f9', borderRadius: '14px', padding: '14px 16px', background: '#fdf4ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#701a75' }}>OCTAVIO SANTOS</span>
              <span style={{ fontSize: '10px', fontWeight: 700, background: '#f5d0fe', color: '#86198f', padding: '2px 8px', borderRadius: '9999px' }}>
                3 DAYS LEAVE
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#4a044e', margin: 0 }}>
              02 Jul – 05 Jul 2026 (Octavio Holiday)
            </p>
            <span style={{ display: 'block', fontSize: '11px', color: '#a21caf', marginTop: '6px' }}>
              Covered by: Reinaldo (Spare Van WX16 RRR)
            </span>
          </div>

          <div style={{ border: '1px solid #f1f5f9', borderRadius: '14px', padding: '14px 16px', background: '#fdf4ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#701a75' }}>EMANUEL PEREIRA</span>
              <span style={{ fontSize: '10px', fontWeight: 700, background: '#f5d0fe', color: '#86198f', padding: '2px 8px', borderRadius: '9999px' }}>
                14 DAYS LEAVE
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#4a044e', margin: 0 }}>
              19 Jul – 01 Aug 2026 (Emanuel 2-Week Annual Leave)
            </p>
            <span style={{ display: 'block', fontSize: '11px', color: '#a21caf', marginTop: '6px' }}>
              Covered by: Daniel K (Route 207)
            </span>
          </div>

          <div style={{ border: '1px solid #f1f5f9', borderRadius: '14px', padding: '14px 16px', background: '#fffbeb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#92400e' }}>REINALDO HERRIG (VAN MOT)</span>
              <span style={{ fontSize: '10px', fontWeight: 700, background: '#fde68a', color: '#b45309', padding: '2px 8px', borderRadius: '9999px' }}>
                MAINTENANCE
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#78350f', margin: 0 }}>
              01 Jul 2026 (Reinaldo van MOT at Sam Motors)
            </p>
            <span style={{ display: 'block', fontSize: '11px', color: '#b45309', marginTop: '6px' }}>
              Van EF22 VVV booked into garage for inspection
            </span>
          </div>
        </div>
      </div>

      {/* Quick Allocation Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Allocate Driver to Route
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Assign shift details for the 4-week roster
                </span>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '6px', borderRadius: '50%', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Date & Driver Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    SHIFT DATE
                  </label>
                  <input
                    type="date"
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    DRIVER NAME
                  </label>
                  <select
                    value={modalDriver}
                    onChange={(e) => setModalDriver(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option>Ronaldo Luiz Silva (DR85899)</option>
                    <option>Octavio Santos (DR80699)</option>
                    <option>Natalie Gomez (DR100799)</option>
                    <option>Thiago Oliveira (DR65457)</option>
                    <option>Kauann Rodrigues (DR88699)</option>
                    <option>Henrry Barbosa (DR799199)</option>
                    <option>Daniel K (DR79599)</option>
                    <option>Lucas Martins (DR79499)</option>
                  </select>
                </div>
              </div>

              {/* Franchise & Route Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    DPD FRANCHISE (FD NUMBER)
                  </label>
                  <select
                    value={modalFranchise}
                    onChange={(e) => setModalFranchise(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option>FD12354 (Crawley Bulk)</option>
                    <option>FD49693 (Crawley Depot 1)</option>
                    <option>FD51406 (Crawley Depot 2)</option>
                    <option>FD54328 (Brighton North East)</option>
                    <option>FD54330 (Brighton South East)</option>
                    <option>FD72458 (Worthing MPB)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    ROUTE NUMBER
                  </label>
                  <input
                    type="text"
                    value={modalRoute}
                    onChange={(e) => setModalRoute(e.target.value)}
                    placeholder="e.g. 593"
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Van & Area Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    FLEET VAN
                  </label>
                  <select
                    value={modalVan}
                    onChange={(e) => setModalVan(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option>KR23 XYZ (Mercedes Sprinter - Diesel)</option>
                    <option>EF22 VVV (Mercedes eVito - Electric)</option>
                    <option>KN22 MMM (Mercedes Sprinter - Diesel)</option>
                    <option>WX16 RRR (Driver's Own Van - Ford)</option>
                    <option>EA22 RRR (Mercedes eVito - Electric)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    POSTCODE / AREA
                  </label>
                  <input
                    type="text"
                    value={modalArea}
                    onChange={(e) => setModalArea(e.target.value)}
                    placeholder="e.g. BN 1 BULK"
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Rate & Multiplier Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    AGREED DAY RATE (£)
                  </label>
                  <input
                    type="number"
                    value={modalRate}
                    onChange={(e) => setModalRate(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    STOP MULTIPLIER
                  </label>
                  <input
                    type="text"
                    value={modalMultiplier}
                    onChange={(e) => setModalMultiplier(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Confirmation Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#0d6942',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 16px rgba(13, 105, 66, 0.25)',
                  marginTop: '10px'
                }}
              >
                <span>Save Allocation & Sync to Roster</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
