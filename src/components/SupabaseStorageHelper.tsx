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
  return <Card className="mb-6" data-unique-id="55a6662e-d8eb-4059-9670-91684152c9f7" data-file-name="components/SupabaseStorageHelper.tsx">
      <CardHeader data-unique-id="4ed763ac-5654-4785-ad68-5a0aff744913" data-file-name="components/SupabaseStorageHelper.tsx">
        <div className="flex items-center justify-between" data-unique-id="b7356586-40b3-4a48-afd9-73c72c4e6240" data-file-name="components/SupabaseStorageHelper.tsx">
          <CardTitle className="text-xl" data-unique-id="6b9ca951-d9cb-4013-99c0-8c6e5d48bc06" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="42964f5f-e10c-4dcc-a1be-e48a427a0f3c" data-file-name="components/SupabaseStorageHelper.tsx">Supabase Storage Status</span></CardTitle>
          <Button variant="outline" size="sm" onClick={checkBuckets} disabled={isChecking} data-unique-id="7cd92b12-0e9c-4528-abb2-9340a06350d7" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
            {isChecking ? 'Checking...' : 'Check Access'}
          </Button>
        </div>
        <CardDescription><span className="editable-text" data-unique-id="e628403b-bc2b-4d8f-8921-8a8e65430623" data-file-name="components/SupabaseStorageHelper.tsx">
          Verify write access to your Supabase storage buckets
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" data-unique-id="9906db3b-3448-41a3-98bd-94cfd0859639" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="716d60b9-413f-4b5f-bb24-77e6b4f7f214" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
          {Object.entries(bucketStatus).map(([bucket, isAccessible]) => <div key={bucket} className="p-3 bg-muted rounded-md" data-is-mapped="true" data-unique-id="cf4bbc9a-17d6-4d6f-bfa2-b2608994364b" data-file-name="components/SupabaseStorageHelper.tsx">
              <div className="flex items-center justify-between mb-1" data-is-mapped="true" data-unique-id="8234be26-8e6b-4659-8405-ca227e35570a" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                <span className="font-medium" data-is-mapped="true" data-unique-id="ad6a3b34-4635-4065-8875-ea62d10389fa" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">{bucket}</span>
                {isAccessible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
              </div>
              <p className="text-xs text-muted-foreground" data-is-mapped="true" data-unique-id="0a183349-b1b3-43b8-9c71-a1bfb8caf544" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a33f9920-19cf-4ab3-8510-a37fc5fc0b88" data-file-name="components/SupabaseStorageHelper.tsx">
                Status: </span>{isAccessible ? 'Accessible' : 'Access Error'}
              </p>
            </div>)}
        </div>

        {!allBucketsAccessible && <div className="bg-amber-50 border border-amber-200 p-4 rounded-md" data-unique-id="7e788ee2-6c91-4384-ad6d-8c7cfdbd7c22" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
            <div className="flex items-start gap-3" data-unique-id="10cfb41e-eed1-4e6d-a62e-dce30b55b7bf" data-file-name="components/SupabaseStorageHelper.tsx">
              <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1" data-unique-id="494cab77-5d53-40bc-b21c-efe3cdbfda9f" data-file-name="components/SupabaseStorageHelper.tsx">
                <h3 className="font-medium text-amber-800 mb-1" data-unique-id="bdb46b39-c30d-4f38-8acf-0bb223d1f7b6" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="8e3b6982-03cb-486a-a883-f879145b0948" data-file-name="components/SupabaseStorageHelper.tsx">Storage Access Issue Detected</span></h3>
                <p className="text-sm text-amber-700 mb-2" data-unique-id="f4ac4a62-c75b-4de7-9b77-b3e50c80bcb4" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="a8cff197-6bd1-477e-b379-f4b738dd54b5" data-file-name="components/SupabaseStorageHelper.tsx">
                  You need to apply Row Level Security (RLS) policies to allow file uploads to your Supabase storage buckets.
                </span></p>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-3" data-unique-id="fd1f5e98-837d-4026-99d8-1abad64e067e" data-file-name="components/SupabaseStorageHelper.tsx">
                  <Button variant="default" size="sm" onClick={applyRLSPolicies} disabled={isApplyingPolicies} className="w-full sm:w-auto" data-unique-id="e44a30a8-2f6e-4bcf-9799-fbd1ef335dbb" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {isApplyingPolicies ? <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Applying Policies...
                      </> : <>
                        <Shield className="h-4 w-4 mr-2" />
                        Apply RLS Policies Automatically
                      </>}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowInstructions(!showInstructions)} className="w-full sm:w-auto mt-2 sm:mt-0" data-unique-id="b0622b78-b8f3-432a-b218-d43dacc434a0" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {showInstructions ? 'Hide Manual Instructions' : 'Show Manual Instructions'}
                  </Button>
                </div>

                <div className="mt-4 border-t border-amber-200 pt-4" data-unique-id="f4086e1b-9e68-4b2d-bbd7-afe2aaee45e0" data-file-name="components/SupabaseStorageHelper.tsx">
                  <h4 className="font-medium text-amber-800 mb-2" data-unique-id="15f0cbba-873f-41e9-81e7-550394076ba4" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="26cc6664-7384-4498-afc5-4f9586b44306" data-file-name="components/SupabaseStorageHelper.tsx">Emergency Fix</span></h4>
                  <p className="text-sm text-amber-700 mb-3" data-unique-id="cc5d36bf-43db-463b-9f96-dab94a554a9e" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="2fcb55eb-4a4d-491f-becd-5060558b0e73" data-file-name="components/SupabaseStorageHelper.tsx">
                    If all else fails, you can temporarily disable RLS completely. </span><strong data-unique-id="548345e6-7524-4671-82a1-a399d05b39a8" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="0f98d459-fa8b-462c-9cb7-9fd20c77229e" data-file-name="components/SupabaseStorageHelper.tsx">Use with caution</span></strong><span className="editable-text" data-unique-id="2ac714d2-5dda-4e9c-bad7-acb6cc4f6921" data-file-name="components/SupabaseStorageHelper.tsx"> as this removes all security restrictions.
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
              }} className="w-full sm:w-auto" data-unique-id="625a5ae2-ee5a-4a98-a5d4-d0e8f33bb9cc" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="2bcfdf8c-98fc-48d4-8ff3-5eda31e089f8" data-file-name="components/SupabaseStorageHelper.tsx">
                    Disable RLS Completely
                  </span></Button>
                </div>
              </div>
            </div>

            {policyResult && <div className={`mt-3 ${policyResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} p-3 rounded-md flex items-center`} data-unique-id="b7e1f1cf-1d65-42d9-837e-c59cfdaa37ed" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                {policyResult.success ? <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />}
                <span data-unique-id="68fb9b30-8c04-4ea2-8775-902ec1f767c0" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">{policyResult.message}</span>
              </div>}

            {showInstructions && <div className="mt-4 bg-white p-3 rounded border border-amber-200" data-unique-id="78f51489-5c5e-4305-bc3b-427b7aa73bbf" data-file-name="components/SupabaseStorageHelper.tsx">
                <div className="flex justify-between items-center mb-2" data-unique-id="9d2e7933-4d0b-48d8-9a6e-4709b0161f4f" data-file-name="components/SupabaseStorageHelper.tsx">
                  <h4 className="font-medium text-amber-800" data-unique-id="d27554b7-8329-478b-99a2-020ff8f4ce38" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="d4ff5265-e17f-4860-9943-92d641cee437" data-file-name="components/SupabaseStorageHelper.tsx">RLS Policy Instructions</span></h4>
                  <Button variant="ghost" size="sm" onClick={copyInstructions} className="h-8 text-xs" data-unique-id="f2127c27-bb6f-4b20-92c2-9e79f7fe0cf9" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {copied ? <>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Copied
                      </> : <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>}
                  </Button>
                </div>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64" data-unique-id="758304b2-4684-496e-9e25-ba5b2b53c667" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                  {getSupabaseRLSInstructions()}
                </pre>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open('https://supabase.com/dashboard', '_blank')} data-unique-id="93f261d2-bb38-45e5-835e-fd94b6b402ef" data-file-name="components/SupabaseStorageHelper.tsx">
                  <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="9166b6d0-136e-48dc-8e0a-632f77784e95" data-file-name="components/SupabaseStorageHelper.tsx">
                  Open Supabase Dashboard
                </span></Button>
              </div>}
          </div>}

        {allBucketsAccessible && <div className="bg-green-50 border border-green-200 p-4 rounded-md flex items-center gap-3" data-unique-id="431fe31a-168c-4b23-9a25-57b1679d2d29" data-file-name="components/SupabaseStorageHelper.tsx">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700" data-unique-id="4889d522-1d37-41de-9e84-a80d07b2b764" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="d22e9dc9-40c1-43a1-9ada-ab61e8236746" data-file-name="components/SupabaseStorageHelper.tsx">
              All storage buckets are accessible and properly configured!
            </span></p>
          </div>}
      </CardContent>
    </Card>;
}