import { Link, useLocation } from "wouter";
import { useUser } from "@/hooks/useUser";
import { Home, Dumbbell, Calendar, LineChart, Settings, Utensils } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { workoutsCompleted } = useUser();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="w-5 h-5 mr-2" /> },
    { path: "/exercises", label: "Exercises", icon: <Dumbbell className="w-5 h-5 mr-2" /> },
    { path: "/routines", label: "My Routines", icon: <Calendar className="w-5 h-5 mr-2" /> },
    { path: "/progress", label: "Progress", icon: <LineChart className="w-5 h-5 mr-2" /> },
    { path: "/nutrition", label: "Nutrition", icon: <Utensils className="w-5 h-5 mr-2" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-5 h-5 mr-2" /> }
  ];

  return (
    <aside className="hidden md:block bg-white w-64 border-r border-gray-200 flex-shrink-0">
      <nav className="flex flex-col h-full px-4 py-6">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center px-3 py-3 rounded-lg font-medium ${
                location === item.path 
                  ? "text-primary bg-indigo-50" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto">
          <div className="bg-gray-50 rounded-xl p-4 mt-6">
            <div className="font-medium mb-2">Your Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-secondary h-2 rounded-full progress-animation" 
                style={{ width: `${Math.min(workoutsCompleted * 5, 100)}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500">
              {workoutsCompleted} workouts completed this month
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}