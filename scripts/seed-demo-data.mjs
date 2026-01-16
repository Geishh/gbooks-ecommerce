import { drizzle } from "drizzle-orm/mysql2";
import { authors, publishers, categories, books } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seedData() {
  console.log("Seeding demo data...");

  try {
    // Create authors
    const authorResults = await db.insert(authors).values([
      { name: "Pramoedya Ananta Toer", bio: "Penulis Indonesia terkenal" },
      { name: "Andrea Hirata", bio: "Penulis Laskar Pelangi" },
      { name: "Tere Liye", bio: "Penulis novel bestseller Indonesia" },
      { name: "Haruki Murakami", bio: "Penulis Jepang terkenal" },
      { name: "J.K. Rowling", bio: "Penulis Harry Potter" },
    ]);

    // Create publishers
    const publisherResults = await db.insert(publishers).values([
      { name: "Gramedia Pustaka Utama", website: "https://gramedia.com" },
      { name: "Bentang Pustaka", website: "https://bentangpustaka.com" },
      { name: "Penerbit Erlangga", website: "https://erlangga.co.id" },
      { name: "Bloomsbury Publishing", website: "https://bloomsbury.com" },
      { name: "Kodansha", website: "https://kodansha.co.jp" },
    ]);

    // Create categories
    const categoryResults = await db.insert(categories).values([
      { name: "Fiksi", description: "Buku cerita fiksi" },
      { name: "Non-Fiksi", description: "Buku non-fiksi dan referensi" },
      { name: "Misteri", description: "Novel misteri dan thriller" },
      { name: "Fantasi", description: "Buku fantasi dan petualangan" },
      { name: "Biografi", description: "Buku biografi dan sejarah" },
      { name: "Anak-anak", description: "Buku untuk anak-anak" },
      { name: "Pengembangan Diri", description: "Buku pengembangan diri" },
      { name: "Seni & Budaya", description: "Buku tentang seni dan budaya" },
    ]);

    // Create sample books
    await db.insert(books).values([
      {
        title: "Laskar Pelangi",
        description: "Kisah inspiratif tentang anak-anak di Belitung",
        authorId: 2,
        publisherId: 2,
        categoryId: 1,
        price: "79000",
        stock: 50,
        isbn: "9789793062847",
        pages: 529,
        publishedYear: 2005,
        isFeatured: true,
      },
      {
        title: "Bumi Manusia",
        description: "Tetralogi Buru karya Pramoedya Ananta Toer",
        authorId: 1,
        publisherId: 1,
        categoryId: 1,
        price: "89000",
        stock: 35,
        isbn: "9789793062854",
        pages: 540,
        publishedYear: 1980,
        isFeatured: true,
      },
      {
        title: "Pulang",
        description: "Novel tentang perjalanan pulang ke akar",
        authorId: 3,
        publisherId: 2,
        categoryId: 1,
        price: "75000",
        stock: 45,
        isbn: "9789793063561",
        pages: 384,
        publishedYear: 2015,
        isFeatured: true,
      },
      {
        title: "Norwegian Wood",
        description: "Novel romantis dari Haruki Murakami",
        authorId: 4,
        publisherId: 5,
        categoryId: 1,
        price: "95000",
        stock: 30,
        isbn: "9784061329935",
        pages: 296,
        publishedYear: 1987,
        isFeatured: false,
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        description: "Petualangan pertama Harry Potter",
        authorId: 5,
        publisherId: 4,
        categoryId: 4,
        price: "120000",
        stock: 60,
        isbn: "9780747532699",
        pages: 223,
        publishedYear: 1997,
        isFeatured: true,
      },
      {
        title: "Atomic Habits",
        description: "Panduan untuk membangun kebiasaan yang baik",
        authorId: 1,
        publisherId: 1,
        categoryId: 7,
        price: "85000",
        stock: 40,
        isbn: "9780735211292",
        pages: 320,
        publishedYear: 2018,
        isFeatured: false,
      },
    ]);

    console.log("✓ Demo data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
