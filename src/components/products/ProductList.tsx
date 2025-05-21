"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gql, useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import clsx from "clsx";

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts(
    $take: Int!
    $skip: Int!
    $category: [String!]
    $stock: Boolean
    $minPrice: Float
    $maxPrice: Float
    $sort: String
  ) {
    allProducts(
      take: $take
      skip: $skip
      category: $category
      stock: $stock
      minPrice: $minPrice
      maxPrice: $maxPrice
      sort: $sort
    ) {
      id
      name
      slug
      description
      price
      imageUrl
      stock
      category {
        name
        slug
      }
    }
  }
`;

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  category?: {
    name: string;
    slug: string;
  };
}

export default function ProductList() {
  const searchParams = useSearchParams();

  const take = 16;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const skip = (page - 1) * take;

  const category = searchParams.getAll("category");
  const stockParam = searchParams.get("stock");
  const stock =
    stockParam === "true" ? true : stockParam === "false" ? false : undefined;

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") || undefined;

  const { data, loading, error } = useQuery<{ allProducts: Product[] }>(GET_ALL_PRODUCTS, {
    variables: {
      take,
      skip,
      category: category.length > 0 ? category : undefined,
      stock,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sort,
    },
    ssr: false,
  });

  const iconClasses = clsx(
    "p-2 rounded-full transition border cursor-pointer",
    "bg-white text-brown-700 border-brown-700 hover:bg-gray-100",
    "dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-700"
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <DotLottieReact
          src="/lottie/Loading.lottie"
          loop
          autoplay
          style={{ width: "80px", height: "80px" }}
        />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading products.</p>;
  }

  const products: Product[] = data?.allProducts ?? [];

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-10">
        No products found matching your filters.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 shadow hover:shadow-md transition flex flex-col"
        >
          <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl || "/ProductPlaceholder.webp"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <h3
            className="text-md font-semibold mb-1 text-brown-700 dark:text-white line-clamp-2"
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="mt-auto flex flex-col gap-2">

            {/* Product subpage */}
            <Link href={`/products/${product.slug}-${product.id}`}>
              <Button variant="demoshop" className="w-full">
                Details
              </Button>
            </Link>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product.price)}
              </p>
              <div className="flex items-center gap-2">
                <div className={iconClasses} aria-label="Add to favorites">
                  <Heart className="w-5 h-5" />
                </div>
                <div className={iconClasses} aria-label="Add to cart">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
