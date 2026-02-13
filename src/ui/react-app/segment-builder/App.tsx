import React, { useState, useEffect } from 'react';
import './styles.css';

export default function Segmentbuilder() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Segment Builder</h1>
        <button className="btn-refresh">Refresh</button>
      </header>
      <div className="content">
        <p>MCP App: segment-builder</p>
      </div>
    </div>
  );
}
