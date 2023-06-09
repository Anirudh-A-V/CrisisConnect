import React from "react";

const Footer = () => {
  return (
    <footer className="bg-transparent text-gray-800 py-4 border-t-[1px] mt-auto bottom-0 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <p className="sm:text-sm text-xs mb-2">© 2023 Crisis Connect. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-500 max-sm:text-xs">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-500 max-sm:text-xs">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-500 max-sm:text-xs">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
