// src/context/DashboardContext.jsx
import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    // Logout logic will be handled by the parent component
    console.log('Logout requested');
  };

  const value = {
    showSidebar,
    setShowSidebar,
    handleLogout
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};