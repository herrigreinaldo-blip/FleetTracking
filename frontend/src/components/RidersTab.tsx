'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Power, 
  Bike, 
  Truck, 
  CheckCircle2, 
  X, 
  MapPin,
  Star
} from 'lucide-react';

export interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: 'Motorbike' | 'E-Bike' | 'Van' | 'Scooter';
  license: string;
  zone: string;
  deliveries: number;
  rating: number;
  status: 'Active' | 'Disabled' | 'On Delivery';
  joinedDate: string;
}

const INITIAL_RIDERS: Rider[] = [
  {
    id: 'RDR-001',
    name: 'Marcus Vance',
    email: 'marcus.v@fleettracking.com',
    phone: '+1 (555) 234-5678',
    vehicle: 'Motorbike',
    license: 'NYC-8921-MB',
    zone: 'Downtown Commercial',
    deliveries: 428,
    rating: 4.95,
    status: 'Active',
    joinedDate: 'Jan 12, 2025'
  },
  {
    id: 'RDR-002',
    name: 'Elena Rostova',
    email: 'elena.r@fleettracking.com',
    phone: '+1 (555) 876-5432',
    vehicle: 'E-Bike',
    license: 'NYC-4412-EB',
    zone: 'Financial District',
    deliveries: 312,
    rating: 4.88,
    status: 'On Delivery',
    joinedDate: 'Feb 03, 2025'
  },
  {
    id: 'RDR-003',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.m@fleettracking.com',
    phone: '+1 (555) 345-6789',
    vehicle: 'Van',
    license: 'NYC-9901-VN',
    zone: 'Airport & Cargo Hub',
    deliveries: 614,
    rating: 4.98,
    status: 'Active',
    joinedDate: 'Nov 18, 2024'
  },
  {
    id: 'RDR-004',
    name: 'Chloe Bennett',
    email: 'chloe.b@fleettracking.com',
    phone: '+1 (555) 987-6543',
    vehicle: 'Scooter',
    license: 'NYC-1134-SC',
    zone: 'Uptown Residential',
    deliveries: 185,
    rating: 4.75,
    status: 'Disabled',
    joinedDate: 'Mar 15, 2025'
  },
  {
    id: 'RDR-005',
    name: 'David Kim',
    email: 'david.k@fleettracking.com',
    phone: '+1 (555) 456-7890',
    vehicle: 'Motorbike',
    license: 'NYC-6578-MB',
    zone: 'Midtown Tech Hub',
    deliveries: 290,
    rating: 4.91,
    status: 'Active',
    joinedDate: 'Apr 02, 2025'
  }
];

