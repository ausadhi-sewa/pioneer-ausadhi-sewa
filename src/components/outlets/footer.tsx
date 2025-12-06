
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
} from 'lucide-react';
import logo from '../../assets/pioneer-aushadhisewa.png';
export function Footer() {
  const currentYear = new Date().getFullYear();

  // Primary navigational links that exist in the app today
  const quickLinks = [
    
    { name: 'About Us', path: '/about' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  const exploreLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'All Products', path: '/products' },
  ];

  // Keep resources minimal for now
  const resourcesLinks: Array<{ name: string; path: string }> = [];

  return (
    <footer className="bg-gradient-to-r from-transparent via-medical-green-200-50 to-transparent text-neutral-800 shadow-lg">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-6">
              <div className="flex items-center mb-3">
                <img 
                  src={logo} 
                  alt="Pioneer Aushadhi Sewa" 
                  className="h-24 w-auto mr-3 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold text-medical-green-700">Pioneer Aushadhi Sewa</h3>
                  <p className="text-sm text-medical-green-600 font-medium">MEDICINE DELIVERY</p>
                </div>
              </div>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Brand Logo and Contact Info */}
          <div className="lg:col-span-1">
            
         
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold text-neutral-800 mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-button-color rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-neutral-700">Murli-12 Birgunj Nepal</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-button-color rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-neutral-700">+977 9705467105</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-button-color rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-neutral-700">pioneeraushadhisewa@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold text-neutral-800 mb-4">Company</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-neutral-700 hover:text-medical-green-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-lg font-bold text-neutral-800 mb-4">Explore</h4>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-neutral-700 hover:text-medical-green-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          {resourcesLinks.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-neutral-800 mb-4">Resources</h4>
              <ul className="space-y-2">
                {resourcesLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="text-neutral-700 hover:text-medical-green-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              © {currentYear} AusadhiSewa. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
