import React, { useState } from 'react';
import { useEffect } from 'react';

function ProductList({ products, onSelectProduct, setMinAmount  }) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [lowestProductID, setLowestProductID] = useState(null);
  const [productOwner, setProductOwner] = useState(null);
  const [minAmountForBid, setMinAmountForBid] = useState(null);

  useEffect(() => {
    const product = findProductById(lowestProductID);
    if (product) {
      setProductOwner(product.funder);
      setMinAmountForBid(product.startingPriceEthr);
      // Call the callback function to transfer the minAmountForBid to the App component
      setMinAmount(product.startingPriceEthr);
    }
  }, [lowestProductID, products, setMinAmount]);

  useEffect(() => {
    if (!products || products.length === 0) {
      setProductOwner("no products");
      setMinAmountForBid("no products");
      return;
    }

    setLowestProductID(findLowestProductId(products));
  }, [products]);

  useEffect(() => {
    const product = findProductById(lowestProductID);
    if (product) {
      setProductOwner(product.funder);
      setMinAmountForBid(product.startingPriceEthr);
    }
  }, [lowestProductID, products]);

  function findLowestProductId(products) {
    if (!products || products.length === 0) {
      return ("no products"); // or some other default value
    }

    let lowestId = products[0].id;

    for (let i = 1; i < products.length; i++) {
      if (products[i].id < lowestId) {
        lowestId = products[i].id;
      }
    }

    return lowestId;
  }

  function findProductById(id) {
    return products.find(product => product.id === id);
  }

  const handleProductSelect = (event) => {
    setSelectedProductId(event.target.value);
  };

  const handleSelectButton = (product) => {
    // Send selected product to parent component
    onSelectProduct(product);
  };

  if (!products) {
    return <div>No products available.</div>;
  }

  return (
    <>
      <div>The ID of the product for sale is: {lowestProductID}</div>
      <div>The product owner is: {productOwner}</div>
      <div>the minimum bid amount {minAmountForBid}</div>
      <br></br>
      <select value={selectedProductId} onChange={handleProductSelect}>
        <option value="">All products</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <br></br>
      <br></br>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Starting Price (Ethr)</th>
            <th>Description</th>
            <th>Product owner</th>
          </tr>
        </thead>
        <tbody>
          {
          // selectedProductId ? (
          //   products
          //     .filter((product) => product.id === selectedProductId)
          //     .map((product) => (
          //       <tr key={product.id}>
          //         <td>{product.id}</td>
          //         <td>{product.name}</td>
          //         <td>{product.startingPriceEthr}</td>
          //         <td>{product.generalDescription}</td>
          //       </tr>
          //     ))
          // ) : 
          (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.startingPriceEthr}</td>
                <td>{product.generalDescription}</td>
                <td>{product.funder}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default ProductList;



