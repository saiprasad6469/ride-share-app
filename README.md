# RideShare App

A full-stack web application that connects drivers and riders on a single platform, making it easier to share rides, split travel costs, and make better use of empty seats. The project replicates the core workflow of real-world ride-sharing platforms like Uber or Ola in a clean, functional, and easy-to-understand way.

---

## The Problem This Solves

A lot of people travel the same routes every day — to college, to the office, or between cities — and most of them do it alone. Drivers end up with empty seats, riders end up paying more than they should, and traffic keeps getting worse.

This application brings both sides together. Drivers post their ride details and available seats, riders search for rides that match their route, and the booking is handled through the platform. No calls, no middlemen, no confusion. Just a straightforward way to coordinate shared travel that benefits everyone involved.

---

## How It Works

The application has two types of users — drivers and riders — and the flow is built around what each of them needs.

1. A user registers and logs into the platform with their credentials.
2. Once inside, they choose whether they want to offer a ride or find one.
3. If they are a driver, they create a ride by entering the pickup location, destination, date, time, and number of available seats. This ride is saved to the database and immediately searchable by other users.
4. If they are a rider, they enter their preferred route and travel time. The system fetches matching rides from the database and displays them.
5. The rider selects a ride and books it. The system automatically reduces the available seat count and records the booking.
6. Both the driver and rider can view the ride in their booking history at any time.

All communication between the frontend and backend happens through REST API calls, keeping the data in sync across both sides in real time.

---

## User Roles

### Driver

Drivers can use the platform to:

- Post a new ride with pickup point, destination, date, time, and available seats
- View all rides they have posted
- See who has booked their ride
- Cancel or update a posted ride if plans change
- Track ride history from their dashboard

### Rider

Riders can use the platform to:

- Search for rides by entering their source, destination, and preferred date
- Browse available rides that match their route
- Book a seat on any open ride
- View all current and past bookings from their profile
- Cancel a booking if they no longer need the ride

---

## Features

**User Authentication**
Registration and login are handled with secure authentication. Passwords are hashed before being stored, and protected routes require a valid token to access. Users stay logged in across sessions without having to sign in each time.

**Ride Posting**
Drivers can create a ride by filling in all relevant details — start point, destination, date, time, and how many seats are available. The ride is saved and instantly shows up in search results for riders looking for matching routes.

**Ride Search**
Riders enter their pickup and drop location along with a travel date, and the system queries the database for rides that match. Results are displayed in a clear list so the rider can compare options and pick the best one.

**Booking System**
When a rider books a seat, the system records the booking and decrements the available seat count on that ride. If all seats are taken, the ride no longer appears as available to other users. This prevents overbooking automatically.

**Ride and Booking History**
Both drivers and riders have access to a history of their past activity. Drivers can see all rides they have offered and who booked them. Riders can see all rides they have been on. This gives both sides a clear record of their travel without needing to track anything manually.

**Responsive Interface**
The frontend is built to work across different screen sizes. Whether accessed from a laptop or a phone, the layout adjusts so users can search, post, and book rides comfortably from any device.

**Modular Backend Structure**
The backend is structured by separating routes, controllers, and models into their own folders. This makes it easier to maintain individual parts of the application without everything being tangled together.

---

## Tech Stack

**Frontend**
- React.js for building the user interface with component-based structure
- HTML and CSS for layout and styling
- Axios for making API requests to the backend

**Backend**
- Node.js and Express.js for the server and REST API
- JWT (JSON Web Tokens) for authentication and session management
- Middleware for protecting routes that require login

**Database**
- MongoDB for storing users, rides, and bookings
- Mongoose for schema definition and database interaction

**Version Control**
- Git and GitHub for source control and project management

---

## Getting Started

### Prerequisites

- Node.js (v16 or above)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/rideshare-app.git
cd rideshare-app
```

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
cd ..
```

Set up your environment variables:

```bash
cp .env.example .env
```

Open the `.env` file and fill in the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the development server:

```bash
npm run dev
```

This starts both the backend and the React frontend at the same time. The frontend runs at `http://localhost:3000` and the API at `http://localhost:5000`.

---

## Project Structure

```
rideshare-app/
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/             # Home, Login, Register, Search, Dashboard
│   │   ├── components/        # RideCard, BookingForm, Navbar, etc.
│   │   └── services/          # Axios API call functions
│   └── public/
│
├── server/                    # Express backend
│   ├── routes/
│   │   ├── authRoutes.js      # Register and login routes
│   │   ├── rideRoutes.js      # Post and search ride routes
│   │   └── bookingRoutes.js   # Booking creation and management
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── rideController.js
│   │   └── bookingController.js
│   └── middleware/
│       └── authMiddleware.js  # JWT verification
│
├── models/
│   ├── User.js                # User schema (name, email, password, role)
│   ├── Ride.js                # Ride schema (driver, route, seats, time)
│   └── Booking.js             # Booking schema (rider, ride, status)
│
├── config/
│   └── db.js                  # MongoDB connection
│
├── .env.example
├── package.json
└── README.md
```

---

## API Overview

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| POST | `/api/rides` | Driver | Post a new ride |
| GET | `/api/rides` | Rider | Search for available rides |
| GET | `/api/rides/:id` | Both | Get details of a specific ride |
| PUT | `/api/rides/:id` | Driver | Update or cancel a posted ride |
| POST | `/api/bookings` | Rider | Book a seat on a ride |
| GET | `/api/bookings/my` | Both | Get all bookings for the logged-in user |
| DELETE | `/api/bookings/:id` | Rider | Cancel a booking |

---

## Screenshots

> *(Add screenshots here — Home Page, Ride Search Results, Post a Ride Form, Booking History Dashboard)*

---

## Planned Improvements

Features that would make sense to add as the project grows:

- Real-time chat between driver and rider before the trip
- In-app notifications when a ride is booked or cancelled
- Rating and review system for drivers and riders
- Map integration to visually display routes and pickup points
- Recurring ride scheduling for daily commuters
- Payment integration for split fare calculation

---

## Contributing

If you want to contribute to this project:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add: description of change"`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a pull request describing what you built or fixed

Bug reports and suggestions can be submitted through the GitHub Issues tab.

---

## License

This project is licensed under the MIT License. You are free to use, modify, and build on it for personal or institutional purposes. See the `LICENSE` file for full details.
