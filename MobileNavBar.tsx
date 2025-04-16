import { Link, useLocation } from "wouter";
import { Home, Dumbbell, Calendar, LineChart, Utensils } from "lucide-react";

export default function MobileNavBar() {
  const [location] = useLocation();
  
  const navigationItems = [
    { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { path: "/exercises", label: "Exercises", icon: <Dumbbell className="h-5 w-5" /> },
    { path: "/routines", label: "Routines", icon: <Calendar className="h-5 w-5" /> },
    { path: "/progress", label: "Progress", icon: <LineChart className="h-5 w-5" /> },
    { path: "/nutrition", label: "Nutrition", icon: <Utensils className="h-5 w-5" /> }
  ];

  const navItems = [
    { path: "/", label: "Home", icon: <Home className="text-lg" /> },
    { path: "/exercises", label: "Exercises", icon: <Dumbbell className="text-lg" /> },
    { path: "/routines", label: "Routines", icon: <Calendar className="text-lg" /> },
    { path: "/progress", label: "Progress", icon: <LineChart className="text-lg" /> },
    { path: "/nutrition", label: "Nutrition", icon: <Utensils className="text-lg" /> }
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-20">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex flex-col items-center ${
              location === item.path ? "text-primary" : "text-gray-500"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
