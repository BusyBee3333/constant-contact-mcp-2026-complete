import React, { useState, useEffect } from 'react';
import './styles.css';

interface Contact {
  contact_id: string;
  email_address: string;
  first_name?: string;
  last_name?: string;
  created_at?: string;
  list_memberships?: string[];
}

interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
}

export default function ContactDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, unsubscribed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      // Simulate MCP tool call
      const response = await fetch('/mcp/contacts_list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 100 })
      });
      const data = await response.json();
      
      setContacts(data.contacts || []);
      setStats({
        total: data.contacts?.length || 0,
        active: data.contacts?.filter((c: Contact) => c.list_memberships?.length).length || 0,
        unsubscribed: 0
      });
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Contact Dashboard</h1>
        <button onClick={loadContacts} className="btn-refresh">
          Refresh
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Contacts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.unsubscribed}</div>
          <div className="stat-label">Unsubscribed</div>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading contacts...</div>
      ) : (
        <div className="contacts-list">
          {filteredContacts.map(contact => (
            <div key={contact.contact_id} className="contact-card">
              <div className="contact-name">
                {contact.first_name} {contact.last_name}
              </div>
              <div className="contact-email">{contact.email_address}</div>
              <div className="contact-meta">
                {contact.list_memberships?.length || 0} lists
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
