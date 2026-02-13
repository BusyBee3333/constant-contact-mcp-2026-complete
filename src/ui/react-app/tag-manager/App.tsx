import React, { useState, useEffect } from 'react';
import './styles.css';

export default function Tagmanager() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Tag Manager</h1>
        <button className="btn-refresh">Refresh</button>
      </header>
      <div className="content">
        <p>MCP App: tag-manager</p>
      </div>
    </div>
  );
}
