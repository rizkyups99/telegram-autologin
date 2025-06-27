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
  return <div className="space-y-6" data-unique-id="c4fdaffa-80a7-4ef7-93c1-9a642a6b1f76" data-file-name="components/PDFManager.tsx">
      <Card data-unique-id="2dcb59d8-b0dd-4147-963c-a2b53d372036" data-file-name="components/PDFManager.tsx">
        <CardHeader data-unique-id="2fc5de4d-0ca2-407a-95a5-1f079934af82" data-file-name="components/PDFManager.tsx">
          <CardTitle data-unique-id="e21a0c11-2957-4656-981b-a3dd5e85563e" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="e9bf86ca-90f3-4e64-a7a9-556e010e15bd" data-file-name="components/PDFManager.tsx">Manajemen Ebook PDF</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="4751d11f-8c64-4492-9165-f57a9c02e009" data-file-name="components/PDFManager.tsx">
            Upload dan kelola ebook PDF untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="ef61063a-2032-444b-a59b-88f9d52a1555" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
          {/* PDF Recovery Tool */}
          <PDFRecoveryTool />
          
          {/* Form for creating/editing PDFs */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="d967ac5d-0011-4302-b6fa-ad9869c38241" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="d84bb5b9-de9c-4ac6-826b-fccda79d7842" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
              {isCreating ? "Upload PDF Baru" : "Upload PDF"}
            </h3>
            <div className="space-y-4" data-unique-id="72222ca5-d82c-4af1-96f1-081a9931a251" data-file-name="components/PDFManager.tsx">
              <div data-unique-id="e683c728-8723-4b2a-9063-0cd7f7add99a" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="45f89b02-26eb-48bd-9378-19fe31d8e8d8" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="e68c54d8-f7ef-416c-b849-963e5435ad44" data-file-name="components/PDFManager.tsx">Judul PDF</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul PDF" className="w-full" data-unique-id="cc5fc9cc-df82-4b52-ad2b-a1e13a141fa2" data-file-name="components/PDFManager.tsx" />
              </div>
              
              <div data-unique-id="bef73fce-5b49-444d-9064-9a5fb661be12" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="5523068a-9ef0-4437-acd1-aa7619b85442" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="40b6c46f-aebe-4e0e-bab2-dbdab2ed1de9" data-file-name="components/PDFManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="8eda8523-43fe-4bbb-a946-d0a214f4772b" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="9147f9fa-f861-4acb-a8eb-db859269b226" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="6559442e-b082-4e14-ac40-f0041782b8e6" data-file-name="components/PDFManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="b9201373-f901-428e-bad5-14c7a869af8e" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="b9d2a066-3089-43db-be92-7a01afde740c" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="d2044203-6c1b-47c9-bd79-f7d41a009b92" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="f6efad4a-15f4-40c0-bade-6ff48209e1b6" data-file-name="components/PDFManager.tsx">Cover PDF</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="77f9f68a-904b-4eb8-a687-e1f43a1e02bd" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} className="flex items-center" data-unique-id="9347c09b-d000-4a23-bd33-d5fc057dce1d" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                    <Image className="h-4 w-4 mr-2" data-unique-id="89704bd3-d690-4045-abd1-28a8fe96376a" data-file-name="components/PDFManager.tsx" />
                    {formData.coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                  </Button>
                  {formData.coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="f20aa2a1-c269-4a32-8e17-e2256bfccf5f" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {formData.coverFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="35f960c9-8e55-40eb-8f32-25750fd1c5c2" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="328fbe97-c943-437c-9107-9228c7e47669" data-file-name="components/PDFManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.coverFile && formData.coverUrl && <div className="flex items-center" data-unique-id="5a4c1665-b78c-4087-9c72-c092a9c9aaf6" data-file-name="components/PDFManager.tsx">
                      <span className="text-sm text-muted-foreground mr-2" data-unique-id="93590833-8ac3-4c52-a8f7-ad67ade136c0" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="f4163fa0-3fcc-459f-9fe6-c1c5af063ca1" data-file-name="components/PDFManager.tsx">Cover sudah ada</span></span>
                      <img src={formData.coverUrl} alt="Cover" className="h-8 w-8 object-cover rounded" data-unique-id="5dfb3db9-44fb-40c6-9aac-91978be14f0b" data-file-name="components/PDFManager.tsx" />
                    </div>}
                </div>
                <input ref={coverInputRef} id="coverFile" name="coverFile" type="file" accept="image/*" onChange={e => handleFileChange(e, 'coverFile')} className="hidden" data-unique-id="2b6e7da3-10af-4a98-9f2b-dbdddbb6a1fb" data-file-name="components/PDFManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="7e928dc3-9c22-4a3b-bb7b-ed8cb7ab256b" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="74af9d5e-a80d-49dd-955f-e448b9e06cb7" data-file-name="components/PDFManager.tsx">
                  Format gambar: JPG, PNG, atau GIF
                </span></p>
              </div>
              
              <div data-unique-id="3fd940a5-7996-4f09-a646-52f421d836e1" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="pdfFile" className="block text-sm font-medium mb-1" data-unique-id="c6dd2f81-c1cb-43e6-a033-c30e9be89673" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="daa271b8-71f6-46be-b96b-934de4d5e95e" data-file-name="components/PDFManager.tsx">File PDF</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="b3c7c938-58e8-49a4-8651-a68e73a60739" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => pdfInputRef.current?.click()} className="flex items-center" data-unique-id="938c709f-57de-4ce5-856b-6d67ab62dbc0" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                    <FileText className="h-4 w-4 mr-2" />
                    {formData.pdfFile ? 'Ganti PDF' : 'Pilih PDF'}
                  </Button>
                  {formData.pdfFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="d8a1d133-e2bf-4c53-8b00-f7634e95b4ac" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {formData.pdfFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="10aa1b96-8166-4d62-a923-28ec261786dd" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="90f25af2-e1d2-4c23-8ebe-e3942f34e90d" data-file-name="components/PDFManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.pdfFile && formData.fileUrl && <span className="text-sm text-muted-foreground" data-unique-id="d671c8ed-bcde-4a37-8bbd-af87fb508190" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="dfca2e23-2d09-4d7c-a610-1c1aa5f29d1b" data-file-name="components/PDFManager.tsx">
                      File PDF sudah ada
                    </span></span>}
                </div>
                <input ref={pdfInputRef} id="pdfFile" name="pdfFile" type="file" accept="application/pdf" onChange={e => handleFileChange(e, 'pdfFile')} className="hidden" data-unique-id="041cd5b2-a384-440f-b780-321b1c0d8c42" data-file-name="components/PDFManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="bbb2ca1b-9b9f-49bc-8476-8f500de1fdcc" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="9eda217a-ad69-4be3-af92-beeb84f2da7b" data-file-name="components/PDFManager.tsx">
                  Format file: PDF
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="6529941d-eb35-4f56-a066-5271070aefca" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                {editingPDF !== null && <Button variant="outline" onClick={cancelEditing} disabled={isUploading} className="flex items-center gap-1" data-unique-id="782198b1-51f8-4461-8a83-8c1f7184e1eb" data-file-name="components/PDFManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="f21a4fa7-3267-4cad-9518-1f73786bc909" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="9ee37b37-8a77-46e5-b892-ad809c658e8f" data-file-name="components/PDFManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingPDF !== null ? () => updatePDF(editingPDF) : createPDF} disabled={isUploading || !formData.title || !formData.categoryId} className="flex items-center gap-1" data-unique-id="784959ab-a4ce-4bda-9d7c-91c21e79dad5" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  {isUploading ? <span className="flex items-center" data-unique-id="87647212-6455-4d28-ac43-5c53713d7d74" data-file-name="components/PDFManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="88902097-b57c-4c04-a219-a505e1162519" data-file-name="components/PDFManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="bc34f4aa-e3db-4970-990e-c3f13da452a3" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="a03e79fc-148f-4493-8cc6-713d9902de98" data-file-name="components/PDFManager.tsx">Mengupload...</span></span>
                    </span> : <>
                      {editingPDF !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="d1a4cd09-09bc-40f3-a366-b3743f791a95" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="87b08185-4d8a-4746-b04f-20c2bdee1bbd" data-file-name="components/PDFManager.tsx">Perbarui PDF</span></span>
                        </> : <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="00b05173-aaa9-4f42-a6df-025b26fa73fb" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="3f60d8f1-6c37-49b7-930d-ef0487273447" data-file-name="components/PDFManager.tsx">Upload PDF</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="5f3d6519-4947-4bab-93fb-0188cb5322f0" data-file-name="components/PDFManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="dfab8304-7806-4c54-bfd5-b9bfd256f8f9" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="3ee93697-ea2e-44a0-b4e7-d96d8d32db0e" data-file-name="components/PDFManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="5c945bcc-dd3e-4437-9755-e8ee50cce8b8" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="a873c366-a83d-4d17-adc8-03ba7f36d12e" data-file-name="components/PDFManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="6db963f5-a546-4417-93ed-c828170d6e57" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="dd2fae51-d46e-46d9-91d3-013d8b667bea" data-file-name="components/PDFManager.tsx">
                    <span data-unique-id="64ff2f27-2d74-4339-8b7f-fae04bf05d70" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="7e43d9bf-e8d3-4635-bb63-eb445051c628" data-file-name="components/PDFManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="fa0eed3d-616e-412a-b1b3-e42fa06b0cab" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="cf31c89f-62f2-4347-a176-0995df4b64c4" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="a4a07da8-cbb2-4f00-82ce-1ae3391ac6ce" data-file-name="components/PDFManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="c645ffc1-88c4-457e-8c99-e3d9513eb195" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="73e80ceb-9a1d-42cc-b73c-2bbfe991790f" data-file-name="components/PDFManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="969d20ea-2372-4f41-b39d-4dcdd659e560" data-file-name="components/PDFManager.tsx">
              <div data-unique-id="53cccfc5-9c71-4ca5-9379-295dcad6c3f8" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="0935ace0-6933-4a2e-b07d-3d0c69abc6a4" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="51dfb8fb-9f35-41bb-b595-c9038b6d66ac" data-file-name="components/PDFManager.tsx">Judul PDF</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="b1741323-4cde-4790-b200-643f785b7f62" data-file-name="components/PDFManager.tsx" />
              </div>
              <div data-unique-id="1bb0ad38-f933-4492-82e5-05773374930e" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="0dd5c047-5550-426c-91ff-5f08ceb2653b" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="e1adbde7-982d-408b-a89d-a3eb5d003c3c" data-file-name="components/PDFManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="da9848ff-53e6-4d47-8b93-2f02393fd377" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="77b32b8a-80ec-4994-b339-fda6c9bb3332" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="65976857-e896-4a85-ba3a-66c954ed8daf" data-file-name="components/PDFManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="dc307291-35a7-44c3-adb9-6f7144463c01" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="d2e43704-4344-43fd-9fdb-da4c7e91b88d" data-file-name="components/PDFManager.tsx">
                <Button onClick={handleSearch} className="flex-1" data-unique-id="bb0cb90b-dd30-4cc2-817a-b05f1c2862a4" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="82ab56c1-3632-4989-bf2a-03d3eeee6f6b" data-file-name="components/PDFManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="30529e23-be38-480a-8f6b-ddc7e8e82881" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="d9fa2dc6-91ca-49a2-bb29-45fdee00d892" data-file-name="components/PDFManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDFs list */}
          <div data-unique-id="79c0ff3b-64e6-4562-9535-117a260b1b22" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="1a2818e7-3dbd-4236-85bd-5fafe6d2ea82" data-file-name="components/PDFManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="37245358-d9ef-439e-bed9-a6a5e9dedb23" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="19803ced-d31c-4abd-8fae-675ea3cfdc55" data-file-name="components/PDFManager.tsx">
                Daftar Ebook PDF
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="c74e8641-fbb1-4a1a-be63-75ed4aa85be9" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2f4f3d53-4492-4a1f-b095-4f3e1da4dc9e" data-file-name="components/PDFManager.tsx">
                  (</span>{pdfs.length}<span className="editable-text" data-unique-id="673a78da-d72f-4869-9651-396546ccfa11" data-file-name="components/PDFManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="0b17f6ba-3a04-43c5-95b9-bad8a0c33a58" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="e1f762be-9c51-4193-8cfb-72ffef7652e7" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="13a06d96-7bfe-4f9f-be16-e082d9ab7ad5" data-file-name="components/PDFManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="2ad9cd6e-2397-43bf-a02b-2b371999f1f7" data-file-name="components/PDFManager.tsx">
                  <option value={10} data-unique-id="dfddab24-ca0a-4e75-94ab-ebfdac53835a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="4b2728b5-d9c2-41a7-b234-1c9d401d76f9" data-file-name="components/PDFManager.tsx">10</span></option>
                  <option value={50} data-unique-id="26c74ada-d0ff-4ee9-a255-ab5b2f8d370c" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="e086b913-70cf-4808-a65e-2ef1ddaf1e1d" data-file-name="components/PDFManager.tsx">50</span></option>
                  <option value={100} data-unique-id="4358da7a-2cb5-4940-bba0-4f8b9841e2bd" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="3716e9dd-c543-491d-bf72-89e6b8642ba6" data-file-name="components/PDFManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto" data-unique-id="cd0495af-b055-47bc-ac3d-c7cda69312df" data-file-name="components/PDFManager.tsx">
              <Table data-unique-id="4400acc3-dca8-49df-b269-019fb31653d1" data-file-name="components/PDFManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="77736f03-c8fa-45e5-a945-5f3ed1332564" data-file-name="components/PDFManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[100px]"><span className="editable-text" data-unique-id="92f4364a-4499-4cb2-af92-a96998b344ab" data-file-name="components/PDFManager.tsx">Cover PDF</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="25e8e9a3-cb65-4dfd-b235-0318c9d38cb8" data-file-name="components/PDFManager.tsx">Judul PDF</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="9322a3ee-baf7-4c87-b52b-26ed7414d337" data-file-name="components/PDFManager.tsx">URL Cover</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="e86edbc0-b103-47b7-95b3-c88d9d5d7e49" data-file-name="components/PDFManager.tsx">URL File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="54a15564-becc-4a18-bc39-f77533b3672c" data-file-name="components/PDFManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="409b28ba-7736-4b22-9d53-122e699848db" data-file-name="components/PDFManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="fa60f2e5-b2e0-4110-9e78-3fc1c697b451" data-file-name="components/PDFManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="d1980153-4632-4c46-8b5e-ff29e66b870d" data-file-name="components/PDFManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : pdfs.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="e21a42a4-b687-4e3d-aca2-78bb746884c9" data-file-name="components/PDFManager.tsx">
                        Belum ada PDF. Silakan tambahkan PDF baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(pdfs) && pdfs.map((pdf, index) => <TableRow key={pdf.id} data-unique-id="27f795c9-14a4-4122-8588-9695053981a5" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="471b6df3-d5a1-4690-91dc-13465c1e0097" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="f73a72c6-c182-451a-8ff8-d0a0fa26bec6" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <img src={pdf.coverUrl} alt={pdf.title} className="h-16 w-12 object-cover rounded" data-is-mapped="true" data-unique-id="715eff41-8d0b-47ff-a5a1-81c70e7f2ab1" data-file-name="components/PDFManager.tsx" />
                        </TableCell>
                        <TableCell className="font-medium" data-unique-id="27a8f5d4-93d8-4712-bfd9-bbcc1fd1235b" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{pdf.title}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="dd8158f1-54bb-4057-9921-e09e9bb677a1" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="8b31cad2-6971-4e95-96b6-fde39fd6e64b" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                            {pdf.coverUrl}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="7e9889fd-9f79-4b57-a286-ea8fa96dec2a" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="fee3e5f6-7fe5-4746-a6df-2763b7d99f0c" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                            {pdf.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="9ffcb79a-a5bf-4a89-9bd8-70bd6d05c4fd" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{pdf.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="e9540bbc-18e5-44be-b19a-c097824c8691" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="ad08528a-3d59-4e59-a61b-4d2329077210" data-file-name="components/PDFManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => {
                        // Open in a new tab with a timestamp parameter to avoid caching issues
                        window.open(`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`, '_blank');
                      }} className="flex items-center" title="View PDF" data-is-mapped="true" data-unique-id="359787fb-a095-4a65-966f-a3f7b9864f90" data-file-name="components/PDFManager.tsx">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-is-mapped="true" data-unique-id="ff7c2ba4-972d-44f2-a5a1-31e7fa7b1f7f" data-file-name="components/PDFManager.tsx">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" data-unique-id="97536c14-66b7-496e-a494-05458babd0ff" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></path>
                                <polyline points="15 3 21 3 21 9" data-unique-id="d85e557b-4bf3-4f67-9fb5-8f3359a8f5ee" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3" data-unique-id="1eacfaed-fe05-4751-8d94-6c156f0cb6f2" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></line>
                              </svg>
                              <span className="sr-only" data-is-mapped="true" data-unique-id="89ead006-e791-4c5b-9917-308cea43eaa6" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="8774ad1c-a4b7-4ef2-86c8-a70f16a18359" data-file-name="components/PDFManager.tsx">View</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => startEditing(pdf)} disabled={editingPDF !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="ab5593c3-5b88-4256-9bbe-82b0cd2f4503" data-file-name="components/PDFManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="94a25fdc-af95-4f55-b02e-dcaada1949e3" data-file-name="components/PDFManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="86c39c02-8eff-48cf-b5ba-d687016053f8" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="43d97a0b-d63f-4d5b-a94f-33e6de637566" data-file-name="components/PDFManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deletePDF(pdf.id)} disabled={editingPDF !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="f43b27ef-e01b-4d04-8708-ea4afc672ef8" data-file-name="components/PDFManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="b6c13690-7ca0-4781-aae2-426acdce4813" data-file-name="components/PDFManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="0f0fdcec-b077-4754-8590-905db59ff22d" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="b8effc9c-effd-4168-894d-60c342357859" data-file-name="components/PDFManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="4446c8fe-baf0-4e44-8291-c8e4c5205295" data-file-name="components/PDFManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="b7138efe-967b-40dd-92bc-85cdef0ddc7c" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="6d24b4ca-37fe-4f1c-9e62-49c0de357b86" data-file-name="components/PDFManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="a7abb3e8-51c9-426f-9a8b-367455188bac" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="6439f8e2-8044-4273-aa5c-e2400e21096a" data-file-name="components/PDFManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="cc70750a-cb91-4150-971e-1ffbe315ae94" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="1b4003a2-0fdc-4bbf-be92-a05d48728ea5" data-file-name="components/PDFManager.tsx">
                    <span data-unique-id="fbf994b2-36be-413e-a009-483523933b6e" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="c756ba2b-a442-4c0b-8c67-ebeacbdada6e" data-file-name="components/PDFManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}