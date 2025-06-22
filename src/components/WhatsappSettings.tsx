'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle, CheckCircle, MessageCircle, Phone } from 'lucide-react';
export default function WhatsappSettings() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  useEffect(() => {
    fetchWhatsappSettings();
  }, []);
  const fetchWhatsappSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/whatsapp-settings');
      if (!response.ok) throw new Error('Failed to fetch WhatsApp settings');
      const data = await response.json();
      setPhoneNumber(data.phoneNumber);
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to load WhatsApp settings'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSave = async () => {
    if (!phoneNumber.trim()) {
      setStatusMessage({
        type: 'error',
        message: 'Phone number is required'
      });
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
      setStatusMessage({
        type: 'error',
        message: 'Please enter a valid phone number (10-15 digits)'
      });
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/whatsapp-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\D/g, '')
        })
      });
      const responseData = await response.json();
      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || responseData.details || 'Failed to save settings');
      }
      setStatusMessage({
        type: 'success',
        message: 'WhatsApp settings saved successfully'
      });

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving WhatsApp settings:', error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save settings'
      });
    } finally {
      setIsSaving(false);
    }
  };
  const testWhatsappLink = () => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanNumber}&text&type=phone_number&app_absent=0`;
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };
  if (isLoading) {
    return <div className="flex justify-center items-center h-64" data-unique-id="0d764a04-dcdc-4f15-868d-d3f3b810b275" data-file-name="components/WhatsappSettings.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="04429cb7-a8ec-4cbf-995d-23d7ec125d09" data-file-name="components/WhatsappSettings.tsx"></div>
      </div>;
  }
  return <div className="space-y-6" data-unique-id="b6318e11-2dc6-4f8b-b89e-84824036434b" data-file-name="components/WhatsappSettings.tsx">
      <Card data-unique-id="a8b46527-d7e1-40ae-95a7-cec8f4403eb8" data-file-name="components/WhatsappSettings.tsx">
        <CardHeader data-unique-id="1ee10c96-4642-4133-89b2-f61e4730dbc5" data-file-name="components/WhatsappSettings.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="b0c4cd17-5eaf-4d8b-a37e-8d59408888ab" data-file-name="components/WhatsappSettings.tsx">
            <MessageCircle className="h-5 w-5" /><span className="editable-text" data-unique-id="95b7cef9-37cb-4377-a2f9-3268b5488464" data-file-name="components/WhatsappSettings.tsx">
            WhatsApp Settings
          </span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="5841f77a-3243-4dc6-8a57-6696434cfa0e" data-file-name="components/WhatsappSettings.tsx">
            Configure the admin WhatsApp number for customer support
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="2d4d0407-b954-4682-afa1-791085a47604" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
          <div className="space-y-4" data-unique-id="c737ec34-3400-43f3-8049-2ad73e08b82c" data-file-name="components/WhatsappSettings.tsx">
            <div data-unique-id="c0267cfc-3f34-467b-8349-994ef423085a" data-file-name="components/WhatsappSettings.tsx">
              <Label htmlFor="phoneNumber" className="block text-sm font-medium mb-1" data-unique-id="12c1c931-495a-41d8-a361-1355799ae005" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="0f81530f-a81a-43e6-979a-23bdb32f4634" data-file-name="components/WhatsappSettings.tsx">
                Admin WhatsApp Number
              </span></Label>
              <div className="flex gap-2" data-unique-id="34f3f4a2-a58a-4fa9-a2f8-f46c968fc285" data-file-name="components/WhatsappSettings.tsx">
                <div className="flex-1" data-unique-id="ccf0cac8-9b24-4bf7-a0e0-04c6a8c493ac" data-file-name="components/WhatsappSettings.tsx">
                  <Input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="6285716665995" className="w-full" data-unique-id="e98e5936-0ffb-4744-a1a2-a0e2d4bdf653" data-file-name="components/WhatsappSettings.tsx" />
                  <p className="text-xs text-muted-foreground mt-1" data-unique-id="ae2ddc4d-f320-49ba-ac86-2c6bce515a73" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="6a9d3fee-e85e-485c-b9f3-0f8c6e37360e" data-file-name="components/WhatsappSettings.tsx">
                    Enter phone number with country code (without + sign)
                  </span></p>
                </div>
                <Button variant="outline" onClick={testWhatsappLink} disabled={!phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="2ae36576-7be8-4f11-8c56-5bbd39aaec89" data-file-name="components/WhatsappSettings.tsx">
                  <Phone className="h-4 w-4" /><span className="editable-text" data-unique-id="044337c4-23c2-4b83-b8b8-cc5932da7a9f" data-file-name="components/WhatsappSettings.tsx">
                  Test
                </span></Button>
              </div>
            </div>

            <div className="flex justify-end" data-unique-id="b18a125f-4616-4576-929f-9b0ccde20fb7" data-file-name="components/WhatsappSettings.tsx">
              <Button onClick={handleSave} disabled={isSaving || !phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="6d34c486-c4ab-4a7e-b029-caacef86f9b4" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
                {isSaving ? <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-unique-id="4ca5b225-c75d-4334-98a5-0e3739269b7d" data-file-name="components/WhatsappSettings.tsx"></div>
                    Saving...
                  </> : <>
                    <CheckCircle className="h-4 w-4" />
                    Save Settings
                  </>}
              </Button>
            </div>
          </div>

          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} p-3 rounded-md border flex items-center`} data-unique-id="730339ff-a319-4170-8b39-0a2dee956af3" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="0df00733-03a8-429d-83ae-04904330375f" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          <div className="bg-blue-50 p-4 rounded-md" data-unique-id="8a2377e2-d4ae-4838-ade1-27d106276509" data-file-name="components/WhatsappSettings.tsx">
            <h3 className="font-medium text-blue-900 mb-2" data-unique-id="375d1562-ab83-47da-a2cf-69cae41cd8a5" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="6f3ab811-87fe-4ff1-a2b6-c7b32388c511" data-file-name="components/WhatsappSettings.tsx">How it works:</span></h3>
            <ul className="text-sm text-blue-800 space-y-1" data-unique-id="00940a6b-a54c-4373-8a36-6c58bb2aa414" data-file-name="components/WhatsappSettings.tsx">
              <li data-unique-id="2db051aa-9f6d-43dc-8ac7-2f318edec46e" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="0fb2e4a6-4cea-47bb-aea5-cda96a179ad1" data-file-name="components/WhatsappSettings.tsx">• Users will see a floating WhatsApp widget on the homepage</span></li>
              <li data-unique-id="430e5663-7864-44b5-a717-03c50980319e" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="6ab6aad8-1f9b-4bb7-b4bb-f107a041ccc9" data-file-name="components/WhatsappSettings.tsx">• Clicking the widget will open WhatsApp with your number</span></li>
              <li data-unique-id="a7bf452a-770c-482b-8b6e-4b5208650661" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="6f20e769-d37b-4123-b932-ca8ef96623f7" data-file-name="components/WhatsappSettings.tsx">• The number can be changed anytime from this settings page</span></li>
              <li data-unique-id="85bb76b4-3164-48e4-a683-159a6fc7854e" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="71cc6132-6f07-452f-8f46-7e6afccd3bb2" data-file-name="components/WhatsappSettings.tsx">• Use the "Test" button to verify the WhatsApp link works</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>;
}