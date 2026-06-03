const express = require("express");
const db = require("../config/db");
const router = express.Router();
const { initializeRoomTypes } = require("../controllers/roomTypeController");

//  Add or update room types (with price) for a hotel
router.post("/set", (req, res) => {
  const { hotel_id, roomTypes } = req.body;

  if (!hotel_id || !Array.isArray(roomTypes)) {
    return res.status(400).json({ message: "Hotel ID and roomTypes array are required." });
  }

  const insertOrUpdate = roomTypes.map(({ type, available_rooms, price_per_night }) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO room_types (hotel_id, type, available_rooms, price_per_night)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          available_rooms = VALUES(available_rooms),
          price_per_night = VALUES(price_per_night)
      `;
      db.query(sql, [hotel_id, type, available_rooms, price_per_night ?? 0], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  Promise.all(insertOrUpdate)
    .then(() => res.status(200).json({ message: " Room types updated successfully!" }))
    .catch((err) => {
      console.error(" Error setting room types:", err);
      res.status(500).json({ message: "Failed to update room types", error: err });
    });
});

//  Get all room types for a hotel
router.get("/:hotelId", (req, res) => {
  const { hotelId } = req.params;

  const sql = "SELECT * FROM room_types WHERE hotel_id = ?";
  db.query(sql, [hotelId], (err, results) => {
    if (err) {
      console.error(" Error fetching room types:", err);
      return res.status(500).json({ message: "Failed to fetch room types" });
    }
    res.status(200).json(results);
  });
});

//  Initialize default room types
router.post("/init/:hotelId", async (req, res) => {
  const { hotelId } = req.params;

  try {
    const result = await initializeRoomTypes(hotelId);
    res.status(200).json({ message: result });
  } catch (err) {
    console.error(" Failed to initialize room types:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
