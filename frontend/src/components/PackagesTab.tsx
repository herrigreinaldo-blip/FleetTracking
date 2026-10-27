'use client';

import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  MapPin, 
  User, 
  CheckCircle2, 
  X
} from 'lucide-react';

interface DeliveryPackage {
  id: string;
  trackingNumber: string;
  sender: string;
  recipient: string;
  pickupAddress: string;
  deliveryAddress: string;
  assignedRider: string;
  status: 'In Transit' | 'Delivered' | 'Pending Pickup' | 'Delayed';
  weightKg: number;
  feeUsd: number;
  estDelivery: string;
}

const INITIAL_PACKAGES: DeliveryPackage[] = [
  {
    id: '1',
    trackingNumber: 'QX-98214',
    sender: 'Nordic Electronics Ltd.',
    recipient: 'Sarah Jenkins',
    pickupAddress: '450 Lexington Ave, New York',
    deliveryAddress: '128 W 82nd St, New York',
    assignedRider: 'Marcus Vance',
    status: 'In Transit',
    weightKg: 2.4,
    feeUsd: 28.50,
    estDelivery: 'Today, 3:45 PM'
  },
  {
    id: '2',
    trackingNumber: 'QX-98215',
    sender: 'FreshFarm Organic Market',
    recipient: 'Alexander Wright',
    pickupAddress: '72 Gansevoort St, New York',
    deliveryAddress: '245 Park Ave, New York',
    assignedRider: 'Elena Rostova',
    status: 'In Transit',
    weightKg: 6.8,
    feeUsd: 45.00,
    estDelivery: 'Today, 4:15 PM'
  },
  {
    id: '3',
    trackingNumber: 'QX-98216',
    sender: 'Supreme Apparel Co.',
    recipient: 'Michael Chang',
    pickupAddress: '190 Bowery, New York',
    deliveryAddress: '310 Riverside Dr, New York',
    assignedRider: 'David Kim',
    status: 'Delivered',
    weightKg: 1.1,
    feeUsd: 18.00,
    estDelivery: 'Delivered at 1:15 PM'
  },
  {
    id: '4',
    trackingNumber: 'QX-98217',
    sender: 'Artisan Gourmet Bakery',
    recipient: 'Olivia Martinez',
    pickupAddress: '14 Bleecker St, New York',
    deliveryAddress: '55 Wall St, New York',
    assignedRider: 'Tariq Al-Mansoor',
    status: 'Pending Pickup',
    weightKg: 3.5,
    feeUsd: 32.00,
    estDelivery: 'Today, 5:30 PM'
  },
  {
    id: '5',
    trackingNumber: 'QX-98218',
    sender: 'Apex Medical Supplies',
    recipient: 'Metro Health Clinic',
    pickupAddress: '800 2nd Ave, New York',
    deliveryAddress: '420 E 70th St, New York',
    assignedRider: 'Marcus Vance',
    status: 'In Transit',
    weightKg: 8.2,
    feeUsd: 65.00,
    estDelivery: 'Today, 3:20 PM'
  }
];

