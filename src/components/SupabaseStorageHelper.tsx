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
  return <Card className="mb-6" data-unique-id="16724b99-78e7-4ad3-a574-0502fdd2e1f0" data-file-name="components/SupabaseStorageHelper.tsx">
      <CardHeader data-unique-id="f6f8560e-4ef0-4f33-9aa2-2285225476a8" data-file-name="components/SupabaseStorageHelper.tsx">
        <div className="flex items-center justify-between" data-unique-id="d85dcfff-aad0-4b35-be3f-17ccbc945104" data-file-name="components/SupabaseStorageHelper.tsx">
          <CardTitle className="text-xl" data-unique-id="841af360-16da-457b-ab85-0b69228c28d4" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="e8b1ca30-f40a-4b7d-95ad-7aae532d1ebb" data-file-name="components/SupabaseStorageHelper.tsx">Supabase Storage Status</span></CardTitle>
          <Button variant="outline" size="sm" onClick={checkBuckets} disabled={isChecking} data-unique-id="ac1f05f3-47d4-403c-a0ec-702a32e2e9f0" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
            {isChecking ? 'Checking...' : 'Check Access'}
          </Button>
        </div>
        <CardDescription><span className="editable-text" data-unique-id="80d4d0b4-4b7b-4c84-8d66-ad0503fa5a2b" data-file-name="components/SupabaseStorageHelper.tsx">
          Verify write access to your Supabase storage buckets
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" data-unique-id="3e87fd01-190e-479a-ac27-cb09e76e2bac" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="bf3dab1f-1355-4d0f-843f-496a44ce420c" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
          {Object.entries(bucketStatus).map(([bucket, isAccessible]) => <div key={bucket} className="p-3 bg-muted rounded-md" data-is-mapped="true" data-unique-id="4fa21d71-8c85-4882-a616-22f1fb168684" data-file-name="components/SupabaseStorageHelper.tsx">
              <div className="flex items-center justify-between mb-1" data-is-mapped="true" data-unique-id="c735e056-32b9-4d95-b24c-231955b0c730" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                <span className="font-medium" data-is-mapped="true" data-unique-id="bb4d9849-acbf-46fc-b811-02504b770797" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">{bucket}</span>
                {isAccessible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
              </div>
              <p className="text-xs text-muted-foreground" data-is-mapped="true" data-unique-id="a66f17d0-716a-41cb-92eb-d24cbb21804d" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f19c0221-f461-466f-9274-49df1ab65547" data-file-name="components/SupabaseStorageHelper.tsx">
                Status: </span>{isAccessible ? 'Accessible' : 'Access Error'}
              </p>
            </div>)}
        </div>

        {!allBucketsAccessible && <div className="bg-amber-50 border border-amber-200 p-4 rounded-md" data-unique-id="1a206b3d-ab4c-446b-9a6d-95d229187790" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
            <div className="flex items-start gap-3" data-unique-id="7a23ec0c-e1be-4ffa-8ff2-b2e5043f19fa" data-file-name="components/SupabaseStorageHelper.tsx">
              <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1" data-unique-id="535290ce-7ee3-412e-a71e-564b9056b9e2" data-file-name="components/SupabaseStorageHelper.tsx">
                <h3 className="font-medium text-amber-800 mb-1" data-unique-id="ae152027-6e08-47a1-8a4f-f33a90178911" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="ac72bded-4d19-4e03-a1b8-a7dc03201b2c" data-file-name="components/SupabaseStorageHelper.tsx">Storage Access Issue Detected</span></h3>
                <p className="text-sm text-amber-700 mb-2" data-unique-id="c3c411c1-4d59-486c-a39d-fa0869677743" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="ebe7d664-6d07-4083-bcd5-33b10ef5962d" data-file-name="components/SupabaseStorageHelper.tsx">
                  You need to apply Row Level Security (RLS) policies to allow file uploads to your Supabase storage buckets.
                </span></p>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-3" data-unique-id="58cafce7-1068-49ed-8cd7-57ff51175fab" data-file-name="components/SupabaseStorageHelper.tsx">
                  <Button variant="default" size="sm" onClick={applyRLSPolicies} disabled={isApplyingPolicies} className="w-full sm:w-auto" data-unique-id="c9fd3d19-376e-4c0d-bad2-7b0cb93e0fd6" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {isApplyingPolicies ? <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Applying Policies...
                      </> : <>
                        <Shield className="h-4 w-4 mr-2" />
                        Apply RLS Policies Automatically
                      </>}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowInstructions(!showInstructions)} className="w-full sm:w-auto mt-2 sm:mt-0" data-unique-id="50c2ff32-48ee-40a1-84f8-ea26d87b851d" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {showInstructions ? 'Hide Manual Instructions' : 'Show Manual Instructions'}
                  </Button>
                </div>

                <div className="mt-4 border-t border-amber-200 pt-4" data-unique-id="d847d3d3-3724-4d4c-bb98-f5e9acbd131b" data-file-name="components/SupabaseStorageHelper.tsx">
                  <h4 className="font-medium text-amber-800 mb-2" data-unique-id="0769760c-fe4a-499b-9984-901a5d042476" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="f0a1e5da-0935-4648-a935-54816cbd83d1" data-file-name="components/SupabaseStorageHelper.tsx">Emergency Fix</span></h4>
                  <p className="text-sm text-amber-700 mb-3" data-unique-id="54519731-7a13-466e-9bea-1e54b707b939" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="f36cdeb9-835f-4704-b742-cfe8c5111aa7" data-file-name="components/SupabaseStorageHelper.tsx">
                    If all else fails, you can temporarily disable RLS completely. </span><strong data-unique-id="a63bc9e0-7d08-4278-8f24-3847c2fee734" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="e310d2aa-d298-45f0-ba5c-e0528230b7b3" data-file-name="components/SupabaseStorageHelper.tsx">Use with caution</span></strong><span className="editable-text" data-unique-id="c112b9b0-bd23-4ce9-9850-b301cc289175" data-file-name="components/SupabaseStorageHelper.tsx"> as this removes all security restrictions.
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
              }} className="w-full sm:w-auto" data-unique-id="64881b27-bf62-483d-be23-0905c75d943c" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="1bb64e57-eba3-4e4d-80f6-800eeb159ef5" data-file-name="components/SupabaseStorageHelper.tsx">
                    Disable RLS Completely
                  </span></Button>
                </div>
              </div>
            </div>

            {policyResult && <div className={`mt-3 ${policyResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} p-3 rounded-md flex items-center`} data-unique-id="f80ce4e4-ff19-4b73-898a-eb547c9c5066" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                {policyResult.success ? <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />}
                <span data-unique-id="32ad4a3f-596b-4fda-92e7-1c9fa32565b4" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">{policyResult.message}</span>
              </div>}

            {showInstructions && <div className="mt-4 bg-white p-3 rounded border border-amber-200" data-unique-id="baabd550-2415-4d59-ba55-a39c906fb74f" data-file-name="components/SupabaseStorageHelper.tsx">
                <div className="flex justify-between items-center mb-2" data-unique-id="97816941-a415-49b2-9500-212663f91da0" data-file-name="components/SupabaseStorageHelper.tsx">
                  <h4 className="font-medium text-amber-800" data-unique-id="8fd8164f-70a9-4cf2-b2de-30000fd7bf0f" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="83658f1e-096a-4f1f-a5ff-61995474ffe0" data-file-name="components/SupabaseStorageHelper.tsx">RLS Policy Instructions</span></h4>
                  <Button variant="ghost" size="sm" onClick={copyInstructions} className="h-8 text-xs" data-unique-id="7e97912f-628b-4911-914e-ca9398cc0caf" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {copied ? <>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Copied
                      </> : <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>}
                  </Button>
                </div>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64" data-unique-id="4ff10cc9-879f-4ad6-9876-e317bccaa3a0" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                  {getSupabaseRLSInstructions()}
                </pre>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open('https://supabase.com/dashboard', '_blank')} data-unique-id="dd227edc-c5df-4052-a584-9a7c36ceab8c" data-file-name="components/SupabaseStorageHelper.tsx">
                  <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="9f58fa7f-9f82-4633-a7d5-b37804abf632" data-file-name="components/SupabaseStorageHelper.tsx">
                  Open Supabase Dashboard
                </span></Button>
              </div>}
          </div>}

        {allBucketsAccessible && <div className="bg-green-50 border border-green-200 p-4 rounded-md flex items-center gap-3" data-unique-id="7ddd578a-6850-4f7d-aaa2-9b5ed99f0d9c" data-file-name="components/SupabaseStorageHelper.tsx">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700" data-unique-id="fc585efe-6c97-4c97-a93a-2be61dee2f3e" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="acbd6ece-6413-4f0e-9ac4-14e588e449f5" data-file-name="components/SupabaseStorageHelper.tsx">
              All storage buckets are accessible and properly configured!
            </span></p>
          </div>}
      </CardContent>
    </Card>;
}