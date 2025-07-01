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
  return <div className="space-y-6" data-unique-id="f3195199-9b6e-4c97-ba74-79cab97a7278" data-file-name="components/PDFManager.tsx">
      <Card data-unique-id="9a56b403-8041-43ad-9300-b1e93edc4c41" data-file-name="components/PDFManager.tsx">
        <CardHeader data-unique-id="801b5027-fc83-46cc-8159-18a5e08bb9ad" data-file-name="components/PDFManager.tsx">
          <CardTitle data-unique-id="ac8e0f02-1da1-41ba-89cd-91a3cac31573" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="71574382-3af5-4f34-bb48-472d36581b03" data-file-name="components/PDFManager.tsx">Manajemen Ebook PDF</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="c6241241-3eae-416b-8af9-ce1990fa98ce" data-file-name="components/PDFManager.tsx">
            Upload dan kelola ebook PDF untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="97ec34b4-e213-4a1f-b4ba-3ee97e7629f0" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
          {/* PDF Recovery Tool */}
          <PDFRecoveryTool />
          
          {/* Form for creating/editing PDFs */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="9885db68-52a2-45ca-8f83-dd5c67790cb3" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="9810c411-6bbb-4c13-b321-105fd03f45c7" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
              {isCreating ? "Upload PDF Baru" : "Upload PDF"}
            </h3>
            <div className="space-y-4" data-unique-id="b50dd55c-8b47-4178-ac5c-f268f7569551" data-file-name="components/PDFManager.tsx">
              <div data-unique-id="5594ec0c-7e3a-4a21-a204-9c32069e3370" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="e74afd7a-c7e8-4139-903a-8601229330ff" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="94377ec3-8fc0-41e4-b991-70a34d6831bd" data-file-name="components/PDFManager.tsx">Judul PDF</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul PDF" className="w-full" data-unique-id="11c2f605-2d2e-45c3-a808-37b7448c6433" data-file-name="components/PDFManager.tsx" />
              </div>
              
              <div data-unique-id="ecdcd9ae-9f74-4f49-8dc6-438366f14a64" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="8ac5d539-492d-407c-ba44-b83aa9db79d5" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="0ac8c78f-3a2b-48f0-be94-cb643f345aed" data-file-name="components/PDFManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="ce30a492-4d5f-4a7b-bf0d-0cf61a09f14f" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="9024e419-9a46-4953-8bca-498191273f60" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="121c713c-acdc-4525-afde-c1ebfde1aa92" data-file-name="components/PDFManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="7a1a92c6-20e3-41a4-9c19-e58346e75ed3" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="9a2e6f71-cc76-4ee8-85b6-61c7b455ab57" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="8e5f89e7-4092-4c8a-94fe-a6987d58035a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="13fda580-77bb-4ff9-90ce-66006f45c04c" data-file-name="components/PDFManager.tsx">Cover PDF</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="fab38bf0-d772-4bcb-a871-b856a8d13e0b" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} className="flex items-center" data-unique-id="2c24463e-7698-4206-8b1d-050affc7e35f" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                    <Image className="h-4 w-4 mr-2" data-unique-id="7bd122a7-6824-4f29-a7d6-4e4464a2c6a5" data-file-name="components/PDFManager.tsx" />
                    {formData.coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                  </Button>
                  {formData.coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="09691382-73e4-485e-a710-901fd4adc91b" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {formData.coverFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="fbe0ba09-035a-4683-a8c5-166e10cffb98" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="8a7908d6-e21f-4c2d-bc1d-b60ceb18625a" data-file-name="components/PDFManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.coverFile && formData.coverUrl && <div className="flex items-center" data-unique-id="c1f2e09d-6ba1-4b17-8b92-f6793e3f2ede" data-file-name="components/PDFManager.tsx">
                      <span className="text-sm text-muted-foreground mr-2" data-unique-id="437e6937-b83c-463b-a080-7387538da0ae" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="3a4b8d78-20a2-4f89-961c-63fa6958f745" data-file-name="components/PDFManager.tsx">Cover sudah ada</span></span>
                      <img src={formData.coverUrl} alt="Cover" className="h-8 w-8 object-cover rounded" data-unique-id="fccd9bab-e17a-4869-b31b-f1be3dcc7c0c" data-file-name="components/PDFManager.tsx" />
                    </div>}
                </div>
                <input ref={coverInputRef} id="coverFile" name="coverFile" type="file" accept="image/*" onChange={e => handleFileChange(e, 'coverFile')} className="hidden" data-unique-id="b43821c4-e1d8-42f1-9e49-1169eeee53a7" data-file-name="components/PDFManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="d00403ba-068a-4d11-9619-2424d5e9b5e4" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="2d772c9a-0f7d-47e3-bf8a-05d9c82bde55" data-file-name="components/PDFManager.tsx">
                  Format gambar: JPG, PNG, atau GIF
                </span></p>
              </div>
              
              <div data-unique-id="ecd74131-d59a-42a3-87c0-f6f635299835" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="pdfFile" className="block text-sm font-medium mb-1" data-unique-id="e405f9a0-11a0-4dfc-a05e-bd57bd50aba9" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="f871f069-e1b1-4764-9e1e-0f9eb2a7ed95" data-file-name="components/PDFManager.tsx">File PDF</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="eb55e164-dd52-4642-a76e-2a015ffe16df" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => pdfInputRef.current?.click()} className="flex items-center" data-unique-id="4682069b-2496-4a00-85c5-aff2ced8b4d3" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                    <FileText className="h-4 w-4 mr-2" />
                    {formData.pdfFile ? 'Ganti PDF' : 'Pilih PDF'}
                  </Button>
                  {formData.pdfFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="6908a265-3ca4-4223-b5d5-8fb3e19c8dba" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {formData.pdfFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="56643116-3f5e-4d39-a2b3-84194af81e87" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="a2b3cb1c-74d6-4f08-a914-274aecb403a6" data-file-name="components/PDFManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.pdfFile && formData.fileUrl && <span className="text-sm text-muted-foreground" data-unique-id="e60f975e-00d5-4f32-9d4a-bdac04306810" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="553f1aa5-8943-4507-aee3-7dbc49391630" data-file-name="components/PDFManager.tsx">
                      File PDF sudah ada
                    </span></span>}
                </div>
                <input ref={pdfInputRef} id="pdfFile" name="pdfFile" type="file" accept="application/pdf" onChange={e => handleFileChange(e, 'pdfFile')} className="hidden" data-unique-id="c259c8bd-9846-4a52-a142-5cbddc4f0fc0" data-file-name="components/PDFManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="9a3a1b02-bdd7-4113-a42d-c46fe279c409" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="4c6e3789-2fda-41af-b19d-f4b7b824bd2c" data-file-name="components/PDFManager.tsx">
                  Format file: PDF
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="30163a00-b47a-417a-bd33-1bcd6497073f" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                {editingPDF !== null && <Button variant="outline" onClick={cancelEditing} disabled={isUploading} className="flex items-center gap-1" data-unique-id="763b2bd7-353b-4532-a1b7-6091447b8695" data-file-name="components/PDFManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="c0a6331f-4870-4a13-939c-071b32cadabb" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="249e5415-14c5-42a3-a430-023e41f75dd8" data-file-name="components/PDFManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingPDF !== null ? () => updatePDF(editingPDF) : createPDF} disabled={isUploading || !formData.title || !formData.categoryId} className="flex items-center gap-1" data-unique-id="bddf9665-da47-46f3-8d5b-a247ad319199" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  {isUploading ? <span className="flex items-center" data-unique-id="26699eaf-a7f1-409e-9c61-209dd2126699" data-file-name="components/PDFManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="3b751edd-fa7a-4765-bdd0-72e6c9e3bc30" data-file-name="components/PDFManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="c031535c-9842-4624-98bd-528eb2a9898f" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="53781825-f12f-4d74-96da-8cea9a35b609" data-file-name="components/PDFManager.tsx">Mengupload...</span></span>
                    </span> : <>
                      {editingPDF !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="2bf3753e-d84d-49d0-8c9a-b02bf30fef41" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="310724de-1fee-4e13-bb38-093d9b6f423f" data-file-name="components/PDFManager.tsx">Perbarui PDF</span></span>
                        </> : <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="6b74c9b7-79f8-4e38-aa4e-cc43624481ae" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="b72a4984-0ad5-4d08-a1da-2ff6fc2531de" data-file-name="components/PDFManager.tsx">Upload PDF</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="03c7cad0-7b3b-4052-9208-8d8f45bb31ee" data-file-name="components/PDFManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="93465478-0a06-4835-a2da-516819e4cde3" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="8399e073-4995-4609-9c76-6d3332ffe4b0" data-file-name="components/PDFManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="14c32aee-d658-499b-b67a-e57d4210ba0a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="2d28aa8d-e58e-414a-abeb-c3c9b265f7b9" data-file-name="components/PDFManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="481ac171-4d3c-4bb6-a3f6-2e8be8195d4a" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="fb57fd91-d6b6-476c-af5a-dfdf8820bf47" data-file-name="components/PDFManager.tsx">
                    <span data-unique-id="516da63a-453b-497a-a01b-aaf96f0d3344" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="40351a9e-4862-423d-9941-2af473b931c2" data-file-name="components/PDFManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="ddf6d0b2-2398-45c9-9d69-d432767a519e" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="eb2eb1b5-abf2-46e1-852c-adb2bf7b8ce6" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="c0f70625-b36a-4904-984d-a79c4289a9bb" data-file-name="components/PDFManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="db319041-6f3b-49d3-97b4-7c2ad3251eba" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="72c0f01a-0195-4dc2-baa0-4e93bed211f3" data-file-name="components/PDFManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="1c93711e-52f3-4466-b576-3ec07a67c5fb" data-file-name="components/PDFManager.tsx">
              <div data-unique-id="ed4e7f45-1e9d-49a6-be29-a88d82f7a458" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="12a7e333-4011-48fd-9601-14e498aab578" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="c300bc2f-286d-462c-a3e3-092afa404804" data-file-name="components/PDFManager.tsx">Judul PDF</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="ddf9c6c2-07cf-49c3-bba4-d80ea72310d2" data-file-name="components/PDFManager.tsx" />
              </div>
              <div data-unique-id="a84da2b6-0602-49c2-8c4d-83abd7d7cfe2" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="9b6bab0d-d7e6-4750-88c0-bc0b8008b3ee" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="f155b1a6-63ed-4539-9c24-107d103fd135" data-file-name="components/PDFManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="ccbe05c1-e4dd-4c27-bfdd-2384bc66af11" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="5f27c2da-6456-490c-9607-b80ed828e884" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="4d1c1f23-ee86-47cb-addf-1a303549acd8" data-file-name="components/PDFManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="29501c34-e2cd-4955-ba16-457789f4c9c7" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="34b152a9-9c1a-4a92-ba01-f706c7a1c52c" data-file-name="components/PDFManager.tsx">
                <Button onClick={handleSearch} className="flex-1" data-unique-id="8ddc497f-d466-47b3-aadb-a0f26ab70e35" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="908598b8-15ee-4b65-bf87-3fac3b3c3da0" data-file-name="components/PDFManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="8dd2bc72-698c-436f-95a8-b3decf2cb69e" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="a42dda49-38e2-4ec2-ab82-fa6e93dbb3d4" data-file-name="components/PDFManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDFs list */}
          <div data-unique-id="e23b6523-17c0-45be-a155-26df365c6613" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="39b5aca2-1ab2-4200-b0e6-2b89a66daf46" data-file-name="components/PDFManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="8bda9f12-a82e-4e72-b5a9-8e20178f7831" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="97e2e3fc-2e67-483a-90be-a75fe1a9c7db" data-file-name="components/PDFManager.tsx">
                Daftar Ebook PDF
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="e9430ded-f8b3-4d4c-a1d2-df2a243ac236" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9306ea26-01fb-4e6c-b1c7-e9e74cf90d45" data-file-name="components/PDFManager.tsx">
                  (</span>{pdfs.length}<span className="editable-text" data-unique-id="04bea8ac-20c5-43f0-85bd-4647f27b562e" data-file-name="components/PDFManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="bf04a43e-d914-43e4-812c-cb3e146d5e75" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="7324e5ea-9b5e-450c-bcc4-8132694ed87f" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="deb3715a-3bb4-43d6-8e8e-626086c084f9" data-file-name="components/PDFManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="f7134a30-50bf-4306-be01-075ad1963b64" data-file-name="components/PDFManager.tsx">
                  <option value={10} data-unique-id="b11026ca-5f08-475a-9707-e239a25da55b" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="850bfac2-fad1-4433-93e0-fd4cbb05024a" data-file-name="components/PDFManager.tsx">10</span></option>
                  <option value={50} data-unique-id="5580184c-ecbf-48ee-ac9a-baa5039695e6" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="027e5cff-742e-4f38-b951-7304de52a804" data-file-name="components/PDFManager.tsx">50</span></option>
                  <option value={100} data-unique-id="1e3f9475-400b-434c-87d3-6b98e528dd12" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="84854c82-56ed-4ab7-ba1a-60034ba0fb83" data-file-name="components/PDFManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto" data-unique-id="de06fddc-1517-41cd-ba27-f2135e9179df" data-file-name="components/PDFManager.tsx">
              <Table data-unique-id="d96ca894-37eb-4055-a4a1-a9aaa57e123e" data-file-name="components/PDFManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="b0cf96f8-18e4-4dd9-b866-01b1d6f2bc60" data-file-name="components/PDFManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[100px]"><span className="editable-text" data-unique-id="e3e8c0a9-f7fc-4c36-8abe-ac596120716f" data-file-name="components/PDFManager.tsx">Cover PDF</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="0fa03254-836f-4ff9-8589-04d5bf10c9cf" data-file-name="components/PDFManager.tsx">Judul PDF</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="23318feb-e845-4446-839a-99633a8b5f55" data-file-name="components/PDFManager.tsx">URL Cover</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="9cd1661e-6b00-4270-bb1d-7dd993833632" data-file-name="components/PDFManager.tsx">URL File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="8e2e41ea-0fcd-4eb6-a5cf-c857881fcc6c" data-file-name="components/PDFManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="8ce416ae-fdb9-4675-9be8-520ca63c6447" data-file-name="components/PDFManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="f90dfb09-32f7-4cae-8445-e43c9d76016d" data-file-name="components/PDFManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="01d2f693-f290-4124-9c45-5a7fa78b4541" data-file-name="components/PDFManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : pdfs.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="8ce4a26b-c8e9-416b-b626-f4a985788bf9" data-file-name="components/PDFManager.tsx">
                        Belum ada PDF. Silakan tambahkan PDF baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(pdfs) && pdfs.map((pdf, index) => <TableRow key={pdf.id} data-unique-id="2d9f1b9e-2cca-46c6-a84f-f9fe9afb0f1d" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="22bb4577-041d-4eb9-8e12-5cfe114743e6" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="d54e5176-e22f-440e-9c9d-14435450936a" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <img src={pdf.coverUrl} alt={pdf.title} className="h-16 w-12 object-cover rounded" data-is-mapped="true" data-unique-id="5a354d28-a594-4547-a47b-ae692a7ae961" data-file-name="components/PDFManager.tsx" />
                        </TableCell>
                        <TableCell className="font-medium" data-unique-id="139d8137-7622-4225-946c-9df9b765c12b" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{pdf.title}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="a45830f2-4937-48f9-a005-9627a84e25ca" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="8f4d6694-1a54-47a2-8a0e-b1c7f093b725" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                            {pdf.coverUrl}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="f611fa6d-0f8b-4e39-867f-d2f8ec0922c5" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="9f453779-45c3-4b27-b9b7-5d614f6efb29" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                            {pdf.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="42874df8-2106-49be-9405-214ee0036ecd" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{pdf.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="3b9a0170-b631-4863-8ea4-855a20c4c233" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="feb3d1f8-9f87-496c-a755-1e385dc7d0a4" data-file-name="components/PDFManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => {
                        // Open in a new tab with a timestamp parameter to avoid caching issues
                        window.open(`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`, '_blank');
                      }} className="flex items-center" title="View PDF" data-is-mapped="true" data-unique-id="adee1d7d-3dfc-464b-ac07-6fcd42965464" data-file-name="components/PDFManager.tsx">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-is-mapped="true" data-unique-id="5c350c9d-bc39-40f8-abd5-2381ed9ad595" data-file-name="components/PDFManager.tsx">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" data-unique-id="95fbcf4e-4735-4dd9-b8b3-edbbea4edf26" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></path>
                                <polyline points="15 3 21 3 21 9" data-unique-id="2d531563-d193-4d05-b905-bc5b6c7ae701" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3" data-unique-id="76a9dbcb-09ce-43f7-a28e-0052226a42ff" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></line>
                              </svg>
                              <span className="sr-only" data-is-mapped="true" data-unique-id="aa986dd4-0a0b-4554-bbfc-52c6ad431a2c" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="40c4e869-e53a-42c5-93ea-c907a45d78bf" data-file-name="components/PDFManager.tsx">View</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => startEditing(pdf)} disabled={editingPDF !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="eba616ca-5e53-40f9-b27f-0f0fba46be11" data-file-name="components/PDFManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="f8ee3541-c208-426d-ba37-b97b0a4823bd" data-file-name="components/PDFManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="6b52aa3b-a1f8-4bf4-a408-7348cbbb5c73" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="d13a6217-bce5-4c7e-b677-3a650b57f49f" data-file-name="components/PDFManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deletePDF(pdf.id)} disabled={editingPDF !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="59ba8f1d-2910-4e70-8d0d-b7d38a933f30" data-file-name="components/PDFManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="ea3317d6-73b6-49fc-bce2-2fd113bba360" data-file-name="components/PDFManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="e560e6e3-f7f8-49f2-8e35-cba9e63a3112" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="c2616226-4968-426c-b291-550d4407d11d" data-file-name="components/PDFManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="1a26c17d-a6d2-4079-9183-6810b53300f4" data-file-name="components/PDFManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="ae4539a3-1318-46a6-b879-d480ec1bb930" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="8b2f2184-399c-472c-a9b1-df054450ed73" data-file-name="components/PDFManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="dd1b0a67-6cf8-4275-962a-8f1aa7e7b471" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="d3ef2bff-4867-4bf6-b6f5-bec37369cf9c" data-file-name="components/PDFManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="86beb61c-4d25-449b-a2fb-4b66d4e35257" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="1077bcac-51ed-4da5-b103-8b88237d4c15" data-file-name="components/PDFManager.tsx">
                    <span data-unique-id="85a9b17f-3219-4970-b4df-56fe2e6f61f6" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="f5f83b11-b856-4842-8a41-4d5dced337d3" data-file-name="components/PDFManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}