const express = require("express");
const db = require("../config/db");
const multer = require("multer");
const router = express.Router();

// Storage for images
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

//  Serve uploads statically
router.use("/uploads", express.static("uploads"));

//  Add Restaurant or Bar
router.post("/add", upload.single("image"), (req, res) => {
  const { name, type, region, manager_id, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !region || !manager_id) {
    return res.status(400).json({ message: "Missing fields!" });
  }

  const sql = `
    INSERT INTO restaurants_bars (name, type, region, manager_id, description, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, type || 'Restaurant', region, manager_id, description || "", image], (err) => {
    if (err) {
      console.error(" Error adding restaurant/bar:", err);
      return res.status(500).json({ message: "Insert failed" });
    }
    res.status(201).json({ message: " Restaurant/Bar added successfully!" });
  });
});

//  Edit Restaurant/Bar
router.put("/update/:id", upload.single("image"), (req, res) => {
  const { name, type, region, manager_id, description } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;

  if (!name || !region) {
    return res.status(400).json({ message: "Missing fields!" });
  }

  const sql = image
    ? `UPDATE restaurants_bars SET name = ?, type = ?, region = ?, description = ?, image = ? WHERE id = ?`
    : `UPDATE restaurants_bars SET name = ?, type = ?, region = ?, description = ? WHERE id = ?`;

  const params = image
    ? [name, type || 'Restaurant', region, description || "", image, id]
    : [name, type || 'Restaurant', region, description || "", id];

  db.query(sql, params, (err) => {
    if (err) {
      console.error(" Error updating restaurant/bar:", err);
      return res.status(500).json({ message: "Update failed" });
    }
    res.status(200).json({ message: " Updated successfully!" });
  });
});

//  Delete Restaurant/Bar
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM restaurants_bars WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(" Error deleting:", err);
      return res.status(500).json({ message: "Delete failed" });
    }
    res.status(200).json({ message: " Deleted successfully!" });
  });
});

//  Fetch by Region with Pagination
router.get("/region/:region", (req, res) => {
  const { region } = req.params;
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  const sql = `
    SELECT * FROM restaurants_bars 
    WHERE region = ?
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [region, parseInt(limit), parseInt(offset)], (err, results) => {
    if (err) {
      console.error(" Fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    db.query(
      "SELECT COUNT(*) AS total FROM restaurants_bars WHERE region = ?",
      [region],
      (err, countResult) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);
        res.json({ restaurants_bars: results, totalPages });
      }
    );
  });
});

router.get("/manager/:managerId", (req, res) => {
  const { managerId } = req.params;
  const sql = "SELECT * FROM restaurants_bars WHERE manager_id = ?";

  db.query(sql, [managerId], (err, results) => {
    if (err) {
      console.error(" Error fetching manager's restaurants:", err);
      return res.status(500).json({ message: "Failed to fetch" });
    }
    res.status(200).json(results);
  });
});

//  Get ALL restaurants/bars (for search)
router.get("/all", (req, res) => {
  db.query("SELECT * FROM restaurants_bars", (err, results) => {
    if (err) {
      console.error("❌ Error fetching all restaurants/bars:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
});

//  Fetch Single by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM restaurants_bars WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(" Fetch single error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(results[0]);
  });
});




module.exports = router;
