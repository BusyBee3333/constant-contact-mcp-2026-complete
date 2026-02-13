import React, { useState, useEffect } from 'react';
import './styles.css';

export default function Reportdetail() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Report Detail</h1>
        <button className="btn-refresh">Refresh</button>
      </header>
      <div className="content">
        <p>MCP App: report-detail</p>
      </div>
    </div>
  );
}
