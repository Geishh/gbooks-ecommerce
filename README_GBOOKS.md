# gBooks - Modern E-Commerce Bookstore

A professional, full-stack e-commerce bookstore application built with React, Express, tRPC, and MySQL. Featuring a clean International Typographic Style design with red accents, comprehensive book catalog management, shopping cart, checkout system, and admin dashboard.

## 🎨 Design Philosophy

**International Typographic Style** - A minimalist aesthetic grounded in mathematical precision:
- **Canvas:** Pristine white background
- **Accent:** Bold red (#DC2626) for primary actions and highlights
- **Typography:** Crisp black sans-serif (Inter font)
- **Layout:** Strict grid system with generous negative space
- **Elements:** Fine black divider lines, clean card-based design

## 🚀 Features

### User Features
- **Home Page:** Hero section, category showcase, featured books, and promotional content
- **Book Catalog:** Search and filter by title, category, author, and publisher
- **Book Details:** Complete information including description, author, publisher, ISBN, pages, and publication year
- **Shopping Cart:** Add/remove items, adjust quantities, persistent storage
- **Checkout:** Shipping address form, order summary, payment simulation
- **Order Tracking:** View order history and status updates
- **Responsive Design:** Optimized for mobile, tablet, and desktop

### Admin Features
- **Dashboard:** Overview of books, orders, users, and revenue
- **Book Management:** Create, read, update, delete books with full metadata
- **Order Management:** Track and update order status (pending → processing → shipped → delivered)
- **User Management:** View registered users and their roles
- **Role-Based Access Control:** Separate admin and user permissions

### Technical Features
- **Authentication:** OAuth-based login with Manus platform
- **Database:** Relational MySQL with proper schema design
- **API:** tRPC for type-safe backend procedures
- **Real-time Updates:** Instant cart updates and order notifications
- **Email Notifications:** Owner notifications for new orders

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Tailwind CSS 4, Wouter (routing) |
| **Backend** | Express 4, tRPC 11, Node.js |
| **Database** | MySQL, Drizzle ORM |
| **Authentication** | Manus OAuth |
| **Styling** | Tailwind CSS with custom design system |
| **UI Components** | shadcn/ui |
| **Icons** | Lucide React |
| **Notifications** | Sonner |

## 🗄️ Database Schema

### Core Tables

**users**
- User authentication and role management
- Fields: id, openId, name, email, role (user/admin), timestamps

**books**
- Product catalog with metadata
- Fields: id, title, description, authorId, publisherId, categoryId, price, stock, coverImageUrl, isbn, pages, publishedYear, isFeatured

**authors**
- Author information
- Fields: id, name, bio, timestamps

**publishers**
- Publisher information
- Fields: id, name, website, timestamps

**categories**
- Book categories for organization
- Fields: id, name, description, timestamps

**orders**
- Customer orders with shipping information
- Fields: id, userId, status, totalPrice, shippingAddress, shippingCity, shippingZip, shippingPhone, notes, timestamps

**order_items**
- Line items for each order
- Fields: id, orderId, bookId, quantity, price (at time of purchase)

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 22+
- MySQL database
- Manus account for OAuth

### Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   - Database connection string
   - OAuth credentials
   - API keys (auto-injected by Manus)

3. **Run database migrations:**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

4. **Seed demo data (optional):**
   ```bash
   node scripts/seed-demo-data.mjs
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin (login as admin)

## 📁 Project Structure

```
gbooks-ecommerce/
├── client/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Catalog.tsx
│   │   │   ├── BookDetail.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── OrderSuccess.tsx
│   │   │   ├── UserOrders.tsx
│   │   │   └── admin/       # Admin pages
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # Utilities and helpers
│   │   ├── App.tsx          # Main routing
│   │   └── index.css        # Global styles
│   └── public/              # Static assets
├── server/
│   ├── routers.ts           # tRPC procedures
│   ├── db.ts                # Database queries
│   └── _core/               # Framework internals
├── drizzle/
│   ├── schema.ts            # Database schema
│   └── migrations/          # SQL migrations
├── shared/                  # Shared types and constants
└── scripts/                 # Utility scripts
```

## 🔑 Key API Endpoints (tRPC)

### Public Endpoints
- `books.list` - Get paginated books
- `books.getById` - Get single book details
- `books.search` - Search books with filters
- `books.featured` - Get featured books
- `categories.list` - Get all categories
- `authors.list` - Get all authors
- `publishers.list` - Get all publishers

### Protected Endpoints (User)
- `orders.create` - Create new order
- `orders.getById` - Get order details
- `orders.getUserOrders` - Get user's order history

### Admin Endpoints
- `books.create/update/delete` - Book management
- `authors.create/update/delete` - Author management
- `publishers.create/update/delete` - Publisher management
- `categories.create/update/delete` - Category management
- `orders.listAll` - View all orders
- `orders.updateStatus` - Update order status
- `users.list` - View all users

## 🎯 User Flows

### Shopping Flow
1. Browse home page → View featured books and categories
2. Search/filter in catalog → Find specific books
3. View book details → Add to cart
4. Review cart → Adjust quantities
5. Checkout → Enter shipping address
6. Confirm order → Receive confirmation
7. Track order → View order history

### Admin Flow
1. Login as admin → Access admin dashboard
2. Manage books → CRUD operations
3. View orders → Update status
4. Monitor users → View user list
5. Track revenue → View statistics

## 🔐 Security Features

- **Password Hashing:** Secure authentication via OAuth
- **SQL Injection Prevention:** Prepared statements via Drizzle ORM
- **Input Validation:** Zod schema validation on all inputs
- **Role-Based Access:** Admin-only procedures protected
- **CSRF Protection:** Built-in with session cookies
- **XSS Prevention:** React's built-in escaping

## 📱 Responsive Design

- **Mobile:** 4-column grid, optimized touch targets
- **Tablet:** 8-column grid, balanced layout
- **Desktop:** 12-column grid, full-width content

## 🚀 Deployment

### Manus Hosting (Recommended)
The application is ready for deployment on Manus:

1. **Create checkpoint** - Save current state
2. **Click Publish** - Deploy to Manus hosting
3. **Configure domain** - Set up custom domain if desired
4. **Enable SSL** - Automatic HTTPS

### Environment Variables
Required environment variables (auto-injected by Manus):
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - OAuth application ID
- `OAUTH_SERVER_URL` - OAuth server URL
- `BUILT_IN_FORGE_API_KEY` - Manus API key

## 📊 Performance Considerations

- **Lazy Loading:** Images and components load on demand
- **Caching:** Static assets cached aggressively
- **Database Indexing:** Proper indexes on frequently queried fields
- **Pagination:** Large lists paginated for performance
- **Code Splitting:** Route-based code splitting

## 🐛 Known Limitations

- Payment processing is simulated (not real transactions)
- Email notifications require SMTP configuration
- Image uploads require S3 configuration
- Admin analytics dashboard is placeholder

## 🔄 Future Enhancements

- [ ] Real payment gateway integration (Stripe/PayPal)
- [ ] Email notifications to customers
- [ ] Book cover image upload to S3
- [ ] Advanced analytics dashboard
- [ ] Wishlist functionality
- [ ] Book reviews and ratings
- [ ] Discount codes and promotions
- [ ] Inventory management alerts
- [ ] Multi-language support
- [ ] Dark mode theme

## 📝 License

This project is provided as-is for educational and commercial use.

## 🤝 Support

For issues or questions, please contact the development team or visit the Manus support portal.

---

**Built with ❤️ using International Typographic Style Design Principles**
