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
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
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
  const pageNumbers = Array.from({
    length: Math.min(5, totalPages)
  }, (_, i) => {
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
    const {
      name,
      value
    } = e.target;
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
            method: 'GET'
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
        const coverUpload = await uploadToStorage(coverFileToUpload, 'pdf-covers', progress => {
          setStatusMessage({
            type: 'success',
            message: `Mengupload cover "${coverFileName}"... ${progress}%`
          });
        });
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
        if (errorDetails.includes('row-level security') || errorDetails.includes('RLS') || errorDetails.includes('permission') || errorDetails.includes('policy')) {
          displayMessage = `Storage permission error: You don't have write access to the storage buckets. ` + `Please ask your administrator to update the RLS policies in Supabase to allow uploads. ` + `Error details: ${errorDetails}`;
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
        const fileUpload = await uploadToStorage(formData.pdfFile, 'pdf-files', progress => {
          setStatusMessage({
            type: 'success',
            message: `Mengupload file PDF "${pdfFileName}"... ${progress}%`
          });
        });
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
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: formData.title,
            coverUrl,
            fileUrl,
            categoryId: formData.categoryId
          })
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
        const coverUpload = await uploadToStorage(formData.coverFile, 'pdf-covers', progress => {
          setStatusMessage({
            type: 'success',
            message: `Mengupload cover baru "${coverFileName}"... ${progress}%`
          });
        });
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
        const fileUpload = await uploadToStorage(formData.pdfFile, 'pdf-files', progress => {
          setStatusMessage({
            type: 'success',
            message: `Mengupload file PDF baru "${pdfFileName}"... ${progress}%`
          });
        });
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          title: formData.title,
          coverUrl,
          fileUrl,
          categoryId: formData.categoryId
        })
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
        method: "DELETE"
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
  return <div className="space-y-6" data-unique-id="c8878d11-ec20-43e7-bd82-2e13381670ef" data-file-name="components/PDFManager.tsx">
      <Card data-unique-id="25da9230-5d63-4399-b99f-b793f396a4d3" data-file-name="components/PDFManager.tsx">
        <CardHeader data-unique-id="947544ab-d7a5-4c00-8ed0-d195f7019be7" data-file-name="components/PDFManager.tsx">
          <CardTitle data-unique-id="d3c0b78b-492b-419c-92d8-b8a68651b9e5" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="3b5bfff8-ad8c-4e6a-b2f6-c0b74fa01c7f" data-file-name="components/PDFManager.tsx">Manajemen Ebook PDF</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="3c82f659-4e95-4e0c-a548-4380917b4f6a" data-file-name="components/PDFManager.tsx">
            Upload dan kelola ebook PDF untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="c1587c03-caa9-4a7b-b1fd-329f604b9414" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
          {/* PDF Recovery Tool */}
          <PDFRecoveryTool />
          
          {/* Form for creating/editing PDFs */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="7ecabcba-fdc8-4d99-ac3d-2343c1131fa3" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="3a25f12a-23ed-4ebb-a4fc-ffcb5ee933c7" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
              {isCreating ? "Upload PDF Baru" : "Upload PDF"}
            </h3>
            <div className="space-y-4" data-unique-id="91991f96-2054-4560-92e7-dbc8ccd4cc28" data-file-name="components/PDFManager.tsx">
              <div data-unique-id="3105ac70-e826-4363-9563-07c3d0eb6760" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="94160267-7223-4bc8-acf1-6b90a5ba160b" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="10bebe4d-5200-4a5f-8d98-1dbf408d6af4" data-file-name="components/PDFManager.tsx">Judul PDF</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul PDF" className="w-full" data-unique-id="9eeea493-ab60-4151-a98d-21a0ab045df6" data-file-name="components/PDFManager.tsx" />
              </div>
              
              <div data-unique-id="399ff764-937d-4dd3-87ff-49d4b5656475" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="5891f339-37b3-47af-b9c9-d01de32cb6c9" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="46f763a3-61da-4baf-980d-a5d955c82c15" data-file-name="components/PDFManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="c5822c5f-1d41-4a7b-b80c-bcb16b19579d" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="350a2985-e48d-4d26-9fa4-4212f63df6e6" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="3698a710-7c57-4ea1-b268-9aeea561ca93" data-file-name="components/PDFManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="ea79e1ae-e418-4a2d-aefb-9a7601d8db6a" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="7ef4c70f-d15a-468c-8668-bdaa384e707a" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="e1d9520f-214a-4e30-9a89-4b46574a8ede" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="ad91f9f8-9656-4d2b-98ef-20441491fa86" data-file-name="components/PDFManager.tsx">Cover PDF</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="38209415-00e2-4ee3-8d73-28dbba90e2a4" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} className="flex items-center" data-unique-id="e984c27c-c9c7-4f39-bf75-ebd199db0ad1" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                    <Image className="h-4 w-4 mr-2" data-unique-id="9f4d7f8f-91f2-44d5-a93c-07140afff080" data-file-name="components/PDFManager.tsx" />
                    {formData.coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                  </Button>
                  {formData.coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="b54e1f1d-50d0-4e92-81c1-16d7f889aac7" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {formData.coverFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="544c4a86-b714-4c7f-9d54-cde6bb0f5faa" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="648bb719-5eb5-4810-b939-120c8d776c8c" data-file-name="components/PDFManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.coverFile && formData.coverUrl && <div className="flex items-center" data-unique-id="b575c4d9-9d4f-407d-bd84-1dbbca0f6ff4" data-file-name="components/PDFManager.tsx">
                      <span className="text-sm text-muted-foreground mr-2" data-unique-id="cc032e92-254d-4823-bf72-3e023848b01f" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="b5435e6c-907e-4136-a054-641ca4b2e067" data-file-name="components/PDFManager.tsx">Cover sudah ada</span></span>
                      <img src={formData.coverUrl} alt="Cover" className="h-8 w-8 object-cover rounded" data-unique-id="8c319bf0-5e3c-4f51-a407-be39dbac0f35" data-file-name="components/PDFManager.tsx" />
                    </div>}
                </div>
                <input ref={coverInputRef} id="coverFile" name="coverFile" type="file" accept="image/*" onChange={e => handleFileChange(e, 'coverFile')} className="hidden" data-unique-id="c6a1fa78-743b-4f5e-8150-d33ea65a2620" data-file-name="components/PDFManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="8f64b06b-25a5-493f-bbe4-68773e49b9a4" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="749b57ed-e072-49ad-a200-7e77f0c038d8" data-file-name="components/PDFManager.tsx">
                  Format gambar: JPG, PNG, atau GIF
                </span></p>
              </div>
              
              <div data-unique-id="5c6c030d-3ec2-413d-9fc0-b9bc1fa156d6" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="pdfFile" className="block text-sm font-medium mb-1" data-unique-id="7cf4ef53-095e-4bbb-a63a-c834e29febb8" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="50f9a48e-5bda-4803-8b36-e6fa3062d377" data-file-name="components/PDFManager.tsx">File PDF</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="a4e96b72-f99b-46cf-ac6c-cc36604ac28e" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => pdfInputRef.current?.click()} className="flex items-center" data-unique-id="ba9eb79d-d678-4bb2-9085-164be98df100" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                    <FileText className="h-4 w-4 mr-2" />
                    {formData.pdfFile ? 'Ganti PDF' : 'Pilih PDF'}
                  </Button>
                  {formData.pdfFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="01426a8a-de54-4d65-8381-5f72d51b5480" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {formData.pdfFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="3bc630d6-dcc9-4ccd-8b05-15e45cc90d60" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="559b52bf-03c2-404b-9126-1876ef99e795" data-file-name="components/PDFManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.pdfFile && formData.fileUrl && <span className="text-sm text-muted-foreground" data-unique-id="ebccbc23-623b-4440-9ed6-7a15a833634c" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="e91924de-6d57-4d4e-8148-25b5ac9c905c" data-file-name="components/PDFManager.tsx">
                      File PDF sudah ada
                    </span></span>}
                </div>
                <input ref={pdfInputRef} id="pdfFile" name="pdfFile" type="file" accept="application/pdf" onChange={e => handleFileChange(e, 'pdfFile')} className="hidden" data-unique-id="ac2d8f5f-850e-4d55-b878-c491cd5f7f4a" data-file-name="components/PDFManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="329c9be1-27fe-43f9-8b66-a29dde982b49" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="1173223c-9f7f-4ae8-b4e1-3c8a3ae39ae7" data-file-name="components/PDFManager.tsx">
                  Format file: PDF
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="5c815eb0-5346-4f89-97b6-b9a23e42c0a6" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                {editingPDF !== null && <Button variant="outline" onClick={cancelEditing} disabled={isUploading} className="flex items-center gap-1" data-unique-id="61296b5e-dbcf-4f1b-981f-0ceca50bbc90" data-file-name="components/PDFManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="eda0f609-ca48-40d8-b528-1a7e61b7f35b" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="c34fc5e8-9aec-4873-9576-b08ee81afea4" data-file-name="components/PDFManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingPDF !== null ? () => updatePDF(editingPDF) : createPDF} disabled={isUploading || !formData.title || !formData.categoryId} className="flex items-center gap-1" data-unique-id="76a46316-d580-421b-b714-8e9d04b993d5" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  {isUploading ? <span className="flex items-center" data-unique-id="e04e8493-1914-47f0-ac08-10b37a58e926" data-file-name="components/PDFManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="3a8a26b1-adae-40fd-9c5b-b2bbc9f1019d" data-file-name="components/PDFManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="1aefcd6e-1b12-46e4-bb5c-f7d2bba2b061" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="014e0b43-9212-4bca-b184-72b689afcb9e" data-file-name="components/PDFManager.tsx">Mengupload...</span></span>
                    </span> : <>
                      {editingPDF !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="057208fe-6be3-433f-947d-bc4d21947a81" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="1b90df73-79f9-4ba5-90b1-9cfef6ac91b2" data-file-name="components/PDFManager.tsx">Perbarui PDF</span></span>
                        </> : <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="e76eb939-6623-4b7d-9297-ed27a96604ba" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="16a00013-9470-476b-9f39-2727e22206ce" data-file-name="components/PDFManager.tsx">Upload PDF</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="de80c8a7-395b-4b21-b85d-e18100d133a2" data-file-name="components/PDFManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="3444bd6a-d99f-4f5e-b40a-89ec6882a983" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="58fe9102-8136-4121-b35b-262250c25636" data-file-name="components/PDFManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="13835c68-6556-4a86-8fa5-507e4c310d16" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="6449bd57-aa6d-4f4e-91da-92c64fb29fa6" data-file-name="components/PDFManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="ad020ac5-f713-47ee-bd83-0b73a06ec638" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="a518949a-42d8-4e1a-9f38-740299e06c31" data-file-name="components/PDFManager.tsx">
                    <span data-unique-id="81315ff8-ddb9-4c4c-aa49-28dfecdd6fed" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="4884f655-deea-430b-b6dc-aae695c8902a" data-file-name="components/PDFManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="d03b56de-4c00-4c31-80f6-cb85b8a7c7f1" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="44cf6bfe-43d5-43f9-b389-268c921cb1a1" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="25edd0cf-8683-4a05-8dd9-078a82f64187" data-file-name="components/PDFManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="1bfb16f8-b0a0-4331-a404-170f40c6f4bf" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="2601bea1-5081-465b-b024-941dfa5fa4a8" data-file-name="components/PDFManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="4c094bf8-d4a5-4e5e-a008-6f3d76afad95" data-file-name="components/PDFManager.tsx">
              <div data-unique-id="a9521542-25d4-40ba-aede-2dc689d2070f" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="fe1341d7-e606-43cc-b597-995c2c2b910e" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="8f16d46c-c1f0-4da2-b75f-b34d929a5a25" data-file-name="components/PDFManager.tsx">Judul PDF</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="fbbf257a-be20-4153-94fa-77cb593ca611" data-file-name="components/PDFManager.tsx" />
              </div>
              <div data-unique-id="d56947b5-acf9-4034-a208-58e6584b1319" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="cf94f333-e525-48da-9185-a9a415c1950a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="f63d0dfe-628e-43ca-b2dd-6d2af3dfe83d" data-file-name="components/PDFManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="5cc86189-3a17-45bb-8d7a-fbeed19e0763" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="5e1ac235-992d-4025-909c-8efdb6786e3a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="18ccd2a1-4fbf-4c27-a8cb-af10615b6242" data-file-name="components/PDFManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="714fe723-8d6a-4c1c-955e-1ace3099876f" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="19b0868c-1b45-4327-ab6f-5fc09b61fd41" data-file-name="components/PDFManager.tsx">
                <Button onClick={handleSearch} className="flex-1" data-unique-id="71483d1d-4b38-4577-a046-5f604700211f" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="42d09f3f-0153-43a0-98f8-1889a836d604" data-file-name="components/PDFManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="593673d2-a495-4261-958d-520a0136c779" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="9687d367-9f8b-4427-9c3c-50e225c06f43" data-file-name="components/PDFManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDFs list */}
          <div data-unique-id="04a463d9-bc4b-43a0-8290-461486b75297" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="dc4b7f8a-ad7b-4f8c-9057-a2ec0924b4e0" data-file-name="components/PDFManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="93bc7a97-9cc8-41d2-8414-64eb6713faf0" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="c47c354a-249c-47ed-972d-c746f5602845" data-file-name="components/PDFManager.tsx">
                Daftar Ebook PDF
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="0e83bd71-6831-499c-8ac3-95de98b139ec" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4fc16266-dd84-48f1-b24b-3771c201e756" data-file-name="components/PDFManager.tsx">
                  (</span>{pdfs.length}<span className="editable-text" data-unique-id="e4c943e6-cfb0-465f-8a3f-8e9fabbc2112" data-file-name="components/PDFManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="a63143b9-9aa9-472d-81b6-4fb3fd866f1a" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="086cf0f1-d0e2-4136-bc35-f551ce697e64" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="1f8abf20-a05d-448f-9458-a8b1af2c3ead" data-file-name="components/PDFManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="5da7a657-6c3c-43ba-9387-feb35c2e3d2a" data-file-name="components/PDFManager.tsx">
                  <option value={10} data-unique-id="ea7099b7-331f-4f2e-8a3f-b06cf56b5104" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="7e18e8eb-6606-4a80-83e6-7e96943e3006" data-file-name="components/PDFManager.tsx">10</span></option>
                  <option value={50} data-unique-id="c6fb4206-7e70-4644-a590-a4722fa663e9" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="1837b4f8-bd92-4792-882d-cf2162e0f76d" data-file-name="components/PDFManager.tsx">50</span></option>
                  <option value={100} data-unique-id="a77804f3-3c9c-4d52-9955-fdb06823a08f" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="00445bfc-c17f-4b4b-ba4b-a9b8a6227576" data-file-name="components/PDFManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto" data-unique-id="1ba36047-7df9-4b2d-9702-7407c2ebad86" data-file-name="components/PDFManager.tsx">
              <Table data-unique-id="09be6c41-de38-408f-8497-fb397e8ecf45" data-file-name="components/PDFManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="a818bc22-5f38-4b3f-9699-170908cbcda4" data-file-name="components/PDFManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[100px]"><span className="editable-text" data-unique-id="1575e49d-f5b9-4f1b-b75c-2cab4233b539" data-file-name="components/PDFManager.tsx">Cover PDF</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="ffa968bf-6c7a-4393-b949-c6f2587cdd49" data-file-name="components/PDFManager.tsx">Judul PDF</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="9d9b00b6-1ec4-40e3-b7d2-93e91a4693fe" data-file-name="components/PDFManager.tsx">URL Cover</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="78d6e2d3-b8c0-4d73-8416-57a01586883e" data-file-name="components/PDFManager.tsx">URL File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="d41741d6-01a9-4a07-99e7-484e27d3bf48" data-file-name="components/PDFManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="5d7f13f8-d2df-4f31-9ff4-1732e87187ec" data-file-name="components/PDFManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="5d874b02-22f2-40b7-ba11-2d4de2e4c279" data-file-name="components/PDFManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="6f604005-0b74-46c2-af5a-a27c474a1666" data-file-name="components/PDFManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : pdfs.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="746a6768-93ce-4b0a-b404-7cde71725ae4" data-file-name="components/PDFManager.tsx">
                        Belum ada PDF. Silakan tambahkan PDF baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(pdfs) && pdfs.map((pdf, index) => <TableRow key={pdf.id} data-unique-id="fdd952fb-29ee-4222-94dd-a8077a0fc0dc" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="b4b4c5e1-1814-4c44-87d1-0e90acb3b2d1" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="c2de6abc-6cb6-4eaf-95ea-7a1c1c3612b2" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <img src={pdf.coverUrl} alt={pdf.title} className="h-16 w-12 object-cover rounded" data-is-mapped="true" data-unique-id="888ecd78-840f-4522-94e8-de9741a2b048" data-file-name="components/PDFManager.tsx" />
                        </TableCell>
                        <TableCell className="font-medium" data-unique-id="21b9b095-9ba6-4238-bc08-63beb2115378" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{pdf.title}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="81b98935-87ef-4e33-b1b7-c0f4f1f6c530" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="f4e7e00f-1b52-436d-b528-3d499b7abccd" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                            {pdf.coverUrl}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="b1a8ea82-62cb-4a73-af3d-948744a6dc39" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="2109e2d8-2192-4f47-beac-06391ac11711" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                            {pdf.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="23b174c6-2803-4abf-8984-83a27a3cf48e" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{pdf.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="32849627-5d09-4aad-bb50-668d600101e4" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="ca6ad20f-a4e4-4e33-851e-8df99ba6cd6b" data-file-name="components/PDFManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => {
                        // Open in a new tab with a timestamp parameter to avoid caching issues
                        window.open(`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`, '_blank');
                      }} className="flex items-center" title="View PDF" data-is-mapped="true" data-unique-id="e76b69c8-5e5d-4678-8f95-7a9a709add41" data-file-name="components/PDFManager.tsx">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-is-mapped="true" data-unique-id="601f9d5b-26c4-4fbd-9731-233ad3d5a235" data-file-name="components/PDFManager.tsx">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" data-unique-id="56ea57a4-d9c0-4a4f-a2ce-5fbde3ce0c56" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></path>
                                <polyline points="15 3 21 3 21 9" data-unique-id="07b88991-4fd6-4f54-a519-a68d8e1c8f14" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3" data-unique-id="13ab9935-b2ef-45f9-be3a-bf223c80f961" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></line>
                              </svg>
                              <span className="sr-only" data-is-mapped="true" data-unique-id="8d70f9dc-24e8-41b4-bbad-9ba32071e08a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="8ec7d8f9-be8a-4f43-867b-eb6fee96c0af" data-file-name="components/PDFManager.tsx">View</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => startEditing(pdf)} disabled={editingPDF !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="37cecac3-1a92-4240-a9cc-5ae17396b669" data-file-name="components/PDFManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="a9154711-31b9-4217-901b-99c77d91b332" data-file-name="components/PDFManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="8cb5b506-1335-4526-8f95-cfd49981a45e" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="7d18d7e8-0aa9-4651-94dd-c042fa124e3c" data-file-name="components/PDFManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deletePDF(pdf.id)} disabled={editingPDF !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="7159645b-b8c9-4fcb-b23d-bd36aaacdce2" data-file-name="components/PDFManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="1764994b-716f-4dff-a41f-b7c9360ccb95" data-file-name="components/PDFManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="dc166bbe-72be-4a69-807e-195faba8c330" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="c939c35f-d5d7-40d9-95c1-64b2985c2889" data-file-name="components/PDFManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="75a2f66b-5d70-45fa-906d-c039d958513a" data-file-name="components/PDFManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="dfeb8637-0737-4347-9134-c4a8421319be" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="ed90918c-1711-43d3-b7ec-1845061a1484" data-file-name="components/PDFManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="a3d08b32-a4aa-40b1-b9df-2149d29dd091" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="0ac664a1-b4d5-44a4-8b5c-e54bbf80d1fd" data-file-name="components/PDFManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="cb6a6c27-dfdb-4f07-b94f-4073c8842b1d" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="4a2a9337-020e-418d-a049-cd781d6e6124" data-file-name="components/PDFManager.tsx">
                    <span data-unique-id="738dd8f9-ce26-447d-b065-ca9886d28e28" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="72dbcbb6-a6c0-4bf3-b486-a8e30cba1e55" data-file-name="components/PDFManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}