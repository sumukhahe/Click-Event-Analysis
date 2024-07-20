import React, { useEffect, useRef } from "react";
import axios from "axios";

function ProductList({ user, products, setProducts }) {
  const prevProductsRef = useRef();
  useEffect(() => {
    prevProductsRef.current = products;
  });
  const prevProducts = prevProductsRef.current;

  const handleClick = (productName) => {
    setProducts((prevProducts) => {
      const newProducts = {
        ...prevProducts,
        [productName]: (prevProducts[productName] || 0) + 1,
      };

      return newProducts;
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (prevProducts) {
      Object.keys(products).forEach((productName) => {
        if (products[productName] !== prevProducts[productName]) {
          axios.post("http://localhost:3001", {
            firstName: user.firstName,
            lastName: user.lastName,
            productName,
            clickCount: products[productName],
          });
        }
      });
    }
  }, [products, user.firstName, user.lastName]);

  return (
    <div>
      {Object.keys(products).map((productName) => (
        <button key={productName} onClick={() => handleClick(productName)}>
          {productName}
        </button>
      ))}
    </div>
  );
}

export default ProductList;
