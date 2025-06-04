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
  return <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} data-unique-id="f63820f5-558f-47f5-939b-a7f07909ee37" data-file-name="components/WhatsappWidget.tsx">
      <div className="relative group" data-unique-id="d1cfad50-e339-4ea4-91a9-1ef74ae5dd54" data-file-name="components/WhatsappWidget.tsx" data-dynamic-text="true">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap" data-unique-id="ac8d5258-60f5-402e-96c7-ea251cfd733a" data-file-name="components/WhatsappWidget.tsx">
          <span className="editable-text" data-unique-id="8aebcd4f-628b-4e4c-8172-049dc0f1488a" data-file-name="components/WhatsappWidget.tsx">Chat CS Admin</span>
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800" data-unique-id="9de20dad-1212-4dd8-ad61-7fdebea512b4" data-file-name="components/WhatsappWidget.tsx"></div>
        </div>

        {/* WhatsApp Button */}
        <button onClick={handleWhatsappClick} className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-1 cursor-pointer" type="button" aria-label="Chat with us on WhatsApp" data-unique-id="10d5a75f-b512-40b9-8823-f21aeaba25c8" data-file-name="components/WhatsappWidget.tsx">
          <img src="https://pre-built-images.s3.amazonaws.com/webapp-uploads/a5fae8a035c5f75582a8a407ef516d46.png" alt="WhatsApp" className="w-full h-full object-contain rounded-full pointer-events-none" data-unique-id="3f134b87-d605-4331-a96c-6ceff1699483" data-file-name="components/WhatsappWidget.tsx" />
        </button>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" data-unique-id="a15cfeed-2df2-487a-8de3-c94ce76093ec" data-file-name="components/WhatsappWidget.tsx"></div>
      </div>
    </div>;
}