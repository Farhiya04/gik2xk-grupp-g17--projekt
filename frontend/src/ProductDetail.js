import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  // Vår notis
  const [notification, setNotification] = useState("");

  useEffect(() => {
    // Hämta produkten
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch((err) => console.error("Fel vid hämtning av produkt:", err));

    // Hämta betyg
    fetch(`http://localhost:5000/ratings/${id}`)
      .then((res) => res.json())
      .then(setRatings)
      .catch((err) => console.error("Fel vid hämtning av betyg:", err));
  }, [id]);

  // BERÄKNA SNITTBETYG
  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(1)
      : 0;

  //FUNKTION FÖR ATT SKICKA OMDÖME (Denna kopplas till formuläret)
  const submitRating = (e) => {
    e.preventDefault(); // Hindrar sidan från att laddas om

    fetch("http://localhost:5000/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: parseInt(newRating),
        comment: comment,
        productId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRatings([...ratings, data]); // Lägg till det nya betyget i listan direkt
        setComment(""); // Töm textfältet
        setMessage("Tack för ditt omdöme! ⭐");
        setTimeout(() => setMessage(""), 3000); // Ta bort meddelandet efter 3 sekunder
      })
      .catch((err) => console.error("Kunde inte skicka betyg:", err));
  };

  //FUNKTION FÖR ATT LÄGGA I VARUKORG
  const addToCart = () => {
    fetch("http://localhost:5000/carts/1/addProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, amount: 1 }),
    }).then(() => {
      // Visar rutan när man har köpt en vara
      setNotification("Varan lades till i varukorgen! 🛒");
      setTimeout(() => setNotification(""), 3000);
    });
  };

  if (!product) return <div className="cart-page">Laddar produkt...</div>;

  return (
    <div className="product-detail" style={{ padding: "20px" }}>
      {/*NOTISEN när man har lagt en vara i varukorgen */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fad9ed",
            color: "white",
            padding: "15px 30px",
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            zIndex: 1000,
            fontWeight: "bold",
          }}
        >
          {notification}
        </div>
      )}

      <Link to="/" className="back-link">
        ← Tillbaka till sortimentet
      </Link>

      <div
        className="detail-container"
        style={{ display: "flex", gap: "40px", marginTop: "20px" }}
      >
        <img
          src={`http://localhost:5000/images/${product.imageUrl}`}
          alt={product.title}
          style={{ maxWidth: "300px", borderRadius: "10px" }}
        />
        <div className="info">
          <h1>{product.title}</h1>

          {/* VISA SNITTBETYG */}
          <div className="average-stars" style={{ marginBottom: "15px" }}>
            <span style={{ fontSize: "1.5rem", color: "#080708" }}>
              {"★".repeat(Math.round(averageRating)) +
                "☆".repeat(5 - Math.round(averageRating))}
            </span>
            <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
              {averageRating > 0
                ? `${averageRating} / 5 (${ratings.length} röster)`
                : "Inga betyg än"}
            </span>
          </div>

          <p
            className="description"
            style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
          >
            {product.description}
          </p>
          <p
            className="price"
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#070707" }}
          >
            {product.price} kr
          </p>

          <button className="buy-button" onClick={addToCart}>
            Lägg i varukorg 🛒
          </button>
        </div>
      </div>

      <hr
        style={{ margin: "40px 0", border: "0", borderTop: "1px solid #444" }}
      />

      {/* GRÄNSSNITT FÖR ATT BETYGSÄTTA */}
      <section className="ratings-section">
        <h3>Vad tycker du om {product.title}? ⭐</h3>
        {message && (
          <p style={{ color: "#ffcc00", fontWeight: "bold" }}>{message}</p>
        )}

        <form
          onSubmit={submitRating}
          className="rating-form"
          style={{
            background: "#f9f7f8",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <label style={{ color: "white" }}>Ditt betyg: </label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              style={{ padding: "5px", marginLeft: "10px" }}
            >
              <option value="5">5 - Magisk!</option>
              <option value="4">4 - Mycket god</option>
              <option value="3">3 - Helt okej</option>
              <option value="2">2 - Inte min smak</option>
              <option value="1">1 - Aldrig igen</option>
            </select>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <textarea
              placeholder="Skriv en kort kommentar om smaken..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              style={{
                width: "100%",
                height: "80px",
                padding: "10px",
                borderRadius: "5px",
              }}
            />
          </div>

          <button
            type="submit"
            className="buy-button"
            style={{ width: "auto" }}
          >
            Skicka omdöme
          </button>
        </form>

        {/* LISTA AV BETYG */}
        <div className="ratings-list" style={{ marginTop: "30px" }}>
          <h4>Senaste omdömen</h4>
          {ratings.length === 0 ? (
            <p>Inga omdömen än. Bli den första att tycka till!</p>
          ) : (
            ratings
              .slice()
              .reverse()
              .map((r) => (
                <div
                  key={r.id}
                  className="rating-item"
                  style={{
                    background: "#fbebf3",
                    padding: "15px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    borderLeft: "4px solid #ffcc00",
                  }}
                >
                  <div style={{ color: "#ffcc00", fontWeight: "bold" }}>
                    {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                  </div>
                  <p style={{ color: "white", margin: "5px 0" }}>
                    "{r.comment}"
                  </p>
                  <small style={{ color: "#aaa" }}>
                    Skickat: {new Date(r.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
