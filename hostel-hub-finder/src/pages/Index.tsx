import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HostelCard from "@/components/HostelCard";
import ChatBot from "@/components/ChatBot"; // Import the ChatBot component
import { hostels, getRecommendedHostels } from "@/data/hostels";
import { Search, MapPin, Star, ArrowRight, Bed } from 'lucide-react';

const popularCities = [
  { name: 'Lahore', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=500&auto=format&fit=crop' },
  { name: 'Karachi', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=500&auto=format&fit=crop' },
  { name: 'Islamabad', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=500&auto=format&fit=crop' },
  { name: 'Peshawar', image: 'https://images.unsplash.com/photo-1572445291381-c18af1b35beb?q=80&w=500&auto=format&fit=crop' },
];

const popularUniversities = [
  'University of the Punjab',
  'Lahore University of Management Sciences (LUMS)',
  'University of Engineering and Technology (UET)',
  'National University of Sciences and Technology (NUST)',
  'Quaid-i-Azam University',
  'International Islamic University',
  'NED University of Engineering and Technology',
  'Institute of Business Administration (IBA)',
  'Karachi University',
  'Dow University of Health Sciences',
  'Government College University',
  'King Edward Medical University',
  'University of Peshawar',
  'Khyber Medical University'
];


const HomeBanner = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop"
          alt="Student accommodation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find your perfect student accommodation
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Hostels and PGs near top universities across Pakistan
          </p>
          
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="University or city..."
                  className="pl-10 py-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <Button 
                className="bg-hostelmate-400 hover:bg-hostelmate-500 py-6 px-6"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [recommendedHostels, setRecommendedHostels] = useState(getRecommendedHostels());
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Handle search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    // Determine if the search query is more likely to be a city or university
    const isUniversity = popularUniversities.some(
      uni => uni.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (isUniversity) {
      navigate(`/search?university=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/search?city=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 md:pt-20">
        {/* Hero Banner */}
        <HomeBanner 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        
        {/* Popular Cities Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Popular Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularCities.map((city) => (
                <Link 
                  key={city.name}
                  to={`/search?city=${city.name}`}
                  className="group relative rounded-lg overflow-hidden h-40 listing-card"
                >
                  <img 
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="font-medium text-lg">{city.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Recommended Hostels Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recommended Hostels</h2>
              <Link to="/search" className="text-hostelmate-400 hover:underline flex items-center">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedHostels.map((hostel) => (
                <HostelCard key={hostel.id} hostel={hostel} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Browse by University */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Browse by University</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularUniversities.map((university) => (
                <Link 
                  key={university}
                  to={`/search?university=${university}`}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:border-hostelmate-400 hover:shadow-md transition-all"
                >
                  <h3 className="font-medium">{university}</h3>
                  <p className="text-sm text-gray-500 mt-1">Find accommodation</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* How it Works */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-10 text-center">How HostelMate Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-hostelmate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-hostelmate-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Search</h3>
                <p className="text-gray-600">Find hostels and PGs near your university or in your preferred city.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-hostelmate-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-hostelmate-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Compare</h3>
                <p className="text-gray-600">Read reviews, check amenities, and select the perfect accommodation.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-hostelmate-100 rounded-full flex items-center justify-center mb-4">
                  <Bed className="h-8 w-8 text-hostelmate-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Book</h3>
                <p className="text-gray-600">Book your stay directly with the hostel owner or through our platform.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Register as Host CTA */}
        <section className="py-12 bg-hostelmate-400 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Own a hostel or PG?</h2>
                <p className="text-white/90">List your property on HostelMate and reach thousands of students.</p>
              </div>
              <Button variant="outline" className="bg-white text-hostelmate-400 hover:bg-hostelmate-50">
                <Link to="/become-host">Become a Host</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Add the ChatBot component */}
      <ChatBot />
      
      <Footer />
    </div>
  );
};

export default Index;
