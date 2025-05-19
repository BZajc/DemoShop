"use client";

import * as Slider from "@radix-ui/react-slider";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

const GET_CATEGORIES = gql`
  query Categories($take: Int!) {
    categories(take: $take) {
      id
      name
      slug
    }
  }
`;

export default function FiltersSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Many categories
  const selectedCategories = searchParams.getAll("category");

  // In stock
  const [inStock, setInStock] = useState(searchParams.get("stock") === "true");

  // Price
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 1000,
  ]);

  const { data } = useQuery(GET_CATEGORIES, {
    variables: { take: 100 },
    ssr: false,
  });

  //  Apply In Stock
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    inStock ? params.set("stock", "true") : params.delete("stock");
    router.push(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inStock]);

  //  Handle category toggle (multi)
  const handleCategoryToggle = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("category");

    if (current.includes(slug)) {
      const updated = current.filter((c) => c !== slug);
      params.delete("category");
      updated.forEach((c) => params.append("category", c));
    } else {
      params.append("category", slug);
    }

    router.push(`?${params.toString()}`);
  };

  //  Apply price range on commit
  const handlePriceCommit = (val: number[]) => {
    const [min, max] = val;
    const params = new URLSearchParams(searchParams.toString());

    if (min > 0) {
      params.set("minPrice", min.toString());
    } else {
      params.delete("minPrice");
    }

    if (max < 1000) {
      params.set("maxPrice", max.toString());
    } else {
      params.delete("maxPrice");
    }

    setPriceRange([min, max]);
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/products");
    setInStock(false);
    setPriceRange([0, 1000]);
  };

  return (
    <aside className="w-full sm:w-64 p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl">
      <h2 className="text-lg font-semibold mb-4 text-brown-700">Filters</h2>

      {/* Categories */}
      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200 mb-6">
        {data?.categories.map((cat: { id: string; name: string; slug: string }) => (
          <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-brown-600"
              checked={selectedCategories.includes(cat.slug)}
              onChange={() => handleCategoryToggle(cat.slug)}
            />
            {cat.name}
          </label>
        ))}
      </div>

      {/* Stock */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="accent-brown-600"
          />
          In Stock
        </label>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Price range: ${priceRange[0]} – ${priceRange[1]}
        </p>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          onValueCommit={(val) => handlePriceCommit(val as [number, number])}
        >
          <Slider.Track className="bg-gray-200 dark:bg-zinc-700 relative grow rounded-full h-[6px]">
            <Slider.Range className="absolute bg-brown-600 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-white border-2 border-brown-600 rounded-full shadow hover:bg-brown-100 focus:outline-none"
            aria-label="Minimum price"
          />
          <Slider.Thumb
            className="block w-5 h-5 bg-white border-2 border-brown-600 rounded-full shadow hover:bg-brown-100 focus:outline-none"
            aria-label="Maximum price"
          />
        </Slider.Root>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="mt-6 text-sm text-blue-600 hover:underline"
      >
        Reset filters
      </button>
    </aside>
  );
}
