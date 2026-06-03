const mysql = require('mysql2');

//  Create DB Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Dkanakis2004',
  database: 'JetLinkdb',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database.');

  //  Create tables
  createUsersTable();
  createHotelsTableColumns();
  createBookingsTable();
  createRoomTypesTable();
  createRestaurantsBarsTable();
  createMenuItemsTable();



  //  Add extra columns if they don't exist
  addRoomTypeToBookings();
  addPriceToRoomTypes();
  addTotalPriceToBookings();


  //  Extend user roles
  updateUserRoles(); 
});

// -----------------------------
//  USERS TABLE
function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phonenumber VARCHAR(20) NOT NULL,
      role ENUM('user', 'hotel_manager') NOT NULL DEFAULT 'user'
    )
  `;
  db.query(query, handleResult("Users table"));
}

// -----------------------------
//  BOOKINGS TABLE
function createBookingsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      hotel_id INT NOT NULL,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      guests INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (hotel_id) REFERENCES hotels(id)
    )
  `;
  db.query(query, handleResult("Bookings table"));
}

// -----------------------------
//  HOTELS TABLE ADDITIONAL COLUMNS
function createHotelsTableColumns() {
  // Add 'image'
  checkAndAddColumn('hotels', 'image', 'VARCHAR(255)', "'image' column");

  // Add 'room_count'
  checkAndAddColumn('hotels', 'room_count', 'INT DEFAULT 0', "'room_count' column");
}

// -----------------------------
//  ROOM_TYPES TABLE
function createRoomTypesTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS room_types (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hotel_id INT,
      type VARCHAR(50),
      available_rooms INT DEFAULT 0,
      UNIQUE KEY unique_room_type (hotel_id, type),
      FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
    )
  `;
  db.query(query, handleResult("room_types table"));
}

// -----------------------------
//  Add price_per_night to room_types if not exists
function addPriceToRoomTypes() {
  checkAndAddColumn(
    'room_types',
    'price_per_night',
    'DECIMAL(10,2) DEFAULT 0',
    "'price_per_night' column"
  );
}

// -----------------------------
//  Add room_type to bookings if not exists
function addRoomTypeToBookings() {
  checkAndAddColumn(
    'bookings',
    'room_type',
    'VARCHAR(50)',
    "'room_type' column"
  );
}

function addTotalPriceToBookings() {
  checkAndAddColumn(
    'bookings',
    'total_price',
    'DECIMAL(10,2) DEFAULT 0',
    "'total_price' column"
  );
}


// -----------------------------
//   Check and add column if not exists
function checkAndAddColumn(table, column, type, label) {
  const checkQuery = `
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = '${table}' AND COLUMN_NAME = '${column}' AND TABLE_SCHEMA = 'JetLinkdb'
  `;
  db.query(checkQuery, (err, results) => {
    if (err) return console.error(`❌ Error checking ${label}:`, err);
    if (results.length === 0) {
      const alterQuery = `ALTER TABLE ${table} ADD COLUMN ${column} ${type}`;
      db.query(alterQuery, (err) => {
        if (err) {
          console.error(`❌ Error adding ${label}:`, err);
        } else {
          console.log(`✅ ${label} added to '${table}' table.`);
        }
      });
    } else {
      console.log(`ℹ️ ${label} already exists.`);
    }
  });
}

// -----------------------------
//  Utility: Handle create table result
function handleResult(label) {
  return (err) => {
    if (err) {
      console.error(`❌ Error creating ${label}:`, err);
    } else {
      console.log(`✅ ${label} is ready.`);
    }
  };
}

//  RESTAURANTS_BARS TABLE
function createRestaurantsBarsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS restaurants_bars (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      type VARCHAR(50) DEFAULT 'Restaurant',
      region VARCHAR(50) NOT NULL,
      image VARCHAR(255),
      description TEXT,
      manager_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  db.query(query, handleResult("Restaurants & Bars table"));
}

//  MENU_ITEMS TABLE
function createMenuItemsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      restaurant_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(6, 2) NOT NULL,
      category ENUM('Food', 'Drink') DEFAULT 'Food',
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants_bars(id) ON DELETE CASCADE
    )
  `;
  db.query(query, handleResult("Menu Items table"));
}


// Extend 'role' ENUM to add 'restaurant_manager' if missing
function updateUserRoles() {
  const checkEnumQuery = `
    SELECT COLUMN_TYPE 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'role'
      AND TABLE_SCHEMA = 'JetLinkdb'
  `;

  db.query(checkEnumQuery, (err, results) => {
    if (err) {
      console.error("❌ Error checking role ENUM:", err);
      return;
    }

    if (results.length > 0 && !results[0].COLUMN_TYPE.includes('restaurant_manager')) {
      const alterQuery = `
        ALTER TABLE users 
        MODIFY COLUMN role 
        ENUM('user', 'hotel_manager', 'restaurant_manager') 
        NOT NULL DEFAULT 'user'
      `;
      db.query(alterQuery, (err) => {
        if (err) {
          console.error("❌ Error updating role ENUM:", err);
        } else {
          console.log("✅ 'restaurant_manager' role added to users table!");
        }
      });
    } else {
      console.log("ℹ️ 'restaurant_manager' role already exists.");
    }
  });
}


module.exports = db;
