
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Filter, 
  Home, 
  DollarSign, 
  Users, 
  Wifi, 
  Bath, 
  MapPin,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterProps {
  onFilterChange: (filters: any) => void;
}

const SearchFilters = ({ onFilterChange }: FilterProps) => {
  const [price, setPrice] = useState([500, 10000]);
  const [roommates, setRoommates] = useState([1, 4]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const amenities = [
    { id: 'wifi', name: 'WiFi', icon: Wifi },
    { id: 'attached-bath', name: 'Attached Bathroom', icon: Bath },
    { id: 'ac', name: 'Air Conditioner', icon: Home },
    { id: 'food', name: 'Food Included', icon: Home },
    { id: 'laundry', name: 'Laundry', icon: Home },
    { id: 'gym', name: 'Gym Access', icon: Home },
  ];

  const propertyTypes = [
    { id: 'hostel', name: 'Hostel' },
    { id: 'pg', name: 'PG' },
    { id: 'apartment', name: 'Apartment' },
    { id: 'shared-flat', name: 'Shared Flat' },
  ];

  const universities = [
    { id: 'delhi-university', name: 'Delhi University' },
    { id: 'jnu', name: 'JNU' },
    { id: 'iit-delhi', name: 'IIT Delhi' },
    { id: 'amity', name: 'Amity University' },
  ];

  const handlePriceChange = (value: number[]) => {
    setPrice(value);
    applyFilters({ price: value });
  };

  const handleRoommatesChange = (value: number[]) => {
    setRoommates(value);
    applyFilters({ roommates: value });
  };

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId) 
        : [...prev, filterId]
    );

    applyFilters({ 
      amenities: activeFilters.includes(filterId) 
        ? activeFilters.filter(id => id !== filterId) 
        : [...activeFilters, filterId] 
    });
  };

  const applyFilters = (newFilters: any) => {
    onFilterChange({
      price,
      roommates,
      amenities: activeFilters,
      ...newFilters
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full flex items-center gap-2 whitespace-nowrap"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Price: ₹{price[0]} - ₹{price[1]}
            </Button>
            
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Students: {roommates[0]} - {roommates[1]}
            </Button>
            
            {propertyTypes.map(type => (
              <Button 
                key={type.id}
                variant={activeFilters.includes(type.id) ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full whitespace-nowrap",
                  activeFilters.includes(type.id) && "bg-hostelmate-400 text-white hover:bg-hostelmate-500"
                )}
                onClick={() => toggleFilter(type.id)}
              >
                {type.name}
              </Button>
            ))}

            <Button variant="outline" size="sm" className="rounded-full flex items-center gap-2 whitespace-nowrap">
              <MapPin className="h-4 w-4" />
              Near Universities
            </Button>
            
            <Button variant="outline" size="sm" className="rounded-full flex items-center gap-2 whitespace-nowrap">
              <Star className="h-4 w-4" />
              Top Rated
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price Range
                </h3>
                <div className="px-3">
                  <Slider 
                    defaultValue={price} 
                    min={500} 
                    max={10000} 
                    step={100} 
                    onValueChange={handlePriceChange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>₹{price[0]}</span>
                    <span>₹{price[1]}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Number of Students
                </h3>
                <div className="px-3">
                  <Slider 
                    defaultValue={roommates} 
                    min={1} 
                    max={8} 
                    step={1} 
                    onValueChange={handleRoommatesChange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{roommates[0]} student{roommates[0] > 1 ? 's' : ''}</span>
                    <span>{roommates[1]} students</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Near Universities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {universities.map(uni => (
                    <Button 
                      key={uni.id}
                      variant={activeFilters.includes(uni.id) ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "justify-start text-left",
                        activeFilters.includes(uni.id) && "bg-hostelmate-400 hover:bg-hostelmate-500"
                      )}
                      onClick={() => toggleFilter(uni.id)}
                    >
                      {uni.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenities.map(amenity => (
                  <Button 
                    key={amenity.id}
                    variant={activeFilters.includes(amenity.id) ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "justify-start",
                      activeFilters.includes(amenity.id) && "bg-hostelmate-400 hover:bg-hostelmate-500"
                    )}
                    onClick={() => toggleFilter(amenity.id)}
                  >
                    <amenity.icon className="h-4 w-4 mr-2" />
                    {amenity.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => {
                setActiveFilters([]);
                setPrice([500, 10000]);
                setRoommates([1, 4]);
                applyFilters({ reset: true });
              }}>
                Clear all
              </Button>
              <Button className="bg-hostelmate-400 hover:bg-hostelmate-500" onClick={() => setShowFilters(false)}>
                Show results
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
