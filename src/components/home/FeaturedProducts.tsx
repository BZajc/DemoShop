import Image from "next/image";
import { Heart, ShoppingCart, ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const GRAPHQL_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;

const GET_FEATURED_PRODUCTS = `
  query GetFeaturedProducts($take: Int!) {
    featuredProducts(take: $take) {
      id
      name
      price
      imageUrl
      description
      category {
      name
      slug
      }
    }
  }
`;

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: {
    name: string;
    slug: string;
  };
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default async function FeaturedProducts() {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: GET_FEATURED_PRODUCTS,
      variables: { take: 4 },
    }),
  });

  const { data, errors } = await res.json();

  if (errors) {
    console.error("GraphQL errors:", errors);
    return <p className="text-red-500">Failed to load products.</p>;
  }

  const products: Product[] = data.featuredProducts;

  return (
    <div className="bg-[#fafafa] text-gray-900 dark:bg-zinc-950 dark:text-white">
      {/* Top navbar mock */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <Flame className="w-5 h-5" />
          eShop
        </h2>
        <input
          placeholder="Search for products..."
          className="w-full max-w-md mx-6 px-4 py-2 rounded-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center gap-4 text-gray-700 dark:text-gray-200">
          <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          <Heart className="w-5 h-5 cursor-pointer hover:text-blue-600" />
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-gradient-to-r from-white via-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-950 px-6 py-10 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold mb-3">
          New & Noteworthy
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6">
          Explore our latest arrivals across categories you love.
        </p>
        <Button variant="demoshop">
          New Products <ArrowRight className="w-4 h-4" />
        </Button>
      </section>

      {/* Product grid */}
      <section className="px-6 py-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">New Products</h3>
          <Link href="/products">
            <Button variant="demoshop">
              See All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col"
            >
              <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src={product.imageUrl || "/images/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-lg font-medium truncate" title={product.name}>
                {product.name}
              </h4>
              {product.category?.name && product.category?.slug && (
                <Link
                  href={`/products?category=${encodeURIComponent(
                    product.category.slug
                  )}`}
                  className="text-xs text-blue-600 hover:underline mb-1"
                >
                  {product.category.name}
                </Link>
              )}

              <p
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1"
                title={product.description}
              >
                {product.description || "No description available."}
              </p>
              <div className="mt-auto pt-3 flex justify-between items-center">
                <span className="text-blue-600 font-bold">
                  {formatPrice(product.price)}
                </span>
                <Button variant="demoshop">Add to Cart</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
