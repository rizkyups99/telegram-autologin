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
  return <Card data-unique-id="1381230e-999a-4634-a78c-ff4a738c61fb" data-file-name="components/ForwardingRules.tsx">
      <CardHeader data-unique-id="6b31687d-cb16-479c-9f5e-f6daa3f46ab9" data-file-name="components/ForwardingRules.tsx">
        <CardTitle data-unique-id="f7e088d8-2d21-40ee-85cb-64b381c525c4" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="a0564ff4-6b87-4df5-83aa-70e1c5f4e499" data-file-name="components/ForwardingRules.tsx">Aturan Filter</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="819b995e-3670-4fbb-b1dd-aba4e01bb552" data-file-name="components/ForwardingRules.tsx">
          Tentukan kata kunci untuk memfilter pesan yang akan diteruskan
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="6b11e759-4f96-4fff-801d-700406406525" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
        <div className="space-y-2" data-unique-id="027e7249-1cea-433b-b25e-e67d66b5f394" data-file-name="components/ForwardingRules.tsx">
          <Label htmlFor="new-keyword" data-unique-id="3262f7dc-467d-40b0-82c5-64e23d91158b" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="b94ba1a7-c221-42ef-baa9-0bf9047a5b45" data-file-name="components/ForwardingRules.tsx">Tambah Kata Kunci</span></Label>
          <div className="flex gap-2" data-unique-id="4777f413-a3fc-4a75-afea-545e172ebe4b" data-file-name="components/ForwardingRules.tsx">
            <Input id="new-keyword" type="text" placeholder="Masukkan kata kunci baru" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') {
              handleAddKeyword();
            }
          }} data-unique-id="03363318-9a02-4753-9203-3efe576264ec" data-file-name="components/ForwardingRules.tsx" />
            <Button onClick={handleAddKeyword} variant="outline" size="icon" title="Tambah kata kunci" data-unique-id="6723db35-efe9-40db-8d60-2dc6586431db" data-file-name="components/ForwardingRules.tsx">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground" data-unique-id="3ab276e5-41dc-4694-8e5b-38ff4459d284" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="847d4b5e-978d-4724-acff-c790cf4e5ee6" data-file-name="components/ForwardingRules.tsx">
            Pesan yang mengandung kata kunci ini akan diteruskan ke bot Telegram Anda
          </span></p>
        </div>

        <div className="space-y-2" data-unique-id="d6b126ff-2034-4738-9b52-de1f9fc67112" data-file-name="components/ForwardingRules.tsx">
          <Label data-unique-id="5f5f3fc3-1760-4d8d-a2af-3714de3d5b6d" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="cb954b40-989c-4c61-92a1-4a05fa54f186" data-file-name="components/ForwardingRules.tsx">Kata Kunci Aktif</span></Label>
          <div className="flex flex-wrap gap-2" data-unique-id="9b64da43-1e4a-4c27-9055-631e4da77828" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
            {keywords.length === 0 ? <p className="text-sm text-muted-foreground italic" data-unique-id="6fbeee7a-fe90-4469-ac31-553b13f603bc" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="04b8b932-9ad5-4d23-8283-6497a6129ad1" data-file-name="components/ForwardingRules.tsx">Belum ada kata kunci yang ditambahkan</span></p> : keywords.map((keyword, index) => <div key={index} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full" data-is-mapped="true" data-unique-id="58469285-29c8-4d8b-b691-8bc877d684bf" data-file-name="components/ForwardingRules.tsx">
                  <span data-is-mapped="true" data-unique-id="567c2d84-c2a9-41aa-9efe-14538ecaadd8" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{keyword}</span>
                  <button onClick={() => handleRemoveKeyword(keyword)} className="text-muted-foreground hover:text-destructive focus:outline-none" title="Hapus kata kunci" data-is-mapped="true" data-unique-id="e60cd5b8-9e2e-46e9-87cc-bac2dd2ca6d6" data-file-name="components/ForwardingRules.tsx">
                    <X className="h-4 w-4" data-unique-id="b4ac118f-bc89-4fa9-becf-9fc08bc5b588" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true" />
                  </button>
                </div>)}
          </div>
        </div>

        {saveStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="08999aa8-0a7f-49dd-944a-8318b1909188" data-file-name="components/ForwardingRules.tsx">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span data-unique-id="34bbde3b-8387-4f38-92f0-f55ae53a61b9" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{statusMessage}</span>
          </div>}

        {saveStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="dff0bfe4-b7bb-4987-a05f-b57e12995dc2" data-file-name="components/ForwardingRules.tsx">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span data-unique-id="cd880cf1-9184-4b44-a654-d937bd0a747a" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{statusMessage}</span>
          </div>}

        <div className="pt-4" data-unique-id="cb878ef6-81ba-4d18-9aeb-0ab4a77b6f98" data-file-name="components/ForwardingRules.tsx">
          <Card className="bg-muted" data-unique-id="ace28c9d-446e-42d6-b8c4-b59c5d0631f9" data-file-name="components/ForwardingRules.tsx">
            <CardContent className="p-4" data-unique-id="9ab42da3-2c54-4fc3-a1b6-56465ef8ea60" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
              <div className="flex justify-between items-center mb-3" data-unique-id="44a0d620-af40-477c-982c-5740089fd06f" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                <h3 className="font-medium" data-unique-id="0e23880b-7c8e-4d6b-8845-68e772a43ed0" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="80d1dbe0-1642-4f71-921f-550bb56a6215" data-file-name="components/ForwardingRules.tsx">Contoh Pesan yang Akan Diteruskan</span></h3>
                {!isEditingExample ? <Button onClick={() => setIsEditingExample(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="fac5935d-c77e-421c-8770-1b1ce132e814" data-file-name="components/ForwardingRules.tsx">
                    <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="e0f0018e-d2b4-4d65-aad0-7b14baa0013a" data-file-name="components/ForwardingRules.tsx">
                    Edit
                  </span></Button> : <div className="flex gap-2" data-unique-id="f9de9728-a9f0-4e8a-9526-429546fee8aa" data-file-name="components/ForwardingRules.tsx">
                    <Button onClick={() => setIsEditingExample(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="ed7b33f4-2289-40e6-80f8-9d7903db4984" data-file-name="components/ForwardingRules.tsx">
                      <X className="h-4 w-4" /><span className="editable-text" data-unique-id="672dbd5e-3b07-48e7-9d4b-6e7139cb1d95" data-file-name="components/ForwardingRules.tsx">
                      Batal
                    </span></Button>
                    <Button onClick={saveExampleMessage} variant="default" size="sm" disabled={isSavingExample} className="flex items-center gap-1" data-unique-id="b7185038-a17b-4d36-a6bd-9a1d2d84012f" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                      {isSavingExample ? <>
                          <span className="animate-spin mr-2" data-unique-id="fd0cc111-4647-44a0-b6f9-5472e90a1376" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="373211a6-5ca6-42d5-be4b-94c477d95948" data-file-name="components/ForwardingRules.tsx">⏳</span></span>
                          Menyimpan...
                        </> : <>
                          <Save className="h-4 w-4" />
                          Simpan
                        </>}
                    </Button>
                  </div>}
              </div>
              
              {exampleStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="32b45191-bf6a-40ff-92e9-3c1aebe89b3a" data-file-name="components/ForwardingRules.tsx">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span data-unique-id="8696b282-ebf3-457e-8875-8d72af155455" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{exampleStatusMessage}</span>
                </div>}
              
              {exampleStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="24f4c2ec-1e05-4570-a5ac-18143e327c47" data-file-name="components/ForwardingRules.tsx">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span data-unique-id="be85cca7-28b5-4e66-aff9-99611b4d0352" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{exampleStatusMessage}</span>
                </div>}
              
              {isEditingExample ? <textarea value={exampleMessage} onChange={e => setExampleMessage(e.target.value)} className="w-full h-64 p-3 font-mono text-sm bg-background rounded-md border border-input resize-none" data-unique-id="afe3f29d-581c-4b81-b50a-d61be953fcb0" data-file-name="components/ForwardingRules.tsx" /> : <div className="bg-background p-3 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="f6df8c7a-c584-4aa7-9406-670a60e5e7b1" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                  {exampleMessage}
                </div>}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>;
}