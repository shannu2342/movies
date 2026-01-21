# Movie App - MERN Stack with Role-Based Access Control

A modern movie management application built with the MERN stack (MongoDB, Express, React, Node.js) featuring role-based access control, search functionality, and a responsive design.

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database service
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Token-based authentication
- **Bcryptjs** - Password hashing
- **Bull** - Background job processing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables management

### Frontend
- **React** - JavaScript library for building user interfaces
- **Material-UI (MUI)** - React component library
- **react-router-dom** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client for API requests

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas (Free M0 Tier)

## Features

### User Features
- **Browse Movies**: View movies in an IMDb-style interface with pagination
- **Search**: Search movies by title or description
- **Sort**: Sort movies by rating, title, release date, or duration
- **Pagination**: Load movies in batches of 10
- **Responsive Design**: Works on desktop and mobile devices
- **User Registration**: New users can sign up with email and password (limited to user role)
- **User Login**: Existing users can login with their credentials

### Admin Features
- **Add Movies**: Create new movie entries with detailed information
- **Edit Movies**: Modify existing movie details
- **Delete Movies**: Remove movies from the database
- **Role-Based Access**: Admin routes are protected and only accessible to admin users

### Authentication & Authorization
- **JWT Authentication**: Secure login with JSON Web Tokens
- **Role-Based Access Control (RBAC)**:
  - `user` role: Can browse, search, and view movies
  - `admin` role: Can manage all movie data and access admin dashboard
- **Protected Routes**: Routes are protected using React Router and context API
- **Automatic Token Handling**: Tokens are stored in localStorage and included in API requests

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | Get all movies with pagination |
| GET | `/api/movies/search?q=query` | Search movies by title or description |
| GET | `/api/movies/sorted?by=rating` | Get movies sorted by specified field |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/health` | Health check endpoint |

### Admin Only Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/movies` | Add a new movie |
| PUT | `/api/movies/:id` | Update a movie |
| DELETE | `/api/movies/:id` | Delete a movie |
| POST | `/api/seed-admin` | Create admin user (one-time use) |

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Redis (for job queue, optional but recommended)

### Backend Setup
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-super-secret-key
   NODE_ENV=development
   ```
4. Start the development server: `npm run dev`

### Frontend Setup
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the development server: `npm start`

### Seed Admin User
1. Make sure the backend server is running
2. Send a POST request to `/api/seed-admin`
3. This will create an admin user with the following credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

## Database

### Movies Collection
Stores movie data with the following fields:
- `title`: Movie title
- `description`: Movie description
- `rating`: IMDb rating (0-10)
- `releaseDate`: Release date
- `duration`: Duration in minutes
- `genre`: Array of genres
- `posterUrl`: URL to movie poster
- `createdAt`: Timestamp when created
- `updatedAt`: Timestamp when last updated

### Users Collection
Stores user data with the following fields:
- `email`: Email address (unique)
- `password`: Hashed password
- `name`: Full name
- `role`: User role (user/admin)
- `createdAt`: Timestamp when created
- `updatedAt`: Timestamp when last updated

### Indexes
- `title` and `description` for text search
- `rating` for sorting
- `releaseDate` for sorting

## Job Queue

### Movie Queue
Processes movie data insertion in the background using Bull queue. This prevents overwhelming the server with large datasets by inserting movies one by one with a delay.

- **Job Processing**: Movies are added to the queue and processed with a 1-second delay between each insertion
- **Initial Seed Data**: The queue is started automatically when the server boots and there are no existing movies
- **Fallback to Memory Queue**: If Redis is not available, the queue will fall back to a memory-based implementation

## Running the Application

### Development
1. Start the backend server: `cd server && npm run dev`
2. Start the frontend server: `cd client && npm start`
3. Open your browser and navigate to `http://localhost:3000`

### Production
1. Build the frontend: `cd client && npm run build`
2. Build the backend: `cd server && npm run build`
3. Start the production server: `cd server && npm start`

## Demo Credentials

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

### Regular User Account
- Email: `user@example.com`
- Password: `user123`

## Live URLs

- **Frontend**: [https://movies-app-delta-jade.vercel.app](https://movies-app-delta-jade.vercel.app)
- **Backend**: [https://movies-gv4l.onrender.com](https://movies-gv4l.onrender.com)

## Code Quality

### Folder Structure
```
movie-app/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── utils/
│       ├── App.js
│       └── index.js
├── server/
│   └── src/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── controllers/
│       ├── utils/
│       ├── queues/
│       └── server.js
├── README.md
└── package.json
```

### Error Handling
- API failures are caught and displayed to users
- Form validation errors are shown inline
- Unauthorized access is handled with proper redirects
- Loading states are displayed during API calls

### Performance
- Movies are loaded with pagination (10 per page)
- Background job processing for large datasets
- Indexes on frequently queried fields
- Responsive design with optimized rendering

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This project is for educational purposes only. The movie data used in this application is for demonstration purposes and may not be accurate. Please refer to official sources for correct movie information.
