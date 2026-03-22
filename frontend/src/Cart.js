import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    fetch("http://localhost:5000/carts/1")
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Funktion för att ändra antal (+ eller -)
  const updateAmount = (productId, currentAmount, change) => {
    const newAmount = currentAmount + change;

    fetch(`http://localhost:5000/carts/${cart.id}/product/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: newAmount }),
    }).then(() => fetchCart());
  };

  // Funktion för att helt ta bort en vara
  const removeItem = (productId) => {
    fetch(`http://localhost:5000/carts/${cart.id}/product/${productId}`, {
      method: "DELETE",
    }).then(() => fetchCart());
  };

  if (loading) return <div className="cart-page">Laddar...</div>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="cart-page">
        <h2>Din varukorg är tom 🛒</h2>
        <Link to="/" className="back-link">
          Tillbaka till sortimentet
        </Link>
      </div>
    );
  }

  const total = cart.products.reduce(
    (sum, p) => sum + p.price * p.cart_row.amount,
    0,
  );

  return (
    <div className="cart-page">
      <h1>Din Varukorg</h1>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Produkt</th>
            <th style={{ textAlign: "center" }}>Antal</th>
            <th>Pris</th>
            <th>Summa</th>
          </tr>
        </thead>
        <tbody>
          {cart.products.map((product) => (
            <tr key={product.id}>
              <td>
                <div style={{ fontWeight: "bold" }}>{product.title}</div>
                <button
                  onClick={() => removeItem(product.id)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "red",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    padding: 0,
                  }}
                >
                  Ta bort helt
                </button>
              </td>
              <td style={{ textAlign: "center" }}>
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      updateAmount(product.id, product.cart_row.amount, -1)
                    }
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span
                    style={{
                      margin: "0 10px",
                      minWidth: "40px",
                      display: "inline-block",
                    }}
                  >
                    {product.cart_row.amount} st
                  </span>
                  <button
                    onClick={() =>
                      updateAmount(product.id, product.cart_row.amount, 1)
                    }
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </td>
              <td>{product.price} kr</td>
              <td>{product.price * product.cart_row.amount} kr</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-total">
        <h3>Totalbelopp: {total} kr</h3>
        <button className="buy-button" onClick={() => alert("Köp genomfört!")}>
          Slutför köp
        </button>
      </div>
      <Link to="/" className="back-link">
        ← Fortsätt handla
      </Link>
    </div>
  );
}

export default Cart;
