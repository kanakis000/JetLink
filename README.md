# JetLink

JetLink is a full-stack tourism platform developed as a university project and expanded into a personal project. The platform allows users to discover hotels, restaurants, and bars, make bookings, and manage reservations through a modern web interface.

The system also provides management tools for hotel and restaurant owners, allowing them to manage their businesses, room types, bookings, and menu items.

---

## Features

### User Features

- User registration and login
- Browse hotels by region
- Browse restaurants and bars
- View hotel details
- View restaurant details
- Hotel room booking system
- Room type selection
- Booking history
- Booking cancellation
- Availability checking

### Hotel Manager Features

- Create hotels
- Edit hotel information
- Upload hotel images
- Manage room types
- Set room availability
- View bookings per hotel
- Manage room pricing

### Restaurant Manager Features

- Create restaurants and bars
- Edit restaurant information
- Upload restaurant images
- Manage menu items
- View restaurant details

### Additional Features

- Responsive design
- Pagination
- Search functionality
- Role-based access control
- Image upload support

---

## Technologies Used

### Frontend

- React.js
- React Router
- Axios
- CSS3
- JavaScript (ES6+)

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Authentication

- JWT (JSON Web Tokens)
- bcrypt

### File Uploads

- Multer

---

## Project Structure

```
JetLink/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── uploads/
│
└── database/
```

---

## Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/kanakis000/JetLink.git
cd JetLink
```

---

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

### 4. Configure the Database

Create a MySQL database.

Example:

```sql
CREATE DATABASE jetlinkdb;
```

Update the database configuration file with your own credentials:

```javascript
host: "localhost",
user: "root",
password: "YOUR_PASSWORD",
database: "jetlinkdb"
```

---

### 5. Start the Backend

```bash
cd backend
npm start

---

### 6. Start the Frontend

```bash
cd jetlink
npm run dev
```

---

### 7. Open the Application

Open your browser and navigate to:

```text
http://localhost:5173
```

---

## Future Improvements

- Online payments
- Email notifications
- Google Maps integration
- Review and rating system
- Advanced search filters
- Mobile application version

---

## Author

Dimitris Kanakis

BSc Computer Science Graduate  
University of East London

GitHub:
https://github.com/kanakis000

LinkedIn:
https://www.linkedin.com/in/dimitris-kanakis-24889b265/

---

## License

This project was developed for educational and portfolio purposes.
