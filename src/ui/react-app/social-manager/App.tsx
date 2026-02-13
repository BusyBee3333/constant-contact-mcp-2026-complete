import React, { useState, useEffect } from 'react';
import './styles.css';

export default function Socialmanager() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Social Manager</h1>
        <button className="btn-refresh">Refresh</button>
      </header>
      <div className="content">
        <p>MCP App: social-manager</p>
      </div>
    </div>
  );
}
