import React, { createContext, useContext, useState } from 'react';

// Create a context
const CarFiltersContext = createContext();

export const useCarFiltersContext = () => useContext(CarFiltersContext);

export const CarFiltersProvider = ({ children }) => {
  const [data, setData] = useState({seatCount: 2,priceRange:[10, 500],automaticSelected:false, manualSelected:false, selectedBrands:[],selectedLocations:[], search:"",filter:false,filterByBrand:false});

  return (
    <CarFiltersContext.Provider value={{ data, setData }}>
      {children}
    </CarFiltersContext.Provider>
  );
};