import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer = ({ t }) => {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-blue-500 mr-2" />
              <span className="font-bold text-xl text-white">SparkLine</span>
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">SIH26092</span>
            </div>
            <p className="mt-4 text-sm text-gray-400 max-w-md">
              A unified portal for Safai Karamcharis, Manual Scavengers, and their dependents to discover and apply for government schemes.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Official Links</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-white">NSFDC Portal</a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-white">PM-SURAJ</a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-white">MSJE Guidelines</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-white">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-white">Disclaimer</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} SparkLine Initiative. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;