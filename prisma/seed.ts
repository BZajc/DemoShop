const { PrismaClient } = require("@prisma/client");
const prismaClient = new PrismaClient();

async function main() {
  // CLEAR DB FROM PRODUCTS AND CATEGORIES BEFORE SEEDING
  await prismaClient.product.deleteMany();
  await prismaClient.category.deleteMany();

  // Categories Seed
  const [homeDecor, fragrance, cosmetics, electronics] = await Promise.all([
    prismaClient.category.create({
      data: { name: "Home Decor", slug: "home-decor" },
    }),
    prismaClient.category.create({
      data: { name: "Fragrance", slug: "fragrance" },
    }),
    prismaClient.category.create({
      data: { name: "Cosmetics", slug: "cosmetics" },
    }),
    prismaClient.category.create({
      data: { name: "Electronics", slug: "electronics" },
    }),
  ]);

  // Products Seed
  await prismaClient.product.createMany({
    data: [
      {
        name: "Pastel Storage Boxes",
        slug: "pastel-storage-boxes",
        description:
          "Set of 4 pastel‐colored storage boxes, perfect for home organization.",
        price: 24.99,
        imageUrl: "/images/featured-temp0.jpg",
        stock: 12,
        metadata: {
          sizes: ["small", "medium", "large"],
          material: "cardboard",
        },
        categoryId: homeDecor.id,
      },
      {
        name: "Luxury Perfume",
        slug: "luxury-perfume",
        description: "Elegant designer fragrance in a sleek bottle.",
        price: 129.5,
        imageUrl: "/images/featured-temp1.jpg",
        stock: 8,
        metadata: { volume: "50ml", brand: "Yves Saint Laurent" },
        categoryId: fragrance.id,
      },
      {
        name: "Blush Palette",
        slug: "blush-palette",
        description:
          "Professional blush palette featuring 12 versatile shades.",
        price: 39.99,
        imageUrl: "/images/featured-temp2.jpg",
        stock: 20,
        metadata: { shades: 12, type: "powder" },
        categoryId: cosmetics.id,
      },
      {
        name: "Professional DSLR Camera",
        slug: "professional-dslr-camera",
        description:
          "High-resolution DSLR camera suitable for both beginners and pros.",
        price: 599.0,
        imageUrl: "/images/featured-temp3.jpg",
        stock: 5,
        metadata: { megapixels: "24MP", brand: "Canon EOS" },
        categoryId: electronics.id,
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
