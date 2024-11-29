import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div>
          <h5 className="text-xl font-bold text-blue-500">Nexus Tag</h5>
          <p className="text-gray-400 mt-2">Innovating Data Labeling</p>
        </div>
        <div className="flex space-x-6">
          {['Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
            <a key={link} href="#" className="text-gray-400 hover:text-white">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
