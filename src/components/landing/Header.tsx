import React from "react";

const Header: React.FC = () => (
  <header className="w-full bg-white shadow py-4 px-6 flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <img src="/logo.png" alt="Solar Hut Logo" className="h-8 w-auto" />
    </div>
    <nav className="space-x-4">
      <a href="/" className="text-gray-700 hover:text-orange-600">Home</a>
      <a href="/enquiry" className="text-gray-700 hover:text-orange-600">Enquiry</a>
      <a href="/login" className="text-gray-700 hover:text-orange-600">Login</a>
    </nav>
  </header>
);

export default Header;
