import { Search, Bell, ChevronDown } from "lucide-react";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            aria-label="Search"
            className="pl-9 pr-4 py-2 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-fire/40 w-56"
          />
        </div>

        <button aria-label="Notifications" className="relative text-gray-500 hover:text-gray-800">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-fire rounded-full" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
            A
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}