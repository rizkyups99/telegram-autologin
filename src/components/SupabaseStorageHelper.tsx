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
  return <Card className="mb-6" data-unique-id="ee4d15f6-afd4-4589-b7f6-bb24f3a33665" data-file-name="components/SupabaseStorageHelper.tsx">
      <CardHeader data-unique-id="f510560a-80bc-4b35-9334-437776cb5ecf" data-file-name="components/SupabaseStorageHelper.tsx">
        <div className="flex items-center justify-between" data-unique-id="a5a10503-1531-431e-8cef-89325b8257d6" data-file-name="components/SupabaseStorageHelper.tsx">
          <CardTitle className="text-xl" data-unique-id="219f68b5-ff10-41ba-8dc6-d804e72f5e0f" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="0e9bd4aa-78c3-41fe-8eca-182bef499fc4" data-file-name="components/SupabaseStorageHelper.tsx">Supabase Storage Status</span></CardTitle>
          <Button variant="outline" size="sm" onClick={checkBuckets} disabled={isChecking} data-unique-id="2b4b8f16-90f6-4863-ba16-8ae53f5873c3" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
            {isChecking ? 'Checking...' : 'Check Access'}
          </Button>
        </div>
        <CardDescription><span className="editable-text" data-unique-id="b2fa444c-2cef-4638-892a-2eae3153a015" data-file-name="components/SupabaseStorageHelper.tsx">
          Verify write access to your Supabase storage buckets
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" data-unique-id="dee5872a-f749-4424-8333-fb2a445a0755" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="f4379203-1641-44f8-bca1-da87ed3ee547" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
          {Object.entries(bucketStatus).map(([bucket, isAccessible]) => <div key={bucket} className="p-3 bg-muted rounded-md" data-is-mapped="true" data-unique-id="8bf34409-373b-4e10-9cf0-c90ef75d8f0c" data-file-name="components/SupabaseStorageHelper.tsx">
              <div className="flex items-center justify-between mb-1" data-is-mapped="true" data-unique-id="a7cd24a7-3d20-4c55-b0bc-368d41c2e4fa" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                <span className="font-medium" data-is-mapped="true" data-unique-id="adf7a491-18b7-4e5d-b347-dc02cb2cf5b3" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">{bucket}</span>
                {isAccessible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
              </div>
              <p className="text-xs text-muted-foreground" data-is-mapped="true" data-unique-id="72ef8cec-4521-4450-b938-60fe43aa812a" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5dab4065-e965-4303-b75d-6747d9431f7c" data-file-name="components/SupabaseStorageHelper.tsx">
                Status: </span>{isAccessible ? 'Accessible' : 'Access Error'}
              </p>
            </div>)}
        </div>

        {!allBucketsAccessible && <div className="bg-amber-50 border border-amber-200 p-4 rounded-md" data-unique-id="835bc929-12da-49bc-9c42-d6d33a638ddd" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
            <div className="flex items-start gap-3" data-unique-id="56c30424-12ed-4eae-85f5-0b6a73fc64c3" data-file-name="components/SupabaseStorageHelper.tsx">
              <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1" data-unique-id="8ad8bf7a-a156-41e2-af30-3718de31ab88" data-file-name="components/SupabaseStorageHelper.tsx">
                <h3 className="font-medium text-amber-800 mb-1" data-unique-id="5e649673-b9b4-49e4-b851-5174628bd34e" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="10c7f9b4-7402-4881-879e-4b85ee10776a" data-file-name="components/SupabaseStorageHelper.tsx">Storage Access Issue Detected</span></h3>
                <p className="text-sm text-amber-700 mb-2" data-unique-id="5a86e707-1112-48d9-b652-84891069bf5c" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="4b03256b-00dc-4a7a-aea6-0681ab6119ec" data-file-name="components/SupabaseStorageHelper.tsx">
                  You need to apply Row Level Security (RLS) policies to allow file uploads to your Supabase storage buckets.
                </span></p>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-3" data-unique-id="df0999b2-237d-448c-97b2-626adf482aa1" data-file-name="components/SupabaseStorageHelper.tsx">
                  <Button variant="default" size="sm" onClick={applyRLSPolicies} disabled={isApplyingPolicies} className="w-full sm:w-auto" data-unique-id="c9c5c51b-9cc3-471a-a779-af9bf8444903" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {isApplyingPolicies ? <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Applying Policies...
                      </> : <>
                        <Shield className="h-4 w-4 mr-2" />
                        Apply RLS Policies Automatically
                      </>}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowInstructions(!showInstructions)} className="w-full sm:w-auto mt-2 sm:mt-0" data-unique-id="b52b6617-da48-43fe-90ec-b71722e76aaa" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {showInstructions ? 'Hide Manual Instructions' : 'Show Manual Instructions'}
                  </Button>
                </div>

                <div className="mt-4 border-t border-amber-200 pt-4" data-unique-id="b906c48b-a1ab-4acd-b424-add05f898ee8" data-file-name="components/SupabaseStorageHelper.tsx">
                  <h4 className="font-medium text-amber-800 mb-2" data-unique-id="603a4ac6-4ce2-4072-b715-90d305bb5640" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="63f17c4c-4c5d-4fc9-ae9a-b3dfd2d8c055" data-file-name="components/SupabaseStorageHelper.tsx">Emergency Fix</span></h4>
                  <p className="text-sm text-amber-700 mb-3" data-unique-id="4dbe737c-e676-41cc-bb75-64406dd3bee0" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="9008c3d1-a56e-4010-addf-2ca310657820" data-file-name="components/SupabaseStorageHelper.tsx">
                    If all else fails, you can temporarily disable RLS completely. </span><strong data-unique-id="6d2f46ec-5847-4703-8c57-876c4d8eb571" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="d03edf60-1330-409d-997b-e863704b2ef5" data-file-name="components/SupabaseStorageHelper.tsx">Use with caution</span></strong><span className="editable-text" data-unique-id="083083e1-c680-40d2-8128-3f0980a895bb" data-file-name="components/SupabaseStorageHelper.tsx"> as this removes all security restrictions.
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
              }} className="w-full sm:w-auto" data-unique-id="3411620a-5fd1-4b9b-b6c9-a42ca0086bd6" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="b634b681-d601-44bb-82a2-2348c6ac8ec8" data-file-name="components/SupabaseStorageHelper.tsx">
                    Disable RLS Completely
                  </span></Button>
                </div>
              </div>
            </div>

            {policyResult && <div className={`mt-3 ${policyResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} p-3 rounded-md flex items-center`} data-unique-id="54ef3b55-9bc1-4eff-922b-4bf5a63b88d1" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                {policyResult.success ? <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />}
                <span data-unique-id="74f32754-6c94-43d0-8648-204443c42d2e" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">{policyResult.message}</span>
              </div>}

            {showInstructions && <div className="mt-4 bg-white p-3 rounded border border-amber-200" data-unique-id="76d41c03-4413-4154-9aa6-9d8f0aef40ad" data-file-name="components/SupabaseStorageHelper.tsx">
                <div className="flex justify-between items-center mb-2" data-unique-id="f6ab2b9b-07e6-4f66-b4e8-e66fc618e2bb" data-file-name="components/SupabaseStorageHelper.tsx">
                  <h4 className="font-medium text-amber-800" data-unique-id="ee89457c-d805-4f0e-9e34-1a56bd419595" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="62176584-c3af-4d8c-aea3-64c7e86c08de" data-file-name="components/SupabaseStorageHelper.tsx">RLS Policy Instructions</span></h4>
                  <Button variant="ghost" size="sm" onClick={copyInstructions} className="h-8 text-xs" data-unique-id="5941363b-8f7c-4b4d-aa35-816bd268d062" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                    {copied ? <>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Copied
                      </> : <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>}
                  </Button>
                </div>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64" data-unique-id="3baca14b-dfb4-489d-8076-ac9dbf1ba0a6" data-file-name="components/SupabaseStorageHelper.tsx" data-dynamic-text="true">
                  {getSupabaseRLSInstructions()}
                </pre>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open('https://supabase.com/dashboard', '_blank')} data-unique-id="2b343a67-a8cf-4684-a031-4b44177cec60" data-file-name="components/SupabaseStorageHelper.tsx">
                  <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="f33035af-274b-4809-81fb-8fead5f74e14" data-file-name="components/SupabaseStorageHelper.tsx">
                  Open Supabase Dashboard
                </span></Button>
              </div>}
          </div>}

        {allBucketsAccessible && <div className="bg-green-50 border border-green-200 p-4 rounded-md flex items-center gap-3" data-unique-id="d9c60400-4263-4c26-9ae9-0e8040b961ee" data-file-name="components/SupabaseStorageHelper.tsx">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700" data-unique-id="d8c12708-6d65-4c91-aeb1-11ebb0e87568" data-file-name="components/SupabaseStorageHelper.tsx"><span className="editable-text" data-unique-id="0619cb7e-de4d-4c4c-89d1-8bac7e7561a7" data-file-name="components/SupabaseStorageHelper.tsx">
              All storage buckets are accessible and properly configured!
            </span></p>
          </div>}
      </CardContent>
    </Card>;
}