import React, { useState, useEffect } from "react";

function Admin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  // INLOGGNINGS-STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Admin LÖSENORD
  const ADMIN_PASSWORD = "Haya123";

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  const fetchProducts = () => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then(setProducts);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    }).then(() => {
      fetchProducts();
      setNewProduct({ title: "", description: "", price: "", imageUrl: "" });
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/products/${id}`, { method: "DELETE" }).then(
      fetchProducts,
    );
  };

  // Hantera inloggningsförsöket
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Fel lösenord! Försök igen.");
      setPassword("");
    }
  };

  // OM MAN INTE ÄR INLOGGAD, VISA INLOGGNINGSFORMULÄR
  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <h1>Admin Inloggning ⚙️</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="password"
            placeholder="Skriv in lösenord..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="buy-button">
            Logga in
          </button>
          {loginError && <p className="error-message">{loginError}</p>}
        </form>
      </div>
    );
  }

  // OM MAN ÄR INLOGGAD, VISA ADMIN-PANELEN
  return (
    <div className="admin-page" style={{ padding: "20px" }}>
      <h1>Admin-panel 🛠️</h1>
      <button
        onClick={() => setIsLoggedIn(false)}
        style={{ marginBottom: "20px" }}
      >
        Logga ut
      </button>

      <section
        className="add-product"
        style={{
          background: "#eee",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h2>Lägg till ny dryck</h2>
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Namn"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Pris"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Bildfil (t.ex. nedladdning.jpg)"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Beskrivning"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            required
          />
          <button type="submit" className="buy-button">
            Spara produkt
          </button>
        </form>
      </section>

      <h2>Hantera befintliga produkter</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Namn</th>
            <th>Pris</th>
            <th>Åtgärd</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.price} kr</td>
              <td>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Ta bort
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
