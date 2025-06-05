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
    return <div className="flex justify-center items-center h-64" data-unique-id="e034fc4e-0838-4647-8be4-64e000693328" data-file-name="components/WhatsappSettings.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="86234a35-bca4-4dec-a65e-25bff0bbd5e9" data-file-name="components/WhatsappSettings.tsx"></div>
      </div>;
  }
  return <div className="space-y-6" data-unique-id="34fb2590-44aa-4580-b6e5-65732e70c925" data-file-name="components/WhatsappSettings.tsx">
      <Card data-unique-id="9b340ace-ab2a-4876-8be6-683d664c7b77" data-file-name="components/WhatsappSettings.tsx">
        <CardHeader data-unique-id="6938227b-02b8-4517-a7d3-ddc900f1e166" data-file-name="components/WhatsappSettings.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="62b2c1be-5f41-42a4-9aff-92c8fc903ba1" data-file-name="components/WhatsappSettings.tsx">
            <MessageCircle className="h-5 w-5" /><span className="editable-text" data-unique-id="135d76e3-fad8-480b-9e66-30578dd783b5" data-file-name="components/WhatsappSettings.tsx">
            WhatsApp Settings
          </span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="de12e150-a3a9-4851-878b-8d52449a9b19" data-file-name="components/WhatsappSettings.tsx">
            Configure the admin WhatsApp number for customer support
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="5f7d2877-6b8c-4b60-b10c-58f1a05b8746" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
          <div className="space-y-4" data-unique-id="04e8db2b-b1d7-4e65-b89f-23813685ed56" data-file-name="components/WhatsappSettings.tsx">
            <div data-unique-id="a66d8143-579d-4735-b35e-4511d3ae75b8" data-file-name="components/WhatsappSettings.tsx">
              <Label htmlFor="phoneNumber" className="block text-sm font-medium mb-1" data-unique-id="bb01a1be-b9a1-4a24-816f-1a01a0844707" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="2c4a8a55-e077-4e6c-8bfb-d85e45bff283" data-file-name="components/WhatsappSettings.tsx">
                Admin WhatsApp Number
              </span></Label>
              <div className="flex gap-2" data-unique-id="3f8cdb68-10ac-4568-9d05-dd9642b7ff0e" data-file-name="components/WhatsappSettings.tsx">
                <div className="flex-1" data-unique-id="2ad89a33-308b-4597-a28f-d3249658e340" data-file-name="components/WhatsappSettings.tsx">
                  <Input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="6285716665995" className="w-full" data-unique-id="26f30156-8bd7-4733-948b-7cf5280c43b5" data-file-name="components/WhatsappSettings.tsx" />
                  <p className="text-xs text-muted-foreground mt-1" data-unique-id="77584e98-8009-4dc6-a28b-436ff7c72c16" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="d726581e-efef-479d-8905-1fc861826e4e" data-file-name="components/WhatsappSettings.tsx">
                    Enter phone number with country code (without + sign)
                  </span></p>
                </div>
                <Button variant="outline" onClick={testWhatsappLink} disabled={!phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="19acd3b0-8d9a-4021-8f64-e9b85a4150fa" data-file-name="components/WhatsappSettings.tsx">
                  <Phone className="h-4 w-4" /><span className="editable-text" data-unique-id="9987b411-eec4-42fc-9c5c-b74ba4346f5c" data-file-name="components/WhatsappSettings.tsx">
                  Test
                </span></Button>
              </div>
            </div>

            <div className="flex justify-end" data-unique-id="e7d3055d-8e8a-48ed-9cf1-07cdf3e97115" data-file-name="components/WhatsappSettings.tsx">
              <Button onClick={handleSave} disabled={isSaving || !phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="26a70481-f052-4f36-8cc8-5e5fa339a6f1" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
                {isSaving ? <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-unique-id="7e7f9711-aa5c-45d4-8980-42a17f77f99b" data-file-name="components/WhatsappSettings.tsx"></div>
                    Saving...
                  </> : <>
                    <CheckCircle className="h-4 w-4" />
                    Save Settings
                  </>}
              </Button>
            </div>
          </div>

          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} p-3 rounded-md border flex items-center`} data-unique-id="b90fc14c-8900-485f-a019-1b47953b9ec7" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="f9dcb147-8725-4071-9f66-d06b63b466cd" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          <div className="bg-blue-50 p-4 rounded-md" data-unique-id="58a4c6d0-153d-4b2b-b7ec-9b3d7122187e" data-file-name="components/WhatsappSettings.tsx">
            <h3 className="font-medium text-blue-900 mb-2" data-unique-id="f5d0f5e0-a338-4e14-a07a-675fb0819231" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="4460e161-e08b-41e8-b5b3-305c01735331" data-file-name="components/WhatsappSettings.tsx">How it works:</span></h3>
            <ul className="text-sm text-blue-800 space-y-1" data-unique-id="dcf2f6c0-df70-46f9-8754-5096dc830ea3" data-file-name="components/WhatsappSettings.tsx">
              <li data-unique-id="81fef31f-ffbd-42ae-bb34-bcd86ab0792c" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="5ceca9f9-5f5e-4056-b29c-ad7d1bebb21e" data-file-name="components/WhatsappSettings.tsx">• Users will see a floating WhatsApp widget on the homepage</span></li>
              <li data-unique-id="928c8cd8-58c1-4f0d-9193-ddbcea0a9143" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="f1af5f47-95a7-403e-a040-5c3a7958937c" data-file-name="components/WhatsappSettings.tsx">• Clicking the widget will open WhatsApp with your number</span></li>
              <li data-unique-id="8d042cbf-8379-4359-bddb-f1f97f786d17" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="606c9bde-2b12-412e-a003-c3ffb25b6641" data-file-name="components/WhatsappSettings.tsx">• The number can be changed anytime from this settings page</span></li>
              <li data-unique-id="af1536c5-fd4f-4eec-a8e7-e6a16b26e3f7" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="77ced07a-ac86-4299-979b-7a73dbcaa1d3" data-file-name="components/WhatsappSettings.tsx">• Use the "Test" button to verify the WhatsApp link works</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>;
}