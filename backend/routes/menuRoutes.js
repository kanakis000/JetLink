const express = require("express");
const router = express.Router();
const db = require("../config/db");;
const multer = require("multer");
const path = require("path");

//  File Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

//  GET all menu items for a restaurant
router.get("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const query = `SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY created_at DESC`;

  db.query(query, [restaurantId], (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching menu items" });
    res.json(results);
  });
});

//  POST create a new menu item
router.post("/add", upload.single("image"), (req, res) => {
  const { restaurant_id, name, description, price, category } = req.body;
  const image = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO menu_items (restaurant_id, name, description, price, category, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [restaurant_id, name, description, price, category, image], (err, result) => {
    if (err) return res.status(500).json({ error: "Error adding menu item" });
    res.json({ message: "Menu item added successfully", id: result.insertId });
  });
});

//  PUT update a menu item
router.put("/update/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;
  const image = req.file ? req.file.filename : null;

  const fields = [];
  const values = [];

  if (name) fields.push("name = ?"), values.push(name);
  if (description !== undefined) {
    fields.push("description = ?");
    values.push(description);
  }
  
  if (price) fields.push("price = ?"), values.push(price);
  if (category) fields.push("category = ?"), values.push(category);
  if (image) fields.push("image = ?"), values.push(image);

  const query = `UPDATE menu_items SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: "Error updating menu item" });
    res.json({ message: "Menu item updated successfully" });
  });
});

//  DELETE a menu item
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM menu_items WHERE id = ?`, [id], (err) => {
    if (err) return res.status(500).json({ error: "Error deleting item" });
    res.json({ message: "Menu item deleted" });
  });
});

module.exports = router;
