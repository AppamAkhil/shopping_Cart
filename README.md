# E-commerce Platform

A simple e-commerce platform built with **Node.js/Express** backend and **React** frontend.

## Project Structure

```
├── backend/        # Node.js backend with Express and Sequelize
│   ├── server.js
│   ├── models.js
│   ├── routes.js
│   ├── middleware.js
│   ├── seed.js
│   ├── package.json
│   └── .env
└── frontend/       # React frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Backend Setup

### Prerequisites
- Node.js 16+ (Download from https://nodejs.org/)
- npm (comes with Node.js)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Seed the database with sample data:
```bash
node seed.js
```

4. Run the server:
```bash
npm start
```

The server will start on `http://localhost:8080`

## ID & Password
-john
-demo123

## Frontend Setup

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

---

## Running Both Services

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm install  # First time only
npm start    # Start server
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install  # First time only
npm start    # Start app
```

Both should now be running:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

---

## API Endpoints

### Public Endpoints
- `POST /users` - Create a new user
- `POST /users/login` - Login and get token
- `GET /users` - List all users
- `POST /items` - Create an item
- `GET /items` - List all items

### Protected Endpoints (Require Authorization Header)
- `POST /carts` - Add item to cart
- `GET /carts` - List all carts
- `GET /carts/user` - Get user's cart
- `POST /orders` - Create order from cart
- `GET /orders` - List user's orders

All protected endpoints require `Authorization: Bearer <token>` header

---

## Database

- Database: SQLite (ecommerce.db)
- Auto-created on first run
- Tables: users, items, carts, cart_items, orders, order_items
- Seed with test data: `node seed.js`

---

## Features

### User Management
- Sign up with username and password
- Login to get authentication token
- Single active token per user

### Shopping
- View all available items
- Add items to cart
- View cart items
- Place order (converts cart to order)
- View order history

## Database Schema

- **User**: Stores user accounts with password hashing
- **Item**: Product items available for purchase
- **Cart**: Shopping cart per user
- **CartItem**: Items in a cart (junction table)
- **Order**: Completed orders
- **OrderItem**: Items in an order (junction table)
