import React, { useState, useEffect } from "react";

function Admin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  // STATES FÖR ATT ÄNDRA PRIS (även namn och bild)
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
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

  // SKAPA produkt (Create)
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

  // TA BORT produkt (Delete)
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/products/${id}`, { method: "DELETE" }).then(
      fetchProducts,
    );
  };

  // UPPDATERA produkt (Update)
  const handleUpdateProduct = (product) => {
    // Vi bygger ihop produkten igen, men med de nya värdena för pris, titel och bild
    const updatedProduct = { ...product, ...editFormData };

    fetch(`http://localhost:5000/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    }).then(() => {
      setEditingProductId(null); // Stäng redigeringsläget
      fetchProducts(); // Ladda om listan med det nya priset
    });
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
      <div
        className="login-page"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <h1>Admin Inloggning ⚙️</h1>
        <form
          onSubmit={handleLogin}
          className="login-form"
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "300px",
            margin: "0 auto",
            gap: "15px",
          }}
        >
          <input
            type="password"
            placeholder="Skriv in lösenord..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button type="submit" className="buy-button">
            Logga in
          </button>
          {loginError && (
            <p style={{ color: "red", fontWeight: "bold" }}>{loginError}</p>
          )}
        </form>
      </div>
    );
  }

  // OM MAN ÄR INLOGGAD, VISA ADMIN-PANELEN
  return (
    <div
      className="admin-page"
      style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Admin-panel </h1>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="buy-button"
          style={{ background: "#666", width: "auto" }}
        >
          Logga ut
        </button>
      </div>

      <section
        className="add-product"
        style={{
          background: "#f9f7f8",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "40px",
        }}
      >
        <h2>Lägg till ny dryck</h2>
        <form
          onSubmit={handleAdd}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <input
            type="text"
            placeholder="Namn"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
            required
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="Pris"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            required
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "80px",
            }}
          />
          <input
            type="text"
            placeholder="Bildfil (t.ex. nedladdning.jpg)"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
            required
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <textarea
            placeholder="Beskrivning"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            required
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minWidth: "200px",
            }}
          />
          <button
            type="submit"
            className="buy-button"
            style={{ width: "auto", padding: "0 20px" }}
          >
            Spara produkt
          </button>
        </form>
      </section>

      <h2>Hantera befintliga produkter</h2>
      <table
        className="cart-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
            <th style={{ padding: "15px" }}>Bild</th>
            <th style={{ padding: "15px" }}>Namn</th>
            <th style={{ padding: "15px" }}>Pris</th>
            <th style={{ padding: "15px" }}>Åtgärd</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
              {/* VISAR BILDEN I TABELLEN ELLER INPUT-FÄLT FÖR FILNAMN */}
              <td style={{ padding: "15px" }}>
                {editingProductId === p.id ? (
                  <input
                    type="text"
                    value={editFormData.imageUrl}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        imageUrl: e.target.value,
                      })
                    }
                    style={{
                      padding: "5px",
                      width: "120px",
                      borderRadius: "4px",
                      border: "1px solid #000",
                    }}
                  />
                ) : (
                  <img
                    src={`http://localhost:5000/images/${p.imageUrl}`}
                    alt={p.title}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                      borderRadius: "5px",
                    }}
                  />
                )}
              </td>

              {/* VISAR NAMNET ELLER INPUT-FÄLT */}
              <td style={{ padding: "15px" }}>
                {editingProductId === p.id ? (
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        title: e.target.value,
                      })
                    }
                    style={{
                      padding: "5px",
                      width: "150px",
                      borderRadius: "4px",
                      border: "1px solid #000",
                    }}
                  />
                ) : (
                  p.title
                )}
              </td>

              {/* VÄXLA MELLAN ATT VISA PRISET ELLER INPUT-FÄLTET */}
              <td style={{ padding: "15px" }}>
                {editingProductId === p.id ? (
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        price: e.target.value,
                      })
                    }
                    style={{
                      padding: "5px",
                      width: "60px",
                      borderRadius: "4px",
                      border: "1px solid #000",
                    }}
                  />
                ) : (
                  `${p.price} kr`
                )}
              </td>

              <td style={{ padding: "15px", display: "flex", gap: "10px" }}>
                {/* VÄXLA MELLAN SPARA- OCH ÄNDRA-KNAPP */}
                {editingProductId === p.id ? (
                  <button
                    onClick={() => handleUpdateProduct(p)}
                    style={{
                      background: "#28a745", //färg för spara ändringar
                      color: "white",
                      border: "none",
                      padding: "5px 15px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Spara
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingProductId(p.id);
                      // Fyll input-fältet med nuvarande information
                      setEditFormData({
                        title: p.title,
                        price: p.price,
                        imageUrl: p.imageUrl,
                      });
                    }}
                    style={{
                      background: "#f39c12", // färg för ändra knappen
                      color: "white",
                      border: "none",
                      padding: "5px 15px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Ändra
                  </button>
                )}

                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "5px 15px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
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
