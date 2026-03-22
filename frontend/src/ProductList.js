import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(""); // För feedback

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Fel vid hämtning:", error));
  }, []);

  // Funktion för att lägga till direkt i korgen
  const addToCartDirect = (productId, title) => {
    fetch("http://localhost:5000/carts/1/addProduct", {
      // Vi använder User ID 1
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: productId,
        amount: 1,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setMessage(`${title} lades till i korgen! 🛒`);
        setTimeout(() => setMessage(""), 2000); // Ta bort meddelandet efter 2 sekunder
      })
      .catch((err) => console.error("Kunde inte lägga till:", err));
  };

  return (
    <main className="product-grid-container">
      {/* Meddelande som dyker upp längst upp när man handlar */}
      {message && <div className="cart-notification">{message}</div>}

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={`http://localhost:5000/images/${product.imageUrl}`}
              alt={product.title}
              className="product-image"
            />
            <h2>{product.title}</h2>
            <span className="price">{product.price} kr</span>

            {/* Ny grupp för att hålla knapparna brevid varandra */}
            <div className="card-buttons">
              <Link to={`/product/${product.id}`} className="detail-button">
                Detaljer
              </Link>
              <button
                className="buy-button"
                onClick={() => addToCartDirect(product.id, product.title)}
              >
                Köp 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default ProductList;
