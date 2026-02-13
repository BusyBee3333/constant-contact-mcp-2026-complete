import React, { useState, useEffect } from 'react';
import './styles.css';

export default function Importwizard() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Import Wizard</h1>
        <button className="btn-refresh">Refresh</button>
      </header>
      <div className="content">
        <p>MCP App: import-wizard</p>
      </div>
    </div>
  );
}
