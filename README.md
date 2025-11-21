 # Origin Reserve Coffee

Simple ordering site for a specialty coffee roaster built with Express, Sequelize (MySQL/MariaDB), and EJS. Customers can browse the menu, manage a cart and wishlist, place orders, and leave reviews. Admin users can manage products, orders, and moderate reviews.

## Setup

1. Copy `.env.example` → `.env` (or create `.env`) with DB credentials and `SESSION_SECRET`.
2. Install dependencies: `npm install`
3. Seed sample data and an admin user: `npm run seed`
4. Start the app: `npm run dev` (nodemon) or `npm start`

Default admin credentials created by the seed:
- Email: `admin@example.com`
- Password: `Admin123!` (override via `ADMIN_PASSWORD` env var)

Use `npm run seed` to reset the DB (it uses `sync({ force: true })`, so it will wipe existing data).

## Frontend SPA (Vite React)

The Vite React landing is bundled into `public/landing` and served at `/`.

1. Build the landing: `npm run build:spa` (builds in a temp dir to avoid path issues, copies output to `public/landing`).
2. Start the server (`npm run dev` or `npm start`) and visit `http://localhost:3000/`.
3. EJS pages remain for auth/cart/orders/admin flows; the SPA is the primary public face.
  
