import React, { useState, useEffect } from 'react';
import './styles.css';

interface Campaign {
  campaign_id: string;
  name: string;
  subject?: string;
  current_status?: string;
  created_at?: string;
  scheduled_date?: string;
}

export default function CampaignDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadCampaigns();
  }, [filter]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch('/mcp/campaigns_list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: filter, limit: 50 })
      });
      const data = await response.json();
      setCampaigns(data || []);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'SENT':
      case 'DONE':
        return '#10b981';
      case 'SCHEDULED':
        return '#3b82f6';
      case 'DRAFT':
        return '#6b7280';
      case 'SENDING':
        return '#f59e0b';
      case 'ERROR':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Campaign Dashboard</h1>
        <button onClick={() => window.location.href = '/campaign-builder'} className="btn-primary">
          Create Campaign
        </button>
      </header>

      <div className="filter-bar">
        {['ALL', 'DRAFT', 'SCHEDULED', 'SENT', 'SENDING'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading campaigns...</div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map(campaign => (
            <div key={campaign.campaign_id} className="campaign-card">
              <div className="campaign-header">
                <h3>{campaign.name}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(campaign.current_status) }}
                >
                  {campaign.current_status || 'DRAFT'}
                </span>
              </div>
              <div className="campaign-subject">{campaign.subject || 'No subject'}</div>
              <div className="campaign-meta">
                {campaign.scheduled_date
                  ? `Scheduled: ${new Date(campaign.scheduled_date).toLocaleDateString()}`
                  : `Created: ${campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : 'Unknown'}`
                }
              </div>
              <div className="campaign-actions">
                <button className="btn-secondary">Edit</button>
                <button className="btn-secondary">Stats</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
