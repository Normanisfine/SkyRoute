# SkyRoute ✈️

A comprehensive flight booking and management system built with Next.js and MySQL. SkyRoute provides a full-featured platform for customers to search, book, and manage flights, as well as an admin panel for airline staff to manage flights, aircraft, airports, and more.

## 🌟 Features

### Customer Features
- **User Authentication**: Secure login and registration with bcrypt password hashing
- **Flight Search**: Search for flights by origin, destination, and date
- **Flight Booking**: Book flights with multiple passengers
- **Seat Selection**: Choose seats based on class (Economy, Business, First)
- **Booking Management**: View and manage existing bookings
- **Online Check-in**: Check in for flights and view boarding passes
- **Luggage Management**: Add and track luggage for bookings
- **Saved Flights**: Save flights for later reference
- **User Profile**: View and update personal information

### Admin Features
- **Flight Management**: Create, update, and delete flights
- **Aircraft Management**: Manage aircraft fleet and seat configurations
- **Airport Management**: Add and update airport information
- **Airline Management**: Manage airline details
- **Seat Management**: Configure seats for each aircraft
- **Price Management**: Set and update flight prices for different seat classes
- **Flight Status Updates**: Update flight statuses (On-Time, Delayed, Cancelled)
- **Data Export**: Export system data for reporting

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.0** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **date-fns** - Date utility library

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **MySQL 2** - Database driver
- **bcrypt** - Password hashing
- **Middleware** - Authentication and authorization

### Database
- **MySQL** - Relational database management system

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SkyRoute
```

### 2. Install Dependencies

```bash
cd client
npm install
```

### 3. Set Up MySQL Database

First, create a MySQL database:

```bash
mysql -u root -p
```

Then in the MySQL shell:

```sql
CREATE DATABASE skyroute;
USE skyroute;
```

Exit MySQL and run the initialization script:

```bash
mysql -u root -p skyroute < ../create_new.sql
```

This script will:
- Create all necessary tables (User, Flight, Booking, Airport, etc.)
- Insert sample data including users, flights, airports, airlines, etc.
- Set up relationships and constraints

### 4. Configure Environment Variables

Create a `.env.local` file in the `client` directory:

```bash
cd client
touch .env.local
```

Add the following environment variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_PORT=3306
DB_NAME=skyroute
```

Replace `your_mysql_password` with your actual MySQL password.

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
SkyRoute/
├── client/                          # Next.js frontend application
│   ├── src/
│   │   ├── app/                     # App Router pages and API routes
│   │   │   ├── admin/              # Admin pages
│   │   │   │   ├── export/         # Data export page
│   │   │   │   └── page.js         # Admin dashboard
│   │   │   ├── api/                # API routes
│   │   │   │   ├── admin/          # Admin API endpoints
│   │   │   │   │   ├── aircraft/   # Aircraft CRUD
│   │   │   │   │   ├── airlines/   # Airline CRUD
│   │   │   │   │   ├── airports/   # Airport CRUD
│   │   │   │   │   ├── flights/    # Flight CRUD
│   │   │   │   │   ├── prices/     # Price management
│   │   │   │   │   ├── seats/      # Seat management
│   │   │   │   │   └── export/     # Data export
│   │   │   │   ├── auth/           # Authentication
│   │   │   │   ├── bookings/       # Booking management
│   │   │   │   ├── flights/        # Flight search & details
│   │   │   │   ├── passengers/     # Passenger management
│   │   │   │   └── profile/        # User profile
│   │   │   ├── bookings/           # Booking pages
│   │   │   ├── checkin/            # Check-in pages
│   │   │   ├── flights/            # Flight search page
│   │   │   ├── login/              # Login page
│   │   │   ├── register/           # Registration page
│   │   │   ├── profile/            # User profile page
│   │   │   └── search/             # Search results page
│   │   ├── components/             # Reusable React components
│   │   │   └── Sidebar/            # Navigation sidebar
│   │   ├── middleware.js           # Authentication middleware
│   │   └── utils/                  # Utility functions
│   │       ├── db.js               # Database connection
│   │       └── dbUtils.js          # Database helper functions
│   ├── package.json
│   ├── next.config.mjs
│   └── tailwind.config.js
├── milestone/                       # Project milestones and SQL files
│   ├── m3/                         # Milestone 3
│   └── m4/                         # Milestone 4
├── create_new.sql                  # Database initialization script
└── README.md
```

## 👥 User Roles & Authentication

### User Roles
The system supports two user roles:
- **Customer**: Can search flights, make bookings, check-in, manage profile
- **Admin**: Has full access to all customer features plus administrative functions

### Default Users
The database is pre-populated with test users:

**Admin Accounts:**
- Email: `admin1@airline.com`
- Password: `password` (default for all test users)

**Customer Accounts:**
- Email: `john.smith@email.com`
- Email: `emma.johnson@email.com`
- Email: `michael.brown@email.com`
- Password: `password` (for all test accounts)

All passwords are hashed with bcrypt for security.

## 🔐 Authentication Flow

The application uses cookie-based authentication:
1. Users log in with email and password
2. Server validates credentials against hashed passwords in database
3. On success, an auth cookie is set with user data (user_id, email, role)
4. Middleware protects routes based on authentication status and user role
5. Admin routes are only accessible to users with `admin` role

## 🌐 API Endpoints

### Public Endpoints
- `POST /api/login` - User authentication
- `POST /api/register` - User registration
- `POST /api/logout` - User logout

### Customer Endpoints
- `GET /api/flights/search` - Search flights
- `GET /api/flights/:id` - Get flight details
- `GET /api/flights/:id/seats` - Get available seats
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/checkin` - Check in for flight
- `GET /api/passengers` - Get user passengers
- `POST /api/passengers` - Add passenger
- `GET /api/profile` - Get user profile

