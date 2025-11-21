# Origin Reserve Copilot Instructions

## Runtime & Build

- Primary workflow is Express + Sequelize; run `npm run dev` for local work (it rebuilds the Vite landing via `build:spa` before starting `nodemon`). Use `npm run build:spa` once + `nodemon app.js` if you only touch the backend to avoid repeated SPA builds.
- `.env` (copied from `.env.example`) must define `DB_HOST/DB_NAME/DB_USER/DB_PASS`, `DB_DIALECT`, `SESSION_SECRET`, and optional `ADMIN_EMAIL/ADMIN_PASSWORD` for seeding.
- Seeding wipes the DB: `npm run seed` loads curated menu items, `npm run seed:beans` (`scripts/seed-beans.js`) generates 100 randomized coffees. Both call `sequelize.sync({ force: true })` and recreate an admin user.

## Architecture Overview

- `app.js` wires middleware in this order: statics (`public`, `/uploads`), body parsers, `express-session` with `connect-session-sequelize`, `attachUser`, then locals for `user`, `cartCount`, and `flash` from `utils/flash` (add flash entries via `addFlash(req, type, message)`).
- Routes are split by concern under `routes/*` and talk to controllers in `controllers/*`. All protected endpoints use `requireAuth`/`requireAdmin` from `middleware/auth`; never check roles inline inside controllers.
- Data layer lives in `models/*` with a single Sequelize instance (`config/database.js`). Import models via `const { User, MenuItem, ... } = require('../models');` so associations defined in `models/index.js` remain intact.
- Session cart state is just an array stored on `req.session.cart` (`controllers/cartController`). Maintain the `{ menuItemId, name, price, quantity, imageUrl }` shape so totals remain accurate.
- Reviews default to `status = 'pending'`; public pages load only approved reviews (`controllers/menuController` order includes `Review` scoped by status). Admin moderation flows live in `controllers/adminController` and corresponding views.

## Views & UX

- EJS views share layout via `views/partials/header.ejs` and `views/partials/footer.ejs`. Both expect `res.locals.user`, `cartCount`, and `flash`. Any new view rendered through Express should include these partials to stay consistent.
- Bootstrap 5 provides the base styling (`public/css/style.css` adds brand tweaks). Keep markup lean and responsive; the navbar already exposes `Wishlist`, `Orders`, and `Admin` links when `user`/role are available.
- Flash messaging is the only feedback pattern. Always set a flash entry before redirects in controllers so users see outcomes.

## Admin + Domain Rules

- Menu items use category strings (coffee/tea/bakery/seasonal/beans). `controllers/menuController.groupMenuByCategory` depends on those keys; introduce new categories carefully or extend the helper.
- Orders transition through the enum in `models/Order`: `pending → confirmed → shipped → completed` (or `cancelled`). Admin status updates happen through `/admin/orders/:id/status`; match those strings when building forms or filters.
- Wishlist uniqueness is enforced by a composite index; prefer `WishlistItem.findOrCreate` to silence duplicate add attempts.
- Password resets rely on records in `PasswordResetToken` with `expiresAt` and `used` flags; the “email” is simulated by rendering the link in `views/auth/reset-link.ejs` and logging to the console.

## Frontend SPA (optional bonus)

- The Vite React landing lives in `src/*` and builds into `public/landing` through `scripts/build-spa.js`, which copies necessary files into a temp dir (paths contain spaces) before running `vite build --base /landing/`.
- `app.js` serves `/`, `/app`, and `/app/*` from `public/landing/index.html` if that build exists. Keep those routes in sync if you introduce new static SPA entry points.

## Helpful References

- `controllers/adminController.js` for full-stack CRUD patterns (menu CRUD, order detail, review moderation) and for how Sequelize eager loads nested relations.
- `controllers/orderController.js` shows the transaction pattern (`sequelize.transaction()`) used when persisting orders + items; follow it for other multi-write workflows.
- `scripts/seed.js` is the canonical place to add demo content and default admin users—update it alongside any schema change so fresh environments still work.

## Current Priorities

1. Normalize the shared layout: `views/partials/header.ejs` currently closes `<main>`, `<body>`, and `<html>` while `views/partials/footer.ejs` does the same, so every view renders duplicate closing tags—refactor the partials so header opens the shell and footer closes it.
2. Expose JSON endpoints that mirror the EJS flows (menu, cart, orders) so the Vite SPA under `src/` can become interactive; add routers under `/api/*` that reuse the existing controllers or new service helpers.
3. Add server-side validation + tests: nothing under `controllers/` guards against invalid payloads beyond basic checks. Introduce a validation layer (e.g., `express-validator`) and start integration tests for auth/cart/order flows to protect against regressions.
4. Put Multer to use for admin-driven image uploads (`controllers/adminController.js` currently just accepts `imageUrl` strings) so menu items can store locally uploaded images under `/public/uploads`.
