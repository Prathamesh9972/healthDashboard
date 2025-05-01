import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const ThresholdSlider = () => {
  const { state, dispatch } = useHealth();
  
  // Get thresholds from state or use defaults
  const defaultThresholds = {
    lowerThreshold: 20,
    lowerBound: 50,
    upperBound: 100,
    upperThreshold: 150
  };
  
  const thresholds = state.thresholds || defaultThresholds;
  
  // State for slider values
  const [sliderValues, setSliderValues] = useState([
    thresholds.lowerThreshold,
    thresholds.lowerBound,
    thresholds.upperBound,
    thresholds.upperThreshold
  ]);
  
  // Maximum possible value for the slider (can be adjusted based on your data needs)
  const [maxSliderValue, setMaxSliderValue] = useState(200);
  
  // Update local state if thresholds change from elsewhere
  useEffect(() => {
    setSliderValues([
      thresholds.lowerThreshold,
      thresholds.lowerBound,
      thresholds.upperBound,
      thresholds.upperThreshold
    ]);
  }, [thresholds]);
  
  // Custom handle styling for different threshold points
  const handleStyle = [
    { backgroundColor: '#dc3545', border: '2px solid #dc3545' }, // Critical Lower
    { backgroundColor: '#fd7e14', border: '2px solid #fd7e14' }, // Warning Lower
    { backgroundColor: '#fd7e14', border: '2px solid #fd7e14' }, // Warning Upper
    { backgroundColor: '#dc3545', border: '2px solid #dc3545' }  // Critical Upper
  ];
  
  // Custom track styling for different zones
  const trackStyle = [
    { backgroundColor: '#dc3545', height: 8 },  // Critical Lower to Warning Lower
    { backgroundColor: '#198754', height: 8 },  // Normal Zone
    { backgroundColor: '#fd7e14', height: 8 }   // Warning Upper to Critical Upper
  ];
  
  // Custom rail styling
  const railStyle = { backgroundColor: '#e9ecef', height: 8 };
  
  // Handle slider changes
  const handleSliderChange = (values) => {
    // Ensure values don't overlap - this is handled by rc-slider but just to be safe
    const sortedValues = [...values].sort((a, b) => a - b);
    setSliderValues(sortedValues);
  };
  
  // Save thresholds when slider stops
  const handleAfterChange = (values) => {
    dispatch({
      type: 'UPDATE_THRESHOLDS',
      payload: {
        lowerThreshold: values[0],
        lowerBound: values[1],
        upperBound: values[2],
        upperThreshold: values[3]
      }
    });
  };
  
  // Handle custom max value change
  const handleMaxValueChange = (e) => {
    const newMax = parseInt(e.target.value);
    if (!isNaN(newMax) && newMax > sliderValues[3]) {
      setMaxSliderValue(newMax);
    }
  };
  
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white">
        <h5 className="card-title mb-0">Adjust Thresholds</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge bg-light text-dark">0</span>
            <div className="flex-grow-1 px-3">
              <Slider
                range
                min={0}
                max={maxSliderValue}
                value={sliderValues}
                onChange={handleSliderChange}
                onAfterChange={handleAfterChange}
                pushable={5} // Minimum distance between handles
                handleStyle={handleStyle}
                trackStyle={trackStyle}
                railStyle={railStyle}
              />
            </div>
            <div className="input-group" style={{ width: '100px' }}>
              <input
                type="number"
                className="form-control form-control-sm"
                value={maxSliderValue}
                onChange={handleMaxValueChange}
                min={sliderValues[3] + 10}
              />
            </div>
          </div>
          
          <div className="d-flex justify-content-center">
            <div className="legend d-flex flex-wrap gap-2">
              <div className="badge bg-danger">Critical</div>
              <div className="badge bg-warning">Warning</div>
              <div className="badge bg-success">Normal</div>
              <div className="badge bg-warning">Warning</div>
              <div className="badge bg-danger">Critical</div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Lower Critical Threshold</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={sliderValues[0]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 0 && val < sliderValues[1]) {
                    const newValues = [...sliderValues];
                    newValues[0] = val;
                    setSliderValues(newValues);
                    handleAfterChange(newValues);
                  }
                }}
                min={0}
                max={sliderValues[1] - 1}
              />
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <label className="form-label">Lower Warning Threshold</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={sliderValues[1]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > sliderValues[0] && val < sliderValues[2]) {
                    const newValues = [...sliderValues];
                    newValues[1] = val;
                    setSliderValues(newValues);
                    handleAfterChange(newValues);
                  }
                }}
                min={sliderValues[0] + 1}
                max={sliderValues[2] - 1}
              />
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <label className="form-label">Upper Warning Threshold</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={sliderValues[2]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > sliderValues[1] && val < sliderValues[3]) {
                    const newValues = [...sliderValues];
                    newValues[2] = val;
                    setSliderValues(newValues);
                    handleAfterChange(newValues);
                  }
                }}
                min={sliderValues[1] + 1}
                max={sliderValues[3] - 1}
              />
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <label className="form-label">Upper Critical Threshold</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={sliderValues[3]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > sliderValues[2] && val <= maxSliderValue) {
                    const newValues = [...sliderValues];
                    newValues[3] = val;
                    setSliderValues(newValues);
                    handleAfterChange(newValues);
                  }
                }}
                min={sliderValues[2] + 1}
                max={maxSliderValue}
              />
            </div>
          </div>
        </div>
        
        <div className="alert alert-secondary">
          <small>
            <strong>How to read:</strong> Values will be categorized as:
            <ul className="mb-0">
              <li><strong>Critical (Red):</strong> Below {sliderValues[0]} or above {sliderValues[3]}</li>
              <li><strong>Warning (Orange):</strong> Between {sliderValues[0]}-{sliderValues[1]} or {sliderValues[2]}-{sliderValues[3]}</li>
              <li><strong>Normal (Green):</strong> Between {sliderValues[1]}-{sliderValues[2]}</li>
            </ul>
          </small>
        </div>
      </div>
    </div>
  );
};

export default ThresholdSlider;