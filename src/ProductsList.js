// import React from 'react';

// function ProductList({ products }) {
//   if (!products) {
//     return <div>No products available.</div>
//   }
//   return (
//     <ul>
//       {products.map((product) => (
//         <li key={product.id}>{product.name}</li>
//       ))}
//     </ul>

//   );
// }

// export default ProductList;

import React from 'react';

function ProductList({ products }) {
  if (!products) {
    return <div>No products available.</div>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Starting Price (Wei)</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.startingPriceWei}</td>
            <td>{product.generalDescription}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductList;
