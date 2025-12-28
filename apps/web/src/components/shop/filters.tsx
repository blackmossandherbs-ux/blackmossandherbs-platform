"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@blackmoss/ui";
import { Button } from "@blackmoss/ui";
import { Checkbox } from "@blackmoss/ui";
import { Label } from "@blackmoss/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blackmoss/ui";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState(searchParams.get("price") || "all");
  const [categories, setCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (priceRange !== "all") params.set("price", priceRange);
    if (categories.length > 0) params.set("categories", categories.join(","));
    if (sortBy !== "newest") params.set("sort", sortBy);
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    setPriceRange("all");
    setCategories([]);
    setSortBy("newest");
    router.push("/shop");
  };

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { value: "all", label: "All Prices" },
            { value: "0-25", label: "$0 - $25" },
            { value: "25-50", label: "$25 - $50" },
            { value: "50-100", label: "$50 - $100" },
            { value: "100+", label: "$100+" },
          ].map((range) => (
            <Label key={range.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                value={range.value}
                checked={priceRange === range.value}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-4 h-4"
              />
              <span>{range.label}</span>
            </Label>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
