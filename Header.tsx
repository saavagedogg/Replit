import { useUser } from "@/hooks/useUser";

export default function Header() {
  const { user } = useUser();
  
  const handleLogout = () => {
    localStorage.removeItem("fitlife_user");
    window.location.reload();
  };
  
  return (
    <header className="bg-white shadow-sm z-20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="font-heading font-bold text-2xl text-primary">FitLife</div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Logout
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-primary bg-gray-200 flex items-center justify-center text-primary font-bold">
              {user?.name ? user.name.charAt(0) : "?"}
            </div>
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-success"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
