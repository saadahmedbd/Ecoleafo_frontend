import { Bell, ShoppingBag } from "lucide-react";

export default function Header({ onNotificationClick }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-[#059669]">TreeShop</span>
      </div>
      <button
        onClick={onNotificationClick}
        className="relative p-2 hover:bg-secondary rounded-full transition-colors"
      >
        <Bell className="w-6 h-6 text-foreground" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-[#f97316] rounded-full"></span>
      </button>
    </header>
  );
}
