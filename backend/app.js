const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./database");

// Importera modellerna
const Product = require("./models/Product");
const User = require("./models/User");
const Rating = require("./models/Rating");
const Cart = require("./models/Cart");
const CartRow = require("./models/CartRow");

// Skapa relationerna (Foreign Keys)
//En användare kan ha många varukorgar
User.hasMany(Cart);
Cart.belongsTo(User);

// En produkt kan ha många betyg
Product.hasMany(Rating);
Rating.belongsTo(Product);

//Många-till-många mellan Cart och Product via CartRow
Cart.belongsToMany(Product, { through: CartRow });
Product.belongsToMany(Cart, { through: CartRow });

const app = express();
app.use(cors());
app.use(express.json());

// Exponerar mappen public/images för webbläsaren/frontend
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Importera alla routes (en gång per fil)
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const ratingRoutes = require("./routes/ratingRoutes"); // Längst upp vid de andra require

// Använd alla routes (en gång per route)
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/carts", cartRoutes);
app.use("/ratings", ratingRoutes);
const PORT = 5000;

// Synkronisera databasen och starta servern
sequelize
  .sync({ force: false })
  .then(() => {
    console.log(
      "Databasen är synkroniserad och alla tabeller/relationer är skapade!",
    );
    app.listen(PORT, () => {
      console.log(`Servern körs på http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Kunde inte koppla till databasen:", error);
  });
