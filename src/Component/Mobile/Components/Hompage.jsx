import { Search, Mic, ChevronRight, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard.jsx";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const categories = [
  { id: 1, name: "Oak", icon: "🌳" },
  { id: 2, name: "Pine", icon: "🌲" },
  { id: 3, name: "Fruit", icon: "🍎" },
  { id: 4, name: "Bonsai", icon: "🪴" },
  { id: 5, name: "Palm", icon: "🌴" },
  { id: 6, name: "Maple", icon: "🍁" },
];

const banners = [
  { id: 1, title: "Spring Sale", subtitle: "Up to 50% off on selected trees", color: "#10b981" },
  { id: 2, title: "New Arrivals", subtitle: "Exotic palm trees now available", color: "#f97316" },
  { id: 3, title: "Bonsai Special", subtitle: "Buy 2 Get 1 Free", color: "#8b5cf6" },
];

export default function Homepage({
  products,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  wishlistIds,
  onSearchClick,
}) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(bannerTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashDeals = products.filter((p) => p.originalPrice).slice(0, 4);
  const trending = products.slice(4, 10);

  return (
    <div className="pb-20 bg-gray-50">
      {/* Greeting */}
      <div className="bg-white px-4 py-4">
        <h1 className="text-xl">Hi Saad 👋</h1>
        <p className="text-sm text-gray-600">Let's find your perfect tree</p>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4 bg-white mb-2">
        <div
          onClick={onSearchClick}
          className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 cursor-pointer"
        >
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search trees..."
            className="flex-1 bg-transparent outline-none"
            readOnly
          />
          <Mic className="w-5 h-5 text-[#059669]" />
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="px-4 mb-4">
        <div className="relative h-36 rounded-2xl overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: currentBanner === index ? 1 : 0,
                backgroundColor: banner.color,
              }}
            >
              <div className="p-6 text-white h-full flex flex-col justify-center">
                <h2 className="text-xl mb-1">{banner.title}</h2>
                <p className="text-sm opacity-90 mb-3">{banner.subtitle}</p>
                <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm self-start">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentBanner === index ? "bg-white w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg">Categories</h2>
          <button className="text-[#059669] text-sm flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              className="bg-white p-4 rounded-xl border border-border flex flex-col items-center gap-2 hover:border-[#059669] hover:shadow-md transition-all"
            >
              <span className="text-3xl">{category.icon}</span>
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Flash Deals */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg">Flash Deals</h2>
          <div className="flex items-center gap-2 text-[#f97316] text-sm">
            <Clock className="w-4 h-4" />
            <span>
              {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {flashDeals.map((product) => (
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
      </div>

      {/* Trending Products */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg">Trending Now</h2>
          <button className="text-[#059669] text-sm flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {trending.map((product) => (
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
      </div>
    </div>
  );
}
