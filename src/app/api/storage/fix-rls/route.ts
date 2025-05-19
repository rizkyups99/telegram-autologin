import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { supabase, supabaseAdmin } from "@/db/supabase";

export async function POST(request: Request) {
  try {
    const { buckets } = await request.json();
    const results: Record<string, any> = {};

    // Log the attempt
    console.log(`Attempting to fix RLS policies for buckets: ${buckets.join(', ')}`);

    // First try the Supabase Admin API approach
    try {
      // Try to use direct SQL for RLS policies
      for (const bucket of buckets) {
        try {
          // Define policy name consistently
          const policyName = `allow_all_access_${bucket.replace(/-/g, '_')}`;
          
          // Try to drop existing policy if it exists
          try {
            console.log(`Dropping existing policy for bucket ${bucket} if it exists`);
            await db.execute(sql`DROP POLICY IF EXISTS "${policyName}" ON "storage"."objects";`);
          } catch (dropError) {
            console.warn(`Error dropping existing policy for ${bucket}:`, dropError);
            // Continue regardless - policy might not exist
          }

          // Create a comprehensive policy with ALL permissions (read, write, update, delete)
          console.log(`Creating comprehensive RLS policy for bucket ${bucket}`);
          await db.execute(sql`
            CREATE POLICY "${policyName}" ON "storage"."objects"
            FOR ALL 
            TO authenticated
            USING (bucket_id = '${bucket}')
            WITH CHECK (bucket_id = '${bucket}');
          `);

          // Also try creating separate policies for each operation type to ensure coverage
          const operationTypes = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
          for (const op of operationTypes) {
            const opPolicyName = `${policyName}_${op.toLowerCase()}`;
            try {
              await db.execute(sql`
                DROP POLICY IF EXISTS "${opPolicyName}" ON "storage"."objects";
                CREATE POLICY "${opPolicyName}" ON "storage"."objects"
                FOR ${sql.raw(op)} 
                TO authenticated
                USING (bucket_id = '${bucket}')
                ${op !== 'SELECT' ? sql`WITH CHECK (bucket_id = '${bucket}')` : sql``};
              `);
            } catch (opError) {
              console.warn(`Warning: Could not create ${op} policy for ${bucket}:`, opError);
              // Continue with other operations
            }
          }

          console.log(`Successfully created policies for ${bucket}`);
          results[bucket] = {
            success: true,
            message: `Policies for ${bucket} created successfully`
          };
        } catch (bucketError) {
          console.error(`Error applying policy to ${bucket}:`, bucketError);
          results[bucket] = {
            success: false,
            error: bucketError instanceof Error ? bucketError.message : String(bucketError),
          };
        }
      }
    } catch (sqlError) {
      console.error("SQL policy creation failed, trying Supabase approach:", sqlError);
      
      // Fallback to Supabase's built-in RLS policy management
      for (const bucket of buckets) {
        try {
          // This is a fallback approach using Supabase's RPC function
          const { error: rpcError } = await supabaseAdmin.rpc('create_storage_policy', {
            bucket_name: bucket,
            policy_definition: 'true' // Allow all operations
          });
          
          if (rpcError) {
            console.error(`Error with RPC approach for ${bucket}:`, rpcError);
            // If RPC failed but SQL succeeded, don't override success
            if (!results[bucket]?.success) {
              results[bucket] = {
                success: false,
                error: rpcError.message
              };
            }
          } else if (!results[bucket]?.success) {
            results[bucket] = {
              success: true,
              message: `Policy for ${bucket} created via RPC`
            };
          }
        } catch (rpcError) {
          console.error(`Error with RPC fallback for ${bucket}:`, rpcError);
          // Only set error if we don't already have success
          if (!results[bucket]?.success) {
            results[bucket] = {
              success: false,
              error: rpcError instanceof Error ? rpcError.message : String(rpcError)
            };
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Error applying storage policies:", error);
    return NextResponse.json(
      { error: "Failed to apply storage policies", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
