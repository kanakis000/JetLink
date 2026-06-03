
const express = require("express");
const db = require("../config/db");

const router = express.Router();


//  Cancel a booking
router.delete("/cancel/:bookingId", (req, res) => {
  const { bookingId } = req.params;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: "Transaction error", error: err });

    const fetchSql = `
      SELECT hotel_id, room_type 
      FROM bookings 
      WHERE id = ? AND status = 'confirmed'
    `;

    db.query(fetchSql, [bookingId], (err, results) => {
      if (err || results.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ message: "Booking not found or already cancelled" });
        });
      }

      const { hotel_id, room_type } = results[0];

      const updateStatusSql = `UPDATE bookings SET status = 'cancelled' WHERE id = ?`;

      db.query(updateStatusSql, [bookingId], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: "Failed to update booking status" });
          });
        }

        const updateRoomSql = `
          UPDATE room_types 
          SET available_rooms = available_rooms + 1 
          WHERE hotel_id = ? AND type = ?
        `;

        db.query(updateRoomSql, [hotel_id, room_type], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: "Failed to restore room availability" });
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ message: "Commit failed" });
              });
            }

            res.status(200).json({ message: " Booking cancelled and room restored." });
          });
        });
      });
    });
  });
});


//  Get all bookings for hotels managed by a specific manager
router.get("/manager/:managerId", (req, res) => {
    const managerId = req.params.managerId;
  
    const sql = `
      SELECT bookings.*, users.username AS guest_name, hotels.name AS hotel_name 
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      JOIN hotels ON bookings.hotel_id = hotels.id
      WHERE hotels.manager_id = ?
      ORDER BY bookings.check_in DESC
    `;
  
    db.query(sql, [managerId], (err, results) => {
      if (err) {
        console.error(" Error fetching manager bookings:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(200).json(results);
    });
  });

 //  Get bookings for a specific hotel
router.get("/hotel/:hotelId", (req, res) => {
  const hotelId = req.params.hotelId;

  const sql = `
    SELECT bookings.*, users.username AS guest_name 
    FROM bookings
    JOIN users ON bookings.user_id = users.id
    WHERE bookings.hotel_id = ?
    ORDER BY bookings.check_in DESC
  `;

  db.query(sql, [hotelId], (err, results) => {
    if (err) {
      console.error(" Error fetching hotel bookings:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});


 //  Check room availability based on date range
router.get("/availability/:hotelId", (req, res) => {
  const { hotelId } = req.params;
  const { check_in, check_out } = req.query;

  if (!check_in || !check_out) {
    return res.status(400).json({ message: "Missing check-in or check-out date." });
  }

  const sql = `
    SELECT room_count FROM hotels WHERE id = ?
  `;
  db.query(sql, [hotelId], (err, hotelResult) => {
    if (err || hotelResult.length === 0) {
      return res.status(500).json({ message: "Hotel not found or error occurred." });
    }

    const roomCount = hotelResult[0].room_count;

    const bookingSql = `
      SELECT SUM(guests) AS booked_guests
      FROM bookings
      WHERE hotel_id = ?
      AND (
        (check_in < ? AND check_out > ?) OR
        (check_in >= ? AND check_in < ?)
      )
    `;

    db.query(
      bookingSql,
      [hotelId, check_out, check_in, check_in, check_out],
      (err, bookingResult) => {
        if (err) {
          return res.status(500).json({ message: "Error checking availability" });
        }

        const booked = bookingResult[0].booked_guests || 0;
        const availableRooms = roomCount - booked;

        res.status(200).json({ availableRooms });
      }
    );
  });
});


router.post("/book", (req, res) => {
    const { user_id, hotel_id } = req.body;

    if (!user_id || !hotel_id) {
        return res.status(400).json({ message: "User ID and Hotel ID are required." });
    }

    const sql = "INSERT INTO bookings (user_id, hotel_id) VALUES (?, ?)";
    db.query(sql, [user_id, hotel_id], (err, result) => {
        if (err) {
            console.error(" Booking Error:", err);
            return res.status(500).json({ message: "Booking failed", error: err });
        }
        res.status(201).json({ message: "Booking successful!" });
    });
});

//  Create a new booking
router.post("/", (req, res) => {
  const { user_id, hotel_id, check_in, check_out, guests, room_type, total_price } = req.body;

  if (!user_id || !hotel_id || !check_in || !check_out || !guests || !room_type) {
    return res.status(400).json({ message: "All fields including room_type are required." });
  }

  const today = new Date().toISOString().split("T")[0];
  if (check_in < today) {
    return res.status(400).json({ message: "Cannot book a room in the past." });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: "Transaction error", error: err });

    const checkSql = `
      SELECT available_rooms FROM room_types
      WHERE hotel_id = ? AND type = ? FOR UPDATE
    `;

    db.query(checkSql, [hotel_id, room_type], (err, results) => {
      if (err || results.length === 0) {
        return db.rollback(() => {
          res.status(400).json({ message: "Room type not available or error" });
        });
      }

      const available = results[0].available_rooms;
      if (available <= 0) {
        return db.rollback(() => {
          res.status(400).json({ message: "No available rooms for selected type" });
        });
      }

      const insertBooking = 
      `INSERT INTO bookings (user_id, hotel_id, check_in, check_out, guests, room_type, total_price)
          VALUES (?, ?, ?, ?, ?, ?, ?)`;

      db.query(
        insertBooking,
        [user_id, hotel_id, check_in, check_out, guests, room_type, total_price],
        (err, result) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: "Booking failed", error: err });
            });
          }

          const updateRoomCount = `
            UPDATE room_types SET available_rooms = available_rooms - 1
            WHERE hotel_id = ? AND type = ?
          `;

          db.query(updateRoomCount, [hotel_id, room_type], (err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ message: "Failed to update room count" });
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ message: "Commit failed" });
                });
              }

              res.status(201).json({ message: " Booking confirmed and room updated!" });
            });
          });
        }

      );
    });
  });
});



//  Add 'status' column to bookings table if it doesn't exist
const checkStatusColumn = `
  SELECT COLUMN_NAME 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'bookings' 
  AND COLUMN_NAME = 'status' 
  AND TABLE_SCHEMA = 'JetLinkdb'
`;

db.query(checkStatusColumn, (err, results) => {
  if (err) {
    console.error(" Error checking 'status' column:", err);
    return;
  }

  if (results.length === 0) {
    const addStatusColumn = `
      ALTER TABLE bookings 
      ADD COLUMN status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed'
    `;
    db.query(addStatusColumn, (err) => {
      if (err) {
        console.error(" Error adding 'status' column:", err);
      } else {
        console.log(" 'status' column added to 'bookings' table.");
      }
    });
  } else {
    console.log("ℹ 'status' column already exists.");
  }
});


router.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT bookings.*, hotels.name AS hotel_name, hotels.region 
    FROM bookings
    JOIN hotels ON bookings.hotel_id = hotels.id
    WHERE bookings.user_id = ? 
    ORDER BY bookings.check_in DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
});




module.exports = router;
