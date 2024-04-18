import React, { useState } from 'react';

// Define your function
const clearCartLocallyOnLogout = () => {
  // Implementation of the function
};


const addProductToCart = () => {
  // Implementation of the function
};

const removeProductFromCart = () => {
  // Implementation of the function
};

const clearCartAPICall = () => {
  // Implementation of the function
};

export const CartContext = React.createContext({
  clearCartLocallyOnLogout: clearCartLocallyOnLogout,
  cart: [],
  addProductToCart: () => addProductToCart,
  removeProductFromCart: removeProductFromCart,
  clearCartAPICall: clearCartAPICall,
});

export const CartProvider = ({ children, clearCartAPICall }) => {
  const [cart, setCart] = useState([]);
  return (
    <CartContext.Provider value={{
      clearCartLocallyOnLogout,
      cart: cart,
      addProductToCart: addProductToCart,
      removeProductFromCart: removeProductFromCart,
      clearCartAPICall: clearCartAPICall,
    }}>
      {children}
    </CartContext.Provider>
  );
};