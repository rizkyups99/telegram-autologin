'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, Info, Copy, ExternalLink, Shield, Loader, Lock } from 'lucide-react';
import { getSupabaseRLSInstructions, checkStorageBucket } from '@/lib/utils';
export default function SupabaseStorageHelper() {
  const [bucketStatus, setBucketStatus] = useState<Record<string, boolean>>({
    'pdf-covers': false,
    'pdf-files': false,
    'audio-mp3': false
  });
  const [showInstructions, setShowInstructions] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isApplyingPolicies, setIsApplyingPolicies] = useState(false);
  const [policyResult, setPolicyResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  useEffect(() => {
    checkBuckets();
  }, []);
  const checkBuckets = async () => {
    setIsChecking(true);
    const status: Record<string, boolean> = {
      'pdf-covers': false,
      'pdf-files': false,
      'audio-mp3': false
    };
    for (const bucket of ['pdf-covers', 'pdf-files', 'audio-mp3'] as const) {
      status[bucket] = await checkStorageBucket(bucket);
    }
    setBucketStatus(status);
    setIsChecking(false);
  };
  const copyInstructions = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(getSupabaseRLSInstructions());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Function to automatically fix RLS policies for all buckets
  const applyRLSPolicies = async () => {
    setIsApplyingPolicies(true);
    setPolicyResult(null);
    try {
      // Include all known storage buckets
      const allBuckets = ['pdf-covers', 'pdf-files', 'audio-mp3', 'mediaijl'];

      // Try the direct SQL approach first (more reliable)
      const response = await fetch('/api/storage/fix-rls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          buckets: allBuckets
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to apply RLS policies');
      }

      // Check if all operations were successful
      const allSuccess = Object.values(result.results).some((r: any) => r.success);
      if (allSuccess) {
        setPolicyResult({
          success: true,
          message: 'RLS policies successfully applied! You should now have upload permissions. Please refresh the page and try uploading again.'
        });
      } else {
        const failedBuckets = Object.entries(result.results).filter(([_, r]: [string, any]) => !r.success).map(([bucket]: [string, any]) => bucket).join(', ');
        setPolicyResult({
          success: false,
          message: `Failed to apply policies to some buckets: ${failedBuckets}. Please contact your Supabase administrator.`
        });
      }

      // Recheck bucket access status after applying policies
      setTimeout(() => {
        checkBuckets();
      }, 1000);
    } catch (error) {
      console.error('Error applying RLS policies:', error);
      setPolicyResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error applying policies'
      });
    } finally {
      setIsApplyingPolicies(false);
    }
  };
  const allBucketsAccessible = Object.values(bucketStatus).every(Boolean);
  return <Card className="mb-6" data-unique-id="0b2783d8-3601-4450-a803-c9f2cf1b61dd" data-file-name="components/SupabaseStorageHelper.tsx">
      <CardHeader data-unique-id="8dab443d-3c9c-4c1b-88bf-9d2840e0a11c" data-file-name="components/SupabaseStorageHelper.tsx">
        <div className="flex items-center justify-between" data-unique-id="ac4b560f-9d99-4e2b-bf6e-0309c94faa7e" data-file-name="components/SupabaseStorageHelper.tsx">
          <CardTitle className="text-xl" data-unique-id="11ce337e-e1e5-47b7-aecc-348fd55d2d37" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="acfc0747-bbc2-4760-bcc4-3fa3a5e5a7af" data-file-name="components/SupabaseStorageHelper.tsx">Supabase Storage Status</span></CardTitle>
          <Button variant="outline" size="sm" onClick={checkBuckets} disabled={isChecking} data-unique-id="4f07550a-177c-42c4-a748-f14ef33a4571" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
            {isChecking ? 'Checking...' : 'Check Access'}
          </Button>
        </div>
        <CardDescription><span className="editable-text" data-unique-id="00295006-4580-4864-b5ee-04b168a9236b" data-file-name="components/SupabaseStorageHelper.tsx">
          Verify write access to your Supabase storage buckets
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" data-unique-id="5412fed4-261a-41f6-bbb0-d8e8cd4285fd" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="7fa2ec63-99bb-47c9-852b-38e62dd96cab" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
          {Object.entries(bucketStatus).map(([bucket, isAccessible]) => <div key={bucket} className="p-3 bg-muted rounded-md" data-is-mapped="true" data-unique-id="638f814a-7567-4d4c-9e56-3e0e12dc0fcf" data-file-name="components/SupabaseStorageHelper.tsx">
              <div className="flex items-center justify-between mb-1" data-is-mapped="true" data-unique-id="5d54440d-436b-4bd7-8214-7ae98c9441df" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                <span className="font-medium" data-is-mapped="true" data-unique-id="be6bd7e4-1d75-4592-90b1-56fde62f0a1e" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">{bucket}</span>
                {isAccessible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
              </div>
              <p className="text-xs text-muted-foreground" data-is-mapped="true" data-unique-id="1e668a40-9bbf-432b-8913-21f8db79adc5" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1623c625-aa97-4443-a1db-236f557e6ae6" data-file-name="components/SupabaseStorageHelper.tsx">
                Status: </span>{isAccessible ? 'Accessible' : 'Access Error'}
              </p>
            </div>)}
        </div>

        {!allBucketsAccessible && <div className="bg-amber-50 border border-amber-200 p-4 rounded-md" data-unique-id="ef350c32-1169-4790-8276-4506e70273a0" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
            <div className="flex items-start gap-3" data-unique-id="e01a8357-2385-4aa4-9750-7a4bb7cfdfc5" data-file-name="components/SupabaseStorageHelper.tsx">
              <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1" data-unique-id="0686ed72-b0f1-408c-8bee-02705fe36e95" data-file-name="components/SupabaseStorageHelper.tsx">
                <h3 className="font-medium text-amber-800 mb-1" data-unique-id="66cd4aba-c8f8-4f3a-8ee8-b201b1815890" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="8e2037a7-b13e-4bee-85b3-f14f4ccdd1bb" data-file-name="components/SupabaseStorageHelper.tsx">Storage Access Issue Detected</span></h3>
                <p className="text-sm text-amber-700 mb-2" data-unique-id="367e6556-2451-4167-ad54-e0c29b305836" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="a1a08051-aae6-45a9-af06-3dd98ff79517" data-file-name="components/SupabaseStorageHelper.tsx">
                  You need to apply Row Level Security (RLS) policies to allow file uploads to your Supabase storage buckets.
                </span></p>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-3" data-unique-id="88d1a0cc-ec67-48e5-87e0-daa1e65d3cd1" data-file-name="components/SupabaseStorageHelper.tsx">
                  <Button variant="default" size="sm" onClick={applyRLSPolicies} disabled={isApplyingPolicies} className="w-full sm:w-auto" data-unique-id="f900809f-efaf-40a8-af64-eb0ee6a37ee8" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {isApplyingPolicies ? <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Applying Policies...
                      </> : <>
                        <Shield className="h-4 w-4 mr-2" />
                        Apply RLS Policies Automatically
                      </>}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowInstructions(!showInstructions)} className="w-full sm:w-auto mt-2 sm:mt-0" data-unique-id="1a875aca-2393-4c4a-a851-9009e9fb3c39" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {showInstructions ? 'Hide Manual Instructions' : 'Show Manual Instructions'}
                  </Button>
                </div>

                <div className="mt-4 border-t border-amber-200 pt-4" data-unique-id="76c9e22a-2c0b-4def-aac2-be0863143113" data-file-name="components/SupabaseStorageHelper.tsx">
                  <h4 className="font-medium text-amber-800 mb-2" data-unique-id="c8d96df3-e918-4280-ba48-70484208af9f" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="ecfedfca-0042-427d-977c-8957087cfaa8" data-file-name="components/SupabaseStorageHelper.tsx">Emergency Fix</span></h4>
                  <p className="text-sm text-amber-700 mb-3" data-unique-id="c5a4e3ed-3d0d-4c96-8705-0156e08c3396" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="a10b2c60-2bd4-496c-b450-4ccf94d626ca" data-file-name="components/SupabaseStorageHelper.tsx">
                    If all else fails, you can temporarily disable RLS completely. </span><strong data-unique-id="f8efd15d-c946-4e33-9d9f-2d1ea93736a5" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="044b0889-b819-4266-81ad-2f21d0696758" data-file-name="components/SupabaseStorageHelper.tsx">Use with caution</span></strong><span className="editable-text" data-unique-id="74ca7a9e-84ce-4b69-af45-8d822ee410ec" data-file-name="components/SupabaseStorageHelper.tsx"> as this removes all security restrictions.
                  </span></p>
                  <Button variant="destructive" size="sm" onClick={async () => {
                if (confirm("Are you sure? This will disable ALL security restrictions on storage.")) {
                  setIsApplyingPolicies(true);
                  try {
                    const response = await fetch('/api/storage/disable-rls', {
                      method: 'POST'
                    });
                    const result = await response.json();
                    if (response.ok && result.success) {
                      setPolicyResult({
                        success: true,
                        message: "RLS completely disabled! You should now have full access to storage. Refresh the page to see changes."
                      });
                    } else {
                      setPolicyResult({
                        success: false,
                        message: `Failed to disable RLS: ${result.error || 'Unknown error'}`
                      });
                      if (result.sqlInstructions) {
                        alert("Please run this SQL in your Supabase SQL Editor: " + result.sqlInstructions);
                      }
                    }
                  } catch (error) {
                    console.error('Error disabling RLS:', error);
                    setPolicyResult({
                      success: false,
                      message: error instanceof Error ? error.message : 'Unknown error disabling RLS'
                    });
                  } finally {
                    setIsApplyingPolicies(false);
                    setTimeout(() => {
                      checkBuckets();
                    }, 1000);
                  }
                }
              }} className="w-full sm:w-auto" data-unique-id="32f0231d-78a9-4dae-a46d-f5a1bc9ac221" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="1cdbf7dc-2827-4ab9-b224-b96b2fedc82d" data-file-name="components/SupabaseStorageHelper.tsx">
                    Disable RLS Completely
                  </span></Button>
                </div>
              </div>
            </div>

            {policyResult && <div className={`mt-3 ${policyResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} p-3 rounded-md flex items-center`} data-unique-id="84903bd0-a86b-4f12-83f2-5423ef1c60ed" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                {policyResult.success ? <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />}
                <span data-unique-id="78d21227-0944-4011-b58e-7fb17814585c" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">{policyResult.message}</span>
              </div>}

            {showInstructions && <div className="mt-4 bg-white p-3 rounded border border-amber-200" data-unique-id="0d8c4341-be31-43a5-ae7b-e07d68bb6b3e" data-file-name="components/SupabaseStorageHelper.tsx">
                <div className="flex justify-between items-center mb-2" data-unique-id="7a7b0f15-d9bd-4a2f-a800-2bac0659791b" data-file-name="components/SupabaseStorageHelper.tsx">
                  <h4 className="font-medium text-amber-800" data-unique-id="b05bc935-03b5-407a-8f1b-bdcf81c16435" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="954aa14b-4058-4ffd-98f7-03f4be7089d1" data-file-name="components/SupabaseStorageHelper.tsx">RLS Policy Instructions</span></h4>
                  <Button variant="ghost" size="sm" onClick={copyInstructions} className="h-8 text-xs" data-unique-id="76476fd0-11bf-470b-82eb-8e6c8af04552" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {copied ? <>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Copied
                      </> : <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>}
                  </Button>
                </div>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64" data-unique-id="59dcdf8a-e913-428b-90ee-712bfcf92c06" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                  {getSupabaseRLSInstructions()}
                </pre>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open('https://supabase.com/dashboard', '_blank')} data-unique-id="4f3bb2b9-edbe-463c-8062-7bf10a5dd688" data-file-name="components/SupabaseStorageHelper.tsx">
                  <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="23248060-b37e-4ea5-a492-60792e067bc3" data-file-name="components/SupabaseStorageHelper.tsx">
                  Open Supabase Dashboard
                </span></Button>
              </div>}
          </div>}

        {allBucketsAccessible && <div className="bg-green-50 border border-green-200 p-4 rounded-md flex items-center gap-3" data-unique-id="f48addc5-ddb7-4e4b-8414-49338a8ff7d6" data-file-name="components/SupabaseStorageHelper.tsx">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700" data-unique-id="dd85fe4b-6994-4fb6-9cb8-7a1589abcc5f" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="f7c101ab-9b7d-43ac-8c1b-79ab1d045455" data-file-name="components/SupabaseStorageHelper.tsx">
              All storage buckets are accessible and properly configured!
            </span></p>
          </div>}
      </CardContent>
    </Card>;
}