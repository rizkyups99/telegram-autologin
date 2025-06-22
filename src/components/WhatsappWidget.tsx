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
  return <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} data-unique-id="fc7ed7e9-c759-483f-ac5f-9da0596a2d09" data-file-name="components/WhatsappWidget.tsx">
      <div className="relative group" data-unique-id="35dfb272-d2f9-4c50-872e-047b5ee753eb" data-file-name="components/WhatsappWidget.tsx" data-dynamic-text="true">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap" data-unique-id="52c1bbe1-f74f-4f48-943b-bd7f5438b58a" data-file-name="components/WhatsappWidget.tsx">
          <span className="editable-text" data-unique-id="e5fbd7ad-5e58-4f29-b028-164454c0049e" data-file-name="components/WhatsappWidget.tsx">Chat CS Admin</span>
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800" data-unique-id="669b5fc4-2742-4ca5-bcad-466305fd8320" data-file-name="components/WhatsappWidget.tsx"></div>
        </div>

        {/* WhatsApp Button */}
        <button onClick={handleWhatsappClick} className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-1 cursor-pointer" type="button" aria-label="Chat with us on WhatsApp" data-unique-id="779d2e87-fb62-4426-a361-7dc51a84e12f" data-file-name="components/WhatsappWidget.tsx">
          <img src="https://pre-built-images.s3.amazonaws.com/webapp-uploads/a5fae8a035c5f75582a8a407ef516d46.png" alt="WhatsApp" className="w-full h-full object-contain rounded-full pointer-events-none" data-unique-id="e5fd87f0-2ae0-423e-b02e-d3a981f9b07f" data-file-name="components/WhatsappWidget.tsx" />
        </button>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" data-unique-id="97fa2b4d-df1d-4696-8d5f-ae1303a8d806" data-file-name="components/WhatsappWidget.tsx"></div>
      </div>
    </div>;
}