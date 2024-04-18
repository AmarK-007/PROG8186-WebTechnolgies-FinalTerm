import React from 'react';

// Define your function
const clearCartLocallyOnLogout = () => {
  // Implementation of the function
};


export const CartContext = React.createContext({
  clearCartLocallyOnLogout: clearCartLocallyOnLogout,
  // Other context values...
});

export const CartProvider = ({ children }) => {
  return (
    <CartContext.Provider value={{ clearCartLocallyOnLogout }}>
      {children}
    </CartContext.Provider>
  );
};