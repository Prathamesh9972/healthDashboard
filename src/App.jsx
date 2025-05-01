import React from 'react';
import Dashboard from './pages/Dashboard';
import { HealthProvider } from './context/HealthContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  return (
    <HealthProvider>
      <div className="bg-light min-vh-100">
        <Dashboard />
      </div>
    </HealthProvider>
  );
}

export default App;
