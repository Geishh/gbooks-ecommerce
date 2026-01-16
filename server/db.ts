import { eq, and, like, desc, asc, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  books,
  authors,
  publishers,
  categories,
  orders,
  orderItems,
  Book,
  Author,
  Publisher,
  Category,
  Order,
  OrderItem,
  InsertBook,
  InsertAuthor,
  InsertPublisher,
  InsertCategory,
  InsertOrder,
  InsertOrderItem,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============= USER QUERIES =============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listUsers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(users)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(users.createdAt));
}

// ============= BOOK QUERIES =============

export async function listBooks(limit = 12, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(books)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(books.createdAt));
}

export async function getBookById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(books).where(eq(books.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchBooks(
  query: string,
  categoryId?: number,
  authorId?: number,
  publisherId?: number,
  limit = 12,
  offset = 0
) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [like(books.title, `%${query}%`)];

  if (categoryId) {
    conditions.push(eq(books.categoryId, categoryId));
  }
  if (authorId) {
    conditions.push(eq(books.authorId, authorId));
  }
  if (publisherId) {
    conditions.push(eq(books.publisherId, publisherId));
  }

  return await db
    .select()
    .from(books)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(books.createdAt));
}

export async function getFeaturedBooks(limit = 6) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(books)
    .where(eq(books.isFeatured, true))
    .limit(limit)
    .orderBy(desc(books.createdAt));
}

export async function createBook(book: InsertBook) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(books).values(book);
  return result[0];
}

export async function updateBook(id: number, updates: Partial<InsertBook>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(books).set(updates).where(eq(books.id, id));
  return await getBookById(id);
}

export async function deleteBook(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(books).where(eq(books.id, id));
}

// ============= AUTHOR QUERIES =============

export async function listAuthors() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(authors).orderBy(asc(authors.name));
}

export async function getAuthorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(authors)
    .where(eq(authors.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAuthor(author: InsertAuthor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(authors).values(author);
  return result[0];
}

export async function updateAuthor(id: number, updates: Partial<InsertAuthor>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(authors).set(updates).where(eq(authors.id, id));
  return await getAuthorById(id);
}

export async function deleteAuthor(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(authors).where(eq(authors.id, id));
}

// ============= PUBLISHER QUERIES =============

export async function listPublishers() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(publishers).orderBy(asc(publishers.name));
}

export async function getPublisherById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(publishers)
    .where(eq(publishers.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPublisher(publisher: InsertPublisher) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(publishers).values(publisher);
  return result[0];
}

export async function updatePublisher(
  id: number,
  updates: Partial<InsertPublisher>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(publishers).set(updates).where(eq(publishers.id, id));
  return await getPublisherById(id);
}

export async function deletePublisher(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(publishers).where(eq(publishers.id, id));
}

// ============= CATEGORY QUERIES =============

export async function listCategories() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(categories).orderBy(asc(categories.name));
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(categories).values(category);
  return result[0];
}

export async function updateCategory(
  id: number,
  updates: Partial<InsertCategory>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(categories).set(updates).where(eq(categories.id, id));
  return await getCategoryById(id);
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(categories).where(eq(categories.id, id));
}

// ============= ORDER QUERIES =============

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(orders).values(order);
  return result[0];
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserOrders(userId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(orders.createdAt));
}

export async function listAllOrders(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(orders)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(
  id: number,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orders).set({ status }).where(eq(orders.id, id));
  return await getOrderById(id);
}

// ============= ORDER ITEM QUERIES =============

export async function createOrderItem(item: InsertOrderItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(orderItems).values(item);
  return result[0];
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
}

export async function deleteOrderItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(orderItems).where(eq(orderItems.id, id));
}
