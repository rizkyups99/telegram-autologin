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
  return <div className="space-y-6" data-unique-id="1c45e91b-ed11-4f08-8199-9a943650c427" data-file-name="components/PDFManager.tsx">
      <Card data-unique-id="da292158-d343-44e5-958c-4d7a5a4eba0c" data-file-name="components/PDFManager.tsx">
        <CardHeader data-unique-id="36ba6d87-cbde-47fb-999a-3c3eb6fba456" data-file-name="components/PDFManager.tsx">
          <CardTitle data-unique-id="7db13a5a-bf19-4c75-a1d7-934d3faae026" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="6c8109de-abc7-4081-9fa6-6f71ea2a2a4a" data-file-name="components/PDFManager.tsx">Manajemen Ebook PDF</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="f6d49547-1878-4ab0-95e6-b30d9d0d6c3e" data-file-name="components/PDFManager.tsx">
            Upload dan kelola ebook PDF untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="365821ec-0dd0-4a92-a7eb-60b87b8479cc" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
          {/* PDF Recovery Tool */}
          <PDFRecoveryTool />
          
          {/* Form for creating/editing PDFs */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="a96f8be7-256e-44aa-a64c-56025ce7c263" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="61216828-ad3d-46c0-a445-b05ee0cb7734" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
              {isCreating ? "Upload PDF Baru" : "Upload PDF"}
            </h3>
            <div className="space-y-4" data-unique-id="371d9329-268c-4a4f-ac8c-0b89fb5c242e" data-file-name="components/PDFManager.tsx">
              <div data-unique-id="e4d40ac0-a1cb-4c60-97dc-a6086b24d22a" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="08ff7c44-d8f0-46bc-ac82-7512beffeeb8" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="45bc957a-cb41-4bee-afa2-62566d339705" data-file-name="components/PDFManager.tsx">Judul PDF</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul PDF" className="w-full" data-unique-id="2eb1341b-814e-4bbf-97a4-241aaeb25139" data-file-name="components/PDFManager.tsx" />
              </div>
              
              <div data-unique-id="1f976c2a-e87f-42cf-8421-75ce770a4ca6" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="f869a67d-59ae-4b9e-b92a-09bb4f688642" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="e9172ff2-1366-4c57-a9c9-45ca49b81c3c" data-file-name="components/PDFManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="e33d3f69-1dfc-4239-95d5-ba33f7b18ace" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="dd91777d-6bc2-42cc-b90a-167ecbc84043" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="55f1706b-bad5-4ecb-9dd8-8e00571f9212" data-file-name="components/PDFManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="18de3d32-3b0f-4b46-981f-1ca7b19dfe06" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="94d24c1f-fdea-45ae-8f09-538edc8e5ce6" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="bb98c869-ebd5-4c02-90d2-f58696e2543e" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="ebd2ee9b-45a9-4fac-becf-6057023e1b83" data-file-name="components/PDFManager.tsx">Cover PDF</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="dc611651-a4c5-450a-90d5-b427f23cd057" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} className="flex items-center" data-unique-id="d9e91991-578a-462d-998a-1ec67c34b62f" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                    <Image className="h-4 w-4 mr-2" data-unique-id="56813b88-a258-4f73-9846-4ddc90837b14" data-file-name="components/PDFManager.tsx" />
                    {formData.coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                  </Button>
                  {formData.coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="d6af35f5-8761-4945-84a4-7f8f2d48bc4d" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {formData.coverFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="d4e234da-fb7f-425b-b41c-a097f5ec37b4" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="c7d095cd-495c-4590-a724-8a429e294a54" data-file-name="components/PDFManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.coverFile && formData.coverUrl && <div className="flex items-center" data-unique-id="39552f30-d459-4571-9329-c4545da2a729" data-file-name="components/PDFManager.tsx">
                      <span className="text-sm text-muted-foreground mr-2" data-unique-id="9446fd42-9512-4b15-94e8-a3d4dc845652" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="62aa3492-8164-4138-9b5f-56beafa4049a" data-file-name="components/PDFManager.tsx">Cover sudah ada</span></span>
                      <img src={formData.coverUrl} alt="Cover" className="h-8 w-8 object-cover rounded" data-unique-id="3bfab984-7982-4aba-adcc-fb473db62075" data-file-name="components/PDFManager.tsx" />
                    </div>}
                </div>
                <input ref={coverInputRef} id="coverFile" name="coverFile" type="file" accept="image/*" onChange={e => handleFileChange(e, 'coverFile')} className="hidden" data-unique-id="30b769c1-1cc0-4af8-ab00-11e79c2cae9e" data-file-name="components/PDFManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="1354d647-25ba-4775-aa6a-00578a21d10e" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="59c593f0-5ec5-48ad-af2e-19430fb787e6" data-file-name="components/PDFManager.tsx">
                  Format gambar: JPG, PNG, atau GIF
                </span></p>
              </div>
              
              <div data-unique-id="7162ad46-613c-4409-81f1-2b8820bcb878" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="pdfFile" className="block text-sm font-medium mb-1" data-unique-id="26f8a193-172c-4c2f-ae3b-e9d8bf35aab1" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="ac02cce7-1454-439d-939d-9f1269e20725" data-file-name="components/PDFManager.tsx">File PDF</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="045dd4c4-8040-41d8-a221-ec53138cb472" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => pdfInputRef.current?.click()} className="flex items-center" data-unique-id="e9deef4a-fef9-4457-a884-94c3d38a0f0f" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                    <FileText className="h-4 w-4 mr-2" />
                    {formData.pdfFile ? 'Ganti PDF' : 'Pilih PDF'}
                  </Button>
                  {formData.pdfFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="4cd74d6c-f5b0-4913-bc48-f68addd6f028" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {formData.pdfFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="a0884713-8089-426f-995f-1bdf52e9d2e3" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="ed91d57a-5a74-4b11-98a8-e2d8eec3a63a" data-file-name="components/PDFManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.pdfFile && formData.fileUrl && <span className="text-sm text-muted-foreground" data-unique-id="370eb5b6-13bd-44b7-8ab7-3a77ead6b657" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="7ca0de27-c33a-4ed1-98fa-0a785d7b74cf" data-file-name="components/PDFManager.tsx">
                      File PDF sudah ada
                    </span></span>}
                </div>
                <input ref={pdfInputRef} id="pdfFile" name="pdfFile" type="file" accept="application/pdf" onChange={e => handleFileChange(e, 'pdfFile')} className="hidden" data-unique-id="168db4da-8c1e-4117-b279-f675b0c4c170" data-file-name="components/PDFManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="f8f51145-18a9-4020-a36a-5b10aeb77b84" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="aa043369-29a0-417c-9b74-df0770e1d0e4" data-file-name="components/PDFManager.tsx">
                  Format file: PDF
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="a43c0e44-dfea-46d5-8b1e-75631c9d5a71" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                {editingPDF !== null && <Button variant="outline" onClick={cancelEditing} disabled={isUploading} className="flex items-center gap-1" data-unique-id="41179252-23da-4d9f-9f50-a63b2d3186c4" data-file-name="components/PDFManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="bbaa25a7-ffd5-4db9-a01b-86fe452426b5" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="549943ae-0ed9-4934-b09c-44ee1596e194" data-file-name="components/PDFManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingPDF !== null ? () => updatePDF(editingPDF) : createPDF} disabled={isUploading || !formData.title || !formData.categoryId} className="flex items-center gap-1" data-unique-id="b2aa4098-e878-4922-9b89-54a22f6aaf85" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  {isUploading ? <span className="flex items-center" data-unique-id="3307261e-69bb-4fe9-9bbe-81a50ea3eda5" data-file-name="components/PDFManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="167624cf-521a-460a-90e8-effdcb53d4de" data-file-name="components/PDFManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="d244eef3-4af7-4b6e-986a-d956fff34a82" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="9922bdfd-efa6-40a6-8ecd-88f5d0b21d41" data-file-name="components/PDFManager.tsx">Mengupload...</span></span>
                    </span> : <>
                      {editingPDF !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="c97e440d-3713-411a-9a50-629d9208022b" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="1838fab0-1139-4e23-ac74-d13c82357e5c" data-file-name="components/PDFManager.tsx">Perbarui PDF</span></span>
                        </> : <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="ccde18e5-32ee-4c9d-bfa5-62fe6fd5d30a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="dfd5d0e6-d576-44e2-9df4-6304c66a0dc3" data-file-name="components/PDFManager.tsx">Upload PDF</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="c7f9f44f-b443-4be1-89d6-2d38ed05a75c" data-file-name="components/PDFManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="9edcd7bf-fc3c-4eb0-a037-be3f48db7f18" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="9adeba2a-19e6-4b29-84e0-56f7c8ff9385" data-file-name="components/PDFManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="0b568445-e40c-4019-9ad9-8d9f5834fb1f" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="02f6ed71-5c0d-41ed-9f57-2c8a5ce2dace" data-file-name="components/PDFManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="314dc4eb-d326-4673-9a50-d02137d0cf04" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="edfe9b0b-5b27-4858-b07f-df1becfcde66" data-file-name="components/PDFManager.tsx">
                    <span data-unique-id="b0c08edb-069d-4c08-9c14-a67cc62174a0" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="df22a3b6-a6fd-4fa7-a4aa-a8e4474bab23" data-file-name="components/PDFManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="fe8576bf-1c43-4429-a3e3-9f12bdd55d92" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="da60ba17-3f93-4090-853f-fe33815345a2" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="0f1f1b88-c73a-49ca-9a86-ab29e823a5f3" data-file-name="components/PDFManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="52378704-cf94-4a5f-bf74-a8eadee1a533" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="dc437fe1-84a0-4b0d-b013-2d06c43a008e" data-file-name="components/PDFManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="4a7bc506-c943-4108-8953-330637ad9117" data-file-name="components/PDFManager.tsx">
              <div data-unique-id="67bc0f50-2057-43ac-b718-7492e51426e7" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="0c468bb6-568e-404a-beca-9f1fad268d4c" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="1701c861-3d5f-4fe3-b901-9f598f76cd4f" data-file-name="components/PDFManager.tsx">Judul PDF</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="128d997b-8d6e-4049-9862-777e072d16bd" data-file-name="components/PDFManager.tsx" />
              </div>
              <div data-unique-id="c78a05e0-26b7-4828-9e05-3941c81a8696" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="d638ca37-cd0f-42c6-af25-d46c368f9c25" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="23f2cd46-ca1d-43a2-bdd8-ddf889d6d0e9" data-file-name="components/PDFManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="1a1cb47c-02a4-48b4-a27f-d917c8774b9f" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="5b085aeb-8bfa-4dc9-acf7-cc202b65ff49" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="c8a88e75-9233-4173-a50f-bd5aff26938f" data-file-name="components/PDFManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="d394aa63-6560-47fe-a42f-e5927b9bff54" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="42f73de8-75f8-4d65-a484-4047c87a58e6" data-file-name="components/PDFManager.tsx">
                <Button onClick={handleSearch} className="flex-1" data-unique-id="b99ef882-1c77-4455-aa39-f48553ff738a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="72155715-b917-435a-bbdf-2d3b225befb3" data-file-name="components/PDFManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="a8ae1799-5dce-4eed-b481-f300d3019e3c" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="11133c57-8185-4ff4-89ab-c4a71e926ff0" data-file-name="components/PDFManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDFs list */}
          <div data-unique-id="7ed6274f-0e47-4973-9c0e-66908b2971da" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="3323db5d-c4c2-4c6b-8ae7-1a9f1fd039ce" data-file-name="components/PDFManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="c267a2c8-12d6-4924-8bc9-1664409fbf0d" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="69765f63-c8ef-4ee8-b5ff-18e0860954eb" data-file-name="components/PDFManager.tsx">
                Daftar Ebook PDF
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="77b3425e-052d-4da1-b09f-f77b27ae0a38" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2d4bb95e-ce4a-4514-81db-e7a4454fcd84" data-file-name="components/PDFManager.tsx">
                  (</span>{pdfs.length}<span className="editable-text" data-unique-id="0913c8db-058a-4174-9c65-f30e3120d0da" data-file-name="components/PDFManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="cb1ef3d0-bfad-4abd-afdb-1ba2fcf83174" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="6a41a809-3a44-4cfc-a95b-963a6da7c8b3" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="b1cf51a9-a14d-4c9a-bf95-97925f50c412" data-file-name="components/PDFManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="e32bf18d-9a4a-415e-b66b-a187fd5b17a5" data-file-name="components/PDFManager.tsx">
                  <option value={10} data-unique-id="147f879f-4fda-4957-b6e0-2f11801a82cf" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="d38dd3e8-ed7a-4627-81ea-d02e4d2744c8" data-file-name="components/PDFManager.tsx">10</span></option>
                  <option value={50} data-unique-id="7fa936b9-e5aa-4552-b27e-56bffebbcc49" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="9b5abc12-f423-4251-8dee-5e177030b7ad" data-file-name="components/PDFManager.tsx">50</span></option>
                  <option value={100} data-unique-id="976cdfea-a7cd-425b-8efa-65b02ea842ce" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="d39b7794-f5ae-447e-97ad-220800f0a349" data-file-name="components/PDFManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto" data-unique-id="3a70ef04-b060-473d-b8e6-ca109473d611" data-file-name="components/PDFManager.tsx">
              <Table data-unique-id="88001da6-4455-4484-bf20-0e6397c0be9d" data-file-name="components/PDFManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="f32c8980-2a62-4abf-852e-67511db2bba9" data-file-name="components/PDFManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[100px]"><span className="editable-text" data-unique-id="528a3468-5161-4f62-8ee3-9d88b1bd08bb" data-file-name="components/PDFManager.tsx">Cover PDF</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="b4ade760-0721-490c-9680-648f47f62568" data-file-name="components/PDFManager.tsx">Judul PDF</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="26fdfc00-98ba-458a-82ee-b9398bb36c18" data-file-name="components/PDFManager.tsx">URL Cover</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="639d9bd2-7339-40a1-a7a9-0ac8ad332bd4" data-file-name="components/PDFManager.tsx">URL File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="b3a0f1f6-d77f-49a5-a3b0-59938426b711" data-file-name="components/PDFManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="5da0e5d9-4dec-4d3b-b3b3-07bc3c82923c" data-file-name="components/PDFManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="9f3787be-33bc-4460-9f12-a940a65b932e" data-file-name="components/PDFManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="882410bd-376b-4a42-8229-823ab86a6a78" data-file-name="components/PDFManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : pdfs.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="85292b21-201c-4bd8-9584-e7354f2233fa" data-file-name="components/PDFManager.tsx">
                        Belum ada PDF. Silakan tambahkan PDF baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(pdfs) && pdfs.map((pdf, index) => <TableRow key={pdf.id} data-unique-id="9f65f6b7-08bc-4dcc-ac3e-b5bb748d4a6a" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="f0080637-9ea6-44ee-9343-b5a9ae0fe546" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="9e28637d-f153-4759-80ad-5952ea8cbab9" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <img src={pdf.coverUrl} alt={pdf.title} className="h-16 w-12 object-cover rounded" data-is-mapped="true" data-unique-id="77ed2d1a-8f81-4800-96e6-550288d5a0a2" data-file-name="components/PDFManager.tsx" />
                        </TableCell>
                        <TableCell className="font-medium" data-unique-id="e352f4ec-7079-4ec5-9d2a-58021b4c46e6" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{pdf.title}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="318a71c2-c72c-4590-9037-0e8265e4902a" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="a0c7f495-9b8d-4fcf-a5df-7a6e227fc982" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                            {pdf.coverUrl}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="3fbf2a1a-5cb6-413b-8e7b-1e19d1d7b348" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="1de4b751-fa8c-4a78-a814-5f370faafd2f" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                            {pdf.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="ef270535-22c3-41d2-9cae-952ef37f3583" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{pdf.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="2a8d43ab-c94d-470d-8ba0-371d34c4d49b" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="dec56e24-e502-4ce4-8ab1-2ecb298ee11c" data-file-name="components/PDFManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => {
                        // Open in a new tab with a timestamp parameter to avoid caching issues
                        window.open(`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`, '_blank');
                      }} className="flex items-center" title="View PDF" data-is-mapped="true" data-unique-id="139ed76c-c216-489b-b6a1-2424142cef54" data-file-name="components/PDFManager.tsx">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-is-mapped="true" data-unique-id="17a19c3b-72d9-44ac-9ef1-c385586bc84f" data-file-name="components/PDFManager.tsx">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" data-unique-id="68cece75-3031-4099-b925-7dce99ba5f6d" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></path>
                                <polyline points="15 3 21 3 21 9" data-unique-id="9251cf70-5017-4eb4-8548-63df6b2dbf5e" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3" data-unique-id="bf6f8c1f-07f9-40cf-9bc1-d49acc5b1621" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></line>
                              </svg>
                              <span className="sr-only" data-is-mapped="true" data-unique-id="6ab1ec48-ddec-4b03-9603-ea82c683af4f" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="bd8fddb0-8c62-4bca-96dd-0dcd593ac7b0" data-file-name="components/PDFManager.tsx">View</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => startEditing(pdf)} disabled={editingPDF !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="79aca549-9469-419d-b3a9-a2447aa8dc90" data-file-name="components/PDFManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="81e8a75f-427e-4270-8eb1-db8469d2491e" data-file-name="components/PDFManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="f9ea7f61-f3b6-4d38-afe7-a5e1c72da2bf" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="4efb6604-2d79-4c9f-a8a3-e411c4068318" data-file-name="components/PDFManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deletePDF(pdf.id)} disabled={editingPDF !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="2daf0dfd-99e2-44e3-9222-3ec25d8245e9" data-file-name="components/PDFManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="c85a964a-e124-49c4-8e19-830ab63b9517" data-file-name="components/PDFManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="d9c21096-d4b0-4abe-ba6f-2e420d425ab7" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="e2a8b9cd-2311-4394-8c0f-e558b84bf9e8" data-file-name="components/PDFManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="48cbea8e-c67d-4e37-a3a7-edaa1c955f56" data-file-name="components/PDFManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="ab1f62c4-85f3-45af-b866-48abaedc934d" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="f3603887-183d-48bd-8759-b767bba828e7" data-file-name="components/PDFManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="d7d8d491-42ae-4a84-9030-37e0fb983301" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="9085afe2-17fe-4f76-93b5-a74d56739564" data-file-name="components/PDFManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="6dbe64f6-dfcc-46ab-9127-ac960bd96bcc" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="4c6dad17-5cb7-4702-a6c7-c2ce4efb5d8e" data-file-name="components/PDFManager.tsx">
                    <span data-unique-id="501dcf65-5ca3-4fe9-84fd-b50071a44613" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="b3872ec0-6f1b-43f3-83f8-2360d2638da4" data-file-name="components/PDFManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}