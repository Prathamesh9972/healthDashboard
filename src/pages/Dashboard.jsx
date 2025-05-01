import React, { useState } from "react";
import DataInputForm from "../components/DataInputForm";
import DataTable from "../components/DataTable";
import Filters from "../components/Filters";
import HealthGraph from "../components/HealthGraph";
import { useHealth } from "../context/HealthContext";
import { calculateStats, filterHealthData } from "../utils/helpers";

const Dashboard = () => {
  const [editData, setEditData] = useState(null);
  const { state } = useHealth();
  
  // Calculate statistics from filtered data
  const filteredData = filterHealthData(state.healthData, state.filter);
  const stats = calculateStats(filteredData);
  
  const handleEdit = (data) => {
    setEditData(data);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const clearEdit = () => {
    setEditData(null);
  };
  
  return (
    <div className="container py-4">
      {/* Header */}
      <header className="pb-3 mb-4 border-bottom">
        <div className="d-flex align-items-center text-dark text-decoration-none">
          <i className="bi bi-activity fs-4 me-2 text-primary"></i>
          <h1 className="fs-4">Health Metrics Dashboard</h1>
        </div>
      </header>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card h-100 bg-light shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Average</h5>
              <h2 className="display-5">{stats.average}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center text-success">
              <h5 className="card-title">Healthy</h5>
              <h2 className="display-5">{stats.healthyCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center text-warning">
              <h5 className="card-title">Warnings</h5>
              <h2 className="display-5">{stats.warningCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center text-danger">
              <h5 className="card-title">Critical</h5>
              <h2 className="display-5">{stats.criticalCount}</h2>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form and Filters */}
      <div className="row">
        <div className="col-md-8">
          <DataInputForm editData={editData} clearEdit={clearEdit} />
        </div>
        <div className="col-md-4">
          <Filters />
        </div>
      </div>
      
      {/* Graph */}
      <div className="row">
        <div className="col-12">
          <HealthGraph />
        </div>
      </div>
      
      {/* Data Table */}
      <div className="row">
        <div className="col-12">
          <DataTable onEdit={handleEdit} />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="pt-3 mt-4 text-muted border-top">
        <div className="d-flex justify-content-between align-items-center">
          <div>Health Metrics Dashboard &copy; 2025</div>
          
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;