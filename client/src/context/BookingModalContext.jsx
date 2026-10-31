import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingModalContext = createContext();

export const BookingModalProvider = ({ children }) => {
  const navigate = useNavigate();

  const openBookingModal = (data = {}) => {
    navigate('/book', { state: data });
  };

  return (
    <BookingModalContext.Provider value={{ openBookingModal }}>
      {children}
    </BookingModalContext.Provider>
  );
};

export const useBookingModal = () => {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error('useBookingModal must be used within a BookingModalProvider');
  }
  return context;
};
