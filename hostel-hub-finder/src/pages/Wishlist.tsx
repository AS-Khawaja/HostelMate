
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HostelCard from '@/components/HostelCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { hostels } from '@/data/hostels';

// In a real application, we would fetch the user's wishlist
// For now, we'll use a sample set of wishlisted hostels
const sampleWishlist = hostels.slice(0, 3);

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(sampleWishlist);
  
  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter(hostel => hostel.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 md:pt-28">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Wishlist</h1>
          <p className="text-gray-600 mb-8">Your favorite hostels and accommodations saved in one place.</p>
          
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((hostel) => (
                <div key={hostel.id} className="relative">
                  <button
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md"
                    onClick={() => removeFromWishlist(hostel.id)}
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  </button>
                  <HostelCard hostel={hostel} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
              <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">Save your favorite hostels to come back to them later</p>
              <Button>
                <Link to="/search">Browse hostels</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
