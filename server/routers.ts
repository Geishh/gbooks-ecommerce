import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  listBooks,
  getBookById,
  searchBooks,
  getFeaturedBooks,
  createBook,
  updateBook,
  deleteBook,
  listAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  listPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher,
  deletePublisher,
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createOrder,
  getOrderById,
  getUserOrders,
  listAllOrders,
  updateOrderStatus,
  createOrderItem,
  getOrderItems,
  listUsers,
} from "./db";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";

// ============= HELPER PROCEDURES =============

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

// ============= BOOKS ROUTER =============

const booksRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(12),
        offset: z.number().min(0).default(0),
      })
    )
    .query(({ input }) => listBooks(input.limit, input.offset)),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getBookById(input.id)),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        categoryId: z.number().optional(),
        authorId: z.number().optional(),
        publisherId: z.number().optional(),
        limit: z.number().min(1).max(100).default(12),
        offset: z.number().min(0).default(0),
      })
    )
    .query(({ input }) =>
      searchBooks(
        input.query,
        input.categoryId,
        input.authorId,
        input.publisherId,
        input.limit,
        input.offset
      )
    ),

  featured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(6) }))
    .query(({ input }) => getFeaturedBooks(input.limit)),

  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        authorId: z.number(),
        publisherId: z.number(),
        categoryId: z.number(),
        price: z.string().regex(/^\d+(\.\d{2})?$/),
        stock: z.number().min(0).default(0),
        isbn: z.string().optional(),
        pages: z.number().optional(),
        publishedYear: z.number().optional(),
        isFeatured: z.boolean().default(false),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await createBook({
        ...input,
        price: input.price as any,
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        authorId: z.number().optional(),
        publisherId: z.number().optional(),
        categoryId: z.number().optional(),
        price: z.string().regex(/^\d+(\.\d{2})?$/).optional(),
        stock: z.number().min(0).optional(),
        isbn: z.string().optional(),
        pages: z.number().optional(),
        publishedYear: z.number().optional(),
        isFeatured: z.boolean().optional(),
        coverImageUrl: z.string().optional(),
        coverImageKey: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      return await updateBook(id, updates as any);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteBook(input.id);
      return { success: true };
    }),
});

// ============= AUTHORS ROUTER =============

const authorsRouter = router({
  list: publicProcedure.query(() => listAuthors()),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getAuthorById(input.id)),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        bio: z.string().optional(),
      })
    )
    .mutation(({ input }) => createAuthor(input)),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      return await updateAuthor(id, updates);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteAuthor(input.id);
      return { success: true };
    }),
});

// ============= PUBLISHERS ROUTER =============

const publishersRouter = router({
  list: publicProcedure.query(() => listPublishers()),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getPublisherById(input.id)),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        website: z.string().optional(),
      })
    )
    .mutation(({ input }) => createPublisher(input)),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        website: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      return await updatePublisher(id, updates);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deletePublisher(input.id);
      return { success: true };
    }),
});

// ============= CATEGORIES ROUTER =============

const categoriesRouter = router({
  list: publicProcedure.query(() => listCategories()),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getCategoryById(input.id)),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(({ input }) => createCategory(input)),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      return await updateCategory(id, updates);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteCategory(input.id);
      return { success: true };
    }),
});

// ============= ORDERS ROUTER =============

const ordersRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            bookId: z.number(),
            quantity: z.number().min(1),
            price: z.string(),
          })
        ),
        totalPrice: z.string(),
        shippingAddress: z.string().min(1),
        shippingCity: z.string().min(1),
        shippingZip: z.string().min(1),
        shippingPhone: z.string().min(1),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const orderResult = await createOrder({
        userId: ctx.user.id,
        totalPrice: input.totalPrice as any,
        shippingAddress: input.shippingAddress,
        shippingCity: input.shippingCity,
        shippingZip: input.shippingZip,
        shippingPhone: input.shippingPhone,
        notes: input.notes,
        status: "pending",
      });

      const orderId = typeof orderResult === 'number' ? orderResult : (orderResult as any).insertId;
      if (!orderId) throw new Error("Failed to create order");

      for (const item of input.items) {
        await createOrderItem({
          orderId: orderId,
          bookId: item.bookId,
          quantity: item.quantity,
          price: item.price as any,
        });
      }

      // Notify owner of new order
      try {
        await notifyOwner({
          title: "New Order Received",
          content: `Order #${orderId} from ${ctx.user.name || "Customer"} for ${input.totalPrice}`,
        });
      } catch (error) {
        console.error("Failed to notify owner:", error);
      }

      return orderId;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const order = await getOrderById(input.id);
      if (!order) return null;

      // Users can only see their own orders, admins can see all
      if (ctx.user.role !== "admin" && order.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const items = await getOrderItems(input.id);
      return { ...order, items };
    }),

  getUserOrders: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(({ input, ctx }) => getUserOrders(ctx.user.id, input.limit, input.offset)),

  listAll: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(({ input }) => listAllOrders(input.limit, input.offset)),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(({ input }) => updateOrderStatus(input.id, input.status)),
});

// ============= USERS ROUTER =============

const usersRouter = router({
  list: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(({ input }) => listUsers(input.limit, input.offset)),
});

// ============= MAIN APP ROUTER =============

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  books: booksRouter,
  authors: authorsRouter,
  publishers: publishersRouter,
  categories: categoriesRouter,
  orders: ordersRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