export const PackagesTab: React.FC = () => {
  const [packages, setPackages] = useState<DeliveryPackage[]>(INITIAL_PACKAGES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Package Form
  const [formData, setFormData] = useState({
    sender: '',
    recipient: '',
    pickupAddress: '',
    deliveryAddress: '',
    assignedRider: 'Marcus Vance',
    weightKg: 2.0,
    feeUsd: 25.00
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const newPkg: DeliveryPackage = {
      id: String(packages.length + 1),
      trackingNumber: `QX-${Math.floor(10000 + Math.random() * 90000)}`,
      sender: formData.sender,
      recipient: formData.recipient,
      pickupAddress: formData.pickupAddress,
      deliveryAddress: formData.deliveryAddress,
      assignedRider: formData.assignedRider,
      status: 'Pending Pickup',
      weightKg: Number(formData.weightKg),
      feeUsd: Number(formData.feeUsd),
      estDelivery: 'Estimated 2 hours'
    };
    setPackages([newPkg, ...packages]);
    setIsModalOpen(false);
    showNotification(`Shipment ${newPkg.trackingNumber} dispatched successfully.`);
  };

  const filtered = packages.filter(p => {
    const matchesSearch = p.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
                          p.recipient.toLowerCase().includes(search.toLowerCase()) ||
                          p.sender.toLowerCase().includes(search.toLowerCase()) ||
                          p.assignedRider.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'All' ? true : p.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#121826' }}>
            Package Deliveries & Logistics
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Live tracking of active shipments, assigned couriers, and dispatch manifests.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '14px' }}
        >
          <Plus size={18} />
          <span>Dispatch New Package</span>
        </button>
      </div>

      {/* Quick Status Stats */}
      <div className="stat-cards-grid">
        <div className="quix-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Total Dispatched</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#121826', marginTop: '4px' }}>
            {packages.length} Packages
          </div>
        </div>
        <div className="quix-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>Active In Transit</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            {packages.filter(p => p.status === 'In Transit').length} Live
          </div>
        </div>
        <div className="quix-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: '#0d6942', fontWeight: 600 }}>Delivered Today</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0d6942', marginTop: '4px' }}>
            {packages.filter(p => p.status === 'Delivered').length} Completed
          </div>
        </div>
        <div className="quix-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: '#d97706', fontWeight: 600 }}>Pending Pickups</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {packages.filter(p => p.status === 'Pending Pickup').length} Queued
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="quix-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <input
            type="text"
            placeholder="Search tracking #, recipient, sender, rider..."
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

        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'In Transit', 'Delivered', 'Pending Pickup'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                background: statusFilter === s ? '#0d6942' : '#f8fafc',
                color: statusFilter === s ? '#ffffff' : '#64748b',
                border: '1px solid',
                borderColor: statusFilter === s ? '#0d6942' : '#e2e8f0',
                transition: 'all 0.2s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Packages List */}
      <div className="quix-card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 20px' }}>Tracking Number</th>
                <th style={{ padding: '16px 20px' }}>Sender & Recipient</th>
                <th style={{ padding: '16px 20px' }}>Route / Address</th>
                <th style={{ padding: '16px 20px' }}>Courier</th>
                <th style={{ padding: '16px 20px' }}>Fee / Weight</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px' }}>
              {filtered.map(pkg => (
                <tr key={pkg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0d6942'
                      }}>
                        <Package size={17} />
                      </div>
                      <div>
                        <span style={{ fontWeight: 800, color: '#121826' }}>{pkg.trackingNumber}</span>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{pkg.estDelivery}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>To: {pkg.recipient}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>From: {pkg.sender}</div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                      <MapPin size={13} color="#0d6942" />
                      <span>{pkg.deliveryAddress}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      Pickup: {pkg.pickupAddress}
                    </div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: 600, color: '#334155', fontSize: '12px' }}>
                      <User size={13} color="#64748b" />
                      <span>{pkg.assignedRider}</span>
                    </div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: '#121826' }}>${pkg.feeUsd.toFixed(2)}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{pkg.weightKg} kg</div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    {pkg.status === 'In Transit' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '9999px', background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: 700 }}>
                        <span style={{ width: '6px', height: '6px', background: '#0284c7', borderRadius: '50%' }} />
                        In Transit
                      </span>
                    )}
                    {pkg.status === 'Delivered' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '9999px', background: '#d1fae5', color: '#065f46', fontSize: '11px', fontWeight: 700 }}>
                        <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
                        Delivered
                      </span>
                    )}
                    {pkg.status === 'Pending Pickup' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '9999px', background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 700 }}>
                        <span style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }} />
                        Pending Pickup
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
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
              Dispatch New Package
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '22px' }}>
              Create shipment, set origin & destination, and assign a delivery partner.
            </p>

            <form onSubmit={handleCreatePackage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Sender / Store
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Supplies"
                    value={formData.sender}
                    onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
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
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Emily Clark"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Pickup Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500 Broadway, New York"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Delivery Destination
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 140 W 57th St, New York"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
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
                    Assign Rider
                  </label>
                  <select
                    value={formData.assignedRider}
                    onChange={(e) => setFormData({ ...formData, assignedRider: e.target.value })}
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
                    <option value="Marcus Vance">Marcus Vance (Motorbike)</option>
                    <option value="Elena Rostova">Elena Rostova (E-Bike)</option>
                    <option value="Tariq Al-Mansoor">Tariq Al-Mansoor (Van)</option>
                    <option value="David Kim">David Kim (Motorbike)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.feeUsd}
                    onChange={(e) => setFormData({ ...formData, feeUsd: parseFloat(e.target.value) || 0 })}
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
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
