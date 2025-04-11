# SkyRoute

This is a airline ticket booking web app for CS3083.

## Prerequisites

- Node.js (version 14 or later)
- npm (Node Package Manager)
- MySQL database (Developed with XAMPP)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Normanisfine/SkyRoute
cd SkyRoute/client
```

### Install Dependencies

```bash
npm install
```

### Configure the Database

1. **Create a MySQL Database**: Set up a MySQL database and note the connection details.
The defaule is "root@localhost:3306", no password and the db name is "skyroute"

2. **Update Database Configuration**: Modify the database configuration in `src/utils/db.js` with your database credentials.

3. **Create the User Table**: Run the following SQL command to create tables:

   ```sql
   CREATE TABLE User (
       user_id INT AUTO_INCREMENT PRIMARY KEY,
       password VARCHAR(255) NOT NULL,
       name VARCHAR(255),
       email VARCHAR(255) UNIQUE,
       phone VARCHAR(255),
       passport_number VARCHAR(255) UNIQUE
   );
   ```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Features

- User registration with email, phone, and passport number
- Password hashing for security
- User login with email and password
- Protected routes for authenticated users

## API Endpoints

- **POST /api/register**: Register a new user
- **POST /api/login**: Log in an existing user
- **GET /api/test**: Test API endpoint

## Troubleshooting

- Ensure your MySQL server is running and accessible.
- Check the console for any error messages during setup or runtime.


