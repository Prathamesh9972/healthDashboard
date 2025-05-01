import React from "react";
import { useHealth } from "../context/HealthContext";
import { getColorByValue } from "../utils/helpers";

const DataTable = ({ onEdit }) => {
  const { state, dispatch } = useHealth();
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      dispatch({
        type: 'DELETE_DATA',
        payload: id,
      });
    }
  };
  
  const getBadgeClass = (color) => {
    switch(color) {
      case 'green':
        return 'bg-success';
      case 'orange':
        return 'bg-warning';
      case 'red':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };
  
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Health Data Records</h5>
        <span className="badge bg-primary">
          {state.healthData.length} Records
        </span>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Value</th>
                <th>Alert Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.healthData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-muted">
                    No health data available. Add some metrics to get started.
                  </td>
                </tr>
              ) : (
                state.healthData.map((item) => {
                  const color = getColorByValue(item.value, state.thresholds);
                  return (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td>{item.value}</td>
                      <td>
                        <span className={`badge ${getBadgeClass(color)}`}>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => onEdit(item)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;