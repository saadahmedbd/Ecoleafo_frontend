import { ArrowLeft, Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import ProductCard from "./ProductCard";

/**
 * Search page component with filtering capabilities
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of products to search through
 * @param {Function} props.onBack - Callback to navigate back
 * @param {Function} props.onAddToCart - Callback to add product to cart
 * @param {Function} props.onToggleWishlist - Callback to toggle wishlist status
 * @param {Function} props.onProductClick - Callback when product is clicked
 * @param {Set} props.wishlistIds - Set of product IDs in wishlist
 */
export default function SearchPage({
  products,
  onBack,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  wishlistIds,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const categories = ["all", "Oak", "Pine", "Fruit", "Bonsai", "Palm", "Maple"];
  const priceRanges = [
    { id: "all", label: "All Prices" },
    { id: "0-50", label: "Under $50" },
    { id: "50-100", label: "$50 - $100" },
    { id: "100-200", label: "$100 - $200" },
    { id: "200+", label: "$200+" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category.toLowerCase() === selectedCategory.toLowerCase();

    let matchesPrice = true;
    if (priceRange === "0-50") matchesPrice = product.price < 50;
    else if (priceRange === "50-100") matchesPrice = product.price >= 50 && product.price < 100;
    else if (priceRange === "100-200") matchesPrice = product.price >= 100 && product.price < 200;
    else if (priceRange === "200+") matchesPrice = product.price >= 200;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header with Search */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search trees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="p-1 hover:bg-gray-200 rounded-full">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <SlidersHorizontal className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-2">Category</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-[#2563eb] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category === "all" ? "All" : category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Price Range</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setPriceRange(range.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm transition-colors ${
                      priceRange === range.id
                        ? "bg-[#2563eb] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        <p className="text-sm text-gray-600 mb-4">
          {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} found
        </p>
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg mb-2">No results found</h3>
            <p className="text-gray-600 text-center">
              Try adjusting your search or filters to find what you're looking for
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                onProductClick={onProductClick}
                isInWishlist={wishlistIds.has(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
