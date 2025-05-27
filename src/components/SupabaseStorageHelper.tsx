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
  return <Card className="mb-6" data-unique-id="5f378ddc-a90d-4236-9c53-8b8664142aa0" data-file-name="components/SupabaseStorageHelper.tsx">
      <CardHeader data-unique-id="c4967f65-a3ac-41d3-bbb2-5e065bb4f715" data-file-name="components/SupabaseStorageHelper.tsx">
        <div className="flex items-center justify-between" data-unique-id="32e20c71-c9f9-4033-bf8f-a18103270231" data-file-name="components/SupabaseStorageHelper.tsx">
          <CardTitle className="text-xl" data-unique-id="8b997242-f1b0-45c9-9758-fb1c51906093" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="a80e6c35-18db-4287-b84c-94041863b1d0" data-file-name="components/SupabaseStorageHelper.tsx">Supabase Storage Status</span></CardTitle>
          <Button variant="outline" size="sm" onClick={checkBuckets} disabled={isChecking} data-unique-id="21ae6341-3d3a-4191-8a98-b5b06473035c" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
            {isChecking ? 'Checking...' : 'Check Access'}
          </Button>
        </div>
        <CardDescription><span className="editable-text" data-unique-id="383faa6a-cd47-4f53-8669-4639a50cb7c1" data-file-name="components/SupabaseStorageHelper.tsx">
          Verify write access to your Supabase storage buckets
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" data-unique-id="824bae6a-e8d3-41ac-80f3-85b2b167a4d3" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="7c208b15-d65c-446d-9cb4-de033bfd3ba1" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
          {Object.entries(bucketStatus).map(([bucket, isAccessible]) => <div key={bucket} className="p-3 bg-muted rounded-md" data-is-mapped="true" data-unique-id="2a1eaaab-0577-437d-bd64-6d59dfd7b19e" data-file-name="components/SupabaseStorageHelper.tsx">
              <div className="flex items-center justify-between mb-1" data-is-mapped="true" data-unique-id="95c02eef-f081-4985-b224-e302fb14caa1" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                <span className="font-medium" data-is-mapped="true" data-unique-id="0c2b0e19-ecdf-4d17-b32a-68909e0b8e60" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">{bucket}</span>
                {isAccessible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
              </div>
              <p className="text-xs text-muted-foreground" data-is-mapped="true" data-unique-id="602860bc-9ca9-4753-aa7a-c9d5c470c969" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="42117391-fbb8-45ad-9b0d-af9a4c941b2c" data-file-name="components/SupabaseStorageHelper.tsx">
                Status: </span>{isAccessible ? 'Accessible' : 'Access Error'}
              </p>
            </div>)}
        </div>

        {!allBucketsAccessible && <div className="bg-amber-50 border border-amber-200 p-4 rounded-md" data-unique-id="477fccfd-340b-404a-a036-1f905a95a26a" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
            <div className="flex items-start gap-3" data-unique-id="c2486d20-5d55-4da5-933b-4de4cae18d8d" data-file-name="components/SupabaseStorageHelper.tsx">
              <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1" data-unique-id="9849ca4c-5f28-4042-adef-3a250ceaaa5d" data-file-name="components/SupabaseStorageHelper.tsx">
                <h3 className="font-medium text-amber-800 mb-1" data-unique-id="c0562071-15ce-4d12-b6a8-570a5be72967" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="57a13718-61d2-4ff3-83b5-e312ee2f3f50" data-file-name="components/SupabaseStorageHelper.tsx">Storage Access Issue Detected</span></h3>
                <p className="text-sm text-amber-700 mb-2" data-unique-id="b03d5e2b-a0b8-4df3-9e2c-b3d974a30942" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="30c372a9-1716-449b-a127-0a4b5466446e" data-file-name="components/SupabaseStorageHelper.tsx">
                  You need to apply Row Level Security (RLS) policies to allow file uploads to your Supabase storage buckets.
                </span></p>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-3" data-unique-id="12014113-a2ca-4e5a-b639-048ac9b2a12d" data-file-name="components/SupabaseStorageHelper.tsx">
                  <Button variant="default" size="sm" onClick={applyRLSPolicies} disabled={isApplyingPolicies} className="w-full sm:w-auto" data-unique-id="eb68a14a-e8cd-48bc-9870-e498e54efdff" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {isApplyingPolicies ? <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Applying Policies...
                      </> : <>
                        <Shield className="h-4 w-4 mr-2" />
                        Apply RLS Policies Automatically
                      </>}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowInstructions(!showInstructions)} className="w-full sm:w-auto mt-2 sm:mt-0" data-unique-id="6ec4c067-73c3-45de-be59-19fe1c8f7e0b" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {showInstructions ? 'Hide Manual Instructions' : 'Show Manual Instructions'}
                  </Button>
                </div>

                <div className="mt-4 border-t border-amber-200 pt-4" data-unique-id="fcaa24c2-fc10-4b5d-b497-cdd4703244ef" data-file-name="components/SupabaseStorageHelper.tsx">
                  <h4 className="font-medium text-amber-800 mb-2" data-unique-id="b19dd650-7eb1-422a-80c9-76bfe3cf9584" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="9f5e9770-4bb3-4bca-80ac-c894d8bbe021" data-file-name="components/SupabaseStorageHelper.tsx">Emergency Fix</span></h4>
                  <p className="text-sm text-amber-700 mb-3" data-unique-id="d85304aa-600c-4963-b13f-e8ce6765fa5a" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="7d9ab7cc-4a76-42be-a7c6-a00780030b83" data-file-name="components/SupabaseStorageHelper.tsx">
                    If all else fails, you can temporarily disable RLS completely. </span><strong data-unique-id="28f9c459-6a9b-4cc7-a8fe-9f41165ebd8c" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="c40660fe-816f-4410-8d29-98ed152b06ec" data-file-name="components/SupabaseStorageHelper.tsx">Use with caution</span></strong><span className="editable-text" data-unique-id="698d2af5-3fc1-4ccd-b085-8c026581997b" data-file-name="components/SupabaseStorageHelper.tsx"> as this removes all security restrictions.
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
              }} className="w-full sm:w-auto" data-unique-id="5787f305-4937-438d-9805-b3bd992cad5a" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="cfa8db82-1bb4-46dc-92f7-c34deaf212a8" data-file-name="components/SupabaseStorageHelper.tsx">
                    Disable RLS Completely
                  </span></Button>
                </div>
              </div>
            </div>

            {policyResult && <div className={`mt-3 ${policyResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} p-3 rounded-md flex items-center`} data-unique-id="6fd3c062-6653-4f86-9c66-0791633bf67f" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                {policyResult.success ? <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />}
                <span data-unique-id="67b91cd7-193d-41ce-8267-92d4fd2fe6e8" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">{policyResult.message}</span>
              </div>}

            {showInstructions && <div className="mt-4 bg-white p-3 rounded border border-amber-200" data-unique-id="76e41e87-01a6-4bb2-a945-9573f7e5a472" data-file-name="components/SupabaseStorageHelper.tsx">
                <div className="flex justify-between items-center mb-2" data-unique-id="4c3790c8-c38e-4a28-83d0-eec0105e75cd" data-file-name="components/SupabaseStorageHelper.tsx">
                  <h4 className="font-medium text-amber-800" data-unique-id="52037a0d-844b-4b51-9128-0d1764dfbfdb" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="37567532-8306-4d4b-8eea-944ea867f661" data-file-name="components/SupabaseStorageHelper.tsx">RLS Policy Instructions</span></h4>
                  <Button variant="ghost" size="sm" onClick={copyInstructions} className="h-8 text-xs" data-unique-id="6a00be44-40dd-4883-a05e-bf879f89b0f9" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {copied ? <>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Copied
                      </> : <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>}
                  </Button>
                </div>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64" data-unique-id="98b9f058-6351-4243-b9a9-3fd48b72dfe4" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                  {getSupabaseRLSInstructions()}
                </pre>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open('https://supabase.com/dashboard', '_blank')} data-unique-id="4753270b-d902-4a07-8892-d649005d7264" data-file-name="components/SupabaseStorageHelper.tsx">
                  <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="ec1811db-daa3-4bf0-a421-9b3ebc29ddea" data-file-name="components/SupabaseStorageHelper.tsx">
                  Open Supabase Dashboard
                </span></Button>
              </div>}
          </div>}

        {allBucketsAccessible && <div className="bg-green-50 border border-green-200 p-4 rounded-md flex items-center gap-3" data-unique-id="4cf5497c-26af-4245-9984-1f5e05830090" data-file-name="components/SupabaseStorageHelper.tsx">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700" data-unique-id="a3aa091b-83d6-4ee1-ae60-232195253048" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="b890b71b-9fe7-4bfa-8b19-730c0ae0edab" data-file-name="components/SupabaseStorageHelper.tsx">
              All storage buckets are accessible and properly configured!
            </span></p>
          </div>}
      </CardContent>
    </Card>;
}