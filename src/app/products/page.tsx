import ProductList from "@/components/products/ProductList";
import FiltersSidebar from "@/components/products/FiltersSidebar";
import SortSelect from "@/components/products/SortSelect";
import Pagination from "@/components/products/Pagination";
import MobileFilters from "@/components/products/MobileFilters";
import ProductsCount from "@/components/products/ProductsCount";
import { headers } from "next/headers";
import { parse } from "url";
import { ParsedUrlQuery } from "querystring";

import { gql } from "@apollo/client";
import { client } from "@/lib/apollo-client";

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

interface ProductsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // Parsing URL
  const headersList = headers();
  const fullUrl = (await headersList).get("x-url") || "";
  const url = parse(fullUrl, true);
  const query: ParsedUrlQuery = url.query;

  const categoryParam =
    typeof query.category === "string" ? query.category : undefined;
  const minPrice =
    typeof query.minPrice === "string"
      ? parseFloat(query.minPrice)
      : undefined;
  const maxPrice =
    typeof query.maxPrice === "string"
      ? parseFloat(query.maxPrice)
      : undefined;
  const page =
    typeof query.page === "string" && !isNaN(Number(query.page))
      ? parseInt(query.page, 10)
      : 1;

  // Apollo Call
  const { data } = await client.query<{ productCount: number }>({
    query: GET_PRODUCTS_COUNT,
    variables: {
      category: categoryParam ? [categoryParam] : undefined,
      minPrice,
      maxPrice,
    },
    fetchPolicy: "no-cache",
  });

  const total = data?.productCount ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 mt-16">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {/* Mobile filters */}
      <MobileFilters />

      <div className="flex gap-8">
        {/* Desktop filters */}
        <div className="hidden sm:block w-64 shrink-0">
          <FiltersSidebar />
        </div>

        <div className="flex-1">
          <div className="hidden sm:flex justify-between items-center mb-4">
            <ProductsCount />
            <SortSelect />
          </div>

          <ProductList />
          <Pagination total={total} page={page} perPage={16} />
        </div>
      </div>
    </div>
  );
}
