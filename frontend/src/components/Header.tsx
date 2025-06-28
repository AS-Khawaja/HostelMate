import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  User,
  Heart,
  Menu,
  X,
  Bed,
  MapPin,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is logged in
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    if (userId) {
      setIsLoggedIn(true);
      setUserName(name || 'User');
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    // Any other user-related items you might have stored
    
    // Update state
    setIsLoggedIn(false);
    
    // Show success toast
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Bed className="h-8 w-8 text-hostelmate-400" />
            <span className="ml-2 text-xl font-bold text-hostelmate-400">HostelMate</span>
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden md:flex items-center border border-gray-200 rounded-full p-2 shadow-sm bg-white flex-1 mx-8">
            <div className="flex items-center justify-between w-full px-4">
              <div className="border-r pr-4">
                <div className="text-sm font-medium">Location</div>
                <div className="text-xs text-gray-500">Find nearby universities</div>
              </div>
              <div className="border-r px-4">
                <div className="text-sm font-medium">Check in</div>
                <div className="text-xs text-gray-500">Add dates</div>
              </div>
              <div className="border-r px-4">
                <div className="text-sm font-medium">Check out</div>
                <div className="text-xs text-gray-500">Add dates</div>
              </div>
              <div className="px-4">
                <div className="text-sm font-medium">Guests</div>
                <div className="text-xs text-gray-500">Add students</div>
              </div>
              {/* <Button className="rounded-full bg-hostelmate-400 text-white hover:bg-hostelmate-500">
                <Search className="h-4 w-4" />
              </Button> */}
            </div>
          </div>

          {/* Mobile search button */}
          <Button variant="outline" className="md:hidden rounded-full">
            <Search className="h-4 w-4 mr-2" />
            <span className="text-sm">Search</span>
          </Button>

          {/* User navigation */}
          <div className="flex items-center gap-2">
            {/* <Link to="/become-host">
              <Button variant="ghost" className="hidden md:block text-sm rounded-full hover:bg-gray-100">
                Become a host
              </Button>
            </Link> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full border border-gray-200 p-1 px-3 flex items-center gap-3">
                  <Menu className="h-4 w-4" />
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2">
                {isLoggedIn ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-500">
                      Hello, {userName}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Link to="/user/profile" className="flex items-center gap-2 w-full">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem className="cursor-pointer">
                      <Link to="/wishlists" className="flex items-center gap-2 w-full">
                        <Heart className="h-4 w-4" />
                        Wishlists
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link to="/become-host" className="flex items-center gap-2 w-full">
                        <Bed className="h-4 w-4" />
                        Host your hostel
                      </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleSignOut}>
                      <div className="flex items-center gap-2 w-full">
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </div>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="cursor-pointer font-medium">
                      <Link to="/signup" className="flex items-center gap-2 w-full">
                        <UserPlus className="h-4 w-4" />
                        Sign up
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link to="/login" className="flex items-center gap-2 w-full">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Link to="/become-host" className="flex items-center gap-2 w-full">
                        <Bed className="h-4 w-4" />
                        Host your hostel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-4 relative md:hidden">
          <Input
            className="w-full pl-10 py-6 rounded-full border border-gray-200 shadow-sm"
            placeholder="Search universities, cities..."
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
