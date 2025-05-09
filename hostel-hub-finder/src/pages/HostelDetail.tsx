import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHostelById } from "@/data/hostels";

interface BookingDates {
  from: Date | undefined;
  to: Date | undefined;
}

interface RoomType {
  type: 'single' | 'double' | 'triple';
  price: number;
  available: number;
}

const HostelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [date, setDate] = useState<BookingDates>({
    from: undefined,
    to: undefined,
  });
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);

  // Get hostel data from static data
  const hostel = id ? getHostelById(id) : null;
  if (!hostel) {
    return <div>Hostel not found</div>;
  }

  // Available room types
  const roomTypes: RoomType[] = [
    { type: 'single', price: hostel.price_per_night, available: hostel.single_rooms },
    { type: 'double', price: hostel.price_per_night * 1.5, available: hostel.double_rooms },
    { type: 'triple', price: hostel.price_per_night * 2, available: hostel.triple_rooms },
  ];

  const handleBooking = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast({
          title: "Error",
          description: "Please login to book a room",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      if (!date.from || !date.to || !selectedRoom) {
        toast({
          title: "Error",
          description: "Please select dates and room type",
          variant: "destructive",
        });
        return;
      }

      // Calculate total price
      const numberOfDays = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = selectedRoom.price * numberOfDays;

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          hostel_id: parseInt(id),
          room_type: selectedRoom.type,
          check_in: format(date.from, 'yyyy-MM-dd'),
          check_out: format(date.to, 'yyyy-MM-dd'),
          total_price: totalPrice,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Room booked successfully!",
        });
        navigate('/'); // Redirect to profile to see booking
      } else {
        throw new Error(data.error || 'Failed to book room');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to book room",
        variant: "destructive",
      });
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? hostel.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === hostel.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Image Gallery and Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <div className="absolute inset-0">
                {hostel.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${hostel.name} view ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
              <div className="absolute inset-y-0 left-4 flex items-center">
                <button
                  onClick={handlePreviousImage}
                  className="h-10 w-10 rounded-full bg-white/70 hover:bg-white flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <span className="text-xl">&lt;</span>
                </button>
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center">
                <button
                  onClick={handleNextImage}
                  className="h-10 w-10 rounded-full bg-white/70 hover:bg-white flex items-center justify-center"
                  aria-label="Next image"
                >
                  <span className="text-xl">&gt;</span>
                </button>
              </div>
            </div>
            {/* Hostel Details */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{hostel.name}</h1>
              <p className="text-gray-600">{hostel.address}</p>
              <p className="text-lg">{hostel.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold">Distance from University</h3>
                  <p>{hostel.distance_from_university} km</p>
                </div>
                <div>
                  <h3 className="font-semibold">Rating</h3>
                  <p>{hostel.rating} / 5</p>
                </div>
                <div>
                  <h3 className="font-semibold">Starting Price</h3>
                  <p>₹{hostel.price_per_night} / night</p>
                </div>
              </div>
            </div>
          </div>
          {/* Booking Section */}
          <div className="md:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg border p-6 space-y-6">
              <h2 className="text-2xl font-bold">Book Your Stay</h2>
              {/* Date Selection */}
              <div className="space-y-2">
                <h3 className="font-semibold">Select Dates</h3>
                <div className="grid gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick your dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={{ from: date?.from, to: date?.to }}
                        onSelect={(range) => setDate({ from: range?.from, to: range?.to })}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {/* Room Type Selection */}
              <div className="space-y-2">
                <h3 className="font-semibold">Select Room Type</h3>
                <div className="space-y-2">
                  {roomTypes.map((room) => (
                    <button
                      key={room.type}
                      onClick={() => setSelectedRoom(room)}
                      className={cn(
                        "w-full p-3 text-left border rounded-lg transition-colors",
                        selectedRoom?.type === room.type
                          ? "border-hostelmate-400 bg-hostelmate-50"
                          : "hover:border-gray-300"
                      )}
                      disabled={room.available === 0}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium capitalize">{room.type} Room</p>
                          <p className="text-sm text-gray-500">
                            {room.available} room(s) available
                          </p>
                        </div>
                        <p className="font-semibold">₹{room.price}/night</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Price Calculation */}
              {selectedRoom && date.from && date.to && (
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Price per night</span>
                    <span>₹{selectedRoom.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of nights</span>
                    <span>
                      {Math.ceil(
                        (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      ₹{selectedRoom.price *
                        Math.ceil(
                          (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
                        )}
                    </span>
                  </div>
                </div>
              )}
              {/* Book Now Button */}
              <Button
                className="w-full bg-hostelmate-400 hover:bg-hostelmate-500"
                onClick={handleBooking}
                disabled={!selectedRoom || !date.from || !date.to}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HostelDetail;
