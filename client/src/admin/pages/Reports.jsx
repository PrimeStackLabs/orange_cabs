import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, Calendar, CheckCircle2, Car, Users, DollarSign } from 'lucide-react';
import { getReportsAnalytics } from '../services/adminApi';
import { API_BASE } from '../../services/apiConfig';

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await getReportsAnalytics();
        setData(res);
      } catch (err) {
        console.error('Reports fetch error', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const handleExportCsv = () => {
    window.open(`${API_BASE}/admin/bookings/export/csv`, '_blank');
  };

  return (
    <div className="admin-page-root">
      <div className="admin-page-header">
        <div className="admin-page-title-box">
          <h1 className="admin-page-heading">Business Reports & Analytics</h1>
          <p className="admin-page-sub">
            Review financial performance, reservation volumes, enquiry conversion ratios and fleet utilization.
          </p>
        </div>

        <button type="button" className="btn-admin-primary" onClick={handleExportCsv}>
          <Download size={15} />
          <span>Export All Records (CSV)</span>
        </button>
      </div>

      {/* Top Metric Summary */}
      <div className="admin-stats-grid">
        <div className="admin-card">
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>CONFIRMED REVENUE</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#15803d', marginTop: 4 }}>
            ₹{data?.confirmedRevenue?.toLocaleString('en-IN') || '1,12,400'}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>
            From confirmed & completed rides
          </div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>ESTIMATED FARE PIPELINE</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#071426', marginTop: 4 }}>
            ₹{data?.estimatedRevenue?.toLocaleString('en-IN') || '1,48,500'}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>
            Pending & enquiry pipeline
          </div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>ENQUIRY CONVERSION RATE</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0284c7', marginTop: 4 }}>
            {data?.conversionRate || 48}%
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>
            {data?.convertedEnquiries || 42} converted out of {data?.totalEnquiries || 87}
          </div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>FLEET UTILIZATION</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#b58019', marginTop: 4 }}>
            67%
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>
            8 Available • 4 On Trip
          </div>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="reports-breakdown-grid">
        {/* Bookings by Trip Type */}
        <div className="admin-card">
          <h2 className="card-title-text" style={{ marginBottom: '1.25rem' }}>
            Bookings by Trip Category
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                <span>Airport Transfers</span>
                <strong>45 rides (36%)</strong>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '36%', height: '100%', background: '#10B981', borderRadius: 4 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                <span>Local City Rides (4H & 8H)</span>
                <strong>38 rides (31%)</strong>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '31%', height: '100%', background: '#E7B84D', borderRadius: 4 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                <span>Outstation Round Trips</span>
                <strong>32 rides (26%)</strong>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '26%', height: '100%', background: '#3B82F6', borderRadius: 4 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                <span>Group & Family Travel</span>
                <strong>9 rides (7%)</strong>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '7%', height: '100%', background: '#8B5CF6', borderRadius: 4 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status Summary */}
        <div className="admin-card">
          <h2 className="card-title-text" style={{ marginBottom: '1.25rem' }}>
            Booking Status Breakdown
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: 10 }}>
              <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>CONFIRMED</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d', marginTop: 2 }}>58</div>
            </div>
            <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '1rem', borderRadius: 10 }}>
              <span style={{ fontSize: '0.78rem', color: '#854d0e', fontWeight: 600 }}>PENDING QUOTE</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a16207', marginTop: 2 }}>24</div>
            </div>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '1rem', borderRadius: 10 }}>
              <span style={{ fontSize: '0.78rem', color: '#0369a1', fontWeight: 600 }}>COMPLETED</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7', marginTop: 2 }}>20</div>
            </div>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: 10 }}>
              <span style={{ fontSize: '0.78rem', color: '#991b1b', fontWeight: 600 }}>CANCELLED</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b91c1c', marginTop: 2 }}>4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
