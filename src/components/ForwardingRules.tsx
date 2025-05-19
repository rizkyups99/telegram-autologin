"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, X, Save, AlertCircle, CheckCircle2, Edit } from "lucide-react";

export default function ForwardingRules() {
  const [keywords, setKeywords] = useState<string[]>(["pembayaran"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  
  // Example message state
  const [exampleMessage, setExampleMessage] = useState("");
  const [isEditingExample, setIsEditingExample] = useState(false);
  const [isSavingExample, setIsSavingExample] = useState(false);
  const [exampleStatus, setExampleStatus] = useState<"idle" | "success" | "error">("idle");
  const [exampleStatusMessage, setExampleStatusMessage] = useState("");

  // Load keywords from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKeywords = localStorage.getItem("forwardingKeywords");
      if (savedKeywords) {
        try {
          const parsedKeywords = JSON.parse(savedKeywords);
          if (Array.isArray(parsedKeywords)) {
            setKeywords(parsedKeywords);
          }
        } catch (e) {
          console.error("Error parsing saved keywords:", e);
        }
      }
    }
    
    // Load example message
    fetchExampleMessage();
  }, []);

  const fetchExampleMessage = async () => {
    try {
      const response = await fetch('/api/telegram/example-message');
      if (response.ok) {
        const data = await response.json();
        setExampleMessage(data.message);
      }
    } catch (error) {
      console.error('Error fetching example message:', error);
    }
  };

  const saveExampleMessage = async () => {
    setIsSavingExample(true);
    setExampleStatus("idle");
    
    try {
      const response = await fetch('/api/telegram/example-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: exampleMessage })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save example message');
      }
      
      setExampleStatus("success");
      setExampleStatusMessage("Contoh pesan berhasil disimpan");
      setIsEditingExample(false);
      
      setTimeout(() => {
        setExampleStatus("idle");
        setExampleStatusMessage("");
      }, 3000);
    } catch (error) {
      setExampleStatus("error");
      setExampleStatusMessage(error instanceof Error ? error.message : "Gagal menyimpan contoh pesan");
    } finally {
      setIsSavingExample(false);
    }
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    
    // Check if keyword already exists
    if (keywords.includes(newKeyword.toLowerCase().trim())) {
      setSaveStatus("error");
      setStatusMessage("Kata kunci sudah ada dalam daftar");
      return;
    }
    
    const updatedKeywords = [...keywords, newKeyword.toLowerCase().trim()];
    setKeywords(updatedKeywords);
    setNewKeyword("");
    
    // Save to localStorage
    localStorage.setItem("forwardingKeywords", JSON.stringify(updatedKeywords));
    
    // In a real app, you would also save to the backend
    saveKeywordsToBackend(updatedKeywords);
  };

  const handleRemoveKeyword = (keyword: string) => {
    const updatedKeywords = keywords.filter(k => k !== keyword);
    setKeywords(updatedKeywords);
    
    // Save to localStorage
    localStorage.setItem("forwardingKeywords", JSON.stringify(updatedKeywords));
    
    // In a real app, you would also save to the backend
    saveKeywordsToBackend(updatedKeywords);
  };

  const saveKeywordsToBackend = async (updatedKeywords: string[]) => {
    setSaveStatus("idle");
    
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch("/api/telegram/keywords", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ keywords: updatedKeywords }),
      // });
      
      // if (!response.ok) throw new Error("Failed to save keywords");
      
      setSaveStatus("success");
      setStatusMessage("Kata kunci berhasil disimpan");
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
        setStatusMessage("");
      }, 3000);
    } catch (error) {
      setSaveStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Gagal menyimpan kata kunci");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aturan Filter</CardTitle>
        <CardDescription>
          Tentukan kata kunci untuk memfilter pesan yang akan diteruskan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="new-keyword">Tambah Kata Kunci</Label>
          <div className="flex gap-2">
            <Input
              id="new-keyword"
              type="text"
              placeholder="Masukkan kata kunci baru"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddKeyword();
                }
              }}
            />
            <Button
              onClick={handleAddKeyword}
              variant="outline"
              size="icon"
              title="Tambah kata kunci"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Pesan yang mengandung kata kunci ini akan diteruskan ke bot Telegram Anda
          </p>
        </div>

        <div className="space-y-2">
          <Label>Kata Kunci Aktif</Label>
          <div className="flex flex-wrap gap-2">
            {keywords.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Belum ada kata kunci yang ditambahkan</p>
            ) : (
              keywords.map((keyword, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full"
                >
                  <span>{keyword}</span>
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="text-muted-foreground hover:text-destructive focus:outline-none"
                    title="Hapus kata kunci"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {saveStatus === "success" && (
          <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span>{statusMessage}</span>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="pt-4">
          <Card className="bg-muted">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Contoh Pesan yang Akan Diteruskan</h3>
                {!isEditingExample ? (
                  <Button 
                    onClick={() => setIsEditingExample(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setIsEditingExample(false)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Batal
                    </Button>
                    <Button 
                      onClick={saveExampleMessage}
                      variant="default"
                      size="sm"
                      disabled={isSavingExample}
                      className="flex items-center gap-1"
                    >
                      {isSavingExample ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Simpan
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              
              {exampleStatus === "success" && (
                <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span>{exampleStatusMessage}</span>
                </div>
              )}
              
              {exampleStatus === "error" && (
                <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{exampleStatusMessage}</span>
                </div>
              )}
              
              {isEditingExample ? (
                <textarea
                  value={exampleMessage}
                  onChange={(e) => setExampleMessage(e.target.value)}
                  className="w-full h-64 p-3 font-mono text-sm bg-background rounded-md border border-input resize-none"
                />
              ) : (
                <div className="bg-background p-3 rounded-md font-mono text-sm whitespace-pre-wrap">
                  {exampleMessage}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
