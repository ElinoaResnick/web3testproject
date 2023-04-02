// import React from "react";
import { useState, useEffect } from 'react';

// function ProductsList(props) {
//   const { contract } = props;
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function fetchData() {   
//       const numProducts = await contract.methods.numberofFunders().call();
//       const newProducts = [];
//       for (let i = 0; i < numProducts; i++) {
//         const productOwner = await contract.methods.lutFunders(i).call();
//         const product = await contract.methods.products(productOwner).call();
//         newProducts.push(product);
//       }
//       setProducts(newProducts);
//     }
//     fetchData();
//   }, [contract]);

//   return (
//     <div>
//       <h2>Products List</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Starting Price</th>
//             <th>Description</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((product, index) => (
//             <tr key={index}>
//               <td>{product.name}</td>
//               <td>{product.startingPriceWei}</td>
//               <td>{product.generalDescription}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ProductsList;

import React from 'react';

function ProductList({ products }) {
  if (!products) {
    return <div>No products available.</div>
  }
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>

  );
}

export default ProductList;
