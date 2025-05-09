
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  hostelName: z.string().min(2, {
    message: "Hostel name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  nearbyUniversities: z.string().min(2, {
    message: "Please specify at least one nearby university.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  totalRooms: z.string().min(1, {
    message: "Please specify the number of rooms.",
  }),
  amenities: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Select at least one amenity.",
  }),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

const amenitiesList = [
  { id: "wifi", label: "WiFi" },
  { id: "ac", label: "Air Conditioning" },
  { id: "meals", label: "Meals Included" },
  { id: "laundry", label: "Laundry" },
  { id: "gym", label: "Gym" },
  { id: "study", label: "Study Room" },
  { id: "tv", label: "TV Lounge" },
  { id: "parking", label: "Parking" },
];

const BecomeHost = () => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hostelName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      nearbyUniversities: "",
      description: "",
      totalRooms: "",
      amenities: [],
      termsAgreed: false,
    },
  });
  
  // Track form completion for steps
  const [stepsCompleted, setStepsCompleted] = useState({
    1: false,
    2: false,
    3: false,
  });
  
  // Handle step navigation
  const nextStep = () => {
    const currentStepFields = {
      1: ["name", "email", "phone"],
      2: ["hostelName", "address", "city", "nearbyUniversities"],
      3: ["description", "totalRooms", "amenities", "termsAgreed"],
    }[step];
    
    // Check if current step fields are valid
    const isStepValid = currentStepFields.every((field) => {
      const fieldState = form.getFieldState(field);
      if (field === "amenities") {
        return form.getValues(field).length > 0;
      }
      return !fieldState.invalid && form.getValues(field);
    });
    
    if (isStepValid) {
      setStepsCompleted({...stepsCompleted, [step]: true});
      setStep(step + 1);
    } else {
      // Trigger validation for current step fields
      void form.trigger(currentStepFields);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // This is where you would typically submit the form data to your backend
      console.log("Form values:", values);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Show success message
      toast({
        title: "Application submitted",
        description: "We'll review your application and get back to you soon!",
      });
      
      setStep(4); // Move to success step
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your application.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              Become a HostelMate Host
            </h1>
            <p className="text-lg text-center text-gray-600 mb-8">
              List your hostel or PG and connect with students across India
            </p>
            
            {step < 4 && (
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s}
                      className="flex items-center"
                    >
                      <div 
                        className={`
                          flex items-center justify-center w-10 h-10 rounded-full 
                          ${s === step ? "bg-hostelmate-400 text-white" : 
                            stepsCompleted[s] ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}
                        `}
                      >
                        {stepsCompleted[s] ? "✓" : s}
                      </div>
                      <span 
                        className={`ml-2 hidden sm:block ${s === step ? "font-medium" : "text-gray-500"}`}
                      >
                        {s === 1 ? "Your Details" : s === 2 ? "Property Details" : "Amenities & Terms"}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="relative mt-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-hostelmate-400 rounded-full transition-all duration-300"
                      style={{ width: `${(step / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <>
                      <h2 className="text-xl font-semibold mb-4">Your Details</h2>
                      <p className="text-gray-600 mb-6">Tell us a bit about yourself as a property owner.</p>
                      
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Your contact number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end mt-6 pt-4">
                        <Button 
                          type="button"
                          onClick={nextStep}
                          className="bg-hostelmate-400 hover:bg-hostelmate-500"
                        >
                          Next: Property Details
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {step === 2 && (
                    <>
                      <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                      <p className="text-gray-600 mb-6">Tell us about your hostel or PG accommodation.</p>
                      
                      <FormField
                        control={form.control}
                        name="hostelName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hostel/PG Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Name of your property" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complete Address</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Full address of your property" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City where property is located" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="nearbyUniversities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nearby Universities/Colleges</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List universities or colleges near your property" 
                                className="resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between mt-6 pt-4">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="button"
                          onClick={nextStep}
                          className="bg-hostelmate-400 hover:bg-hostelmate-500"
                        >
                          Next: Amenities & Terms
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {step === 3 && (
                    <>
                      <h2 className="text-xl font-semibold mb-4">Amenities & Terms</h2>
                      <p className="text-gray-600 mb-6">Tell us what your property offers and agree to our terms.</p>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your property, its features, and rules" 
                                className="resize-none h-24" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="totalRooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Number of Rooms</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" placeholder="Number of rooms available" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="amenities"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Available Amenities</FormLabel>
                              <div className="text-sm text-gray-500">
                                Select all that apply
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {amenitiesList.map((amenity) => (
                                <FormField
                                  key={amenity.id}
                                  control={form.control}
                                  name="amenities"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={amenity.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(amenity.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, amenity.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== amenity.id
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {amenity.label}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Separator className="my-6" />
                      
                      <FormField
                        control={form.control}
                        name="termsAgreed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => field.onChange(checked as boolean)}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I agree to the <Link to="#" className="text-hostelmate-400 hover:underline">terms and conditions</Link> and <Link to="#" className="text-hostelmate-400 hover:underline">privacy policy</Link>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between mt-6 pt-4">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-hostelmate-400 hover:bg-hostelmate-500"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Application"}
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {step === 4 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Application Submitted Successfully!</h2>
                      <p className="text-gray-600 mb-6">
                        Thank you for your interest in becoming a HostelMate host. We've received your application and will review it shortly. Our team will contact you within 2-3 business days.
                      </p>
                      <div className="mt-8">
                        <Button
                          onClick={() => window.location.href = "/"}
                          className="bg-hostelmate-400 hover:bg-hostelmate-500"
                        >
                          Return to Home
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BecomeHost;
