
import React, { useState } from 'react';

function ProductList({ products, onSelectProduct }) {
  const [selectedProductId, setSelectedProductId] = useState('');

  if (!products) {
    return <div>No products available.</div>;
  }

  const handleProductSelect = (event) => {
    setSelectedProductId(event.target.value);
  };

  const handleSelectButton = (product) => {
    // Send selected product to parent component
    onSelectProduct(product);
  };

  return (
    <>
      <select value={selectedProductId} onChange={handleProductSelect}>
        <option value="">All products</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Starting Price (Wei)</th>
            <th>Description</th>
            {/* <th>Select</th> */}
            <th>Product owner</th>
          </tr>
        </thead>
        <tbody>
          {selectedProductId ? (
            products
              .filter((product) => product.id === selectedProductId)
              .map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.startingPriceWei}</td>
                  <td>{product.generalDescription}</td>
                  <td>{product.funder}</td>
                  {/* <td>
                    <button onClick={() => handleSelectButton(product)}>Select</button>
                  </td> */}
                </tr>
              ))
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.startingPriceWei}</td>
                <td>{product.generalDescription}</td>
                <td>{product.funder}</td>
                {/* <td>
                  <button onClick={() => handleSelectButton(product)}>Select</button>
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default ProductList;


