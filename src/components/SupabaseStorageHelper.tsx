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
    'audio-mp3': false,
  });
  const [showInstructions, setShowInstructions] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isApplyingPolicies, setIsApplyingPolicies] = useState(false);
  const [policyResult, setPolicyResult] = useState<{success: boolean, message: string} | null>(null);

  useEffect(() => {
    checkBuckets();
  }, []);

  const checkBuckets = async () => {
    setIsChecking(true);
    const status: Record<string, boolean> = {
      'pdf-covers': false,
      'pdf-files': false,
      'audio-mp3': false,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buckets: allBuckets
        }),
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
        const failedBuckets = Object.entries(result.results)
          .filter(([_, r]: [string, any]) => !r.success)
          .map(([bucket]: [string, any]) => bucket)
          .join(', ');
          
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Supabase Storage Status</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkBuckets}
            disabled={isChecking}
          >
            {isChecking ? 'Checking...' : 'Check Access'}
          </Button>
        </div>
        <CardDescription>
          Verify write access to your Supabase storage buckets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(bucketStatus).map(([bucket, isAccessible]) => (
            <div key={bucket} className="p-3 bg-muted rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{bucket}</span>
                {isAccessible ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Status: {isAccessible ? 'Accessible' : 'Access Error'}
              </p>
            </div>
          ))}
        </div>

        {!allBucketsAccessible && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-amber-800 mb-1">Storage Access Issue Detected</h3>
                <p className="text-sm text-amber-700 mb-2">
                  You need to apply Row Level Security (RLS) policies to allow file uploads to your Supabase storage buckets.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-3">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={applyRLSPolicies}
                    disabled={isApplyingPolicies}
                    className="w-full sm:w-auto"
                  >
                    {isApplyingPolicies ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Applying Policies...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Apply RLS Policies Automatically
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    {showInstructions ? 'Hide Manual Instructions' : 'Show Manual Instructions'}
                  </Button>
                </div>

                <div className="mt-4 border-t border-amber-200 pt-4">
                  <h4 className="font-medium text-amber-800 mb-2">Emergency Fix</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    If all else fails, you can temporarily disable RLS completely. <strong>Use with caution</strong> as this removes all security restrictions.
                  </p>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={async () => {
                      if (confirm("Are you sure? This will disable ALL security restrictions on storage.")) {
                        setIsApplyingPolicies(true);
                        try {
                          const response = await fetch('/api/storage/disable-rls', {
                            method: 'POST',
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
                    }}
                    className="w-full sm:w-auto"
                  >
                    Disable RLS Completely
                  </Button>
                </div>
              </div>
            </div>

            {policyResult && (
              <div className={`mt-3 ${policyResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} p-3 rounded-md flex items-center`}>
                {policyResult.success ? (
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                )}
                <span>{policyResult.message}</span>
              </div>
            )}

            {showInstructions && (
              <div className="mt-4 bg-white p-3 rounded border border-amber-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-amber-800">RLS Policy Instructions</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyInstructions}
                    className="h-8 text-xs"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">
                  {getSupabaseRLSInstructions()}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Supabase Dashboard
                </Button>
              </div>
            )}
          </div>
        )}

        {allBucketsAccessible && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-md flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700">
              All storage buckets are accessible and properly configured!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
