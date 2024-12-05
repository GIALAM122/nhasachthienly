// productFilters.js
export const filterByPriceHighToLow = (products) => {
    return [...products].sort((a, b) => b.price - a.price);
  };
  
  export const filterByPriceLowToHigh = (products) => {
    return [...products].sort((a, b) => a.price - b.price);
  };
  