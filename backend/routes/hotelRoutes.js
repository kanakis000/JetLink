const express = require("express");
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

const router = express.Router();

//  Storage config
const storage = multer.diskStorage({
  destination: "uploads/", // Folder to store uploaded images
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

//  Serve uploaded images statically
router.use("/uploads", express.static("uploads"));

//  ADD Hotel (Insert)
router.post("/add", upload.single("image"), (req, res) => {
  const { name, type, region, manager_id, room_count } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !type || !region || !manager_id) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const sql = "INSERT INTO hotels (name, type, region, manager_id, image, room_count) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, type, region, manager_id, image, room_count || 0], (err, result) => {
    if (err) {
      console.error(" Error adding hotel:", err);
      return res.status(500).json({ message: "Insert failed", error: err });
    }
    res.status(201).json({ message: "Hotel added successfully!" });
  });
});

  
  //  UPDATE Hotel (Edit)
  router.put("/update/:id", upload.single("image"), (req, res) => {
    const { name, type, region, room_count } = req.body;
    const image = req.file ? req.file.filename : null;
    const id = req.params.id;
  
    if (!name || !type || !region) {
      return res.status(400).json({ message: "All fields are required!" });
    }
  
    const sql = image
      ? "UPDATE hotels SET name = ?, type = ?, region = ?, image = ?, room_count = ? WHERE id = ?"
      : "UPDATE hotels SET name = ?, type = ?, region = ?, room_count = ? WHERE id = ?";
  
    const params = image
      ? [name, type, region, image, room_count || 0, id]
      : [name, type, region, room_count || 0, id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error(" Error updating hotel:", err);
        return res.status(500).json({ message: "Update failed", error: err });
      }
      res.status(200).json({ message: "Hotel updated successfully!" });
    });
  });
  
  

//  DELETE Hotel by ID
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM hotels WHERE id = ?";
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(" Error deleting hotel:", err);
        return res.status(500).json({ message: "Delete failed", error: err });
      }
      res.status(200).json({ message: "Hotel deleted successfully!" });
    });
  });

// Shared Fetch with Pagination (Reusable)
const fetchHotelsByRegion = (region) => {
  return (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    db.query(
      "SELECT * FROM hotels WHERE region = ? LIMIT ? OFFSET ?",
      [region, parseInt(limit), parseInt(offset)],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        db.query(
          "SELECT COUNT(*) AS total FROM hotels WHERE region = ?",
          [region],
          (err, countResult) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Database error", error: err });
            }

            const totalHotels = countResult[0].total;
            const totalPages = Math.ceil(totalHotels / limit);

            res.json({ hotels: results, totalPages });
          }
        );
      }
    ); 
  };
};

router.get("/manager/:managerId", (req, res) => {
    const { managerId } = req.params;
    const sql = "SELECT * FROM hotels WHERE manager_id = ?";

    db.query(sql, [managerId], (err, results) => {
        if (err) {
            console.error(" Error fetching hotels:", err);
            return res.status(500).json({ message: "Failed to fetch hotels" });
        }
        res.status(200).json(results);
    });
});




//  Routes for regions
router.get("/heraklion", fetchHotelsByRegion("Heraklion"));
router.get("/chania", fetchHotelsByRegion("Chania"));
router.get("/rethymno", fetchHotelsByRegion("Rethymno"));

router.get("/all", (req, res) => {
  db.query("SELECT * FROM hotels", (err, results) => {
    if (err) {
      console.error(" Error fetching all hotels:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
});

//  Get a single hotel by ID
router.get("/:id", (req, res) => {
  const hotelId = req.params.id;
  const sql = "SELECT * FROM hotels WHERE id = ?";

  

  db.query(sql, [hotelId], (err, results) => {
    if (err) {
      console.error(" Error fetching hotel:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(results[0]);
  });
});



module.exports = router;





