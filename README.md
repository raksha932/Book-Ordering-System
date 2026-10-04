# 📚 Book Ordering System - College Mini-Project

A clean, modern, frontend-only web application for browsing, searching, carting, and ordering books, along with a full administrative management suite.

Built with **React.js**, **Vite**, **Tailwind CSS**, and **React Router**.

---

## 🚀 Technology Stack

- **React.js (v18)** - Component-based architecture, React Context for local state management
- **Vite** - High-performance next-generation frontend tooling and bundler
- **Tailwind CSS (v3)** - Utility-first modern CSS framework with custom theme palettes
- **React Router (v6)** - Client-side SPA routing and nested layouts
- **Lucide React** - Clean and accessible modern iconography
- **Pure Frontend State** - Local state and `localStorage` persistence with mock datasets (no backend / no databases required)

---

## 📁 Folder Structure

```
Book ordering system/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── assets/              # Static assets and media
    ├── components/          # Reusable UI elements
    │   ├── AdminHeader.jsx      # Top admin bar with live store link and avatar
    │   ├── AdminSidebar.jsx     # Admin navigation sidebar
    │   ├── BookCard.jsx         # Card showing cover, title, author, price, badges, action buttons
    │   ├── CategoryBadge.jsx    # Color-coded genre badges
    │   ├── Footer.jsx           # Clean footer with links and project metadata
    │   ├── Navbar.jsx           # Responsive customer header with cart badge & auth menu
    │   └── Toast.jsx            # Dynamic toast alert popups
    ├── context/             # Global React Context state providers
    │   ├── AuthContext.jsx      # Customer and admin authentication + customer profiles
    │   ├── BookContext.jsx      # Books catalog, search, stock toggle, add/edit/delete
    │   ├── CartContext.jsx      # Cart items, quantities, subtotal, tax, free shipping rules
    │   └── OrderContext.jsx     # Order history, checkout generation, status updates
    ├── data/
    │   └── books.js             # Initial 12-book dataset with realistic cover images and specs
    ├── layouts/
    │   ├── AdminLayout.jsx      # Protected admin layout with sidebar, header, and demo bypass
    │   └── CustomerLayout.jsx   # Storefront layout with sticky Navbar and Footer
    ├── pages/               # Application Pages
    │   ├── RoleSelection.jsx    # First Landing Page: Role Selection (Customer Login vs Admin Login)
    │   ├── Home.jsx             # Customer Home Page (Accessible only after customer login)
    │   ├── Books.jsx            # Filterable, searchable, sortable catalog grid
    │   ├── BookDetails.jsx      # Book overview, quantity selector, tabs, related titles
    │   ├── Cart.jsx             # Cart items list, quantity counters, totals, clear cart
    │   ├── Checkout.jsx         # Shipping address form, mock payment, order placement
    │   ├── MyOrders.jsx         # Order history, status badges, item breakdown, cancellation
    │   ├── Login.jsx            # Customer login with 1-click student demo sign-in
    │   ├── Register.jsx         # Customer account registration form
    │   ├── AdminLogin.jsx       # Admin portal login with 1-click admin demo access
    │   ├── AdminDashboard.jsx   # KPI metric cards, recent orders, inventory stock alerts
    │   ├── ManageBooks.jsx      # Inventory table, add/edit modal, stock toggle, delete
    │   ├── ManageOrders.jsx     # Orders table, status update dropdowns, order item viewer
    │   └── ManageCustomers.jsx  # Customer table, active/inactive status toggle
    ├── App.jsx              # Main router definition connecting all 13 pages
    ├── index.css            # Tailwind directives and custom scrollbar styles
    └── main.jsx             # React DOM root mounting
```

---

## ⚡ How to Run the Project

1. Open your terminal in the project directory:
   ```bash
   cd "Book ordering system"
   ```

2. If dependencies are not yet installed, run:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open the local URL displayed in the terminal (usually `http://localhost:5173` or `http://localhost:5174`).

---

## 🧪 How to Test Each Page

| # | Page | Route | Features to Test |
|---|------|-------|------------------|
| 1 | **Home** | `/` | Test hero search bar, click category chips, view Featured Books & Best Sellers, and click CTA buttons. |
| 2 | **Books** | `/books` | Test keyword search in real-time, filter by genre pills, sort by Price (Low/High) or Rating, and toggle **In Stock Only**. |
| 3 | **Book Details** | `/books/:id` | View high-res cover, switch tabs (*Synopsis*, *Product Details*, *Reviews*), adjust quantity with `+` / `-`, and click **Add to Cart**. |
| 4 | **Cart** | `/cart` | Adjust item quantities (updates subtotal, tax, and shipping automatically), remove individual items, or use **Clear All Items**. |
| 5 | **Checkout** | `/checkout` | Fill shipping details (or keep pre-filled defaults), select simulated payment option, and click **Place Order**. |
| 6 | **My Orders** | `/my-orders` | Check confirmed orders and sample orders, filter by status tabs (*Processing*, *Shipped*, *Delivered*), and cancel *Processing* orders. |
| 7 | **Login** | `/login` | Test normal customer sign-in or use the purple **1-Click Student Demo Login** button. |
| 8 | **Register** | `/register` | Fill the signup form; notice your new user profile appears in the navbar and customer management. |
| 9 | **Admin Login** | `/admin/login` | Click **1-Click Admin Demo Login** or enter `admin@bookstore.com` / `admin123`. |
| 10 | **Admin Dashboard** | `/admin/dashboard` | Review live metrics (Revenue, Orders, Books, Customers), stock alerts, and recent orders. |
| 11 | **Manage Books** | `/admin/books` | Click **Add New Book** to open the modal, edit existing titles, toggle in-stock status pill, or click **Reset Demo Data**. |
| 12 | **Manage Orders** | `/admin/orders` | Change an order's status using the dropdown (*Processing* -> *Shipped* -> *Delivered*), and click **View** to inspect items. |
| 13 | **Manage Customers** | `/admin/customers` | Search customers, click status pills to toggle *Active*/*Inactive*, or remove a customer. |
