export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
}

/**
 * Uploads a file to Cloudinary using a specific preset through our backend proxy
 * to avoid CORS issues
 * @param file The file to upload
 * @param preset The upload preset to use ('pdf_covers', 'pdf_files', or 'audio_mp3')
 * @returns Promise with the Cloudinary response
 */
export async function uploadToCloudinary(
  file: File,
  preset: 'pdf_covers' | 'pdf_files' | 'audio_mp3',
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResponse> {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type based on preset
    if (preset === 'pdf_covers' && !file.type.includes('image/')) {
      throw new Error('Cover file must be an image (JPG, PNG, etc.)');
    }
    
    if (preset === 'pdf_files' && !file.type.includes('pdf')) {
      throw new Error('File must be a PDF document');
    }
    
    if (preset === 'audio_mp3' && !file.type.includes('audio/')) {
      throw new Error('File must be an audio file');
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('preset', preset);
    
    // Add unique identifier based on file name and timestamp
    const originalFileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 8);
    
    formData.append('timestamp', String(timestamp));
    formData.append('original_filename', originalFileName);
    formData.append('unique_id', uniqueId);

    console.log(`Uploading file "${file.name}" with unique ID: ${uniqueId}`);

    // Create an XMLHttpRequest to track upload progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Setup progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            
            // Validate response data
            if (!data.secure_url) {
              reject(new Error('Invalid response from upload service'));
              return;
            }
            
            // Log success with file info
            console.log(`Successfully uploaded to Cloudinary: ${file.name} → ${data.secure_url}`);
            console.log(`Public ID: ${data.public_id}`);
            
            resolve(data);
          } catch (e) {
            reject(new Error('Failed to parse response from server'));
          }
        } else {
          let errorMessage = `Upload failed with status ${xhr.status}`;
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            // Ignore parsing errors
          }
          reject(new Error(errorMessage));
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('Network error during upload'));
      };
      
      xhr.open('POST', '/api/upload', true);
      xhr.setRequestHeader('Accept', 'application/json');
      
      // Send the form data
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Upload error:', error);
    throw error instanceof Error ? error : new Error('Upload failed');
  }
}
