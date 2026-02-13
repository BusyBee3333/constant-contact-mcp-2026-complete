import React, { useState, useEffect } from 'react';
import './styles.css';

export default function Landingpagegrid() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Landing Page Grid</h1>
        <button className="btn-refresh">Refresh</button>
      </header>
      <div className="content">
        <p>MCP App: landing-page-grid</p>
      </div>
    </div>
  );
}
