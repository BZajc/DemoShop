"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProductOptionsProps {
  options: Record<string, string[]>;
}

export default function ProductOptions({ options }: ProductOptionsProps) {
  const initialSelected = Object.fromEntries(
    Object.entries(options).map(([key, values]) => [key, values[0]])
  );
  const [selected, setSelected] = useState<Record<string, string>>(initialSelected);

  return (
    <div className="mt-6 space-y-4">
      {Object.entries(options).map(([key, values]) => {
        const current = selected[key];
        return (
          <div key={key}>
            <h3 className="text-base font-medium text-gray-900 dark:text-white capitalize">
              {key}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {values.map((opt) => {
                const isSelected = current === opt;
                return (
                  <Button
                    key={opt}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelected(prev => ({ ...prev, [key]: opt }))}
                  >
                    {opt}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
