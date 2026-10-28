'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Wrench, 
  Coins, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Upload, 
  Eye, 
  Download, 
  X,
  CreditCard,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';

interface VehicleCard {
  id: string;
  reg: string;
  make: string;
  model: string;
  year: number;
  fuel: 'Diesel' | 'Electric';
  mileage: number;
  company: string;
  currentDriver: string;
  motDue: string;
  motDays: number;
  taxDue: string;
  taxDays: number;
  insuranceDue: string;
  insuranceDays: number;
  monthlyFinance: string;
  totalSpentRepairs: string;
  ownership: string;
}

export const FleetTab: React.FC = () => {
  const [selectedVan, setSelectedVan] = useState<string>('KR23XYZ');
  const [activeSubTab, setActiveSubTab] = useState<'vehicles' | 'deposits' | 'documents'>('vehicles');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState<boolean>(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Form State for Service Modal
  const [serviceDate, setServiceDate] = useState('2026-10-14');
  const [serviceMileage, setServiceMileage] = useState('129500');
  const [serviceDesc, setServiceDesc] = useState('FRONT BRAKE DISCS & PADS');
  const [serviceLabour, setServiceLabour] = useState('110.00');
  const [serviceParts, setServiceParts] = useState('148.46');
  const [serviceGarage, setServiceGarage] = useState('SAM MOTORS');

  // Form State for Vehicle Onboarding Modal
  const [onboardReg, setOnboardReg] = useState('');
  const [onboardMake, setOnboardMake] = useState('MERCEDES');
  const [onboardModel, setOnboardModel] = useState('SPRINTER 315 CDI');
  const [onboardYear, setOnboardYear] = useState('2024');
  const [onboardFuel, setOnboardFuel] = useState<'Diesel' | 'Electric'>('Diesel');
  const [onboardMileage, setOnboardMileage] = useState('42000');
  const [onboardCompany, setOnboardCompany] = useState('MS Herrig Ltd');
  const [onboardDriver, setOnboardDriver] = useState('');
  const [onboardMotDays, setOnboardMotDays] = useState('365');
  const [onboardFinance, setOnboardFinance] = useState('£450.00');
  const [onboardOwnership, setOnboardOwnership] = useState('Financed (Close Brothers)');

  const [vehiclesList, setVehiclesList] = useState<VehicleCard[]>([
    {
      id: 'KR23XYZ',
      reg: 'KR23 XYZ',
      make: 'MERCEDES',
      model: 'SPRINTER 315 CDI',
      year: 2023,
      fuel: 'Diesel',
      mileage: 117000,
      company: 'MS Herrig Ltd',
      currentDriver: 'Daniel K (DR79599)',
      motDue: '2027-07-12',
      motDays: 257,
      taxDue: '2027-04-01',
      taxDays: 155,
      insuranceDue: '2027-04-15',
      insuranceDays: 169,
      monthlyFinance: '£456.80',
      totalSpentRepairs: '£7,202.08',
      ownership: 'Financed (Close Brothers)'
    },
    {
      id: 'HX72XYZ',
      reg: 'HX72 XYZ',
      make: 'MERCEDES',
      model: 'SPRINTER',
      year: 2022,
      fuel: 'Diesel',
      mileage: 124000,
      company: 'TGB Services Ltd',
      currentDriver: 'Henrry Barbosa (DR799199)',
      motDue: '2026-11-15',
      motDays: 18,
      taxDue: '2027-03-01',
      taxDays: 124,
      insuranceDue: '2026-12-01',
      insuranceDays: 34,
      monthlyFinance: '£441.72',
      totalSpentRepairs: '£3,850.00',
      ownership: 'Financed (Close Brothers)'
    },
    {
      id: 'EF22VVV',
      reg: 'EF22 VVV',
      make: 'MERCEDES',
      model: 'EVITO ELECTRIC',
      year: 2022,
      fuel: 'Electric',
      mileage: 48000,
      company: 'MS Herrig Ltd',
      currentDriver: 'Reinaldo Herrig (DR40399)',
      motDue: '2026-12-20',
      motDays: 53,
      taxDue: '2027-01-01',
      taxDays: 65,
      insuranceDue: '2027-05-10',
      insuranceDays: 194,
      monthlyFinance: '£540.93',
      totalSpentRepairs: '£1,180.00',
      ownership: 'Leased (Lombard)'
    },
    {
      id: 'WX16RRR',
      reg: 'WX16 RRR',
      make: 'FORD',
      model: 'TRANSIT CUSTOM',
      year: 2016,
      fuel: 'Diesel',
      mileage: 165000,
      company: 'MS Herrig Ltd',
      currentDriver: 'Octavio Santos (Driver Owned)',
      motDue: '2027-02-14',
      motDays: 109,
      taxDue: '2027-02-01',
      taxDays: 96,
      insuranceDue: '2027-03-15',
      insuranceDays: 138,
      monthlyFinance: '£0.00',
      totalSpentRepairs: '£0.00',
      ownership: 'Subcontractor Owned'
    }
  ]);

  // Maintenance history extracted from KR23XYZ sheet
  const serviceHistory = [
    { date: '2026-09-07', mileage: 129500, desc: 'BRAKE CHANGE (FRONT DISC & PADS / REAR PADS)', labour: '£0.00', parts: '£258.46', total: '£258.46', garage: 'EURO CAR PARTS' },
    { date: '2026-09-06', mileage: 129500, desc: 'FULL SERVICE (ALL FILTERS CHANGE)', labour: '£0.00', parts: '£194.30', total: '£194.30', garage: 'ALL FILTERS' },
    { date: '2026-07-13', mileage: 125664, desc: 'ANNUAL MOT INSPECTION', labour: '£150.00', parts: '£0.00', total: '£150.00', garage: 'SAM MOTORS' },
    { date: '2026-05-14', mileage: 120071, desc: 'FULL CLUTCH KIT CHANGED', labour: '£464.40', parts: '£1,585.14', total: '£2,049.54', garage: 'P&D AUTOMOTIVE' },
    { date: '2026-04-18', mileage: 117500, desc: 'REAR STEP ACCESSORY INSTALLATION', labour: '£0.00', parts: '£150.00', total: '£150.00', garage: 'EBAY' },
    { date: '2026-04-11', mileage: 117000, desc: '3 YEARS ADDED EXTENDED WARRANTY', labour: '£0.00', parts: '£1,298.98', total: '£1,298.98', garage: 'AUTOGUARD' },
    { date: '2026-04-11', mileage: 117000, desc: 'ANNUAL ROAD TAX (VED) RENEWAL', labour: '£0.00', parts: '£360.00', total: '£360.00', garage: 'DVLA' },
  ];

  // Driver Van Security Deposits from DEPOSIT FOR THE VANS sheet
  const deposits = [
    { driver: 'Daniel K', drNumber: 'DR79599', installments: 5, target: 1000, current: 1000, status: 'Completed', dates: '26/06, 24/07, 21/08, 18/09, 16/10' },
    { driver: 'Henrry Barbosa', drNumber: 'DR799199', installments: 5, target: 1000, current: 1000, status: 'Completed', dates: '26/06, 24/07, 21/08, 18/09, 16/10' },
    { driver: 'Lucas Martins', drNumber: 'DR79499', installments: 4, target: 1000, current: 800, status: 'In Progress (£200 left)', dates: '24/07, 21/08, 18/09, 16/10' },
    { driver: 'Rafael Santos', drNumber: 'DR09099', installments: 0, target: 1000, current: 0, status: 'Pending Start', dates: 'None' },
    { driver: 'Ahmed Ali', drNumber: 'DR12345', installments: 0, target: 1000, current: 0, status: 'Pending Start', dates: 'None' },
    { driver: 'Thiago Oliveira', drNumber: 'DR65457', installments: 0, target: 1000, current: 0, status: 'Pending Start', dates: 'None' },
    { driver: 'Emanuel Pereira', drNumber: 'DR61299', installments: 0, target: 1000, current: 0, status: 'Pending Start', dates: 'None' },
    { driver: 'Bruno Carvalho', drNumber: 'DR09099', installments: 0, target: 1000, current: 0, status: 'Pending Start', dates: 'None' },
  ];

  const handleOnboardVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardReg.trim()) return;

    const newVehicle: VehicleCard = {
      id: onboardReg.replace(/\s+/g, '').toUpperCase(),
      reg: onboardReg.trim().toUpperCase(),
      make: onboardMake,
      model: onboardModel,
      year: parseInt(onboardYear, 10) || 2024,
      fuel: onboardFuel,
      mileage: parseInt(onboardMileage, 10) || 40000,
      company: onboardCompany,
      currentDriver: onboardDriver.trim() || 'Unassigned Subcontractor',
      motDue: '2027-10-28',
      motDays: parseInt(onboardMotDays, 10) || 365,
      taxDue: '2027-05-01',
      taxDays: 180,
      insuranceDue: '2027-04-15',
      insuranceDays: 160,
      monthlyFinance: onboardFinance.startsWith('£') ? onboardFinance : `£${onboardFinance}`,
      totalSpentRepairs: '£0.00',
      ownership: onboardOwnership
    };

    setVehiclesList([newVehicle, ...vehiclesList]);
    setSelectedVan(newVehicle.id);
    setIsOnboardModalOpen(false);
    setOnboardReg('');
    setToastNotice(`Vehicle ${newVehicle.reg} onboarded to ${newVehicle.company}!`);
    setTimeout(() => setToastNotice(null), 3500);
  };

  return (
    <div style={{ padding: '0 24px 32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Toast Notification */}
      {toastNotice && (
        <div style={{
          background: '#0d6942',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 700,
          fontSize: '13px',
          boxShadow: '0 4px 14px rgba(13, 105, 66, 0.3)'
        }}>
          <CheckCircle2 size={16} color="#ffffff" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '24px',
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.25)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              background: '#0d6942', 
              color: '#ffffff',
              padding: '4px 10px', 
              borderRadius: '9999px', 
              fontSize: '12px', 
              fontWeight: 700 
            }}>
              FLEET & COMPLIANCE COMMAND
            </span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{vehiclesList.length} Vehicles Active in Fleet</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
            Fleet Telemetry, Document Vault & Compliance Watchdog
          </h1>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
            Proactive alerts for MOT, Road Tax, Insurance, and Service intervals. Integrated vehicle loan telemetry and driver deposit escrow.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsOnboardModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0d6942',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              padding: '10px 18px',
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(13,105,66,0.3)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>Onboard New Vehicle</span>
          </button>

          <button
            onClick={() => setIsServiceModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              padding: '10px 18px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              cursor: 'pointer'
            }}
          >
            <Wrench size={16} />
            <span>Log Service / Repair</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="quix-card" style={{ padding: '8px 12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        {[
          { id: 'vehicles', label: 'Fleet Overview & Telemetry', icon: Truck },
          { id: 'deposits', label: 'Driver Van Deposit Escrow (£1k Target)', icon: Coins },
          { id: 'documents', label: 'Document Vault (MOT/Insurance/V5C)', icon: FileText },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 700,
                background: isActive ? '#0d6942' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                boxShadow: isActive ? '0 4px 10px rgba(13,105,66,0.2)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: FLEET OVERVIEW & VEHICLE TELEMETRY */}
      {activeSubTab === 'vehicles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Van Selector Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {vehiclesList.map((v) => {
              const isSelected = selectedVan === v.id;
              const isWarning = v.motDays <= 30;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVan(v.id)}
                  className="quix-card"
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #0d6942' : '1px solid #e2e8f0',
                    background: isSelected ? '#f0fdf4' : '#ffffff',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  {isWarning && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#fef2f2',
                      color: '#dc2626',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontWeight: 800
                    }}>
                      <AlertTriangle size={12} />
                      <span>MOT in {v.motDays}d</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      background: '#1e293b',
                      color: '#fbbf24',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      letterSpacing: '1px'
                    }}>
                      {v.reg}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                      {v.fuel}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                    {v.make} {v.model} ({v.year})
                  </h3>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>
                    Driver: <strong style={{ color: '#0f172a' }}>{v.currentDriver}</strong>
                  </span>

                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                    <span>Mileage: <strong>{v.mileage.toLocaleString()} mi</strong></span>
                    <span>Finance: <strong style={{ color: '#0d6942' }}>{v.monthlyFinance}/mo</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dedicated Van Detail Panel (Replicating KR23XYZ Sheet Model) */}
          <div className="quix-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid #eef2f6' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: '#0f172a', color: '#fbbf24', padding: '6px 14px', borderRadius: '8px', fontSize: '18px', fontWeight: 900, fontFamily: 'monospace' }}>
                    KR23 XYZ
                  </span>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      MERCEDES SPRINTER 315 CDI (2023)
                    </h2>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Owned by: MS Herrig Ltd • Admiral Business Insurance P771542333 • Named: Tulio + Daniel K
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: '#ecfdf5', color: '#065f46', padding: '6px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} color="#10b981" /> MOT Valid (12/07/2027)
                </span>
                <span style={{ background: '#eff6ff', color: '#1e40af', padding: '6px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} color="#3b82f6" /> Road Tax (£360/yr)
                </span>
                <span style={{ background: '#fdf4ff', color: '#86198f', padding: '6px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700 }}>
                  Next Full Service: 139,000 mi
                </span>
              </div>
            </div>

            {/* Financial Telemetry Banner (From KR23XYZ cells N4:O8) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', margin: '20px 0' }}>
              <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>ORIGINAL PURCHASE PRICE</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>£24,600.00</span>
                <span style={{ display: 'block', fontSize: '11px', color: '#10b981', marginTop: '2px' }}>£5,000 Deposit Paid</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>MONTHLY LOAN PAYMENT</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#0d6942' }}>£456.80 / mo</span>
                <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>48 Months Term</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>BALANCE LEFT TO PAY</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#b45309' }}>£19,184.90</span>
                <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Close Brothers Finance</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>TOTAL SPENT ON REPAIRS</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626' }}>£7,202.08</span>
                <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>7 Logged Interventions</span>
              </div>
            </div>

            {/* Maintenance History Table */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={16} color="#0d6942" />
                  Service & Maintenance Log (Exact Data from KR23XYZ Sheet)
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Auto-linked to Bank Expenses</span>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 16px', fontWeight: 700 }}>DATE</th>
                      <th style={{ padding: '10px 16px', fontWeight: 700 }}>MILEAGE</th>
                      <th style={{ padding: '10px 16px', fontWeight: 700 }}>SERVICE CARRIED OUT</th>
                      <th style={{ padding: '10px 16px', fontWeight: 700 }}>LABOUR COST</th>
                      <th style={{ padding: '10px 16px', fontWeight: 700 }}>PART COST</th>
                      <th style={{ padding: '10px 16px', fontWeight: 700 }}>TOTAL COST</th>
                      <th style={{ padding: '10px 16px', fontWeight: 700 }}>GARAGE / OBSERVATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceHistory.map((s, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 600, color: '#334155' }}>{s.date}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 700, color: '#0f172a' }}>{s.mileage.toLocaleString()} mi</td>
                        <td style={{ padding: '10px 16px', fontWeight: 700, color: '#0d6942' }}>{s.desc}</td>
                        <td style={{ padding: '10px 16px', color: '#64748b' }}>{s.labour}</td>
                        <td style={{ padding: '10px 16px', color: '#64748b' }}>{s.parts}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 800, color: '#0f172a' }}>{s.total}</td>
                        <td style={{ padding: '10px 16px', color: '#475569' }}>
                          <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                            {s.garage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Driver Logbook (Chain of Custody) */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #eef2f6' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Driver Custody Logbook (Who Operated This Van)
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 16px', background: '#f8fafc' }}>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>16/04/2026 – Present</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0d6942' }}>Daniel K (Active Custody)</span>
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 16px', background: '#f8fafc' }}>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>16/04/2026 – 16/04/2026</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Bruno (Temporary Induction)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DRIVER VAN DEPOSIT ESCROW (£1,000 TARGET) */}
      {activeSubTab === 'deposits' && (
        <div className="quix-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Driver Van Security Deposit Escrow (Sample: DEPOSIT FOR THE VANS)
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Subcontractors contribute £200 installments every 4-week pay period up to the required £1,000 damage security cap.
              </p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0d6942', background: '#ecfdf5', padding: '6px 14px', borderRadius: '9999px' }}>
              Total Escrow Held: £2,800.00
            </span>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>DRIVER NAME</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>DR NUMBER</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>PAID INSTALLMENTS</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>ESCROW PROGRESS</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>COLLECTED / TARGET</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>PAYROLL DEDUCTION DATES</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((d, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                    <td style={{ padding: '12px 18px', fontWeight: 700, color: '#0f172a' }}>{d.driver}</td>
                    <td style={{ padding: '12px 18px', fontFamily: 'monospace', fontWeight: 600, color: '#64748b' }}>{d.drNumber}</td>
                    <td style={{ padding: '12px 18px', fontWeight: 700, color: '#334155' }}>{d.installments} × £200</td>
                    <td style={{ padding: '12px 18px', width: '180px' }}>
                      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${(d.current / d.target) * 100}%`, height: '100%', background: d.current >= d.target ? '#10b981' : '#0d6942' }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 800, color: '#0f172a' }}>
                      £{d.current}.00 / £{d.target}.00
                    </td>
                    <td style={{ padding: '12px 18px', fontSize: '11px', color: '#64748b' }}>{d.dates}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: d.current >= d.target ? '#ecfdf5' : d.current > 0 ? '#eff6ff' : '#f1f5f9',
                        color: d.current >= d.target ? '#065f46' : d.current > 0 ? '#1e40af' : '#64748b'
                      }}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DIGITAL DOCUMENT VAULT */}
      {activeSubTab === 'documents' && (
        <div className="quix-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Vehicle Document Vault (Client Request: Sheet1 Vehicle Control)
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Secure repository for MOT Certificates, Insurance Policies, V5C Logbooks, and Hire Contracts.
              </p>
            </div>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0d6942',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: '9999px'
            }}>
              <Upload size={14} /> Upload New Document
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { name: 'MOT Certificate (KR23 XYZ)', date: '13/07/2026', type: 'MOT Pass Certificate', expiry: '12/07/2027', file: 'MOT_KR23XYZ_2026.pdf', status: 'Valid' },
              { name: 'Admiral Fleet Insurance Policy', date: '15/04/2026', type: 'Commercial Policy', expiry: '15/04/2027', file: 'Admiral_P771542333.pdf', status: 'Valid' },
              { name: 'V5C Registration Logbook', date: '10/04/2026', type: 'DVLA Logbook', expiry: 'Permanent', file: 'V5C_KR23XYZ.pdf', status: 'Registered' },
              { name: 'Autoguard 3-Yr Warranty Contract', date: '11/04/2026', type: 'Extended Warranty', expiry: '11/04/2029', file: 'Warranty_Autoguard.pdf', status: 'Active' },
            ].map((doc, idx) => (
              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <FileText size={20} color="#0d6942" />
                    <span style={{ fontSize: '10px', fontWeight: 700, background: '#ecfdf5', color: '#065f46', padding: '2px 8px', borderRadius: '9999px' }}>
                      {doc.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{doc.name}</h4>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Type: {doc.type}</span>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Expires: <strong>{doc.expiry}</strong></span>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#0d6942' }}>
                    <Eye size={13} /> View
                  </button>
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                    <Download size={13} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Service & Maintenance Modal */}
      {isServiceModalOpen && (
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
            maxWidth: '540px',
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
                  Log Vehicle Service or Repair
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Directly updates vehicle telemetry and maintenance ledger
                </span>
              </div>
              <button onClick={() => setIsServiceModalOpen(false)} style={{ padding: '6px', borderRadius: '50%', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    VEHICLE
                  </label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}>
                    <option>KR23 XYZ (Mercedes Sprinter)</option>
                    <option>HX72 XYZ (Mercedes Sprinter)</option>
                    <option>EF22 VVV (Mercedes eVito)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    DATE OF SERVICE
                  </label>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  ODOMETER MILEAGE
                </label>
                <input
                  type="number"
                  value={serviceMileage}
                  onChange={(e) => setServiceMileage(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  SERVICE CARRIED OUT
                </label>
                <input
                  type="text"
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="e.g. FULL CLUTCH KIT CHANGED"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    LABOUR COST (£)
                  </label>
                  <input
                    type="number"
                    value={serviceLabour}
                    onChange={(e) => setServiceLabour(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    PARTS COST (£)
                  </label>
                  <input
                    type="number"
                    value={serviceParts}
                    onChange={(e) => setServiceParts(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  SUPPLIER / GARAGE
                </label>
                <input
                  type="text"
                  value={serviceGarage}
                  onChange={(e) => setServiceGarage(e.target.value)}
                  placeholder="e.g. P&D AUTOMOTIVE, SAM MOTORS"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <button
                onClick={() => setIsServiceModalOpen(false)}
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
                <span>Record Maintenance Entry</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard New Vehicle Modal */}
      {isOnboardModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
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
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ background: '#ecfdf5', color: '#0d6942', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800 }}>
                  FLEET ASSET REGISTRATION
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '6px 0 0 0' }}>
                  Onboard Commercial Fleet Vehicle
                </h3>
              </div>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleOnboardVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    REGISTRATION PLATE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KR24 XYZ"
                    value={onboardReg}
                    onChange={(e) => setOnboardReg(e.target.value.toUpperCase())}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 800, fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    COMPANY ENTITY
                  </label>
                  <select
                    value={onboardCompany}
                    onChange={(e) => setOnboardCompany(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}
                  >
                    <option value="MS Herrig Ltd">MS Herrig Ltd</option>
                    <option value="TGB Services Ltd">TGB Services Ltd</option>
                    <option value="GoConnect Partnership">GoConnect Partnership</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    MAKE & MODEL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mercedes Sprinter 315 CDI"
                    value={onboardModel}
                    onChange={(e) => setOnboardModel(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    FUEL TYPE
                  </label>
                  <select
                    value={onboardFuel}
                    onChange={(e) => setOnboardFuel(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    ASSIGNED DRIVER
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ronaldo Luiz Silva (DR85899)"
                    value={onboardDriver}
                    onChange={(e) => setOnboardDriver(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    STARTING ODOMETER (MI)
                  </label>
                  <input
                    type="number"
                    value={onboardMileage}
                    onChange={(e) => setOnboardMileage(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    MONTHLY FINANCE / LEASE (£)
                  </label>
                  <input
                    type="text"
                    value={onboardFinance}
                    onChange={(e) => setOnboardFinance(e.target.value)}
                    placeholder="£450.00"
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    MOT DAYS REMAINING
                  </label>
                  <input
                    type="number"
                    value={onboardMotDays}
                    onChange={(e) => setOnboardMotDays(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
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
                  marginTop: '10px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>Complete Vehicle Onboarding</span>
                <CheckCircle2 size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
