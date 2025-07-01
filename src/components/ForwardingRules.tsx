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
        body: JSON.stringify({
          message: exampleMessage
        })
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
  return <Card data-unique-id="0e660fac-373b-4198-a2f9-445cd0975d0f" data-file-name="components/ForwardingRules.tsx">
      <CardHeader data-unique-id="9a56f250-a714-4a62-ba61-0b6ca3362dc9" data-file-name="components/ForwardingRules.tsx">
        <CardTitle data-unique-id="a0d66669-1814-4ea8-bd4e-b1da9c50d3f4" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="75f22d4a-a765-43a9-8798-ce418e86e66e" data-file-name="components/ForwardingRules.tsx">Aturan Filter</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="a96d3823-c510-496c-bcdc-f723aa8db568" data-file-name="components/ForwardingRules.tsx">
          Tentukan kata kunci untuk memfilter pesan yang akan diteruskan
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="afb8cd0d-c92a-42a7-a35d-94b76d8853e6" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
        <div className="space-y-2" data-unique-id="73fb6ecf-3623-45d4-b092-8c458b642196" data-file-name="components/ForwardingRules.tsx">
          <Label htmlFor="new-keyword" data-unique-id="d0bcc487-bffe-40b1-965f-25e0680d1d7d" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="2d688e3b-664d-4566-a147-4d42cf28c876" data-file-name="components/ForwardingRules.tsx">Tambah Kata Kunci</span></Label>
          <div className="flex gap-2" data-unique-id="6093bba5-7605-43f6-a94e-a297bffe897a" data-file-name="components/ForwardingRules.tsx">
            <Input id="new-keyword" type="text" placeholder="Masukkan kata kunci baru" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') {
              handleAddKeyword();
            }
          }} data-unique-id="3294d759-ac29-4111-8870-7334238be17b" data-file-name="components/ForwardingRules.tsx" />
            <Button onClick={handleAddKeyword} variant="outline" size="icon" title="Tambah kata kunci" data-unique-id="14aa75e7-78ce-4520-b76f-8439929c61ae" data-file-name="components/ForwardingRules.tsx">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground" data-unique-id="3a87b958-5cee-4d00-870f-b66fda69a9a2" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="cf24eda6-d379-43b7-9cbf-d9749450ded5" data-file-name="components/ForwardingRules.tsx">
            Pesan yang mengandung kata kunci ini akan diteruskan ke bot Telegram Anda
          </span></p>
        </div>

        <div className="space-y-2" data-unique-id="d714b5ef-7202-4c91-ae57-d33d1d926f39" data-file-name="components/ForwardingRules.tsx">
          <Label data-unique-id="d804809b-453b-46b8-b6e0-fe84563c88dc" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="cc990233-3cc7-4bf5-9a2d-63735578beac" data-file-name="components/ForwardingRules.tsx">Kata Kunci Aktif</span></Label>
          <div className="flex flex-wrap gap-2" data-unique-id="bd8c0932-72f1-4fb3-8ea3-f7c8714c3322" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
            {keywords.length === 0 ? <p className="text-sm text-muted-foreground italic" data-unique-id="30d9d0d7-00f0-4af0-a0e3-c289ccf1332b" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="c60fdd95-e62a-4b3f-9e7c-1068083ed611" data-file-name="components/ForwardingRules.tsx">Belum ada kata kunci yang ditambahkan</span></p> : keywords.map((keyword, index) => <div key={index} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full" data-is-mapped="true" data-unique-id="7ee1fcda-56f9-4c6b-8601-19134fa5c1a9" data-file-name="components/ForwardingRules.tsx">
                  <span data-is-mapped="true" data-unique-id="17d3a1dc-662a-467b-8c9e-856a88ee5cc3" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{keyword}</span>
                  <button onClick={() => handleRemoveKeyword(keyword)} className="text-muted-foreground hover:text-destructive focus:outline-none" title="Hapus kata kunci" data-is-mapped="true" data-unique-id="50f33a92-bfbf-40d7-a179-20700ff144b3" data-file-name="components/ForwardingRules.tsx">
                    <X className="h-4 w-4" data-unique-id="afa305de-1c47-4618-bd12-d7c0a0e4fad4" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true" />
                  </button>
                </div>)}
          </div>
        </div>

        {saveStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="690f2d1c-66d0-4f6d-b20f-cc169e913c1f" data-file-name="components/ForwardingRules.tsx">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span data-unique-id="9d5a08f0-3094-4053-81d2-21d45d2b8eaf" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{statusMessage}</span>
          </div>}

        {saveStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="397716e4-77e3-4532-999c-da629766659e" data-file-name="components/ForwardingRules.tsx">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span data-unique-id="c451a987-df88-4632-aa8b-0960432fd0ac" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{statusMessage}</span>
          </div>}

        <div className="pt-4" data-unique-id="8f00d964-e74c-4a6b-8642-88c03ed55e4e" data-file-name="components/ForwardingRules.tsx">
          <Card className="bg-muted" data-unique-id="0a95635a-026b-44f7-ae20-2b9c0b0850d6" data-file-name="components/ForwardingRules.tsx">
            <CardContent className="p-4" data-unique-id="f1e64fde-60ec-423f-9c48-2b1607886a49" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
              <div className="flex justify-between items-center mb-3" data-unique-id="a62ff0f5-0a95-4bfb-8fb3-8a70481d6766" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                <h3 className="font-medium" data-unique-id="4940216b-3c4f-4117-8617-8c74c27b424a" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="756b4aa3-b4db-4ab8-a998-f156fa5186db" data-file-name="components/ForwardingRules.tsx">Contoh Pesan yang Akan Diteruskan</span></h3>
                {!isEditingExample ? <Button onClick={() => setIsEditingExample(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="74db057f-4ee5-4a28-8515-0076bfc2a17a" data-file-name="components/ForwardingRules.tsx">
                    <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="341f592c-6a51-475c-81d5-06b8a04ff1c2" data-file-name="components/ForwardingRules.tsx">
                    Edit
                  </span></Button> : <div className="flex gap-2" data-unique-id="b0185167-ff54-4c52-9178-5450b203d404" data-file-name="components/ForwardingRules.tsx">
                    <Button onClick={() => setIsEditingExample(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="80c6116a-71d5-4c2b-95fa-24b3d08abdf8" data-file-name="components/ForwardingRules.tsx">
                      <X className="h-4 w-4" /><span className="editable-text" data-unique-id="c74b9b9d-4853-4f06-adf3-9bd7df2ad10d" data-file-name="components/ForwardingRules.tsx">
                      Batal
                    </span></Button>
                    <Button onClick={saveExampleMessage} variant="default" size="sm" disabled={isSavingExample} className="flex items-center gap-1" data-unique-id="cf79b41d-24cd-46c4-a9ce-5c291d092f8e" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                      {isSavingExample ? <>
                          <span className="animate-spin mr-2" data-unique-id="f6b2f124-9430-4e0d-9253-90449aea32e4" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="26811ab1-c64b-46e6-a556-c73bc6a4bd69" data-file-name="components/ForwardingRules.tsx">⏳</span></span>
                          Menyimpan...
                        </> : <>
                          <Save className="h-4 w-4" />
                          Simpan
                        </>}
                    </Button>
                  </div>}
              </div>
              
              {exampleStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="38a46a01-e840-4348-a864-3a35287c1053" data-file-name="components/ForwardingRules.tsx">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span data-unique-id="8c4b4956-805d-4598-bbb2-0c2eaabef564" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{exampleStatusMessage}</span>
                </div>}
              
              {exampleStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="e9ac93cb-40f7-43e6-97ee-71dd456b41ac" data-file-name="components/ForwardingRules.tsx">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span data-unique-id="a6d7f336-2422-4d0e-b282-9f2e8ffae57c" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{exampleStatusMessage}</span>
                </div>}
              
              {isEditingExample ? <textarea value={exampleMessage} onChange={e => setExampleMessage(e.target.value)} className="w-full h-64 p-3 font-mono text-sm bg-background rounded-md border border-input resize-none" data-unique-id="1369a461-7dcb-476a-8d93-28274bbdcf7d" data-file-name="components/ForwardingRules.tsx" /> : <div className="bg-background p-3 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="28b110e4-bdaf-494d-8a10-14f3c1080b5b" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                  {exampleMessage}
                </div>}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>;
}