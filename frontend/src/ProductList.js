import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(""); // Den håller koll på det meddelandet

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Kunde inte hämta produkter:", err));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const addToCart = (productId) => {
    fetch("http://localhost:5000/carts/1/addProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: productId, amount: 1 }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Servern sa ifrån! Status:", res.status);
        }

        // Visa vår notis när man har lagt en vara i korgen
        setNotification("Varan lades till i varukorgen! 🛒");

        // Gömmer notisen automatiskt efter 3 sekunder
        setTimeout(() => {
          setNotification("");
        }, 3000);
      })
      .catch((err) => console.error("Gick inte att lägga till:", err));
  };

  return (
    <div className="home-container">
      {/* DETTA ÄR NOTISEN PÅ SKÄRMEN */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fad9ed",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            zIndex: 1000,
            fontWeight: "bold",
          }}
        >
          {notification}
        </div>
      )}

      {/* SÖKFÄLTET */}
      <div
        className="search-container"
        style={{ margin: "20px auto", maxWidth: "500px" }}
      >
        <input
          type="text"
          placeholder="Sök efter en Red Bull..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 20px",
            borderRadius: "25px",
            border: "2px solid #f8e8f2",
            outline: "none",
          }}
        />
      </div>

      {/* PRODUKTLISTAN */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={`http://localhost:5000/images/${product.imageUrl}`}
                alt={product.title}
                className="product-image"
              />
              <h2>{product.title}</h2>
              <p className="price">{product.price} kr</p>

              <div className="card-buttons">
                <Link to={`/product/${product.id}`} className="detail-button">
                  Detaljer
                </Link>
                <button
                  onClick={() => addToCart(product.id)}
                  className="buy-button"
                >
                  Köp 🛒
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Inga produkter matchar din sökning... 🥤</p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
