import React from 'react';
import { useHealth } from '../context/HealthContext';

const ThresholdSettings = () => {
  const { state, dispatch } = useHealth();
  const { thresholds } = state.filter;

  const handleThresholdChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_THRESHOLDS',
      payload: {
        [name]: Number(value)
      }
    });
  };

  return (
    <div className="threshold-settings">
      <h3>Threshold Settings</h3>
      <div className="threshold-inputs">
        <div className="threshold-group">
          <label>
            Primary Lower Threshold:
            <input
              type="number"
              name="lowerThreshold"
              value={thresholds?.lowerThreshold || ''}
              onChange={handleThresholdChange}
              placeholder="Lower Threshold (e.g., 20)"
            />
          </label>
        </div>
        <div className="threshold-group">
          <label>
            Primary Upper Threshold:
            <input
              type="number"
              name="upperThreshold"
              value={thresholds?.upperThreshold || ''}
              onChange={handleThresholdChange}
              placeholder="Upper Threshold (e.g., 50)"
            />
          </label>
        </div>
        <div className="threshold-group">
          <label>
            Secondary Lower Threshold:
            <input
              type="number"
              name="lowerSecondaryThreshold"
              value={thresholds?.lowerSecondaryThreshold || ''}
              onChange={handleThresholdChange}
              placeholder="Lower Secondary Threshold (e.g., 10)"
            />
          </label>
        </div>
        <div className="threshold-group">
          <label>
            Secondary Upper Threshold:
            <input
              type="number"
              name="upperSecondaryThreshold"
              value={thresholds?.upperSecondaryThreshold || ''}
              onChange={handleThresholdChange}
              placeholder="Secondary Upper Threshold (e.g., 70)"
            />
          </label>
        </div>
      </div>
      <div className="threshold-legend">
        <div className="legend-item">
          <span className="color-box green"></span>
          <span>Between primary thresholds</span>
        </div>
        <div className="legend-item">
          <span className="color-box orange"></span>
          <span>Between primary and secondary thresholds</span>
        </div>
        <div className="legend-item">
          <span className="color-box red"></span>
          <span>Outside secondary thresholds</span>
        </div>
      </div>
    </div>
  );
};

export default ThresholdSettings;