### Admin Endpoints
- `GET/POST /api/admin/flights` - Manage flights
- `GET/PUT/DELETE /api/admin/flights/:id` - Flight operations
- `GET/POST /api/admin/aircraft` - Manage aircraft
- `GET/POST /api/admin/airports` - Manage airports
- `GET/POST /api/admin/airlines` - Manage airlines
- `GET/POST /api/admin/seats` - Manage seats
- `GET/POST /api/admin/prices` - Manage prices
- `GET /api/admin/export` - Export data

## 🗃️ Database Schema

The database consists of the following main tables:
- **AirlineUser**: User accounts (customers and admins)
- **Passenger**: Passenger information linked to users
- **Airport**: Airport details with IATA/ICAO codes
- **Airline**: Airline information
- **Aircraft**: Aircraft models and configurations
- **Seat**: Seat layout for each aircraft
- **Flight**: Flight schedules and details
- **Price**: Pricing for seats on specific flights
- **Booking**: Flight bookings with status tracking
- **Payment**: Payment information for bookings
- **Luggage**: Luggage information for bookings
- **Check_in**: Check-in records
- **Boarding_Pass**: Boarding pass information
- **Flight_Status**: Real-time flight status updates
- **Saved_Flights**: User's saved flights
- **Crew**: Flight crew assignments
- **Baggage_Claim**: Baggage claim information

## 🔧 Development Scripts

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean and intuitive interface using Tailwind CSS
- **Dynamic Sidebar**: Navigation menu with role-based options
- **Real-time Updates**: Flight status and booking information
- **Form Validation**: Client-side validation for all forms

## 📊 Sample Data

The database initialization script includes:
- 20 users (18 customers + 2 admins)
- 20 airports worldwide
- 20 airlines
- 20+ aircraft
- 20+ flights with various routes
- Multiple bookings with different statuses
- Sample luggage, check-ins, and boarding passes

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- Cookie-based authentication
- Protected routes with middleware
- Role-based access control
- SQL injection prevention with parameterized queries
- Environment variable protection for sensitive data

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure MySQL is running: `mysql -u root -p`
- Check credentials in `.env.local`
- Verify database exists: `SHOW DATABASES;`

### Port Already in Use
- Change the port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

### Dependencies Issues
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## 📝 License

This project is part of CS3083 coursework at NYU.

## 👨‍💻 Contributors

Team: The Last Minute

---

**Note**: This is a student project created for educational purposes. Default passwords should be changed in a production environment.
