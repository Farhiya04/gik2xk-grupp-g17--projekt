const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const CartRow = require("../models/CartRow");
const Product = require("../models/Product");

// Hämta varukorg
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.params.userId, payed: false },
      include: [Product],
    });
    res.json(cart || { message: "Varukorgen är tom" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lägg till produkt
router.post("/:userId/addProduct", async (req, res) => {
  try {
    const { productId, amount } = req.body;
    let [cart] = await Cart.findOrCreate({
      where: { userId: req.params.userId, payed: false },
    });

    let cartRow = await CartRow.findOne({
      where: { cartId: cart.id, productId: productId },
    });

    if (cartRow) {
      cartRow.amount += amount;
      await cartRow.save();
    } else {
      await CartRow.create({
        cartId: cart.id,
        productId: productId,
        amount: amount,
      });
    }
    res.json({ message: "Tillagd!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ändra antal (Plus/Minus)
router.put("/:cartId/product/:productId", async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount <= 0) {
      await CartRow.destroy({
        where: { cartId: req.params.cartId, productId: req.params.productId },
      });
      return res.json({ message: "Borttagen" });
    }

    await CartRow.update(
      { amount: amount },
      { where: { cartId: req.params.cartId, productId: req.params.productId } },
    );
    res.json({ message: "Uppdaterad" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ta bort produkt helt
router.delete("/:cartId/product/:productId", async (req, res) => {
  try {
    await CartRow.destroy({
      where: { cartId: req.params.cartId, productId: req.params.productId },
    });
    res.json({ message: "Raderad" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
