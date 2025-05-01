import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { useHealth } from '../context/HealthContext';
import { filterHealthData, getColorByValue } from '../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const color = payload[0].payload.color;
    let statusText;
    
    switch(color) {
      case 'red':
        statusText = 'Critical';
        break;
      case 'orange':
        statusText = 'Warning';
        break;
      case 'green':
        statusText = 'Normal';
        break;
      default:
        statusText = 'Unknown';
    }
    
    return (
      <div className="bg-white p-3 border rounded shadow">
        <p className="mb-1"><strong>Date:</strong> {label}</p>
        <p className="mb-1"><strong>Value:</strong> {payload[0].value}</p>
        <p className="mb-0">
          <strong>Status:</strong> <span style={{ color }}>{statusText}</span>
        </p>
      </div>
    );
  }
  return null;
};

const HealthGraph = () => {
  const { state } = useHealth();
  const filteredData = filterHealthData(state.healthData, {...state.filter, thresholds: state.thresholds});
  
  // Get thresholds from state or use defaults
  const thresholds = state.thresholds || {
    lowerThreshold: 20,
    lowerBound: 50,
    upperBound: 100,
    upperThreshold: 150
  };
  
  const data = filteredData.map((item) => ({
    date: item.date,
    value: item.value,
    color: getColorByValue(item.value, thresholds),
  }));
  
  // Find suitable Y-axis domain based on data and thresholds
  const maxThreshold = thresholds.upperThreshold;
  const minThreshold = thresholds.lowerThreshold;
  
  // Include data values in determining domain boundaries
  const values = data.map(item => item.value);
  const maxValue = values.length > 0 ? Math.max(...values) : 0;
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  
  // Calculate domain with padding
  const yMin = Math.max(0, Math.floor(Math.min(minValue, minThreshold) * 0.8));
  const yMax = Math.ceil(Math.max(maxValue, maxThreshold) * 1.2);
  
  const renderColorfulDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <circle 
        cx={cx}
        cy={cy}
        r={5}
        fill={payload.color}
        stroke="white"
        strokeWidth={2}
      />
    );
  };
  
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white">
        <h5 className="card-title mb-0">Health Metrics Over Time</h5>
      </div>
      <div className="card-body">
        {data.length === 0 ? (
          <div className="alert alert-info text-center">
            No data available to display. Add some health records to see your graph.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart 
              data={data}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#666' }}
                tickLine={{ stroke: '#666' }}
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fill: '#666' }}
                tickLine={{ stroke: '#666' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Reference lines for threshold indicators */}
              <ReferenceLine
                y={thresholds.lowerThreshold}
                stroke="red"
                strokeDasharray="3 3"
                label={{
                  value: 'Lower Critical',
                  position: 'insideBottomLeft',
                  fill: 'red'
                }}
              />
              <ReferenceLine
                y={thresholds.lowerBound}
                stroke="orange"
                strokeDasharray="3 3"
                label={{
                  value: 'Lower Warning',
                  position: 'insideBottomLeft',
                  fill: 'orange'
                }}
              />
              <ReferenceLine
                y={thresholds.upperBound}
                stroke="orange"
                strokeDasharray="3 3"
                label={{
                  value: 'Upper Warning',
                  position: 'insideTopLeft',
                  fill: 'orange'
                }}
              />
              <ReferenceLine
                y={thresholds.upperThreshold}
                stroke="red"
                strokeDasharray="3 3"
                label={{
                  value: 'Upper Critical',
                  position: 'insideTopLeft',
                  fill: 'red'
                }}
              />
              
              <Line
                type="monotone"
                dataKey="value"
                name="Health Value"
                stroke="#0d6efd"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={renderColorfulDot}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        <div className="mt-3 p-2 border-top">
          <small className="text-muted">
            <strong>Legend:</strong> 
            <span className="ms-2 badge bg-success">Normal (Green)</span>: {thresholds.lowerBound} - {thresholds.upperBound}
            <span className="ms-2 badge bg-warning">Warning (Orange)</span>: {thresholds.lowerThreshold} - {thresholds.lowerBound} or {thresholds.upperBound} - {thresholds.upperThreshold}
            <span className="ms-2 badge bg-danger">Critical (Red)</span>: Below {thresholds.lowerThreshold} or above {thresholds.upperThreshold}
          </small>
        </div>
      </div>
    </div>
  );
};

export default HealthGraph;