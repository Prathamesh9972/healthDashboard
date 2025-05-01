import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DataInputForm = ({ editData, clearEdit }) => {
  const { state, dispatch } = useHealth();
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState('');
  const [formError, setFormError] = useState('');
  
  // Threshold state values
  const [upperBound, setUpperBound] = useState(state.thresholds?.upperBound || 100);
  const [lowerBound, setLowerBound] = useState(state.thresholds?.lowerBound || 50);
  const [upperThreshold, setUpperThreshold] = useState(state.thresholds?.upperThreshold || 150);
  const [lowerThreshold, setLowerThreshold] = useState(state.thresholds?.lowerThreshold || 20);
  const [showThresholds, setShowThresholds] = useState(false);
  
  useEffect(() => {
    if (editData) {
      setDate(new Date(editData.date));
      setValue(editData.value.toString());
      setFormError('');
    }
  }, [editData]);
  
  useEffect(() => {
    // Update thresholds from state when available
    if (state.thresholds) {
      setUpperBound(state.thresholds.upperBound);
      setLowerBound(state.thresholds.lowerBound);
      setUpperThreshold(state.thresholds.upperThreshold);
      setLowerThreshold(state.thresholds.lowerThreshold);
    }
  }, [state.thresholds]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!date) {
      setFormError('Please select a date');
      return;
    }
    
    if (!value || isNaN(Number(value))) {
      setFormError('Please enter a valid numeric value');
      return;
    }
    
    const payload = {
      id: editData ? editData.id : Date.now(),
      date: date.toISOString().split('T')[0],
      value: Number(value),
    };
    
    dispatch({
      type: editData ? 'UPDATE_DATA' : 'ADD_DATA',
      payload,
    });
    
    // Reset form
    setDate(new Date());
    setValue('');
    setFormError('');
    
    if (clearEdit) {
      clearEdit();
    }
  };
  
  const updateThresholds = (e) => {
    e.preventDefault();
    
    // Validate thresholds
    if (
      isNaN(Number(upperBound)) || 
      isNaN(Number(lowerBound)) || 
      isNaN(Number(upperThreshold)) || 
      isNaN(Number(lowerThreshold))
    ) {
      setFormError('Please enter valid numeric values for all thresholds');
      return;
    }
    
    // Validate threshold logic
    if (Number(lowerThreshold) >= Number(lowerBound)) {
      setFormError('Lower threshold must be less than lower bound');
      return;
    }
    
    if (Number(lowerBound) >= Number(upperBound)) {
      setFormError('Lower bound must be less than upper bound');
      return;
    }
    
    if (Number(upperBound) >= Number(upperThreshold)) {
      setFormError('Upper bound must be less than upper threshold');
      return;
    }
    
    // Dispatch threshold update
    dispatch({
      type: 'UPDATE_THRESHOLDS',
      payload: {
        upperBound: Number(upperBound),
        lowerBound: Number(lowerBound),
        upperThreshold: Number(upperThreshold),
        lowerThreshold: Number(lowerThreshold)
      }
    });
    
    setFormError('');
    setShowThresholds(false);
  };
  
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white">
        <h5 className="card-title mb-0">
          {editData ? 'Edit Health Data' : 'Add New Health Data'}
        </h5>
      </div>
      <div className="card-body">
        {formError && (
          <div className="alert alert-danger" role="alert">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-5 mb-3">
              <label className="form-label">Date:</label>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                required
              />
            </div>
            
            <div className="col-md-5 mb-3">
              <label className="form-label">Health Value:</label>
              <input
                type="number"
                className="form-control"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                min="0"
                required
              />
            </div>
            
            <div className="col-md-2 d-flex align-items-end mb-3">
              <button 
                type="submit"
                className={`btn ${editData ? 'btn-success' : 'btn-primary'} w-100`}
              >
                {editData ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
          
          {editData && (
            <div className="text-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={clearEdit}
              >
                Cancel Edit
              </button>
            </div>
          )}
        </form>
        
        <div className="mt-3">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => setShowThresholds(!showThresholds)}
          >
            {showThresholds ? 'Hide Threshold Settings' : 'Configure Alert Thresholds'}
          </button>
          
          {showThresholds && (
            <form onSubmit={updateThresholds} className="mt-3 border p-3 rounded">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Lower Threshold (Red below):</label>
                  <input
                    type="number"
                    className="form-control"
                    value={lowerThreshold}
                    onChange={(e) => setLowerThreshold(e.target.value)}
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Lower Bound (Orange → Green):</label>
                  <input
                    type="number"
                    className="form-control"
                    value={lowerBound}
                    onChange={(e) => setLowerBound(e.target.value)}
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Upper Bound (Green → Orange):</label>
                  <input
                    type="number"
                    className="form-control"
                    value={upperBound}
                    onChange={(e) => setUpperBound(e.target.value)}
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Upper Threshold (Red above):</label>
                  <input
                    type="number"
                    className="form-control"
                    value={upperThreshold}
                    onChange={(e) => setUpperThreshold(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center">
                <div className="alert alert-info mb-0 flex-grow-1 me-2">
                  <small>
                    <strong>Red</strong>: Values below {lowerThreshold} or above {upperThreshold}<br />
                    <strong>Orange</strong>: Values between {lowerThreshold}-{lowerBound} or {upperBound}-{upperThreshold}<br />
                    <strong>Green</strong>: Values between {lowerBound}-{upperBound}
                  </small>
                </div>
                <button type="submit" className="btn btn-primary">Save Thresholds</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataInputForm;