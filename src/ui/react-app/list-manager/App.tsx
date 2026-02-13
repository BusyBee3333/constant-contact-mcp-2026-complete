import React, { useState, useEffect } from 'react';
import './styles.css';

interface ContactList {
  list_id: string;
  name: string;
  description?: string;
  membership_count?: number;
}

export default function ListManager() {
  const [lists, setLists] = useState<ContactList[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    setLoading(true);
    try {
      const response = await fetch('/mcp/lists_list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ include_membership_count: 'all' })
      });
      const data = await response.json();
      setLists(data || []);
    } catch (error) {
      console.error('Failed to load lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const createList = async () => {
    if (!newListName.trim()) return;
    
    try {
      await fetch('/mcp/lists_create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName })
      });
      setNewListName('');
      setShowCreate(false);
      loadLists();
    } catch (error) {
      console.error('Failed to create list:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>List Manager</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
          Create List
        </button>
      </header>

      {showCreate && (
        <div className="create-form">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List name..."
            className="text-input"
          />
          <button onClick={createList} className="btn-primary">Save</button>
          <button onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading lists...</div>
      ) : (
        <div className="lists-grid">
          {lists.map(list => (
            <div key={list.list_id} className="list-card">
              <h3>{list.name}</h3>
              <p className="list-desc">{list.description || 'No description'}</p>
              <div className="list-stats">
                <span className="member-count">{list.membership_count || 0} members</span>
              </div>
              <div className="list-actions">
                <button className="btn-secondary">Edit</button>
                <button className="btn-secondary">View Contacts</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
