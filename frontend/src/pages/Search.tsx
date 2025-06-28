
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import HostelCard from '@/components/HostelCard';
import { hostels } from '@/data/hostels';
import { Button } from '@/components/ui/button';
import { MapPin, Map } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [filteredHostels, setFilteredHostels] = useState(hostels);
  const [showMap, setShowMap] = useState(false);
  const [searchInfo, setSearchInfo] = useState({
    query: '',
    results: hostels.length,
  });
  
  // Extract search query from URL
  useEffect(() => {
    const city = searchParams.get('city');
    const university = searchParams.get('university');
    
    if (city) {
      const filtered = hostels.filter(hostel => 
        hostel.location.toLowerCase().includes(city.toLowerCase())
      );
      setFilteredHostels(filtered);
      setSearchInfo({
        query: city,
        results: filtered.length,
      });
    } else if (university) {
      const filtered = hostels.filter(hostel => 
        hostel.nearUniversity?.toLowerCase().includes(university.toLowerCase())
      );
      setFilteredHostels(filtered);
      setSearchInfo({
        query: university,
        results: filtered.length,
      });
    } else {
      setFilteredHostels(hostels);
      setSearchInfo({
        query: '',
        results: hostels.length,
      });
    }
  }, [searchParams]);

  const handleFilterChange = (filters: any) => {
    let filtered = [...hostels];
    
    // Filter by price
    if (filters.price) {
      filtered = filtered.filter(
        hostel => hostel.price >= filters.price[0] && hostel.price <= filters.price[1]
      );
    }
    
    // Filter by number of students
    if (filters.roommates) {
      filtered = filtered.filter(
        hostel => hostel.capacity >= filters.roommates[0] && hostel.capacity <= filters.roommates[1]
      );
    }
    
    // Filter by amenities or other selected filters
    if (filters.amenities && filters.amenities.length > 0) {
      // In a real application, we would filter by amenities here
      // For this demo, we'll just simulate the filtering
      if (filters.amenities.includes('wifi')) {
        // Filter hostels with WiFi
      }
    }
    
    setFilteredHostels(filtered);
    setSearchInfo(prev => ({
      ...prev,
      results: filtered.length,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 md:pt-28">
        <SearchFilters onFilterChange={handleFilterChange} />
        
        <div className="container mx-auto px-4 py-6">
          {/* Search Results Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-semibold">
                {searchInfo.query ? `Showing results for "${searchInfo.query}"` : 'All accommodations'}
              </h1>
              <p className="text-gray-500">{searchInfo.results} listings found</p>
            </div>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? <MapPin className="h-4 w-4" /> : <Map className="h-4 w-4" />}
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
          
          {/* Results Grid/Map View */}
          <div className={`grid ${showMap ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
            {showMap && (
              <div className="col-span-1 bg-gray-200 rounded-lg h-[calc(100vh-200px)] sticky top-28">
                <div className="p-4 h-full flex items-center justify-center text-gray-500">
                  Map View (Not implemented in this demo)
                </div>
              </div>
            )}
            
            <div className={`${showMap ? 'col-span-1' : 'col-span-full'} grid ${showMap ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
              {filteredHostels.length > 0 ? (
                filteredHostels.map(hostel => (
                  <HostelCard key={hostel.id} hostel={hostel} />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search for a different location</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
