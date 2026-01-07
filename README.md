# Origin Reserve Coffee

A specialty coffee e-commerce site built with Express, Sequelize, EJS, and React.

---

## Installation

### 1. Clone & Install

```bash
git clone https://github.com/andee3301/webdes.git
cd webdes
npm install
```

### 2. Create Database

```bash
mysql -u root -p -e "CREATE DATABASE origin_reserve;"
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_NAME=origin_reserve
DB_USER=root
DB_PASS=your_password
DB_DIALECT=mysql
SESSION_SECRET=any-random-string-here
```

### 4. Seed Database

```bash
npm run seed
```

> ⚠️ This wipes all data and creates fresh tables with demo content.

### 5. Build Landing Page

```bash
npm run build:spa
```

### 6. Start Server

```bash
npm run dev
```

### 7. Open Browser

Go to **http://localhost:3000**

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@example.com` | `Admin123!` |
| **Customer** | `john@test.com` | `1234` |
| **Demo User** | `sarah.j@email.com` | `demo1234` |
| **Demo User** | `mike.chen@email.com` | `demo1234` |
| **Demo User** | `emma.w@email.com` | `demo1234` |

---

## Seed Commands

| Command | Description |
|---------|-------------|
| `npm run seed` | Reset DB with 29 coffees, users & sample orders |
| `npm run seed:beans` | Add 100 randomized coffee products |
| `npm run seed:stock` | Reset menu stock levels |

---

## Quick Commands

```bash
npm run dev      # Start dev server (auto-reload)
npm start        # Start production server
npm run seed     # Reset database with demo data
npm run build:spa # Build React landing page
```

