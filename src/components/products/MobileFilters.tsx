"use client";

import * as Slider from "@radix-ui/react-slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SortSelect from "./SortSelect";
import { gql, useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const GET_CATEGORIES = gql`
  query Categories($take: Int!) {
    categories(take: $take) {
      id
      name
      slug
    }
  }
`;

export default function MobileFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategories = searchParams.getAll("category");
  const [inStock, setInStock] = useState(searchParams.get("stock") === "true");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 1000,
  ]);

  const { data } = useQuery(GET_CATEGORIES, {
    variables: { take: 100 },
    ssr: false,
  });

  const updateSearchParams = (params: URLSearchParams) => {
    router.push(`?${params.toString()}`);
  };

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const categories = new Set(params.getAll("category"));

    if (categories.has(slug)) {
      categories.delete(slug);
    } else {
      categories.add(slug);
    }

    params.delete("category");
    categories.forEach((cat) => params.append("category", cat));
    updateSearchParams(params);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (inStock) {
      params.set("stock", "true");
    } else {
      params.delete("stock");
    }

    updateSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inStock]);

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
    updateSearchParams(params);
  };

  const handleReset = () => {
    router.push("/products");
    setInStock(false);
    setPriceRange([0, 1000]);
  };

  return (
    <div className="flex justify-between items-center mb-4 sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="demoshop">Filters</Button>
        </SheetTrigger>
<SheetContent side="left" className="w-[85vw] sm:w-64 px-4 py-6">
  <SheetHeader className="mb-6">
    <SheetTitle className="text-lg text-brown-700">Filters</SheetTitle>
  </SheetHeader>

  <aside className="space-y-6">
    {/* Categories */}
    <div className="space-y-4 text-base text-gray-700 dark:text-gray-200">
      {data?.categories.map((cat: { id: string; name: string; slug: string }) => (
        <label
          key={cat.id}
          className="flex items-center gap-3 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedCategories.includes(cat.slug)}
            onChange={() => handleCategoryChange(cat.slug)}
            className="accent-brown-600 scale-110"
          />
          {cat.name}
        </label>
      ))}
    </div>

    {/* In Stock */}
    <div>
      <label className="flex items-center gap-3 text-base text-gray-700 dark:text-gray-200 cursor-pointer">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="accent-brown-600 scale-110"
        />
        In Stock
      </label>
    </div>

    {/* Price Range */}
    <div>
      <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
        Price range: ${priceRange[0]} – ${priceRange[1]}
      </p>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-6"
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
          className="block w-6 h-6 bg-white border-2 border-brown-600 rounded-full shadow hover:bg-brown-100 focus:outline-none"
          aria-label="Minimum price"
        />
        <Slider.Thumb
          className="block w-6 h-6 bg-white border-2 border-brown-600 rounded-full shadow hover:bg-brown-100 focus:outline-none"
          aria-label="Maximum price"
        />
      </Slider.Root>
    </div>

    <button
      onClick={handleReset}
      className="text-sm text-blue-600 hover:underline mt-6"
    >
      Reset filters
    </button>
  </aside>
</SheetContent>
      </Sheet>

      <div className="ml-auto">
        <SortSelect />
      </div>
    </div>
  );
}
