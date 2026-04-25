# 🛍️ Sumathi Trends — Ecommerce Clothing Website

A production-ready, full-stack ecommerce platform for selling children's frocks online. Built with React 18, Node.js, MongoDB, Firebase Auth, Razorpay payments, and Shiprocket shipping — deployed with Docker and Nginx.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), React Router v6, Context API, CSS (Vanilla) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose ODM |
| **Customer Auth** | Firebase Auth — Google OAuth + Phone OTP |
| **Admin Auth** | JWT in HTTP-only cookies (8h TTL) |
| **Payments** | Razorpay |
| **Shipping** | Shiprocket API |
| **Media Storage** | AWS S3 (ap-south-1) |
| **Deployment** | Docker + Docker Compose, Nginx, Let's Encrypt SSL |
| **Cron Jobs** | node-cron |

---

## ✨ Features

### 🛒 Customer Storefront
- Fully responsive SPA with 25+ pages/routes
- Product catalog with **multi-filter sidebar** (category, subcategory, age group, price range)
- **5 dedicated category pages** — Occasion Wear, Party Wear, Designer, Traditional, Fabric-Based
- **Age group pages** — Newborn, Infant, Toddler, Little Girls, Kids, Pre-Teen
- Product detail page with **image gallery**, lightbox, hover zoom, per-colour gallery switching, size picker, and accordion (specs / description / manufacturer)
- **Cart** — localStorage-persisted for guests, composite key by product + size + colour, stock-capped
- **Wishlist** — local-first with DB sync (1.5s debounce), merges on login
- Full **checkout flow** — address management, gift wrap option, Razorpay modal, post-payment confirmation
- **Account hub** — profile, addresses, orders, order tracking (live Shiprocket timeline), wishlist, reviews, support chat
- **QR review page** — standalone page for in-store review collection via QR code
- Google OAuth + Phone OTP login (Firebase invisible reCAPTCHA)
- SEO-ready — dynamic meta tags, robots.txt, sitemap.xml

### 🔧 Admin Dashboard
- JWT-protected admin panel at `/admin`
- Superadmin auto-seeded from environment variables on first run
- Role-based access: **admin** and **superadmin** with per-module permissions

| Module | Access |
|---|---|
| Product Management | Admin |
| Product Detail Editor | Admin |
| Order Management + Shiprocket Sync | Admin |
| Payment Management | Admin |
| Client Management | Admin |
| Review Moderation | Admin |
| QR Review Page | Admin |
| Support Management | Admin |
| Contact Messages | Admin |
| User Management | Superadmin only |

### ⚙️ Backend
- RESTful API with **35+ endpoints** across public, customer, payment, and admin routes
- **Server-side price recalculation** — client-sent amounts are ignored (prevents price tampering)
- **HMAC-SHA256 Razorpay signature verification** — prevents payment bypass attacks
- Stock check before order creation — prevents overselling
- Auto-push to Shiprocket on payment success
- **node-cron** job runs every 5 minutes to retry unsynced orders to Shiprocket
- 4-tier rate limiting (general, customer auth, admin login, payment)
- Helmet CSP with relaxed directives for Razorpay and S3

---

## 📁 Project Structure

```text
Clothing-Website/
├── client/                        # React 18 + Vite SPA
│   └── src/
│       ├── pages/                 # Route-level page components
│       ├── components/            # Reusable UI components
│       │   ├── homepage/          # Hero, Categories, NewArrivals, etc.
│       │   ├── collections/       # ProductGrid, FilterSidebar
│       │   ├── collectiondetails/ # Gallery, ProductInfo, Reviews
│       │   ├── cart/              # CartItems, OrderSummary
│       │   └── navbar/            # Navbar, Footer
│       ├── admin/                 # Admin panel (views, layout, login)
│       ├── context/               # CartContext, WishlistContext
│       ├── hooks/                 # useAddressSync, etc.
│       ├── utils/                 # authFetch helper
│       └── styles/                # CSS modules per feature
│
└── server/                        # Node.js + Express API
    ├── conf/                      # DB, Firebase, Razorpay, S3 config
    ├── controllers/               # Business logic per module
    ├── routers/                   # Express route definitions
    ├── middleware/                # Auth guards, rate limiting
    ├── models/                    # Mongoose schemas
    ├── services/                  # Shiprocket service
    └── cronJobs.js                # Shiprocket sync cron
```

---

## 🗄️ Database Models

- **Product** — name, category, subCategory, ageGroup, price, colors, inventory (Map), stock, featuredIn, badge
- **ProductDetail** — galleryImages (1–7), colorGalleries, sizes, specifications, description, manufacturerInfo, highlights
- **ClientUser** — uids[], customerId (CUST-XXXXX), cart, wishlist, addresses, orders, loginTypes
- **Order** — orderId (Razorpay), displayId (ST-XXXXXX), items snapshot, shiprocketOrderId, trackingStatus
- **AdminUser** — role (admin | superadmin), bcrypt password, permissions[]
- **ProductReview**, **QRReview**, **SupportIssue**, **ContactModel**, **SiteSettings**

---

## 🔐 Security

- JWT in **HTTP-only Strict SameSite cookies** — not accessible by JavaScript
- Firebase ID tokens **verified server-side** via Firebase Admin SDK
- `requireOwnership` middleware prevents cross-user data access
- **HMAC-SHA256** payment signature verification
- Server-side price recalculation — client cannot manipulate order amount
- bcrypt password hashing for admin accounts
- Helmet CSP, CORS whitelist, 50 MB body limit enforcement

---

## 💳 Payment Flow

1. Client sends cart items → server **recalculates totals from DB** (ignores client amount)
2. Razorpay order created server-side → checkout modal opened on client
3. On payment success → **HMAC signature verified** server-side
4. Order status updated → **stock decremented** → order **auto-pushed to Shiprocket**
5. If Shiprocket push fails → error saved to DB → **cron retries every 5 minutes**

---

## 🚢 Shipping Flow

- Orders pushed to Shiprocket automatically after payment verification
- `node-cron` runs on startup and every 5 minutes to catch any missed orders
- Admin can manually trigger Shiprocket sync per order from the dashboard
- Live tracking timeline fetched via Shiprocket API and displayed on the customer order detail page

---

## 🐳 Deployment

```yaml
# docker-compose.yml
services:
  backend:
    build: ./server
    ports:
      - "127.0.0.1:5000:5000"   # internal only

  frontend:
    build: ./client
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

- **Backend** runs internally, not exposed to the internet directly
- **Nginx** serves the React build and reverse-proxies `/api/*` to the backend
- **Let's Encrypt** SSL certificates mounted read-only into the frontend container
- Both containers set `restart: always` for automatic recovery

---

## ⚙️ Environment Variables

```env
# Server
MONGO_URI=
JWT_SECRET=
ADMIN_USERNAME=
ADMIN_PASSWORD=
CLIENT_URL=
PORT=5000

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=

# Firebase Admin SDK
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

# Shiprocket
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=

# Client (.env)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/sumathi-trends.git
cd sumathi-trends/Clothing-Website

# Install dependencies
cd server && npm install
cd ../client && npm install

# Add your .env files (see above)

# Run with Docker
docker-compose up --build

# Or run locally
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

---

## 📄 License

This project is private and proprietary. All rights reserved.
