
import { Link } from 'react-router-dom';
import { Bed } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-600 hover:text-hostelmate-400">Help Center</Link></li>
              <li><Link to="/safety" className="text-gray-600 hover:text-hostelmate-400">Safety Information</Link></li>
              <li><Link to="/covid" className="text-gray-600 hover:text-hostelmate-400">Covid-19 Resources</Link></li>
              <li><Link to="/accessibility" className="text-gray-600 hover:text-hostelmate-400">Accessibility</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link to="/diversity" className="text-gray-600 hover:text-hostelmate-400">Diversity & Belonging</Link></li>
              <li><Link to="/referrals" className="text-gray-600 hover:text-hostelmate-400">Referrals</Link></li>
              <li><Link to="/students" className="text-gray-600 hover:text-hostelmate-400">Student Discounts</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Hosting</h3>
            <ul className="space-y-2">
              <li><Link to="/become-host" className="text-gray-600 hover:text-hostelmate-400">List Your Hostel</Link></li>
              <li><Link to="/host/community" className="text-gray-600 hover:text-hostelmate-400">Community Forum</Link></li>
              <li><Link to="/host/responsible" className="text-gray-600 hover:text-hostelmate-400">Responsible Hosting</Link></li>
              <li><Link to="/host/resources" className="text-gray-600 hover:text-hostelmate-400">Host Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about-us" className="text-gray-600 hover:text-hostelmate-400">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-hostelmate-400">Careers</Link></li>
              <li><Link to="/press" className="text-gray-600 hover:text-hostelmate-400">Press</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-hostelmate-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-hostelmate-400">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Bed className="h-6 w-6 text-hostelmate-400" />
            <span className="ml-2 text-xl font-semibold text-hostelmate-400">HostelMate</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center text-sm text-gray-500">
            <span className="mb-2 md:mb-0 md:mr-4">© {currentYear} HostelMate, Inc.</span>
            <div className="flex space-x-4">
              <Link to="/privacy" className="hover:text-hostelmate-400">Privacy</Link>
              <Link to="/terms" className="hover:text-hostelmate-400">Terms</Link>
              <Link to="/sitemap" className="hover:text-hostelmate-400">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
