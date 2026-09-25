import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  Radio,
  Bell,
  History,
  Cpu,
  Settings,
  HelpCircle,
  Flame,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/video-analysis", label: "Video Analysis", icon: Video },
  { to: "/monitoring", label: "Real-time Monitoring", icon: Radio },
  { to: "/alerts", label: "Alert Logs", icon: Bell },
  { to: "/history", label: "History", icon: History },
  { to: "/models", label: "AI Models", icon: Cpu },
  { to: "/settings", label: "System Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-sidebar text-gray-300 flex flex-col fixed left-0 top-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <Flame className="text-fire" size={28} />
        <span className="text-white text-xl font-bold tracking-wide">IGNIS</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-fire text-white" : "hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full hover:bg-gray-800 hover:text-white transition-colors">
          <HelpCircle size={18} />
          Help Center
        </button>
      </div>
    </aside>
  );
}