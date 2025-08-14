import React from 'react'

const ProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return <p>No recommendations found</p>;
  }

  return (
    <ul>
      {products.map((product, index) => (
        <li key={index}>{product.name} - ${product.price}</li>
      ))}
    </ul>
  );
};


export default ProductList