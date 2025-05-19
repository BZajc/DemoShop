"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PaginationProps {
  total: number;
  page?: number;
  perPage?: number;
}

export default function Pagination({ total, page = 1, perPage = 16 }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      {prevPage ? (
        <Link href={`?page=${prevPage}`}>
          <Button variant="demoshop">Previous</Button>
        </Link>
      ) : (
        <Button variant="demoshop" disabled>Previous</Button>
      )}

      <span className="text-sm text-gray-600 dark:text-gray-300">
        Page {page} of {totalPages}
      </span>

      {nextPage ? (
        <Link href={`?page=${nextPage}`}>
          <Button variant="demoshop">Next</Button>
        </Link>
      ) : (
        <Button variant="demoshop" disabled>Next</Button>
      )}
    </div>
  );
}
