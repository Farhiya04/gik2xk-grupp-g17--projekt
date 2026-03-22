const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Rating = require("../models/Rating");

// GET /products - Hämta alla produkter
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /products/:id - Hämta en produkt (inklusive dess betyg)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Rating],
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Produkten hittades inte" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /products - Skapa en ny produkt
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /products/:id - Ändra en produkt
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.update(req.body);
      res.json(product);
    } else {
      res.status(404).json({ message: "Produkten hittades inte" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /products/:id - Ta bort en produkt
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: "Produkten är borttagen" });
    } else {
      res.status(404).json({ message: "Produkten hittades inte" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
