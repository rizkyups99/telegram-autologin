'use client';

import { useState, useEffect } from 'react';
export default function WhatsappWidget() {
  const [phoneNumber, setPhoneNumber] = useState('6285716665995');
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Fetch WhatsApp settings
    fetchWhatsappSettings();

    // Show widget after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const fetchWhatsappSettings = async () => {
    try {
      const response = await fetch('/api/whatsapp-settings');
      if (response.ok) {
        const data = await response.json();
        setPhoneNumber(data.phoneNumber);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
    }
  };
  const handleWhatsappClick = () => {
    // Create WhatsApp URL exactly like the Test button
    const message = encodeURIComponent('Halo, saya ingin bertanya tentang username dan kode akses Langit Digital');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=6285716665995&text=${message}`;

    // Open WhatsApp in new tab (same as Test button behavior)
    window.open(whatsappUrl, '_blank');
  };
  return <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} data-unique-id="ca6bc49f-4610-4d5f-bbca-499d3fd7cd61" data-file-name="components/WhatsappWidget.tsx">
      <div className="relative group" data-unique-id="a8fcfefd-a521-4a1c-8ea8-2787550ee5ed" data-file-name="components/WhatsappWidget.tsx" data-dynamic-text="true">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap" data-unique-id="5159a4cb-2d2f-4ed8-b145-4ee09037a1a0" data-file-name="components/WhatsappWidget.tsx">
          <span className="editable-text" data-unique-id="6e04c0a8-0f99-4f06-abed-52b8e7455a89" data-file-name="components/WhatsappWidget.tsx">Chat CS Admin</span>
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800" data-unique-id="760b53de-6cda-464b-9536-44ae2d7b391a" data-file-name="components/WhatsappWidget.tsx"></div>
        </div>

        {/* WhatsApp Button */}
        <button onClick={handleWhatsappClick} className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-1 cursor-pointer" type="button" aria-label="Chat with us on WhatsApp" data-unique-id="41671239-649d-44f3-87b3-b5b15c2b3ca0" data-file-name="components/WhatsappWidget.tsx">
          <img src="https://pre-built-images.s3.amazonaws.com/webapp-uploads/a5fae8a035c5f75582a8a407ef516d46.png" alt="WhatsApp" className="w-full h-full object-contain rounded-full pointer-events-none" data-unique-id="f41c3011-4ee4-4ecc-a12f-353b08185b2a" data-file-name="components/WhatsappWidget.tsx" />
        </button>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" data-unique-id="278ed2da-3bad-4271-970a-8175eeb6586e" data-file-name="components/WhatsappWidget.tsx"></div>
      </div>
    </div>;
}