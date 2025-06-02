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
    return <div className="flex justify-center items-center h-64" data-unique-id="7e6ec13e-34a0-4621-82de-c07fa6d7dfec" data-file-name="components/WhatsappSettings.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="68aeb161-15d9-4d69-9aef-b1934d857cf1" data-file-name="components/WhatsappSettings.tsx"></div>
      </div>;
  }
  return <div className="space-y-6" data-unique-id="124e151f-a9b2-40b9-b17a-60a986bbffd1" data-file-name="components/WhatsappSettings.tsx">
      <Card data-unique-id="6056b108-42f9-4674-940a-c604a5011ada" data-file-name="components/WhatsappSettings.tsx">
        <CardHeader data-unique-id="39dfae86-a655-49fe-9da7-4fa35061d31b" data-file-name="components/WhatsappSettings.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="548722e1-e7dd-4579-8dc3-3740afe9272c" data-file-name="components/WhatsappSettings.tsx">
            <MessageCircle className="h-5 w-5" /><span className="editable-text" data-unique-id="b4ba5745-ce11-4780-90d4-0dc37552e8b7" data-file-name="components/WhatsappSettings.tsx">
            WhatsApp Settings
          </span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="070dd3a9-bb53-4b40-bfbc-f89d122dcf6d" data-file-name="components/WhatsappSettings.tsx">
            Configure the admin WhatsApp number for customer support
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="1f54763d-92d5-4425-80f8-56fa1cc8cdac" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
          <div className="space-y-4" data-unique-id="4e832356-fa95-4c06-a2ec-eda6f6afa6e6" data-file-name="components/WhatsappSettings.tsx">
            <div data-unique-id="3975e401-1444-4d07-ad04-51b991a8edf8" data-file-name="components/WhatsappSettings.tsx">
              <Label htmlFor="phoneNumber" className="block text-sm font-medium mb-1" data-unique-id="c2d2450b-7586-4e2b-a367-39e68d698997" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="cb315b28-05ab-47b0-81bd-82cf04559733" data-file-name="components/WhatsappSettings.tsx">
                Admin WhatsApp Number
              </span></Label>
              <div className="flex gap-2" data-unique-id="f4361c80-fbe5-4666-9770-74a27ce364eb" data-file-name="components/WhatsappSettings.tsx">
                <div className="flex-1" data-unique-id="fe4c99f8-b166-480a-ab62-b26b767ce0a3" data-file-name="components/WhatsappSettings.tsx">
                  <Input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="6285716665995" className="w-full" data-unique-id="de5ae035-8d71-48cc-b607-0f57488d6dcd" data-file-name="components/WhatsappSettings.tsx" />
                  <p className="text-xs text-muted-foreground mt-1" data-unique-id="7a743195-7293-4039-9be1-9a32ea6e7589" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="cb9ed746-9ed4-4c6a-996c-9be33974f968" data-file-name="components/WhatsappSettings.tsx">
                    Enter phone number with country code (without + sign)
                  </span></p>
                </div>
                <Button variant="outline" onClick={testWhatsappLink} disabled={!phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="a3a98769-229a-4658-b2df-f1cfede81ce5" data-file-name="components/WhatsappSettings.tsx">
                  <Phone className="h-4 w-4" /><span className="editable-text" data-unique-id="d6137291-cf80-4063-b3fa-fed1e233d68f" data-file-name="components/WhatsappSettings.tsx">
                  Test
                </span></Button>
              </div>
            </div>

            <div className="flex justify-end" data-unique-id="f4967f36-0112-41c7-9803-158d1de0c490" data-file-name="components/WhatsappSettings.tsx">
              <Button onClick={handleSave} disabled={isSaving || !phoneNumber.trim()} className="flex items-center gap-2" data-unique-id="3caf8fc7-c2a4-42e1-8d94-5eec6c40c9e4" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
                {isSaving ? <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-unique-id="892d83f9-5649-49d0-9674-cc4d77d49a2d" data-file-name="components/WhatsappSettings.tsx"></div>
                    Saving...
                  </> : <>
                    <CheckCircle className="h-4 w-4" />
                    Save Settings
                  </>}
              </Button>
            </div>
          </div>

          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} p-3 rounded-md border flex items-center`} data-unique-id="f39616b9-e841-4c5c-8e3b-6f6c74f8ef2f" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="2737311c-3ce3-4319-95a9-6854e788c824" data-file-name="components/WhatsappSettings.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          <div className="bg-blue-50 p-4 rounded-md" data-unique-id="7a46c32f-931e-4246-8188-327d857489b6" data-file-name="components/WhatsappSettings.tsx">
            <h3 className="font-medium text-blue-900 mb-2" data-unique-id="2f1999ad-a317-4864-aec6-520b4f6f744b" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="881f7e67-1925-4abe-91ed-b35f3c4252be" data-file-name="components/WhatsappSettings.tsx">How it works:</span></h3>
            <ul className="text-sm text-blue-800 space-y-1" data-unique-id="b676c205-6dd4-4406-b7d4-14509c0ddc2f" data-file-name="components/WhatsappSettings.tsx">
              <li data-unique-id="0811f484-0f32-4a7f-b492-6a59086519d5" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="801ce815-1c3a-4f05-bdf7-e89f90c9784c" data-file-name="components/WhatsappSettings.tsx">• Users will see a floating WhatsApp widget on the homepage</span></li>
              <li data-unique-id="e3dbed3c-da3c-4135-8289-035edaf5fd25" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="05fa5493-99d6-487a-8a8b-55c23a3cada7" data-file-name="components/WhatsappSettings.tsx">• Clicking the widget will open WhatsApp with your number</span></li>
              <li data-unique-id="04667276-bcfa-410f-ad07-e28cef573c2a" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="2ec36abc-95c4-4cb3-99f4-42ded2ecfd39" data-file-name="components/WhatsappSettings.tsx">• The number can be changed anytime from this settings page</span></li>
              <li data-unique-id="3a0208dc-90d0-43d3-a983-d299c3704d54" data-file-name="components/WhatsappSettings.tsx"><span className="editable-text" data-unique-id="2499bc09-c816-4493-9575-081edeb67738" data-file-name="components/WhatsappSettings.tsx">• Use the "Test" button to verify the WhatsApp link works</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>;
}