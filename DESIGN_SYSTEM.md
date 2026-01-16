# gBooks Design System

## Design Philosophy: International Typographic Style

A modern, minimalist aesthetic grounded in mathematical precision and functional beauty. Clean white canvas, bold red accents, crisp black sans-serif typography, strict grid system, fine divider lines, and generous negative space.

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **White** | #FFFFFF | Primary background, card backgrounds |
| **Black** | #000000 | Primary text, headings, borders |
| **Red** | #DC2626 | Primary accent, CTAs, highlights, active states |
| **Gray 50** | #F9FAFB | Secondary background, hover states |
| **Gray 100** | #F3F4F6 | Borders, dividers, subtle backgrounds |
| **Gray 500** | #6B7280 | Secondary text, muted content |
| **Gray 900** | #111827 | Dark text alternative |

## Typography

**Font Family:** Inter (system fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|-----------------|
| **H1 (Hero)** | 48px | 700 | 1.2 | -0.02em |
| **H2 (Section)** | 32px | 700 | 1.3 | -0.01em |
| **H3 (Subsection)** | 24px | 600 | 1.4 | 0 |
| **H4 (Card Title)** | 18px | 600 | 1.4 | 0 |
| **Body Large** | 16px | 400 | 1.6 | 0 |
| **Body Regular** | 14px | 400 | 1.6 | 0 |
| **Small** | 12px | 400 | 1.5 | 0 |
| **Label** | 12px | 600 | 1.5 | 0.05em |

## Spacing System

Based on 4px base unit:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

## Grid System

- **Desktop:** 12-column grid with 24px gutters, max-width 1440px
- **Tablet:** 8-column grid with 16px gutters
- **Mobile:** 4-column grid with 12px gutters

## Components

### Buttons

**Primary (Red):** bg-red-600, text-white, hover: bg-red-700
**Secondary (White):** bg-white, text-black, border: 1px black, hover: bg-gray-50
**Ghost:** bg-transparent, text-black, hover: bg-gray-50

### Cards

- Background: white
- Border: 1px solid #F3F4F6
- Padding: 24px
- No shadow (flat design)

### Dividers

- Color: #F3F4F6
- Weight: 1px
- Generous spacing above/below (24px minimum)

## Visual Hierarchy

1. **Primary:** Large headings (H1, H2), red accents, bold CTA buttons
2. **Secondary:** H3, H4 headings, secondary buttons
3. **Tertiary:** Body text, labels, secondary information
4. **Quaternary:** Muted gray text, helper text

## Layout Principles

- Asymmetric layouts with clear focal points
- Generous white space (minimum 24px padding)
- Strict alignment to grid
- Fine black divider lines between sections
- Clear visual separation between content blocks

## Responsive Breakpoints

- **Mobile:** 0px - 639px
- **Tablet:** 640px - 1023px
- **Desktop:** 1024px+

## Interaction States

- **Hover:** Subtle background color change or border emphasis
- **Active:** Red accent color
- **Focus:** 2px solid red outline, 2px offset
- **Disabled:** Gray 300 text, 50% opacity

## Database Schema Overview

### Core Tables

**users**
- id (PK)
- openId (OAuth)
- name, email
- role (user | admin)
- createdAt, updatedAt, lastSignedIn

**books**
- id (PK)
- title, description
- authorId (FK)
- publisherId (FK)
- categoryId (FK)
- price, stock
- coverImageUrl
- createdAt, updatedAt

**authors**
- id (PK)
- name, bio
- createdAt, updatedAt

**publishers**
- id (PK)
- name, website
- createdAt, updatedAt

**categories**
- id (PK)
- name, description
- createdAt, updatedAt

**orders**
- id (PK)
- userId (FK)
- status (pending | processing | shipped | delivered | cancelled)
- totalPrice
- shippingAddress, shippingCity, shippingZip, shippingPhone
- createdAt, updatedAt

**order_items**
- id (PK)
- orderId (FK)
- bookId (FK)
- quantity, price
- createdAt

## API Endpoints Structure

### Public Routes
- GET /api/trpc/books.list - List books with pagination
- GET /api/trpc/books.search - Search books
- GET /api/trpc/books.getById - Get book details
- GET /api/trpc/categories.list - List categories
- GET /api/trpc/authors.list - List authors
- GET /api/trpc/publishers.list - List publishers
- POST /api/trpc/orders.create - Create order (protected)
- GET /api/trpc/orders.getByUser - Get user orders (protected)

### Admin Routes
- POST /api/trpc/books.create - Create book (admin)
- PUT /api/trpc/books.update - Update book (admin)
- DELETE /api/trpc/books.delete - Delete book (admin)
- Similar CRUD for authors, publishers, categories
- GET /api/trpc/orders.list - List all orders (admin)
- PUT /api/trpc/orders.updateStatus - Update order status (admin)
- GET /api/trpc/users.list - List users (admin)

## File Storage

Book cover images stored in S3 with structure:
- `/books/{bookId}/{filename}-{timestamp}.{ext}`
- Metadata stored in database with url and fileKey
