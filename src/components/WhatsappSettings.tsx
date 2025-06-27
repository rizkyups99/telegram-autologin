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
    return <div className="flex justify-center items-center h-64" data-unique-id="ce6c240a-e32e-40a9-aaf6-0b3efb35ed14" data-file-name="components/WhatsappSettings.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="3e7a0f7d-4f04-47a1-b6e5-b5513f937a64" data-file-name="components/WhatsappSettings.tsx"></div>
      </div>;
  }
  return <div className="space-y-6" data-unique-id="2ede52d4-4dd8-46d2-bf69-2cf71c9a3487" data-file-name="components/WhatsappSettings.tsx">
      <Card data-unique-id="ae7d31f3-7e4a-47a4-ad17-712d44fa509e" data-file-name="components/WhatsappSettings.tsx">
        <CardHeader data-unique-id="a3121af3-834e-45cc-8bd0-ab573051e215" data-file-name="components/WhatsappSettings.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="0def0a6b-8c50-439e-adf4-aac8788d1902" data-file-name="components/WhatsappSettings.tsx">
            <MessageCircle className="h-5 w-5" /><span className="editable-text" data-unique-id="8b3fa3a1-27f5-47c6-adb7-e4c242da5e62" data-file-name="components/WhatsappSettings.tsx">
            WhatsApp Settings
          </span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="280550eb-ef9e-435e-831e-61ec7006a4f5" data-file-name="components/WhatsappSettings.tsx">
            Configure the admin WhatsApp number for customer support
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="0c3a1ffd-88ae-4695-87b3-0480b9cb2a1a" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
          <div className="space-y-4" data-unique-id="f31455fe-f733-4570-ae5c-42728f2433dd" data-file-name="components/WhatsappSettings.tsx">
            <div data-unique-id="4991d59a-86ad-4aba-a3b7-480c1848f0fc" data-file-name="components/WhatsappSettings.tsx">
              <Label htmlFor="phoneNumber" className="block text-sm font-medium mb-1" data-unique-id="b4163eb4-7977-4d20-b258-bfdeac1eb7bf" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="7a388a78-0f91-4b01-a73f-3359817578c2" data-file-name="components/WhatsappSettings.tsx">
                Admin WhatsApp Number
              </span></Label>
              <div className="flex gap-2" data-unique-id="8acca191-a02d-43ef-9fbb-04c2361928ea" data-file-name="components/WhatsappSettings.tsx">
                <div className="flex-1" data-unique-id="543fe0af-bea4-4d93-993e-a62fb9fc9a2d" data-file-name="components/WhatsappSettings.tsx">
                  <Input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="6285716665995" className="w-full" data-unique-id="bd2feabc-ae78-4666-b96d-8df81ce5a386" data-file-name="components/WhatsappSettings.tsx" />
                  <p className="text-xs text-muted-foreground mt-1" data-unique-id="20ae0839-6336-4d68-b1ef-d3ba8c23b0b8" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="7e9677d8-270e-4c6c-b58f-070b6dd89713" data-file-name="components/WhatsappSettings.tsx">
                    Enter phone number with country code (without + sign)
                  </span></p>
                </div>
                <Button variant="outline" onClick={testWhatsappLink} disabled={!phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="cb6601dd-b7db-47b7-9397-77990c264e44" data-file-name="components/WhatsappSettings.tsx">
                  <Phone className="h-4 w-4" /><span className="editable-text" data-unique-id="e53b6df1-2106-4606-8be0-c3a307985bf9" data-file-name="components/WhatsappSettings.tsx">
                  Test
                </span></Button>
              </div>
            </div>

            <div className="flex justify-end" data-unique-id="23234177-840e-49de-8eb1-673660d1e2d5" data-file-name="components/WhatsappSettings.tsx">
              <Button onClick={handleSave} disabled={isSaving || !phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="f60f6fa2-dd08-4962-9a9d-b934fa0ae6be" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
                {isSaving ? <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-unique-id="5266b726-cbba-48cd-b0d9-15303b6d5bd4" data-file-name="components/WhatsappSettings.tsx"></div>
                    Saving...
                  </> : <>
                    <CheckCircle className="h-4 w-4" />
                    Save Settings
                  </>}
              </Button>
            </div>
          </div>

          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} p-3 rounded-md border flex items-center`} data-unique-id="c58554bf-b90b-451e-8276-d3cd258a2767" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="e797ca6c-6efa-44d1-80ee-f8e50a5cb971" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          <div className="bg-blue-50 p-4 rounded-md" data-unique-id="2d06d137-3a4f-449b-a585-5380870a7bb8" data-file-name="components/WhatsappSettings.tsx">
            <h3 className="font-medium text-blue-900 mb-2" data-unique-id="c9c4d7ca-9502-4f3d-a13f-6b86cbf7cf32" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="3fa8fc44-fee2-4687-8dbe-2edc1727ca83" data-file-name="components/WhatsappSettings.tsx">How it works:</span></h3>
            <ul className="text-sm text-blue-800 space-y-1" data-unique-id="467686d6-8be9-48be-be2d-15486ff1d0c4" data-file-name="components/WhatsappSettings.tsx">
              <li data-unique-id="73e2ea4b-9a2e-4d77-9da9-97a40668e2f2" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="aa1e6259-ee65-4e7a-8811-ea9792acd79d" data-file-name="components/WhatsappSettings.tsx">• Users will see a floating WhatsApp widget on the homepage</span></li>
              <li data-unique-id="837e7ebc-6d3c-4681-bd15-877922c27643" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="74d5bfd3-f9f7-4c35-94f8-4b6149909d60" data-file-name="components/WhatsappSettings.tsx">• Clicking the widget will open WhatsApp with your number</span></li>
              <li data-unique-id="05093cc9-81a6-4165-9d74-7b24c4f39cad" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="12ce0dde-8556-4d79-88df-4d4b1e86cc65" data-file-name="components/WhatsappSettings.tsx">• The number can be changed anytime from this settings page</span></li>
              <li data-unique-id="fe587192-6808-4f0e-a633-4d3d6e8e9137" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="03710b6c-3ee2-4c74-8655-a423d57068bf" data-file-name="components/WhatsappSettings.tsx">• Use the "Test" button to verify the WhatsApp link works</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>;
}