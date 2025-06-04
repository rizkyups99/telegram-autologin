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
    return <div className="flex justify-center items-center h-64" data-unique-id="91f2fdf4-e33f-4c35-a997-c32e3dc410ce" data-file-name="components/WhatsappSettings.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="360f373d-4589-480f-8eb4-64a98ebe95f8" data-file-name="components/WhatsappSettings.tsx"></div>
      </div>;
  }
  return <div className="space-y-6" data-unique-id="9c449448-a0f0-457b-b154-1fb32354418f" data-file-name="components/WhatsappSettings.tsx">
      <Card data-unique-id="5c6b12a1-940a-425b-8405-809a8f455a0d" data-file-name="components/WhatsappSettings.tsx">
        <CardHeader data-unique-id="a0fccb16-3c00-4e53-abeb-fd3b71893fd7" data-file-name="components/WhatsappSettings.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="22144be0-34db-422d-8e62-cf1de92d2781" data-file-name="components/WhatsappSettings.tsx">
            <MessageCircle className="h-5 w-5" /><span className="editable-text" data-unique-id="3f974ba9-a29b-47c8-b390-b23b99d84b17" data-file-name="components/WhatsappSettings.tsx">
            WhatsApp Settings
          </span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="3fa64bc5-cc1f-4910-a0f2-5fa772b5cc28" data-file-name="components/WhatsappSettings.tsx">
            Configure the admin WhatsApp number for customer support
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="1035e8c8-0b7f-4a84-afe2-133409a6bfb6" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
          <div className="space-y-4" data-unique-id="f15d874e-12ef-4a7a-b17e-c3d73d400e44" data-file-name="components/WhatsappSettings.tsx">
            <div data-unique-id="b5db62f7-b749-4dc6-84a8-1aaed31294f4" data-file-name="components/WhatsappSettings.tsx">
              <Label htmlFor="phoneNumber" className="block text-sm font-medium mb-1" data-unique-id="a63ffe02-180b-4aad-ab20-6883e7f00bfa" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="47c04071-c60e-44fe-af79-42b2296917e1" data-file-name="components/WhatsappSettings.tsx">
                Admin WhatsApp Number
              </span></Label>
              <div className="flex gap-2" data-unique-id="088fdef7-d55e-49d5-826a-a1fc8d306e55" data-file-name="components/WhatsappSettings.tsx">
                <div className="flex-1" data-unique-id="a6fb85c3-de25-4399-b9e2-96c61939cad0" data-file-name="components/WhatsappSettings.tsx">
                  <Input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="6285716665995" className="w-full" data-unique-id="e6a37244-dcfa-472f-ab10-fde3ffdf1d40" data-file-name="components/WhatsappSettings.tsx" />
                  <p className="text-xs text-muted-foreground mt-1" data-unique-id="2ecc9b31-57b5-48c6-8a6a-2ea5ae566a40" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="58fd4ead-4f02-42ea-a206-de4582b7f4f4" data-file-name="components/WhatsappSettings.tsx">
                    Enter phone number with country code (without + sign)
                  </span></p>
                </div>
                <Button variant="outline" onClick={testWhatsappLink} disabled={!phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="57309abe-293b-4ccf-a265-5e0e202c2db9" data-file-name="components/WhatsappSettings.tsx">
                  <Phone className="h-4 w-4" /><span className="editable-text" data-unique-id="c0fb7ab0-31c7-45c1-a757-9fec7cb6b1b3" data-file-name="components/WhatsappSettings.tsx">
                  Test
                </span></Button>
              </div>
            </div>

            <div className="flex justify-end" data-unique-id="eaa4af96-5197-4afb-9add-537fa8785b72" data-file-name="components/WhatsappSettings.tsx">
              <Button onClick={handleSave} disabled={isSaving || !phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="e3e5bc87-90b2-4e7d-b533-e481f7e2594f" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
                {isSaving ? <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-unique-id="fb43842e-434a-4e81-a85d-42d13d4c55d8" data-file-name="components/WhatsappSettings.tsx"></div>
                    Saving...
                  </> : <>
                    <CheckCircle className="h-4 w-4" />
                    Save Settings
                  </>}
              </Button>
            </div>
          </div>

          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} p-3 rounded-md border flex items-center`} data-unique-id="ac8dcc84-e7d5-490a-8b27-abf96eac7342" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="56c778f7-7fc9-4fdf-ba20-e60f8828d3c2" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          <div className="bg-blue-50 p-4 rounded-md" data-unique-id="72d86f5d-9113-4e41-9760-a124d7024c5f" data-file-name="components/WhatsappSettings.tsx">
            <h3 className="font-medium text-blue-900 mb-2" data-unique-id="99d31c70-c940-432a-88a8-2b3cc0c35522" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="5df8ba7f-27d3-4792-8b7a-0215d02fd681" data-file-name="components/WhatsappSettings.tsx">How it works:</span></h3>
            <ul className="text-sm text-blue-800 space-y-1" data-unique-id="38a67aa3-df2a-4a6b-8329-6bc2e1d40c67" data-file-name="components/WhatsappSettings.tsx">
              <li data-unique-id="ea053181-00ca-4778-bc1b-4c3881e44a00" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="7deb34b0-2b12-4592-8925-46703981f0ca" data-file-name="components/WhatsappSettings.tsx">• Users will see a floating WhatsApp widget on the homepage</span></li>
              <li data-unique-id="9e7a686a-437a-4d33-ac94-cc1154925f49" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="cc42b069-8fb7-4237-a404-06f1251e8af4" data-file-name="components/WhatsappSettings.tsx">• Clicking the widget will open WhatsApp with your number</span></li>
              <li data-unique-id="6345aaaa-6d1e-4e57-ba4c-e5768e2145c5" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="e8cb9177-9c47-4dc0-abd6-77189159f5a9" data-file-name="components/WhatsappSettings.tsx">• The number can be changed anytime from this settings page</span></li>
              <li data-unique-id="a63df583-97ac-48cc-a519-5cc7e61e0314" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="d61cc77b-6656-458d-ab80-c23585f79918" data-file-name="components/WhatsappSettings.tsx">• Use the "Test" button to verify the WhatsApp link works</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>;
}