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
  return <div className="space-y-6" data-unique-id="43986298-b4df-432d-bbbf-d54bc2dd1c1f" data-file-name="components/PDFManager.tsx">
      <Card data-unique-id="15e2e06b-1742-41d7-84f6-99bdc3a1a083" data-file-name="components/PDFManager.tsx">
        <CardHeader data-unique-id="c82c6ed3-e80c-4f21-8c71-5a7385b0d146" data-file-name="components/PDFManager.tsx">
          <CardTitle data-unique-id="7b3b6314-5f6e-4874-9572-3543959360d9" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="26cd90fc-bc54-4d1b-ae7f-71346a5f4895" data-file-name="components/PDFManager.tsx">Manajemen Ebook PDF</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="2a53ef19-3f92-4d41-9b33-065b65d9346d" data-file-name="components/PDFManager.tsx">
            Upload dan kelola ebook PDF untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="1cee35e8-d044-4340-8276-6cd7453dd531" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
          {/* PDF Recovery Tool */}
          <PDFRecoveryTool />
          
          {/* Form for creating/editing PDFs */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="f302ef0e-d8b3-4f10-8ef1-795aed291c02" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="c3418259-2929-43ed-8d54-d12d5b14e8e6" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
              {isCreating ? "Upload PDF Baru" : "Upload PDF"}
            </h3>
            <div className="space-y-4" data-unique-id="f996a947-c17a-4e01-988c-75b85b582703" data-file-name="components/PDFManager.tsx">
              <div data-unique-id="f73fb379-7bbb-4599-b0ba-45384d91663d" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="d7d7667c-9963-4a8c-b810-a3a5cad5fa0f" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="3ad37311-3da9-4c8c-8741-8028610c342b" data-file-name="components/PDFManager.tsx">Judul PDF</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul PDF" className="w-full" data-unique-id="4fea1097-0159-40d5-999a-3c7cb3a11690" data-file-name="components/PDFManager.tsx" />
              </div>
              
              <div data-unique-id="873ea716-9a39-47ea-8c1b-2314751a4226" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="dec36e25-4a9c-4425-ac67-849121182e8a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="54582032-fb6a-45ba-b824-0f38e95defa2" data-file-name="components/PDFManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="17e31b99-6bd9-418a-bd5b-5514421d9216" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="d25cc8ff-62b2-4a2e-95cd-9e57625c4312" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="478511e1-cc6b-4fc5-b848-675890908c60" data-file-name="components/PDFManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="52a11e87-897d-46a6-bbd2-c6b6c02f4e44" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="8490aeca-fbf4-48bf-9baf-4ee4b38c23f7" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="3f086f53-123c-439d-b95b-2be150da0826" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="a0a12a54-249a-470f-a29d-5ae7fb89d27c" data-file-name="components/PDFManager.tsx">Cover PDF</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="75823ece-3e49-4511-af86-61d06a39d342" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} className="flex items-center" data-unique-id="b6b54384-5ff2-4bbf-a579-6ca662b7a1fe" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                    <Image className="h-4 w-4 mr-2" data-unique-id="ac9fe992-899c-41e8-a199-e59882889658" data-file-name="components/PDFManager.tsx" />
                    {formData.coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                  </Button>
                  {formData.coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="660772cd-526c-4c8f-a252-41818b3fddd0" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {formData.coverFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="a10fb8ec-6ec2-4f51-849d-a0159908896a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="7bd67222-40a2-46f5-9301-bd74d426aa1c" data-file-name="components/PDFManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.coverFile && formData.coverUrl && <div className="flex items-center" data-unique-id="51a168d8-3f9e-4406-b46e-fc45db51a697" data-file-name="components/PDFManager.tsx">
                      <span className="text-sm text-muted-foreground mr-2" data-unique-id="4263e456-3581-4637-aa96-d059349c95e5" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="ab04574e-e648-4061-9b83-fb232d39735b" data-file-name="components/PDFManager.tsx">Cover sudah ada</span></span>
                      <img src={formData.coverUrl} alt="Cover" className="h-8 w-8 object-cover rounded" data-unique-id="f2333024-1bdc-4fef-8c1d-26a0c0039fec" data-file-name="components/PDFManager.tsx" />
                    </div>}
                </div>
                <input ref={coverInputRef} id="coverFile" name="coverFile" type="file" accept="image/*" onChange={e => handleFileChange(e, 'coverFile')} className="hidden" data-unique-id="786b4aed-7523-4236-b8ac-2c80dd386fae" data-file-name="components/PDFManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="b1a3c0c7-708e-48ba-adcc-7b21ec25d133" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="82406afd-a450-48c9-a532-13762bcb0826" data-file-name="components/PDFManager.tsx">
                  Format gambar: JPG, PNG, atau GIF
                </span></p>
              </div>
              
              <div data-unique-id="74cf5613-b96c-4e2a-a5e0-c78751eb232a" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="pdfFile" className="block text-sm font-medium mb-1" data-unique-id="7300c827-2e41-4310-95a0-1266b97a11c2" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="5e44b675-4185-43af-a22e-92216985242b" data-file-name="components/PDFManager.tsx">File PDF</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="b209f04e-39c6-4ca0-b926-fb3db57ac201" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => pdfInputRef.current?.click()} className="flex items-center" data-unique-id="57084e24-b1ef-4235-9715-30d9767bdadc" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                    <FileText className="h-4 w-4 mr-2" />
                    {formData.pdfFile ? 'Ganti PDF' : 'Pilih PDF'}
                  </Button>
                  {formData.pdfFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="9ea1740f-250f-434c-9955-6930ee7766ce" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {formData.pdfFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="868b5cd6-35c9-4295-938b-c1e3f2efb5c2" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="f29eb6ac-25ce-4339-99d2-5a2b593b1ed2" data-file-name="components/PDFManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.pdfFile && formData.fileUrl && <span className="text-sm text-muted-foreground" data-unique-id="0e677e7d-3c58-45fa-b0d8-4d3d951efc56" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="083e3f54-f8a0-41da-ba4f-bd2220bd4553" data-file-name="components/PDFManager.tsx">
                      File PDF sudah ada
                    </span></span>}
                </div>
                <input ref={pdfInputRef} id="pdfFile" name="pdfFile" type="file" accept="application/pdf" onChange={e => handleFileChange(e, 'pdfFile')} className="hidden" data-unique-id="d0a86027-0517-4d6a-b557-d96b34a5e165" data-file-name="components/PDFManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="4ae96a88-8468-4296-80d3-f376b60900a9" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="0af3f8b9-fb34-4e7b-902c-5cd48b991569" data-file-name="components/PDFManager.tsx">
                  Format file: PDF
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="dab2d8e8-3cca-4fbc-83f6-08e523d1972c" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                {editingPDF !== null && <Button variant="outline" onClick={cancelEditing} disabled={isUploading} className="flex items-center gap-1" data-unique-id="d008ab72-76a6-47a5-953a-3eed92f10f65" data-file-name="components/PDFManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="bb151fe3-3f88-4e6d-8d04-f2c7b1ee4637" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="95e925a6-5529-429a-a6cd-5782a7a64171" data-file-name="components/PDFManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingPDF !== null ? () => updatePDF(editingPDF) : createPDF} disabled={isUploading || !formData.title || !formData.categoryId} className="flex items-center gap-1" data-unique-id="b4df8e37-f0e9-4398-bbdb-52465dd2acfe" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  {isUploading ? <span className="flex items-center" data-unique-id="a920bf6e-e131-4eb3-b697-7159517482ec" data-file-name="components/PDFManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="f9bbd23a-ce8f-476e-addc-7082b5b18159" data-file-name="components/PDFManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="779fa6c5-4b3f-4409-8a36-42b8a1c3fefe" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="63c4a640-270f-4913-b3a2-72211163a4ce" data-file-name="components/PDFManager.tsx">Mengupload...</span></span>
                    </span> : <>
                      {editingPDF !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="b03b7540-f822-4a04-84ca-321d71703524" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="c4436e2f-e468-47c0-a07f-2ae3e3ed1519" data-file-name="components/PDFManager.tsx">Perbarui PDF</span></span>
                        </> : <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="293efef0-eb58-4521-9c50-7c304d499b70" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="bfce29ba-4ee4-4ed8-8746-d59fc6c2cf75" data-file-name="components/PDFManager.tsx">Upload PDF</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="238147ec-91e0-4c9f-a8e6-2775234beecc" data-file-name="components/PDFManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="6050792a-16a1-4b5f-8894-d7121cadf3d4" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="270b25d6-6496-48be-98b6-1b94e25405c2" data-file-name="components/PDFManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="8860cdec-ab68-402f-880e-089b6f2e4778" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="db963307-d832-4612-b66b-a532d4d90ee7" data-file-name="components/PDFManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="0b31aef1-e94d-416d-bb3d-4a8b6b50c15f" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="6c502aea-b148-40cf-bb0b-061fed828ed2" data-file-name="components/PDFManager.tsx">
                    <span data-unique-id="d50afbf2-581d-4065-9419-7cb9dadd80fe" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="034869c3-e291-4138-8e2a-c72ba2efa846" data-file-name="components/PDFManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="f681f14c-bf3a-4a97-9dba-83eb1ec821bb" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="0327614f-79e6-4308-9489-ac92af035639" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="be547cbb-d43e-4152-ab00-a284300aa64d" data-file-name="components/PDFManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="881e6511-7c0a-46ec-8cde-e46367c5a8e3" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="9ccf01ef-830f-46fc-a6d9-a301c640a20e" data-file-name="components/PDFManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="b0ba1f90-832f-419e-bfef-6d56a9ae79d3" data-file-name="components/PDFManager.tsx">
              <div data-unique-id="6b1018c7-b6ed-42ea-8d10-dc06c6bb36fe" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="fbf673c9-5fb7-42d7-8e4a-e79cb58ba446" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="669983a1-fbe4-4ce6-bf8e-aff4bec93132" data-file-name="components/PDFManager.tsx">Judul PDF</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="84db1124-ad97-4ace-b67d-5f8314c589a5" data-file-name="components/PDFManager.tsx" />
              </div>
              <div data-unique-id="128d46ea-644f-414e-abac-8ddcfc612e09" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="422ea3d2-d61a-442d-bbcc-e22ede6792b9" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="3f1ae1e4-aa02-47a8-94ce-df2788bb0570" data-file-name="components/PDFManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="00a7c12a-f8e7-4c12-9902-8bcce511a187" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="43937ca6-3d70-4e86-8661-de2e588c1556" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="42c59004-e911-4680-95b5-a7ece3257747" data-file-name="components/PDFManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="3b14d411-2e93-460f-aaee-d88cc2129abb" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="ce26d52f-5006-45d0-bc3f-2a2c7de22986" data-file-name="components/PDFManager.tsx">
                <Button onClick={handleSearch} className="flex-1" data-unique-id="fbdf57a9-4ae1-4595-af80-5a75cf9d26d3" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="afda4196-18bf-4290-8751-6afa89f1204d" data-file-name="components/PDFManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="0cc9bd10-4461-4445-93d0-76e4051932ac" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="4a80c96f-a47b-4e19-ab72-cc5bb5ad4ab1" data-file-name="components/PDFManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDFs list */}
          <div data-unique-id="581a9dea-c67a-4b71-9b77-a5452c3f4c77" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="672768c3-7779-4537-9447-34df537ade39" data-file-name="components/PDFManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="5179a1fd-47a2-4407-97a1-3a66e24990d8" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="049a8095-1993-41b6-a86a-db45ce671229" data-file-name="components/PDFManager.tsx">
                Daftar Ebook PDF
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="dc45f2f0-4e71-48fe-af2f-0a93439928df" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="00874a0c-89f7-4ddf-8c79-0be9100598ba" data-file-name="components/PDFManager.tsx">
                  (</span>{pdfs.length}<span className="editable-text" data-unique-id="b0319b19-4f3d-48fe-9c5a-9b31c4f963e2" data-file-name="components/PDFManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="ff2352de-76b0-43dd-b483-805bc8249859" data-file-name="components/PDFManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="73f48808-7e2d-4697-bf7d-332d4dba951d" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="9dc17d6f-3670-48eb-90a8-57ddda4ed8fc" data-file-name="components/PDFManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="777553a9-a230-4281-98f8-7b9569ff66af" data-file-name="components/PDFManager.tsx">
                  <option value={10} data-unique-id="b9c8cbc9-0461-4112-96d6-e54c0782d212" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="e2141c4c-0e7c-44d7-93f0-46a2433a8d0b" data-file-name="components/PDFManager.tsx">10</span></option>
                  <option value={50} data-unique-id="dc810280-9fe5-46fa-ad41-d1d83b5cb39e" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="32ba3c6c-051a-415d-af35-4be76553c28a" data-file-name="components/PDFManager.tsx">50</span></option>
                  <option value={100} data-unique-id="ae1c7160-3035-4585-b6bc-a084e4451b1a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="0d1589e8-36d1-4718-a7af-b87ce2650b63" data-file-name="components/PDFManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto" data-unique-id="6b3f5b6f-28f1-4dd8-893e-27ba64971bed" data-file-name="components/PDFManager.tsx">
              <Table data-unique-id="5f3013f1-fd98-4a40-bf25-06aab231c37f" data-file-name="components/PDFManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="784d9598-7edf-4832-acce-ecdb1a17b831" data-file-name="components/PDFManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[100px]"><span className="editable-text" data-unique-id="a073a490-b94d-4c9c-a36a-9d7d12d5afe9" data-file-name="components/PDFManager.tsx">Cover PDF</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="a66748bf-a27a-40f4-95bc-b2449b6b332b" data-file-name="components/PDFManager.tsx">Judul PDF</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="a6039319-c7b1-4170-89c5-129395882ece" data-file-name="components/PDFManager.tsx">URL Cover</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="4452cfe5-1c63-4c0f-ad4f-0e8818974e2d" data-file-name="components/PDFManager.tsx">URL File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="939d86a4-b20e-4ece-8b77-1bd9cca787c7" data-file-name="components/PDFManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="a5b3679a-493d-4cce-a81d-c51af85af3c4" data-file-name="components/PDFManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="77595155-be8e-47b8-8446-72a10cbd0459" data-file-name="components/PDFManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="99c87adc-02c4-42b2-a608-638728edb724" data-file-name="components/PDFManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : pdfs.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="9f42e11b-bd79-43fa-848b-4e71a115a895" data-file-name="components/PDFManager.tsx">
                        Belum ada PDF. Silakan tambahkan PDF baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(pdfs) && pdfs.map((pdf, index) => <TableRow key={pdf.id} data-unique-id="f44115ed-dff1-420d-b5d7-50489b1125f6" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="cc4cecf0-3a65-470f-b482-179dc1e6315e" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="bf252fce-9634-4684-bdb0-91ef147ef9a3" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <img src={pdf.coverUrl} alt={pdf.title} className="h-16 w-12 object-cover rounded" data-is-mapped="true" data-unique-id="26af1939-c3f3-487d-9a52-fe25d19a77a9" data-file-name="components/PDFManager.tsx" />
                        </TableCell>
                        <TableCell className="font-medium" data-unique-id="bac576e2-783f-4cb3-8ec6-79d418b59b38" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{pdf.title}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="fc734119-7517-4d79-ad3e-f6f674b224f5" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="ee4996c6-8ba0-46bd-93ab-4c24af542b3c" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                            {pdf.coverUrl}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="aa413fcd-2846-4245-a6f2-d0f41c340070" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="6943e1c4-d4ab-48ff-a9b1-956d3f561a06" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                            {pdf.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="de3cc313-83b5-4848-bc40-bc2a34d5e043" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">{pdf.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="9b8887ce-1f71-4c03-bed4-335f01dcc044" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="0d4c99e2-939d-452e-bc36-022a79d5ccb1" data-file-name="components/PDFManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => {
                        // Open in a new tab with a timestamp parameter to avoid caching issues
                        window.open(`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`, '_blank');
                      }} className="flex items-center" title="View PDF" data-is-mapped="true" data-unique-id="2fa2aa90-8a09-4c11-b1a6-452f21e367c4" data-file-name="components/PDFManager.tsx">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-is-mapped="true" data-unique-id="84af4a9c-528b-4730-92fb-b9229354e222" data-file-name="components/PDFManager.tsx">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" data-unique-id="61d9f5de-aee8-4567-9ae7-bd5cb11cdc5a" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></path>
                                <polyline points="15 3 21 3 21 9" data-unique-id="2dd6d58b-d04c-4d7c-8b40-20665aabc478" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3" data-unique-id="49c35ed8-7c6c-499a-a5e7-8651421d2ead" data-file-name="components/PDFManager.tsx" data-dynamic-text="true"></line>
                              </svg>
                              <span className="sr-only" data-is-mapped="true" data-unique-id="ed79404f-a0b4-4cbf-b512-699e93c6df60" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="ebca6a69-2332-435f-9fac-4c5dda5082e1" data-file-name="components/PDFManager.tsx">View</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => startEditing(pdf)} disabled={editingPDF !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="2b0ae83b-9ec2-45cb-85ad-9f0cf7efaf49" data-file-name="components/PDFManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="e5c0ab2a-c852-44ab-b158-5261fe467645" data-file-name="components/PDFManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="3e16b8d9-28d6-4394-be0d-008388ed2355" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="d1c09e92-06a0-45d3-b2c9-aeb7b3af75e6" data-file-name="components/PDFManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deletePDF(pdf.id)} disabled={editingPDF !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="d41d8574-a940-4ca4-887d-c4894d301d80" data-file-name="components/PDFManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="13677c8d-8a59-4c9f-944b-d0394933ac59" data-file-name="components/PDFManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="23a7a59f-6207-4a73-8dfd-0bb3532a1069" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="12d41bce-99fb-4d10-8998-e4d78654eea5" data-file-name="components/PDFManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="54743f7d-6f44-4265-98a5-158eba4b62e0" data-file-name="components/PDFManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="84b24ae4-808e-4e14-948b-eb57cf8880fe" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="fcb20568-c5f8-46d7-b1fc-e829cc4c16d9" data-file-name="components/PDFManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="eef852e5-d51e-4688-a169-7e65eb05158a" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="d3360b18-4074-4548-9026-acd1293c8a51" data-file-name="components/PDFManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="8ca84507-0f91-4f27-85a8-3a33b614be7b" data-file-name="components/PDFManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="150c02ab-7e72-4990-aab1-0d08666369e0" data-file-name="components/PDFManager.tsx">
                    <span data-unique-id="5950a473-812c-4921-8445-a99a5b1f1d5e" data-file-name="components/PDFManager.tsx"><span className="editable-text" data-unique-id="6d866d61-fb50-41e6-81db-8d4f63876e98" data-file-name="components/PDFManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}