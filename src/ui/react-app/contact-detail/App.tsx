import React, { useState, useEffect } from 'react';
import './styles.css';

export default function Contactdetail() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Contact Detail</h1>
        <button className="btn-refresh">Refresh</button>
      </header>
      <div className="content">
        <p>MCP App: contact-detail</p>
      </div>
    </div>
  );
}
