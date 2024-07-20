// App.js
import React, { useState } from "react";
import UserForm from "./UserForm";
import ProductList from "./ProductList";

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState({
    Smartphones: 0,
    Fashion: 0,
    Grocery: 0,
    Electronics: 0,
    HomeFurniture: 0,
    Books: 0,
    Beauty_and_Personal:0,
    Music: 0
  });

  return (
    <div className="App">
      <UserForm setUser={setUser} />
      {user && (
        <ProductList
          user={user}
          products={products}
          setProducts={setProducts}
        />
      )}
    </div>
  );
}

export default App;
