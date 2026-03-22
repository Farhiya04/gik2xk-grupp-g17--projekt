const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");

// POST /ratings - Lägg till ett betyg
router.post("/", async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const newRating = await Rating.create({
      rating: rating,
      comment: comment,
      productId: productId,
    });
    res.json(newRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /ratings/:productId - Hämta alla betyg för en viss produkt
router.get("/:productId", async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { productId: req.params.productId },
    });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
