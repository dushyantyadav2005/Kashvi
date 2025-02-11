function displayPrice(price) {
  return `₹${price.toFixed(2)}`;
}

const PriceComponent = ({ price }) => (
  <div>
    {/* <span>Price: {displayPrice(price)}</span> */}
  </div>
); 