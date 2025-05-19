'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle, Upload, FileText, Image, ExternalLink, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { uploadToStorage } from "@/lib/storage";
import PDFRecoveryTool from "./PDFRecoveryTool";
import SupabaseStorageHelper from "./SupabaseStorageHelper";

interface Category {
  id: number;
  name: string;
}

interface PDF {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
}

export default function PDFManager() {
  const [pdfs, setPDFs] = useState<PDF[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPDF, setEditingPDF] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    coverFile: null as File | null,
    pdfFile: null as File | null,
    coverUrl: "",
    fileUrl: ""
  });
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Calculated pagination values
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    // Center current page when possible
    let startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return startPage + i;
  }).filter(num => num > 0 && num <= totalPages);

  useEffect(() => {
    fetchCategories();
    fetchPDFs();
  }, [currentPage, itemsPerPage]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Gagal mengambil data kategori");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError("Error memuat data kategori. Silakan coba lagi nanti.");
      console.error(err);
    }
  };

  const fetchPDFs = async (title?: string, categoryId?: string) => {
    setIsLoading(true);
    try {
      let url = "/api/pdfs";
      const params = new URLSearchParams();
      
      if (title) params.append("title", title);
      if (categoryId) params.append("categoryId", categoryId);
      
      // Add pagination parameters
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Gagal mengambil data PDF");
      }
      const data = await response.json();
      if (data.pdfs && Array.isArray(data.pdfs)) {
        setPDFs(data.pdfs);
        setTotalItems(data.total || data.pdfs.length);
      } else if (Array.isArray(data)) {
        setPDFs(data);
        setTotalItems(data.length);
      }
    } catch (err) {
      setError("Error memuat data PDF. Silakan coba lagi nanti.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'coverFile' | 'pdfFile') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        [fileType]: e.target.files![0]
      }));
    }
  };

  // The rest of the component remains the same

  useEffect(() => {
    // Refetch PDFs when pagination changes
    fetchPDFs(searchTitle || undefined, searchCategory || undefined);
  }, [currentPage, itemsPerPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchPDFs(searchTitle || undefined, searchCategory || undefined);
  };

  const resetSearch = () => {
    setSearchTitle("");
    setSearchCategory("");
    setCurrentPage(1);
    fetchPDFs();
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const startEditing = (pdf: PDF) => {
    setEditingPDF(pdf.id);
    setFormData({
      title: pdf.title,
      categoryId: pdf.categoryId.toString(),
      coverFile: null,
      pdfFile: null,
      coverUrl: pdf.coverUrl,
      fileUrl: pdf.fileUrl
    });
  };

  const cancelEditing = () => {
    setEditingPDF(null);
    setIsCreating(false);
    setFormData({
      title: "",
      categoryId: "",
      coverFile: null,
      pdfFile: null,
      coverUrl: "",
      fileUrl: ""
    });
  };

  const createPDF = async () => {
    if (!formData.title || !formData.categoryId || !formData.coverFile || !formData.pdfFile) {
      setStatusMessage({
        type: 'error',
        message: 'Semua field harus diisi'
      });
      return;
    }
    
    setIsUploading(true);
    let coverUrl, fileUrl;
    let coverFileName = formData.coverFile?.name || "unknown_cover";
    let pdfFileName = formData.pdfFile?.name || "unknown_pdf";
    
    try {
      // Step 1: Upload cover to Supabase Storage
      try {
        console.log(`Uploading cover "${coverFileName}" to Supabase Storage...`);
        setStatusMessage({
          type: 'success',
          message: `Mengupload cover "${coverFileName}"...`
        });
        
        // Initialize Supabase storage buckets first
        try {
          const response = await fetch('/api/storage/init', {
            method: 'GET',
          });
          
          if (!response.ok) {
            console.warn('Storage bucket initialization warning:', await response.text());
          } else {
            console.log('Storage buckets ready:', await response.json());
          }
        } catch (initError) {
          console.warn('Storage initialization warning (continuing anyway):', initError);
        }
        
        // Process image if needed (resize/compress large images)
        let coverFileToUpload = formData.coverFile;
        
        // Explicit file size warning for debugging
        console.log(`Cover file size: ${(formData.coverFile.size / 1024 / 1024).toFixed(2)}MB`);
        
        const coverUpload = await uploadToStorage(
          coverFileToUpload, 
          'pdf-covers',
          (progress) => {
            setStatusMessage({
              type: 'success',
              message: `Mengupload cover "${coverFileName}"... ${progress}%`
            });
          }
        );
        
        console.log("Cover uploaded successfully:", coverUpload);
        coverUrl = coverUpload.url;
        
        setStatusMessage({
          type: 'success',
          message: `Cover berhasil diupload! Mengupload file PDF...`
        });
      } catch (coverError) {
        console.error("Cover upload error:", coverError);
        
        // Check if this is an RLS policy error
        const errorDetails = coverError instanceof Error ? coverError.message : "Unknown error";
        let displayMessage = `Error uploading cover "${coverFileName}": ${errorDetails}`;
        
        // Provide more helpful error message for RLS policy issues
        if (errorDetails.includes('row-level security') || errorDetails.includes('RLS') || 
            errorDetails.includes('permission') || errorDetails.includes('policy')) {
          displayMessage = 
            `Storage permission error: You don't have write access to the storage buckets. ` +
            `Please ask your administrator to update the RLS policies in Supabase to allow uploads. ` +
            `Error details: ${errorDetails}`;
        }
        
        setStatusMessage({
          type: 'error',
          message: displayMessage
        });
        
        // Log more details for debugging
        console.error("Upload error details:", {
          fileName: coverFileName,
          fileType: formData.coverFile?.type,
          fileSize: formData.coverFile ? `${(formData.coverFile.size / 1024 / 1024).toFixed(2)}MB` : 'unknown',
          error: coverError
        });
        
        setIsUploading(false);
        return;
      }
      
      // Step 2: Upload PDF file to Supabase Storage
      try {
        console.log(`Uploading PDF "${pdfFileName}" to Supabase Storage...`);
        setStatusMessage({
          type: 'success',
          message: `Mengupload file PDF "${pdfFileName}"...`
        });
        
        const fileUpload = await uploadToStorage(
          formData.pdfFile, 
          'pdf-files',
          (progress) => {
            setStatusMessage({
              type: 'success',
              message: `Mengupload file PDF "${pdfFileName}"... ${progress}%`
            });
          }
        );
        
        console.log("PDF uploaded successfully:", fileUpload);
        fileUrl = fileUpload.url;
        
        setStatusMessage({
          type: 'success',
          message: `PDF berhasil diupload! Menyimpan ke database...`
        });
      } catch (pdfError) {
        console.error("PDF upload error:", pdfError);
        setStatusMessage({
          type: 'error',
          message: `Error uploading PDF "${pdfFileName}": ${pdfError instanceof Error ? pdfError.message : "Unknown error"}`
        });
        setIsUploading(false);
        return;
      }
      
      // Step 3: Create record in database
      try {
        console.log("Creating database record with:", {
          title: formData.title,
          coverUrl,
          fileUrl,
          categoryId: formData.categoryId
        });
        
        const response = await fetch("/api/pdfs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            coverUrl,
            fileUrl,
            categoryId: formData.categoryId
          }),
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          const errorDetails = responseData.details ? `: ${responseData.details}` : '';
          throw new Error(`${responseData.error || "Failed to create PDF record"}${errorDetails}`);
        }
        
        setPDFs(prev => [responseData, ...prev]);
        cancelEditing();
        setStatusMessage({
          type: 'success',
          message: 'PDF berhasil ditambahkan'
        });
        
        // Clear status message after 3 seconds
        setTimeout(() => {
          setStatusMessage(null);
        }, 3000);
      } catch (dbError) {
        console.error("Database error:", dbError);
        
        // Save record of successful uploads to help with recovery
        try {
          // Use a separate function to handle localStorage to avoid SSR issues
          const saveToLocalStorage = () => {
            if (typeof window !== 'undefined') {
              localStorage.setItem(`pdf_upload_recovery_${Date.now()}`, JSON.stringify({
                title: formData.title,
                coverUrl,
                fileUrl,
                categoryId: formData.categoryId,
                uploadTime: new Date().toISOString()
              }));
            }
          };
          
          // Actually call the function
          saveToLocalStorage();
          
          // Only run on client side
          if (typeof window !== 'undefined') {
            saveToLocalStorage();
          }
        } catch (storageError) {
          console.warn("Could not save recovery data to localStorage:", storageError);
        }
        
        setStatusMessage({
          type: 'error',
          message: `Files uploaded to Cloudinary but database record failed: ${dbError instanceof Error ? dbError.message : "Unknown error"}. File information has been saved locally for recovery.`
        });
      }
    } catch (error) {
      console.error("Error creating PDF:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal menambahkan PDF"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const updatePDF = async (id: number) => {
    if (!formData.title || !formData.categoryId) {
      setStatusMessage({
        type: 'error',
        message: 'Judul dan kategori harus diisi'
      });
      return;
    }
    
    setIsUploading(true);
    try {
      let coverUrl = formData.coverUrl;
      let fileUrl = formData.fileUrl;
      
      // Upload new files if provided to Supabase Storage
      if (formData.coverFile) {
        const coverFileName = formData.coverFile.name || "unknown_cover";
        setStatusMessage({
          type: 'success',
          message: `Mengupload cover baru "${coverFileName}"...`
        });
        
        const coverUpload = await uploadToStorage(
          formData.coverFile, 
          'pdf-covers',
          (progress) => {
            setStatusMessage({
              type: 'success',
              message: `Mengupload cover baru "${coverFileName}"... ${progress}%`
            });
          }
        );
        
        coverUrl = coverUpload.url;
        
        setStatusMessage({
          type: 'success',
          message: `Cover baru berhasil diupload!`
        });
      }
      
      if (formData.pdfFile) {
        const pdfFileName = formData.pdfFile.name || "unknown_pdf";
        setStatusMessage({
          type: 'success',
          message: `Mengupload file PDF baru "${pdfFileName}"...`
        });
        
        const fileUpload = await uploadToStorage(
          formData.pdfFile, 
          'pdf-files',
          (progress) => {
            setStatusMessage({
              type: 'success',
              message: `Mengupload file PDF baru "${pdfFileName}"... ${progress}%`
            });
          }
        );
        
        fileUrl = fileUpload.url;
        
        setStatusMessage({
          type: 'success',
          message: `PDF baru berhasil diupload!`
        });
      }
      
      // Update PDF in database
      const response = await fetch("/api/pdfs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title: formData.title,
          coverUrl,
          fileUrl,
          categoryId: formData.categoryId
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update PDF");
      }
      
      const updatedPDF = await response.json();
      setPDFs(prev => prev.map(pdf => pdf.id === id ? updatedPDF : pdf));
      setEditingPDF(null);
      setStatusMessage({
        type: 'success',
        message: 'PDF berhasil diperbarui'
      });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating PDF:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal memperbarui PDF"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deletePDF = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus PDF ini?")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pdfs?id=${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete PDF");
      }
      
      setPDFs(prev => prev.filter(pdf => pdf.id !== id));
      setStatusMessage({
        type: 'success',
        message: 'PDF berhasil dihapus'
      });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting PDF:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal menghapus PDF"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Ebook PDF</CardTitle>
          <CardDescription>
            Upload dan kelola ebook PDF untuk pengguna
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PDF Recovery Tool */}
          <PDFRecoveryTool />
          
          {/* Form for creating/editing PDFs */}
          <div className="bg-muted p-4 rounded-md mb-4">
            <h3 className="text-lg font-medium mb-4">
              {isCreating ? "Upload PDF Baru" : "Upload PDF"}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="block text-sm font-medium mb-1">Judul PDF</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul PDF"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1">Kategori</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1">Cover PDF</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => coverInputRef.current?.click()}
                    className="flex items-center"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    {formData.coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                  </Button>
                  {formData.coverFile && (
                    <span className="text-sm text-muted-foreground font-medium">
                      {formData.coverFile.name}
                      <span className="text-xs ml-1 text-green-600">(Akan diupload dengan nama unik)</span>
                    </span>
                  )}
                  {!formData.coverFile && formData.coverUrl && (
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">Cover sudah ada</span>
                      <img 
                        src={formData.coverUrl} 
                        alt="Cover" 
                        className="h-8 w-8 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <input
                  ref={coverInputRef}
                  id="coverFile"
                  name="coverFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'coverFile')}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format gambar: JPG, PNG, atau GIF
                </p>
              </div>
              
              <div>
                <Label htmlFor="pdfFile" className="block text-sm font-medium mb-1">File PDF</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => pdfInputRef.current?.click()}
                    className="flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {formData.pdfFile ? 'Ganti PDF' : 'Pilih PDF'}
                  </Button>
                  {formData.pdfFile && (
                    <span className="text-sm text-muted-foreground font-medium">
                      {formData.pdfFile.name}
                      <span className="text-xs ml-1 text-green-600">(Akan diupload dengan nama unik)</span>
                    </span>
                  )}
                  {!formData.pdfFile && formData.fileUrl && (
                    <span className="text-sm text-muted-foreground">
                      File PDF sudah ada
                    </span>
                  )}
                </div>
                <input
                  ref={pdfInputRef}
                  id="pdfFile"
                  name="pdfFile"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, 'pdfFile')}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format file: PDF
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                {editingPDF !== null && (
                  <Button 
                    variant="outline" 
                    onClick={cancelEditing}
                    disabled={isUploading}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Batal</span>
                  </Button>
                )}
                <Button 
                  onClick={editingPDF !== null ? () => updatePDF(editingPDF) : createPDF}
                  disabled={isUploading || (!formData.title || !formData.categoryId)}
                  className="flex items-center gap-1"
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Mengupload...</span>
                    </span>
                  ) : (
                    <>
                      {editingPDF !== null ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline">Perbarui PDF</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline">Upload PDF</span>
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                  
                  {pageNumbers.map(number => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Status messages */}
          {statusMessage && (
            <div className={`${
              statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            } p-3 rounded-md flex items-center`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span>{statusMessage.message}</span>
            </div>
          )}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Filter Pencarian</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1">Judul PDF</Label>
                <Input
                  id="searchTitle"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Cari berdasarkan judul"
                />
              </div>
              <div>
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1">Kategori</Label>
                <select
                  id="searchCategory"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end space-x-2">
                <Button onClick={handleSearch} className="flex-1">
                  Cari
                </Button>
                <Button variant="outline" onClick={resetSearch}>
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* PDFs list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Daftar Ebook PDF
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({pdfs.length} file)
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <Label htmlFor="itemsPerPage" className="text-sm">Tampilkan:</Label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead className="w-[100px]">Cover PDF</TableHead>
                    <TableHead>Judul PDF</TableHead>
                    <TableHead className="hidden md:table-cell">URL Cover</TableHead>
                    <TableHead className="hidden md:table-cell">URL File</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : pdfs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Belum ada PDF. Silakan tambahkan PDF baru.
                      </TableCell>
                    </TableRow>
                  ) : (
                    Array.isArray(pdfs) && pdfs.map((pdf, index) => (
                      <TableRow key={pdf.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <img 
                            src={pdf.coverUrl} 
                            alt={pdf.title} 
                            className="h-16 w-12 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{pdf.title}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="max-w-[200px] truncate">
                            {pdf.coverUrl}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="max-w-[200px] truncate">
                            {pdf.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell>{pdf.categoryName}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Open in a new tab with a timestamp parameter to avoid caching issues
                                window.open(`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`, '_blank');
                              }}
                              className="flex items-center"
                              title="View PDF"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                              <span className="sr-only">View</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startEditing(pdf)}
                              disabled={editingPDF !== null}
                              className="flex items-center"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deletePDF(pdf.id)}
                              disabled={editingPDF !== null || isLoading}
                              className="text-red-500 hover:text-red-700 flex items-center"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Hapus</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                  
                  {pageNumbers.map(number => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
