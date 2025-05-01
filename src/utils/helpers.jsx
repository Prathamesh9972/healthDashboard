export const getColorByValue = (value, thresholds = null) => {
    const defaults = {
      lowerThreshold: 20,
      lowerBound: 50,
      upperBound: 100,
      upperThreshold: 150
    };
    
    const {
      lowerThreshold = defaults.lowerThreshold,
      lowerBound = defaults.lowerBound,
      upperBound = defaults.upperBound,
      upperThreshold = defaults.upperThreshold
    } = thresholds || {};
    
    if (value < lowerThreshold || value >= upperThreshold) {
      return 'red';
    } else if (value < lowerBound || value >= upperBound) {
      return 'orange';
    } else {
      return 'green';
    }
  };
  
  export const filterHealthData = (data, filter) => {
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const startDateMatch = !filter.startDate || itemDate >= new Date(filter.startDate);
      const endDateMatch = !filter.endDate || itemDate <= new Date(filter.endDate);
      const dateMatch = startDateMatch && endDateMatch;
      
      const color = getColorByValue(item.value, filter.thresholds);
      const alertTypesSpecified = filter.alertTypes && Object.values(filter.alertTypes).some(value => value);
      const colorMatch = !alertTypesSpecified || filter.alertTypes[color];
      
      return dateMatch && colorMatch;
    });
  };
  
  export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  export const calculateStats = (data, thresholds) => {
    if (!data || data.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        criticalCount: 0,
        warningCount: 0,
        healthyCount: 0
      };
    }
    
    const values = data.map(item => item.value);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const criticalCount = data.filter(item => getColorByValue(item.value, thresholds) === 'red').length;
    const warningCount = data.filter(item => getColorByValue(item.value, thresholds) === 'orange').length;
    const healthyCount = data.filter(item => getColorByValue(item.value, thresholds) === 'green').length;
    
    return {
      average: Math.round(average * 10) / 10,
      min,
      max,
      criticalCount,
      warningCount,
      healthyCount
    };
  };