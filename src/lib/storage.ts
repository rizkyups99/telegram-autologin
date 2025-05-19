'use client';

import { supabase, supabaseAdmin } from "@/db/supabase";

export type StorageBucket = 'pdf-covers' | 'pdf-files' | 'audio-mp3';

export interface UploadResponse {
  url: string;
  path: string;
  size: number;
  fileName: string;
}

export interface ProgressCallback {
  (progress: number): void;
}

/**
 * Uploads a file to Supabase Storage
 * @param file File to upload
 * @param bucket Storage bucket name
 * @param onProgress Optional callback for progress updates
 * @returns Promise with upload response
 */
export async function uploadToStorage(
  file: File,
  bucket: StorageBucket,
  onProgress?: ProgressCallback
): Promise<UploadResponse> {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    const maxSizeMB = 300; // 300MB limit
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
    }
    
    // Log upload attempt for debugging
    console.log(`Attempting to upload file to ${bucket}:`, {
      fileName: file.name,
      fileType: file.type,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });
    
    // Verify Supabase client is initialized
    if (!supabase || !supabase.storage) {
      throw new Error('Supabase client not properly initialized');
    }

    // Create a unique file path using timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    
    // Get file extension and sanitize it
    const fileExtension = (file.name.split('.').pop() || '').toLowerCase();
    
    // Create a unique file name with sanitized extension
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;
    
    // Add progressive upload reporting simulation
    if (onProgress) {
      onProgress(10); // Started
      setTimeout(() => onProgress(30), 300);
      setTimeout(() => onProgress(50), 600);
    }

    // Skip bucket creation since buckets already exist manually
    // Just log which bucket we're using
    console.log(`Using existing ${bucket} bucket for upload...`);
    
    // More progress updates
    if (onProgress) {
      setTimeout(() => onProgress(70), 900);
    }
    
    // Upload the file to Supabase Storage using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(`${fileName}`, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite if exists
        contentType: file.type, // Explicitly set content type
      });

    if (onProgress) {
      onProgress(90);
    }

    if (error) {
      // Handle RLS policy error specifically
      if (error.message.includes('row-level security') || error.message.includes('RLS') || error.message.includes('permission')) {
        console.error('Row Level Security (RLS) policy error:', error);
        throw new Error(`Storage permission error: You don't have permission to upload to this bucket. Please use the "Apply RLS Policies Automatically" button or "Disable RLS Completely" in the Storage Helper to fix this issue.`);
      } else {
        console.error('Supabase upload error details:', {
          message: error.message,
          error
        });
        throw new Error(`Upload failed: ${error.message}`);
      }
    }
    
    if (!data || !data.path) {
      throw new Error('Upload failed: No data returned from Supabase');
    }

    // Get the public URL for the file
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    if (!urlData || !urlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    // Complete progress
    if (onProgress) {
      onProgress(100);
    }

    console.log(`Upload to ${bucket} successful:`, {
      path: data.path,
      publicUrl: urlData.publicUrl
    });

    return {
      url: urlData.publicUrl,
      path: data.path,
      size: file.size,
      fileName: file.name
    };
  } catch (error) {
    // Enhanced error reporting
    console.error('Storage upload error details:', {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      file: {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
      },
      bucket
    });
    
    // Provide more helpful error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    throw new Error(`Upload failed: ${errorMessage}`);
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param path File path to delete
 * @param bucket Storage bucket name
 * @returns Promise with success status
 */
export async function deleteFromStorage(path: string, bucket: StorageBucket): Promise<boolean> {
  try {
    // Extract the filename from the URL or path
    const fileName = path.split('/').pop();
    
    if (!fileName) {
      throw new Error('Invalid file path');
    }
    
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([fileName]);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Storage delete error:', error);
    return false;
  }
}
