import React, { useState, useEffect } from 'react';
import './styles.css';

export default function Contactgrid() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Contact Grid</h1>
        <button className="btn-refresh">Refresh</button>
      </header>
      <div className="content">
        <p>MCP App: contact-grid</p>
      </div>
    </div>
  );
}
