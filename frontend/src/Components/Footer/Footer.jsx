import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-700">
      <div className="flex flex-wrap items-center justify-between py-4 px-6 gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="#" className="block cursor-pointer w-20 h-6">
            <img
              src="/images/logo-udemy-inverted.svg"
              alt="Udemy Logo"
              className="w-full h-auto"
            />
          </a>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          <a
            href="#"
            className="text-sm text-white hover:text-gray-300 hover:underline transition-colors duration-200 whitespace-nowrap"
          >
            About us
          </a>
          <a
            href="#"
            className="text-sm text-white hover:text-gray-300 hover:underline transition-colors duration-200 whitespace-nowrap"
          >
            Contact us
          </a>
          <a
            href="#"
            className="text-sm text-white hover:text-gray-300 hover:underline transition-colors duration-200 whitespace-nowrap"
          >
            Help and support
          </a>
          <a
            href="#"
            className="text-sm text-white hover:text-gray-300 hover:underline transition-colors duration-200 whitespace-nowrap"
          >
            Privacy policy
          </a>
        </div>

        {/* Copyright */}
        <div className="flex-shrink-0 text-sm whitespace-nowrap">
          &copy; 2024 Udemy, Inc.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
