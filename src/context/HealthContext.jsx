import React, { createContext, useContext, useReducer } from 'react';

const HealthContext = createContext();

const sampleData = [
  { id: 1, date: '2025-04-20', value: 45 },
  { id: 2, date: '2025-04-21', value: 65 },
  { id: 3, date: '2025-04-22', value: 115},
  { id: 4, date: '2025-04-23', value: 90 },
  { id: 5, date: '2025-04-24', value: 110 },
];

const initialState = {
  healthData: sampleData, // Pre-populated with sample data
  filter: {
    startDate: null,
    endDate: null,
    alertTypes: {
      orange: true,
      green: true,
      red: true,
    },
  },
};

const reducer = (state, action) => {
  switch(action.type) {
    case 'ADD_DATA':
      return {
        ...state,
        healthData: [...state.healthData, action.payload].sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        ),
      };
      
    case 'UPDATE_DATA':
      return {
        ...state,
        healthData: state.healthData.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ).sort((a, b) => new Date(a.date) - new Date(b.date)),
      };
      
    case 'DELETE_DATA':
      return {
        ...state,
        healthData: state.healthData.filter(item => item.id !== action.payload),
      };
      
    case 'SET_FILTER':
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
      };
      
    case 'RESET_FILTERS':
      return {
        ...state,
        filter: initialState.filter,
      };
      
    default:
      return state;
  }
};

export const HealthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <HealthContext.Provider value={{ state, dispatch }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);