"use client";

import { gql, useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const GET_PRODUCTS_COUNT = gql`
  query ProductCount(
    $category: [String!]
    $minPrice: Float
    $maxPrice: Float
  ) {
    productCount(
      category: $category
      minPrice: $minPrice
      maxPrice: $maxPrice
    )
  }
`;

export default function ProductsCount() {
  const searchParams = useSearchParams();

  const category = searchParams.getAll("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const { data, loading } = useQuery(GET_PRODUCTS_COUNT, {
    variables: {
      category: category.length > 0 ? category : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    },
    ssr: false,
  });

  return (
    <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-500 dark:text-white" />
      ) : (
        `Showing ${data?.productCount ?? 0} results`
      )}
    </p>
  );
}
