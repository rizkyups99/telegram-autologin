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
    return <div className="flex justify-center items-center h-64" data-unique-id="50a45a46-ca06-4977-b46f-595f6a6a1438" data-file-name="components/WhatsappSettings.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="0607e0f6-249c-459e-a650-0c9985680590" data-file-name="components/WhatsappSettings.tsx"></div>
      </div>;
  }
  return <div className="space-y-6" data-unique-id="cff30211-ffc0-4a05-b9aa-ee2d9505b09f" data-file-name="components/WhatsappSettings.tsx">
      <Card data-unique-id="7171eb2b-7092-4e5d-bb2e-1d84bfb71753" data-file-name="components/WhatsappSettings.tsx">
        <CardHeader data-unique-id="7d9ee8f7-b236-4fe6-a8f7-0b4ee66c5de8" data-file-name="components/WhatsappSettings.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="61cf71c1-f961-45d1-b070-4878a26ea4d9" data-file-name="components/WhatsappSettings.tsx">
            <MessageCircle className="h-5 w-5" /><span className="editable-text" data-unique-id="60583f94-4ed3-4513-b8d9-24e393d958d6" data-file-name="components/WhatsappSettings.tsx">
            WhatsApp Settings
          </span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="24b1a1af-46cb-4328-a96c-37440cdacacc" data-file-name="components/WhatsappSettings.tsx">
            Configure the admin WhatsApp number for customer support
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="c790b797-0121-42d5-a1b6-f1b58811e289" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
          <div className="space-y-4" data-unique-id="108bef27-e78f-449a-85db-9875545b4ff4" data-file-name="components/WhatsappSettings.tsx">
            <div data-unique-id="76affa9f-86eb-42d8-8036-be9ef4890fb4" data-file-name="components/WhatsappSettings.tsx">
              <Label htmlFor="phoneNumber" className="block text-sm font-medium mb-1" data-unique-id="89a34bd9-473b-4414-8663-961f99233a62" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="a2162b55-5d7a-4191-9070-5577e48b133f" data-file-name="components/WhatsappSettings.tsx">
                Admin WhatsApp Number
              </span></Label>
              <div className="flex gap-2" data-unique-id="19bae8ca-3a47-4712-8ac0-67842d8b4863" data-file-name="components/WhatsappSettings.tsx">
                <div className="flex-1" data-unique-id="7d56bbc0-71ab-4416-9543-9ae38a07d19d" data-file-name="components/WhatsappSettings.tsx">
                  <Input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="6285716665995" className="w-full" data-unique-id="bfab7e4e-1c8f-4d6d-8287-0d4726f48016" data-file-name="components/WhatsappSettings.tsx" />
                  <p className="text-xs text-muted-foreground mt-1" data-unique-id="cfe9a203-5f63-4482-ade0-4a9398ff4f13" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="d79ce1f9-31d4-4c61-a9f5-e3c914a4cc34" data-file-name="components/WhatsappSettings.tsx">
                    Enter phone number with country code (without + sign)
                  </span></p>
                </div>
                <Button variant="outline" onClick={testWhatsappLink} disabled={!phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="b4905269-06c3-4819-ba67-f393d35506e0" data-file-name="components/WhatsappSettings.tsx">
                  <Phone className="h-4 w-4" /><span className="editable-text" data-unique-id="4dda9b54-e2dd-4367-a72c-9313ba66f914" data-file-name="components/WhatsappSettings.tsx">
                  Test
                </span></Button>
              </div>
            </div>

            <div className="flex justify-end" data-unique-id="f2bbdf50-729b-426c-9524-148a9647af6c" data-file-name="components/WhatsappSettings.tsx">
              <Button onClick={handleSave} disabled={isSaving || !phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="53a6620e-1521-4b85-a78e-04e3b7f3f00c" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
                {isSaving ? <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-unique-id="d0d91a51-99ca-4567-8b44-1f132ee93435" data-file-name="components/WhatsappSettings.tsx"></div>
                    Saving...
                  </> : <>
                    <CheckCircle className="h-4 w-4" />
                    Save Settings
                  </>}
              </Button>
            </div>
          </div>

          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} p-3 rounded-md border flex items-center`} data-unique-id="6aac66a7-91cb-4ec9-a544-e30356487446" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="21da12bf-e0ff-468d-9652-929278f115b8" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          <div className="bg-blue-50 p-4 rounded-md" data-unique-id="a59c6f39-d971-4501-89c9-ab8c25ba134b" data-file-name="components/WhatsappSettings.tsx">
            <h3 className="font-medium text-blue-900 mb-2" data-unique-id="a0becfc7-02eb-4e54-a93e-19563d914fce" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="1d9e07d5-74be-4006-b412-42844e1aa399" data-file-name="components/WhatsappSettings.tsx">How it works:</span></h3>
            <ul className="text-sm text-blue-800 space-y-1" data-unique-id="313f44c7-bf76-4e01-9b28-3c39fa400fc9" data-file-name="components/WhatsappSettings.tsx">
              <li data-unique-id="40004e50-6b71-4c19-abe6-18144029a303" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="8cdb7f13-d54d-44bb-add1-5c5444552855" data-file-name="components/WhatsappSettings.tsx">• Users will see a floating WhatsApp widget on the homepage</span></li>
              <li data-unique-id="ccd0ea78-169a-4aee-832f-cdc557fa9682" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="72879d38-2541-49cc-81bd-a8ecb34b82f8" data-file-name="components/WhatsappSettings.tsx">• Clicking the widget will open WhatsApp with your number</span></li>
              <li data-unique-id="63cd55bf-1f19-400b-900b-1ec96b136ecd" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="fc4975df-75cf-4c7c-93f7-3df7f3dc9a5e" data-file-name="components/WhatsappSettings.tsx">• The number can be changed anytime from this settings page</span></li>
              <li data-unique-id="24f6c4ff-9fd0-4462-80b0-ead9b9bf4b9f" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="c184f21b-184b-4afa-99e4-8bb24cbf85d4" data-file-name="components/WhatsappSettings.tsx">• Use the "Test" button to verify the WhatsApp link works</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>;
}