import React from 'react';
import { useHealth } from '../context/HealthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Filters = () => {
  const { state, dispatch } = useHealth();
  
  const handleDateChange = (field, date) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { [field]: date },
    });
  };
  
  const handleAlertTypeChange = (color) => {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        alertTypes: {
          ...state.filter.alertTypes,
          [color]: !state.filter.alertTypes?.[color],
        },
      },
    });
  };
  
  const handleResetFilters = () => {
    dispatch({
      type: 'RESET_FILTERS'
    });
  };
  
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white">
        <h5 className="card-title mb-0">Filter Options</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Start Date:</label>
            <DatePicker
              selected={state.filter?.startDate || null}
              onChange={(date) => handleDateChange('startDate', date)}
              isClearable
              className="form-control"
              placeholderText="Select start date"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">End Date:</label>
            <DatePicker
              selected={state.filter?.endDate || null}
              onChange={(date) => handleDateChange('endDate', date)}
              isClearable
              className="form-control"
              placeholderText="Select end date"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Alert Types:</label>
          <div className="d-flex gap-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="greenCheck"
                checked={state.filter.alertTypes?.green || false}
                onChange={() => handleAlertTypeChange('green')}
              />
              <label className="form-check-label text-success" htmlFor="greenCheck">
                Green
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="orangeCheck"
                checked={state.filter.alertTypes?.orange || false}
                onChange={() => handleAlertTypeChange('orange')}
              />
              <label className="form-check-label text-warning" htmlFor="orangeCheck">
                Orange
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="redCheck"
                checked={state.filter.alertTypes?.red || false}
                onChange={() => handleAlertTypeChange('red')}
              />
              <label className="form-check-label text-danger" htmlFor="redCheck">
                Red
              </label>
            </div>
          </div>
        </div>
        
        <button 
          className="btn btn-outline-secondary"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;