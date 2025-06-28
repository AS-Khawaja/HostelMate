import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Star, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface Hostel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  isRecommended?: boolean;
  nearUniversity?: string;
  type: string;
  capacity: number;
}

interface HostelCardProps {
  hostel: Hostel;
  className?: string;
  //userId?: number; // Add userId prop to check if user is logged in
}

const HostelCard = ({ hostel, className, userId }: HostelCardProps) => {
  const [liked, setLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Check if hostel is in user's wishlist on component mount
  useEffect(() => {
    
    const checkWishlistStatus = async () => {
      
      if (!(localStorage.getItem('userId'))) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/wishlist/${localStorage.getItem('userId'),hostel.id}`);
        if (response.ok) {
          const data = await response.json();
          const isInWishlist = data.wishlist.some(
            (item: any) => item.id.toString() === hostel.id.toString()
          );
          setLiked(isInWishlist);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };
    
    checkWishlistStatus();
  }, [userId, hostel.id]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex < hostel.images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : hostel.images.length - 1
    );
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!(localStorage.getItem('userId'))) {
      toast.error("Please login to add to wishlist", {
        description: "You need to be logged in to save hostels to your wishlist",
        action: {
          label: "Login",
          onClick: () => {
            // Navigate to login page
            window.location.href = '/login';
          }
        }
      });
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: userId,
          hostel_id: hostel.id,
          remove: liked // If already liked, we want to remove it
        }),
      });
      
      if (response.ok) {
        const newLikedState = !liked;
        setLiked(newLikedState);
        
        toast(newLikedState ? "Added to Wishlist" : "Removed from Wishlist", {
          description: newLikedState 
            ? `${hostel.name} has been added to your wishlist` 
            : `${hostel.name} has been removed from your wishlist`,
          action: {
            label: "View Wishlist",
            onClick: () => {
              // Navigate to profile wishlist tab
              window.location.href = '/profile?tab=wishlist';
            }
          }
        });
      } else {
        const errorData = await response.json();
        toast.error("Failed to update wishlist", {
          description: errorData.error || "Something went wrong"
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error("Failed to update wishlist", {
        description: "Network error or server is unavailable"
      });
    }
  };

  return (
    <Link 
      to={`/hostels/${hostel.id}`}
      className={cn("block listing-card", className)}
    >
      <div className="relative w-full">
        <AspectRatio ratio={4/3} className="bg-slate-100 overflow-hidden rounded-xl">
          <img 
            src={hostel.images[currentImageIndex]}
            alt={hostel.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        
        {/* Image navigation */}
        <div className="absolute inset-0 flex items-center justify-between">
          <button 
            onClick={handlePrevImage}
            className="h-8 w-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center ml-2 text-black"
            aria-label="Previous image"
          >
            &lt;
          </button>
          <button 
            onClick={handleNextImage}
            className="h-8 w-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center mr-2 text-black"
            aria-label="Next image"
          >
            &gt;
          </button>
        </div>
        
        {/* Indicator dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1">
          {hostel.images.map((_, index) => (
            <span 
              key={index}
              className={cn(
                "h-1.5 w-1.5 rounded-full", 
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
        
        {/* Like/Wishlist button */}
        <button 
          onClick={handleLike}
          className="absolute top-3 right-3 z-10 text-white hover:scale-110 transition-transform"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={cn(
              "h-6 w-6", 
              liked ? "fill-red-500 stroke-red-500" : "fill-transparent stroke-white"
            )} 
          />
        </button>
        
        {hostel.isRecommended && (
          <Badge className="absolute top-3 left-3 bg-hostelmate-400 hover:bg-hostelmate-500">
            Recommended
          </Badge>
        )}
      </div>
      
      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{hostel.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 fill-current text-yellow-500" />
            <span>{hostel.rating}</span>
            <span className="text-gray-500 text-sm ml-1">({hostel.reviewCount})</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm">{hostel.location}</p>
        {hostel.nearUniversity && (
          <p className="text-gray-500 text-sm">Near {hostel.nearUniversity}</p>
        )}
        <p className="text-gray-500 text-sm">
          {hostel.type} · {hostel.capacity} students
        </p>
        <p className="font-medium">
          ₹{hostel.price} <span className="text-gray-500 font-normal">/ month</span>
        </p>
      </div>
    </Link>
  );
};

export default HostelCard;