export const RidersTab: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>(INITIAL_RIDERS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: 'Motorbike' as Rider['vehicle'],
    license: '',
    zone: 'Downtown Commercial',
    status: 'Active' as Rider['status']
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingRider(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      vehicle: 'Motorbike',
      license: '',
      zone: 'Downtown Commercial',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rider: Rider) => {
    setEditingRider(rider);
    setFormData({
      name: rider.name,
      email: rider.email,
      phone: rider.phone,
      vehicle: rider.vehicle,
      license: rider.license,
      zone: rider.zone,
      status: rider.status
    });
    setIsModalOpen(true);
  };

  const handleSaveRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRider) {
      // Edit existing
      setRiders(prev => prev.map(r => r.id === editingRider.id ? {
        ...r,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        vehicle: formData.vehicle,
        license: formData.license,
        zone: formData.zone,
        status: formData.status
      } : r));
      showNotification(`Rider "${formData.name}" updated successfully.`);
    } else {
      // Create new
      const newRider: Rider = {
        id: `RDR-${String(riders.length + 1).padStart(3, '0')}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        vehicle: formData.vehicle,
        license: formData.license || `NYC-${Math.floor(1000 + Math.random() * 9000)}-DL`,
        zone: formData.zone,
        deliveries: 0,
        rating: 5.0,
        status: formData.status,
        joinedDate: 'Today'
      };
      setRiders(prev => [newRider, ...prev]);
      showNotification(`Rider "${formData.name}" onboarded successfully.`);
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (riderId: string) => {
    setRiders(prev => prev.map(r => {
      if (r.id === riderId) {
        const nextStatus = r.status === 'Disabled' ? 'Active' : 'Disabled';
        showNotification(`Rider "${r.name}" is now ${nextStatus}.`);
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const handleDeleteRider = (riderId: string, name: string) => {
    if (confirm(`Are you sure you want to remove rider "${name}"?`)) {
      setRiders(prev => prev.filter(r => r.id !== riderId));
      showNotification(`Rider "${name}" has been deleted.`);
    }
  };

  const filteredRiders = riders.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                          r.email.toLowerCase().includes(search.toLowerCase()) ||
                          r.phone.includes(search) ||
                          r.zone.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'All' ? true : r.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const activeCount = riders.filter(r => r.status === 'Active').length;
  const deliveryCount = riders.filter(r => r.status === 'On Delivery').length;
  const disabledCount = riders.filter(r => r.status === 'Disabled').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
          zIndex: 2000,
          fontWeight: 600,
          fontSize: '13px'
        }}>
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Header & Stats Cards */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#121826' }}>
            Delivery Fleet & Rider Onboarding
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Manage active riders, onboard new partners, configure zones and monitor compliance.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '14px' }}
        >
          <Plus size={18} />
          <span>Onboard New Rider</span>
        </button>
      </div>

      {/* Metric Counters */}
      <div className="stat-cards-grid">
        <div className="quix-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Total Registered</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#121826', marginTop: '4px' }}>
            {riders.length} Riders
          </div>
        </div>

        <div className="quix-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: '#0d6942', fontWeight: 600 }}>Active Fleet</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0d6942', marginTop: '4px' }}>
            {activeCount} Ready
          </div>
        </div>

        <div className="quix-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>On Live Delivery</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            {deliveryCount} In Transit
          </div>
        </div>

        <div className="quix-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>Disabled / On Hold</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
            {disabledCount} Inactive
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="quix-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <input
              type="text"
              placeholder="Search rider name, phone, zone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 36px',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                background: '#f8fafc'
              }}
            />
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          </div>
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['All', 'Active', 'On Delivery', 'Disabled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                background: filterStatus === st ? '#0d6942' : '#f8fafc',
                color: filterStatus === st ? '#ffffff' : '#64748b',
                border: '1px solid',
                borderColor: filterStatus === st ? '#0d6942' : '#e2e8f0',
                transition: 'all 0.2s',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Riders Table */}
      <div className="quix-card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 20px' }}>Rider</th>
                <th style={{ padding: '16px 20px' }}>Vehicle & License</th>
                <th style={{ padding: '16px 20px' }}>Operational Zone</th>
                <th style={{ padding: '16px 20px' }}>Deliveries / Rating</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px' }}>
              {filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    No delivery riders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRiders.map((rider) => (
                  <tr 
                    key={rider.id}
                    style={{ 
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.15s',
                      opacity: rider.status === 'Disabled' ? 0.75 : 1
                    }}
                  >
                    {/* Rider Info */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: rider.status === 'Disabled' ? '#e2e8f0' : '#d1fae5',
                          color: rider.status === 'Disabled' ? '#64748b' : '#0d6942',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px'
                        }}>
                          {rider.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#121826' }}>{rider.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            <span>{rider.phone}</span>
                            <span>•</span>
                            <span>{rider.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', background: '#f1f5f9', fontWeight: 600, fontSize: '12px', color: '#334155' }}>
                        {rider.vehicle === 'Motorbike' && <Bike size={14} color="#0d6942" />}
                        {rider.vehicle === 'E-Bike' && <Bike size={14} color="#0284c7" />}
                        {rider.vehicle === 'Van' && <Truck size={14} color="#7c3aed" />}
                        {rider.vehicle === 'Scooter' && <Bike size={14} color="#d97706" />}
                        <span>{rider.vehicle}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                        Plate: {rider.license}
                      </div>
                    </td>

                    {/* Zone */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontWeight: 500 }}>
                        <MapPin size={14} color="#0d6942" />
                        <span>{rider.zone}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                        Joined: {rider.joinedDate}
                      </div>
                    </td>

                    {/* Deliveries & Rating */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#121826' }}>
                        {rider.deliveries} orders
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#d97706', fontWeight: 600, marginTop: '2px' }}>
                        <Star size={12} color="#d97706" fill="#d97706" />
                        <span>{rider.rating.toFixed(2)} rating</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '16px 20px' }}>
                      {rider.status === 'Active' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '9999px', background: '#d1fae5', color: '#065f46', fontSize: '11px', fontWeight: 700 }}>
                          <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
                          Active
                        </span>
                      )}
                      {rider.status === 'On Delivery' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '9999px', background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: 700 }}>
                          <span style={{ width: '6px', height: '6px', background: '#0284c7', borderRadius: '50%' }} />
                          On Route
                        </span>
                      )}
                      {rider.status === 'Disabled' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '9999px', background: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: 700 }}>
                          <span style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }} />
                          Disabled
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEditModal(rider)}
                          title="Edit Rider"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#475569'
                          }}
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Toggle Disable / Enable */}
                        <button
                          onClick={() => handleToggleStatus(rider.id)}
                          title={rider.status === 'Disabled' ? 'Enable Rider' : 'Disable Rider'}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: rider.status === 'Disabled' ? '#ecfdf5' : '#fef2f2',
                            border: '1px solid',
                            borderColor: rider.status === 'Disabled' ? '#a7f3d0' : '#fecaca',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: rider.status === 'Disabled' ? '#059669' : '#dc2626'
                          }}
                        >
                          <Power size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteRider(rider.id, rider.name)}
                          title="Delete Rider"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard / Edit Rider Modal */}
      {isModalOpen && (
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
          zIndex: 1100,
          padding: '20px'
        }}>
          <div 
            className="modal-animate"
            style={{
              background: '#ffffff',
              borderRadius: '28px',
              width: '100%',
              maxWidth: '520px',
              padding: '32px',
              boxShadow: '0 25px 60px -12px rgba(13, 105, 66, 0.25)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}
            >
              <X size={16} />
            </button>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#121826', marginBottom: '4px' }}>
              {editingRider ? 'Edit Rider Information' : 'Onboard New Delivery Rider'}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '22px' }}>
              Fill in the partner details to register and assign vehicles & zones.
            </p>

            <form onSubmit={handleSaveRider} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jason Scott"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                    background: '#f8fafc'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jason@delivery.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      background: '#f8fafc'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      background: '#f8fafc'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Vehicle Type
                  </label>
                  <select
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value as Rider['vehicle'] })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      background: '#f8fafc',
                      color: '#1e293b'
                    }}
                  >
                    <option value="Motorbike">Motorbike</option>
                    <option value="E-Bike">E-Bike</option>
                    <option value="Van">Delivery Van</option>
                    <option value="Scooter">Electric Scooter</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    License / Plate ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="NYC-7890-MB"
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      background: '#f8fafc'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Operational Zone
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      background: '#f8fafc',
                      color: '#1e293b'
                    }}
                  >
                    <option value="Downtown Commercial">Downtown Commercial</option>
                    <option value="Financial District">Financial District</option>
                    <option value="Airport & Cargo Hub">Airport & Cargo Hub</option>
                    <option value="Uptown Residential">Uptown Residential</option>
                    <option value="Midtown Tech Hub">Midtown Tech Hub</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Rider['status'] })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      background: '#f8fafc',
                      color: '#1e293b'
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="On Delivery">On Delivery</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: '13px' }}
                >
                  {editingRider ? 'Save Changes' : 'Complete Onboarding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
