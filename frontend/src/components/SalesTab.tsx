'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

export const SalesTab: React.FC = () => {
  const zones = [
    { name: 'Downtown Commercial', revenue: 98450.00, orders: 4920, growth: '+24.5%', share: 38 },
    { name: 'Financial District', revenue: 76120.00, orders: 3800, growth: '+18.2%', share: 29 },
    { name: 'Airport Cargo Hub', revenue: 52340.00, orders: 2610, growth: '+15.7%', share: 20 },
    { name: 'Midtown Tech Center', revenue: 34180.00, orders: 1710, growth: '+12.1%', share: 13 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#121826' }}>
          Sales Revenue & Growth Performance
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          Regional distribution volume, delivery margins, and demand velocity.
        </p>
      </div>

      {/* Top Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div className="quix-card">
          <span style={{ fontSize: '12px', color: '#64748b' }}>Gross Merchandise Value (GMV)</span>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#121826', margin: '6px 0 8px' }}>
            $261,090.00
          </div>
          <span className="pill-badge badge-mint">
            +22.4% vs last period
          </span>
        </div>

        <div className="quix-card">
          <span style={{ fontSize: '12px', color: '#0d6942', fontWeight: 600 }}>Total Fulfilled Orders</span>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#0d6942', margin: '6px 0 8px' }}>
            13,040
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            99.2% on-time fulfillment rate
          </span>
        </div>

        <div className="quix-card">
          <span style={{ fontSize: '12px', color: '#64748b' }}>Average Order Value (AOV)</span>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#121826', margin: '6px 0 8px' }}>
            $20.02
          </div>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
            +$1.45 higher average ticket
          </span>
        </div>
      </div>

      {/* Regional Zone Revenue Contribution */}
      <div className="quix-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#121826' }}>
              Zone Revenue Distribution & Growth Velocity
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Order dispatch density and volume contribution by urban sector.
            </p>
          </div>
          <span className="pill-badge badge-mint">
            Active Real-time
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {zones.map((zone, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="#0d6942" />
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{zone.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: '#64748b' }}>{zone.orders.toLocaleString()} orders</span>
                  <span style={{ fontWeight: 800, color: '#121826' }}>
                    ${zone.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="pill-badge badge-mint" style={{ padding: '2px 8px', fontSize: '11px' }}>
                    {zone.growth}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${zone.share}%`, 
                    height: '100%', 
                    background: idx === 0 ? '#0d6942' : idx === 1 ? '#10b981' : '#6ee7b7',
                    borderRadius: '9999px'
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
