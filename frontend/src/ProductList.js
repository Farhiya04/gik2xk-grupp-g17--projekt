import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(""); // Håller koll på meddelandet
  const [sortBy, setSortBy] = useState("default"); // Håller koll på vald pris-sortering

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Kunde inte hämta produkter:", err));
  }, []);

  // Filtrera först efter sökord
  let displayedProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  //Sortera därefter bara efter PRIS
  if (sortBy === "lowestPrice") {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "highestPrice") {
    displayedProducts.sort((a, b) => b.price - a.price);
  }

  const addToCart = (productId) => {
    fetch("http://localhost:5000/carts/1/addProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: productId, amount: 1 }),
    })
      .then((res) => {
        if (!res.ok) console.error("Servern sa ifrån!");

        // Visa notis
        setNotification("Varan lades till i varukorgen! 🛒");

        // Göm notis efter 3 sekunder
        setTimeout(() => {
          setNotification("");
        }, 3000);
      })
      .catch((err) => console.error("Gick inte att lägga till:", err));
  };

  return (
    <div
      className="home-container"
      style={{
        backgroundColor: "#fbebf3",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* NOTISEN PÅ SKÄRMEN*/}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fad9ed",
            color: "#000",
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

      {/* SÖK OCH PRIS-SORTERING  */}
      <div
        className="search-container"
        style={{
          margin: "20px auto",
          maxWidth: "600px",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Sök efter en Red Bull..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 2,
            padding: "12px 20px",
            borderRadius: "25px",
            border: "2px solid #f8e8f2",
            outline: "none",
          }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "25px",
            border: "2px solid #f8e8f2",
            backgroundColor: "white",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="default">Sortera efter...</option>
          <option value="lowestPrice">Lägsta pris </option>
          <option value="highestPrice">Högsta pris </option>
        </select>
      </div>

      {/* PRODUKTLISTAN */}
      <div
        className="product-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "15px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              }}
            >
              <img
                src={`http://localhost:5000/images/${product.imageUrl}`}
                alt={product.title}
                style={{ width: "150px", height: "auto", marginBottom: "15px" }}
              />
              <h3 style={{ margin: "10px 0" }}>{product.title}</h3>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  color: "#333",
                }}
              >
                {product.price} kr
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                {/* KÖPKNAPP */}
                <button
                  onClick={() => addToCart(product.id)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#ff3366",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  Köp 🛒
                </button>

                {/* DETALJLÄNK  */}
                <Link
                  to={`/product/${product.id}`}
                  style={{
                    color: "#666",
                    textDecoration: "underline",
                    fontSize: "0.95rem",
                    marginTop: "5px",
                  }}
                >
                  Läs mer om smaken
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
            Inga produkter matchar din sökning...
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
