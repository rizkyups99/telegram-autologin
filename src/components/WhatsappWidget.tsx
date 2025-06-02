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
  return <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} data-unique-id="28e92c56-420d-446a-ba31-e09399290d41" data-file-name="components/WhatsappWidget.tsx">
      <div className="relative group" data-unique-id="a0a6af95-a78c-4ad7-946e-d869d93cdf23" data-file-name="components/WhatsappWidget.tsx" data-dynamic-text="true">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap" data-unique-id="39daa2f3-d28a-4fc7-a80b-df6fb97ddaa9" data-file-name="components/WhatsappWidget.tsx">
          <span className="editable-text" data-unique-id="d15245bd-091c-4884-aef6-ae495519f26d" data-file-name="components/WhatsappWidget.tsx">Chat CS Admin</span>
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800" data-unique-id="3bf86e50-77f3-43a6-a76c-1d62c4e3c0df" data-file-name="components/WhatsappWidget.tsx"></div>
        </div>

        {/* WhatsApp Button */}
        <button onClick={handleWhatsappClick} className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-1 cursor-pointer" type="button" aria-label="Chat with us on WhatsApp" data-unique-id="eebe69ca-9119-4e42-8624-14602da06e18" data-file-name="components/WhatsappWidget.tsx">
          <img src="https://pre-built-images.s3.amazonaws.com/webapp-uploads/a5fae8a035c5f75582a8a407ef516d46.png" alt="WhatsApp" className="w-full h-full object-contain rounded-full pointer-events-none" data-unique-id="98a9d883-db63-4c3a-80dc-80c5c10a6870" data-file-name="components/WhatsappWidget.tsx" />
        </button>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" data-unique-id="02e9ac1f-697a-4438-aded-f446ad1ef985" data-file-name="components/WhatsappWidget.tsx"></div>
      </div>
    </div>;
}