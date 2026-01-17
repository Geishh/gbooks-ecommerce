import { drizzle } from "drizzle-orm/mysql2";
import { books } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

async function updateBookCovers() {
  console.log("Updating book covers with image URLs...");

  try {
    const bookCovers = [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600&fit=crop",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1495446815901-a7297e3ffe02?w=400&h=600&fit=crop",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1543002588-d83cea6bfbad?w=400&h=600&fit=crop",
      },
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600&fit=crop",
      },
      {
        id: 7,
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      },
      {
        id: 8,
        url: "https://images.unsplash.com/photo-1495446815901-a7297e3ffe02?w=400&h=600&fit=crop",
      },
      {
        id: 9,
        url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
      },
      {
        id: 10,
        url: "https://images.unsplash.com/photo-1543002588-d83cea6bfbad?w=400&h=600&fit=crop",
      },
    ];

    for (const book of bookCovers) {
      await db
        .update(books)
        .set({ coverImageUrl: book.url })
        .where(eq(books.id, book.id));
      console.log(`✓ Updated book ${book.id} with cover image`);
    }

    console.log("✓ Successfully updated all book covers!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating book covers:", error);
    process.exit(1);
  }
}

updateBookCovers();
