import { drizzle } from "drizzle-orm/mysql2";
import { books } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function addSampleBooks() {
  console.log("Adding 10 sample books to catalog...");

  try {
    const booksData = [
      {
        title: "Pergi",
        description:
          "Novel tentang perjalanan hidup dan penemuan diri. Kisah menarik tentang seorang pemuda yang memutuskan untuk meninggalkan kota besar dan mencari makna hidup di tempat yang lebih sederhana.",
        authorId: 3,
        publisherId: 2,
        categoryId: 1,
        price: "85000",
        stock: 25,
        isbn: "9789793063578",
        pages: 412,
        publishedYear: 2014,
        isFeatured: true,
      },
      {
        title: "Sang Pemimpi",
        description:
          "Cerita inspiratif tentang dua sahabat yang bermimpi besar. Mengikuti perjalanan mereka dari desa kecil hingga mencapai impian mereka di kota besar.",
        authorId: 2,
        publisherId: 2,
        categoryId: 1,
        price: "82000",
        stock: 30,
        isbn: "9789793062847",
        pages: 534,
        publishedYear: 2006,
        isFeatured: true,
      },
      {
        title: "Hujan",
        description:
          "Novel tentang cinta, kehilangan, dan harapan. Mengisahkan perjalanan emosional seorang pria yang mencoba memahami arti sebenarnya dari cinta sejati.",
        authorId: 3,
        publisherId: 2,
        categoryId: 1,
        price: "78000",
        stock: 20,
        isbn: "9789793063561",
        pages: 356,
        publishedYear: 2007,
        isFeatured: false,
      },
      {
        title: "Filosofi Teras",
        description:
          "Buku yang menggabungkan filosofi Stoik dengan kehidupan modern Indonesia. Memberikan panduan praktis untuk mencapai ketenangan batin dan kebahagiaan sejati.",
        authorId: 1,
        publisherId: 1,
        categoryId: 7,
        price: "95000",
        stock: 50,
        isbn: "9789793065846",
        pages: 400,
        publishedYear: 2018,
        isFeatured: true,
      },
      {
        title: "Sapiens",
        description:
          "Sejarah singkat manusia dari era Batu hingga era modern. Buku ini mengeksplorasi bagaimana manusia berkembang dan membentuk peradaban yang kompleks.",
        authorId: 1,
        publisherId: 1,
        categoryId: 5,
        price: "120000",
        stock: 35,
        isbn: "9780062316097",
        pages: 528,
        publishedYear: 2011,
        isFeatured: true,
      },
      {
        title: "Midnight Library",
        description:
          "Petualangan fantasi tentang seorang wanita yang diberikan kesempatan untuk menjalani kehidupan alternatif. Setiap pilihan membuka dunia baru yang berbeda.",
        authorId: 1,
        publisherId: 4,
        categoryId: 4,
        price: "110000",
        stock: 28,
        isbn: "9780062688873",
        pages: 304,
        publishedYear: 2020,
        isFeatured: false,
      },
      {
        title: "Atomic Habits",
        description:
          "Panduan praktis untuk membangun kebiasaan baik dan menghilangkan kebiasaan buruk. Sistem kecil yang konsisten menghasilkan perubahan besar dalam hidup.",
        authorId: 1,
        publisherId: 1,
        categoryId: 7,
        price: "95000",
        stock: 45,
        isbn: "9780735211292",
        pages: 320,
        publishedYear: 2018,
        isFeatured: true,
      },
      {
        title: "Educated",
        description:
          "Memoir inspiratif tentang seorang gadis yang tumbuh dalam keluarga fundamentalis dan akhirnya mendapatkan pendidikan formal. Kisah tentang kekuatan pendidikan untuk mengubah hidup.",
        authorId: 1,
        publisherId: 1,
        categoryId: 5,
        price: "125000",
        stock: 22,
        isbn: "9780399590504",
        pages: 352,
        publishedYear: 2018,
        isFeatured: false,
      },
      {
        title: "The Midnight Library",
        description:
          "Novel fantasi yang menggabungkan elemen misteri dan petualangan. Seorang detektif harus memecahkan kasus yang melibatkan perpustakaan ajaib.",
        authorId: 1,
        publisherId: 4,
        categoryId: 3,
        price: "115000",
        stock: 18,
        isbn: "9780062688890",
        pages: 288,
        publishedYear: 2021,
        isFeatured: false,
      },
      {
        title: "Ketika Cinta Bertabrakan",
        description:
          "Kisah cinta yang rumit antara dua orang dari latar belakang yang berbeda. Mereka harus memilih antara cinta dan tanggung jawab keluarga.",
        authorId: 3,
        publisherId: 2,
        categoryId: 1,
        price: "72000",
        stock: 32,
        isbn: "9789793063578",
        pages: 298,
        publishedYear: 2019,
        isFeatured: true,
      },
    ];

    await db.insert(books).values(booksData);

    console.log("✓ Successfully added 10 sample books to catalog!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding books:", error);
    process.exit(1);
  }
}

addSampleBooks();
