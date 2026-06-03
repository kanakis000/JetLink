const db = require("../config/db");

const defaultRoomTypes = ["1-person", "2-person", "3-person", "4-person", "suite"];

const initializeRoomTypes = async (hotelId) => {
  return new Promise((resolve, reject) => {
    const checkQuery = `SELECT * FROM room_types WHERE hotel_id = ?`;
    db.query(checkQuery, [hotelId], (err, rows) => {
      if (err) return reject(err);
      if (rows.length > 0) return resolve("Already exists");

      const insertQuery = `
        INSERT INTO room_types (hotel_id, type, available_rooms)
        VALUES ${defaultRoomTypes.map(() => "(?, ?, ?)").join(", ")}
      `;

      const values = defaultRoomTypes.flatMap(type => [hotelId, type, 0]);

      db.query(insertQuery, values, (err2) => {
        if (err2) return reject(err2);
        resolve("Room types created");
      });
    });
  });
};

module.exports = { initializeRoomTypes };
