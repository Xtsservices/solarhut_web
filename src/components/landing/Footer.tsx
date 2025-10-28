import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full bg-gray-100 py-4 px-6 text-center text-sm text-gray-500">
    &copy; {new Date().getFullYear()} Solar Hut Solutions. All rights reserved.
  </footer>
);

export default Footer;
