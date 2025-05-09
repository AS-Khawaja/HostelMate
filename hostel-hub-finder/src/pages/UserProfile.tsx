import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Heart, User, Settings, Calendar, Mail, X, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHostelById } from "@/data/hostels";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  university: string;
  course: string;
  bio: string;
}

interface Booking {
  id: number;
  user_id: number;
  user_name: string;
  hostel_id: number;
  hostel_name: string;
  check_in: string;
  check_out: string;
  room_type: string;
  total_price: number;
  status: string;
}

interface WishlistItem {
  id: number;
  name: string;
  description: string;
  address: string;
  price_per_month: number;
  gender_preference: string;
  available_rooms: number;
  total_rooms: number;
  wishlist_id: number;
  added_on: string;
  // Additional properties for UI
  image?: string;
  location?: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for user profile data
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    university: "",
    course: "",
    bio: "",
  });
  // State for bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  // State for wishlist
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for form data when editing
  const [formData, setFormData] = useState({...profile});
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Check if user is logged in
        const userId = localStorage.getItem('userId');
        if (!userId) {
          toast({
            title: "Error",
            description: "Please login to view your profile",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }
        
        // Fetch user profile
        const profileResponse = await fetch(`http://localhost:5000/api/user/${userId}`);
        const profileData = await profileResponse.json();
        if (profileResponse.ok && profileData.user) {
          setProfile(profileData.user);
          setFormData(profileData.user);
        } else {
          throw new Error(profileData.error || 'Failed to fetch user data');
        }
        
        // Fetch all bookings and filter by user ID
        const bookingsResponse = await fetch(`http://localhost:5000/api/bookings`);
        const bookingsData = await bookingsResponse.json();
        if (bookingsResponse.ok && bookingsData.bookings) {
          // Filter bookings for the current user
          const userBookings = bookingsData.bookings.filter(
            (booking: Booking) => booking.user_id === parseInt(userId)
          );
          const enhancedBookings = userBookings.map((booking: Booking) => {
            // Get hostel data from hostels.ts using the hostel_id
            const hostelData = getHostelById(booking.hostel_id.toString());
            
            return {
              ...booking,
              // Use hostel name from hostels.ts if available, otherwise use the one from API
              hostel_name: hostelData ? hostelData.name : booking.hostel_name
            };
          });
          setBookings(enhancedBookings);
        }
        
        // Fetch wishlist items
        const wishlistResponse = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
        const wishlistData = await wishlistResponse.json();
        if (wishlistResponse.ok && wishlistData.wishlist) {
          // Enhance wishlist data with additional UI properties
          const enhancedWishlist = wishlistData.wishlist.map((item: WishlistItem) => {
            // Try to get additional data from hostels.ts
            const hostelData = getHostelById(item.id.toString());
            
            return {
              ...item,
              // Add placeholder image if not available
              image: hostelData?.images?.[0] || 'https://placehold.co/600x400?text=Hostel',
              location: hostelData?.location || item.address || 'Location not available'
            };
          });
          setWishlist(enhancedWishlist);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, toast]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/user/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setProfile(formData);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };
  
  // Handle cancel edit
  const handleCancel = () => {
    setFormData({...profile});
    setIsEditing(false);
  };
  
  // Handle remove from wishlist
  
  
  // Handle delete booking
  const handleDeleteBooking = async (bookingId: number) => {
    try {
      // You would need to implement this endpoint in your Flask backend
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        // Remove the booking from the local state
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        toast({
          title: "Success",
          description: "Booking deleted successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete booking');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete booking",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - Profile Card */}
            <div className="w-full md:w-1/4">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{profile.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{profile.university}</p>
                    
                    <div className="flex flex-col space-y-3 w-full text-sm">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{profile.course}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {!isEditing && (
                      <Button 
                        onClick={() => setIsEditing(true)} 
                        variant="outline" 
                        className="w-full"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="w-full md:w-3/4">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-6 border-b w-full justify-start rounded-none bg-transparent p-0 h-auto">
                  <TabsTrigger 
                    value="profile" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-hostelmate-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-base"
                  >
                    <User className="mr-2 h-5 w-5" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bookings" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-hostelmate-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-base"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Bookings
                  </TabsTrigger>
                  <TabsTrigger 
                    value="wishlist" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-hostelmate-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-base"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Wishlist
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-hostelmate-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-base"
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-0 p-0">
                  <Card>
                    <CardContent className="p-6">
                      {isEditing ? (
                        <form onSubmit={handleSubmit}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="name">Full Name</Label>
                              <Input 
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email Address</Label>
                              <Input 
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1"
                                disabled
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input 
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="university">University</Label>
                              <Input 
                                id="university"
                                name="university"
                                value={formData.university}
                                onChange={handleChange}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="course">Course</Label>
                              <Input
                                id="course"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="mt-1"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea 
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="mt-1"
                                rows={4}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 mt-6">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              className="bg-hostelmate-400 hover:bg-hostelmate-500"
                            >
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div>
                          <h3 className="text-2xl font-bold mb-6">Profile Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm text-gray-500">Full Name</h4>
                              <p className="font-medium">{profile.name}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-500">Email Address</h4>
                              <p className="font-medium">{profile.email}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-500">Phone Number</h4>
                              <p className="font-medium">{profile.phone || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-500">University</h4>
                              <p className="font-medium">{profile.university || 'Not provided'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-500">Course</h4>
                              <p className="font-medium">{profile.course || 'Not provided'}</p>
                            </div>
                          </div>
                          
                          <Separator className="my-6" />
                          
                          <div>
                            <h4 className="text-sm text-gray-500">Bio</h4>
                            <p className="mt-2">{profile.bio || 'Not provided'}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Bookings Tab */}
                <TabsContent value="bookings" className="mt-0 p-0">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-6">Your Bookings</h3>
                      
                      <div className="space-y-6">
                        {isLoading ? (
                          <div className="text-center py-16">
                            <p>Loading your bookings...</p>
                          </div>
                        ) : bookings.length > 0 ? (
                          bookings.map((booking) => (
                            <div key={booking.id} className="border rounded-lg overflow-hidden">
                              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                                <div>
                                  <h4 className="font-bold">{booking.hostel_name}</h4>
                                  <p className="text-sm text-gray-500">Booking #{booking.id}</p>
                                </div>
                                <div className="flex items-center">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      booking.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : booking.status === 'Upcoming'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {booking.status}
                                  </span>
                                </div>
                              </div>
                              <div className="p-4 flex flex-col md:flex-row justify-between">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span>
                                    <span className="text-gray-500 mr-1">Check in:</span>
                                    {booking.check_in}
                                  </span>
                                  <span className="mx-1">—</span>
                                  <span>
                                    <span className="text-gray-500 mr-1">Check out:</span>
                                    {booking.check_out}
                                  </span>
                                </div>
                                <div className="mt-3 md:mt-0">
                                  {/* Replace View Details button with Delete button */}
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mr-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handleDeleteBooking(booking.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                  {booking.status !== 'Completed' && (
                                    <Button size="sm" className="bg-hostelmate-400 hover:bg-hostelmate-500">
                                      Manage Booking
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="p-4 border-t">
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-gray-500">Room Type:</p>
                                  <p className="font-medium">{booking.room_type}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-gray-500">Total Price:</p>
                                  <p className="font-medium">₹{booking.total_price}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-16 border border-dashed rounded-lg">
                            <Calendar className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">
                              You don't have any bookings yet.
                            </p>
                            <Button 
                              className="mt-4 bg-hostelmate-400 hover:bg-hostelmate-500"
                              onClick={() => navigate('/hostels')}
                            >
                              Browse Hostels
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Wishlist Tab */}
                <TabsContent value="wishlist" className="mt-0 p-0">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-6">Your Wishlist</h3>
                      
                      {isLoading ? (
                        <div className="text-center py-16">
                          <p>Loading your wishlist...</p>
                        </div>
                      ) : wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {wishlist.map((item) => (
                            <div key={item.id} className="border rounded-lg overflow-hidden relative group">
                              <button
                                onClick={() => handleRemoveFromWishlist(item.id)}
                                className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove from wishlist"
                              >
                                <X className="h-4 w-4 text-gray-600" />
                              </button>
                              
                              <Link to={`/hostels/${item.id}`}>
                                <div className="relative h-48">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                    <h4 className="text-white font-medium">{item.name}</h4>
                                    <p className="text-white/80 text-sm">{item.location}</p>
                                  </div>
                                </div>
                                
                                <div className="p-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="font-medium">₹{item.price_per_month} <span className="text-gray-500 font-normal">/ month</span></p>
                                    <Badge variant="outline" className="text-xs">
                                      {item.gender_preference}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex justify-between text-sm text-gray-500">
                                    <span>Available: {item.available_rooms}/{item.total_rooms}</span>
                                    <span>Added: {new Date(item.added_on).toLocaleDateString()}</span>
                                  </div>
                                  
                                  <Button className="w-full mt-3 bg-hostelmate-400 hover:bg-hostelmate-500">
                                    View Details
                                  </Button>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 border border-dashed rounded-lg">
                          <Heart className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500">
                            Your wishlist is empty. Browse hostels and save your favorites!
                          </p>
                          <Button 
                            className="mt-4 bg-hostelmate-400 hover:bg-hostelmate-500"
                            onClick={() => navigate('/hostels')}
                          >
                            Browse Hostels
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings" className="mt-0 p-0">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-6">Account Settings</h3>
                      
                      <div className="space-y-8">
                        {/* Password Section */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Change Password</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input 
                                id="currentPassword"
                                type="password"
                                className="mt-1"
                              />
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input 
                                  id="newPassword"
                                  type="password"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input 
                                  id="confirmPassword"
                                  type="password"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                              <Button className="bg-hostelmate-400 hover:bg-hostelmate-500">
                                Update Password
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Notifications Section */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Notification Preferences</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-gray-500">Receive emails about your bookings</p>
                              </div>
                              <div>
                                {/* Include a proper switch component here */}
                                <input type="checkbox" className="toggle" defaultChecked />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Marketing Emails</p>
                                <p className="text-sm text-gray-500">Receive emails about promotions and updates</p>
                              </div>
                              <div>
                                {/* Include a proper switch component here */}
                                <input type="checkbox" className="toggle" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Account Actions Section */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Account Actions</h4>
                          <div className="space-y-4">
                            <Button 
                              variant="outline" 
                              className="text-amber-600 border-amber-600 hover:bg-amber-50"
                            >
                              Download My Data
                            </Button>
                            <Button 
                              variant="outline" 
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
