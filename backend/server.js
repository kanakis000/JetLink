const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const roomTypeRoutes = require('./routes/roomTypeRoutes');
const restaurantBarRoutes = require("./routes/restaurantBarRoutes");
const menuRoutes = require("./routes/menuRoutes");
require('./config/db'); 

const app = express();



//  Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/room-types", roomTypeRoutes);

//  Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  Routes
app.use("/auth", authRoutes);
app.use("/hotels", hotelRoutes);
app.use("/bookings", bookingRoutes);
app.use("/restaurants-bars", restaurantBarRoutes);
app.use("/menu", menuRoutes);

//  Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});