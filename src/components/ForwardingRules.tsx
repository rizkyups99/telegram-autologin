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
  return <Card data-unique-id="cf26ec7e-7e30-46b2-9aca-ade2c342a255" data-file-name="components/ForwardingRules.tsx">
      <CardHeader data-unique-id="ab38bbc5-c9d9-474d-9565-c03f23afca7b" data-file-name="components/ForwardingRules.tsx">
        <CardTitle data-unique-id="543a3944-e70c-42f7-90c7-afeed3836b8a" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="aac9b80d-7e34-40ec-bc31-8448303eede3" data-file-name="components/ForwardingRules.tsx">Aturan Filter</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="2c3bb9b1-7c3c-4686-aa2b-574b7d57f35b" data-file-name="components/ForwardingRules.tsx">
          Tentukan kata kunci untuk memfilter pesan yang akan diteruskan
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="2557a5a4-c0c8-42a1-ae96-42b3b4119058" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
        <div className="space-y-2" data-unique-id="a15cedaf-a495-45f6-a4b8-9c93c11b81a3" data-file-name="components/ForwardingRules.tsx">
          <Label htmlFor="new-keyword" data-unique-id="57776964-4e5b-48d8-8ed2-df3f3807cbc6" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="e628a004-f2e8-45b8-b58d-814fdeed2760" data-file-name="components/ForwardingRules.tsx">Tambah Kata Kunci</span></Label>
          <div className="flex gap-2" data-unique-id="60e19091-8844-43d7-96da-4fe5893463fb" data-file-name="components/ForwardingRules.tsx">
            <Input id="new-keyword" type="text" placeholder="Masukkan kata kunci baru" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') {
              handleAddKeyword();
            }
          }} data-unique-id="21fec675-8259-4746-b43c-11750e9495d8" data-file-name="components/ForwardingRules.tsx" />
            <Button onClick={handleAddKeyword} variant="outline" size="icon" title="Tambah kata kunci" data-unique-id="8765ca9d-34fb-4d88-82d8-8c9cb4a81612" data-file-name="components/ForwardingRules.tsx">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground" data-unique-id="7523da72-0268-4725-b265-60257cc6f141" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="b3198e36-1f78-4de0-af40-0d936da5965a" data-file-name="components/ForwardingRules.tsx">
            Pesan yang mengandung kata kunci ini akan diteruskan ke bot Telegram Anda
          </span></p>
        </div>

        <div className="space-y-2" data-unique-id="94bde654-252f-4d07-bd51-72b369eeb745" data-file-name="components/ForwardingRules.tsx">
          <Label data-unique-id="74fbdd6b-59fd-4df0-8321-340393f905d7" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="4f21b985-689c-4801-89e5-6df5546e8b48" data-file-name="components/ForwardingRules.tsx">Kata Kunci Aktif</span></Label>
          <div className="flex flex-wrap gap-2" data-unique-id="576f58da-3672-4fbd-9787-92a30621e7bb" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
            {keywords.length === 0 ? <p className="text-sm text-muted-foreground italic" data-unique-id="a7baa426-60a0-40be-ba36-01254ebb9ce6" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="4cede08c-cd2b-4b49-8207-8aa937d3fc5b" data-file-name="components/ForwardingRules.tsx">Belum ada kata kunci yang ditambahkan</span></p> : keywords.map((keyword, index) => <div key={index} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full" data-is-mapped="true" data-unique-id="9cb10808-0392-4ceb-bb83-6327c5e5ec3a" data-file-name="components/ForwardingRules.tsx">
                  <span data-is-mapped="true" data-unique-id="0d3c51e5-e19d-474f-bf59-0136689ecf5b" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{keyword}</span>
                  <button onClick={() => handleRemoveKeyword(keyword)} className="text-muted-foreground hover:text-destructive focus:outline-none" title="Hapus kata kunci" data-is-mapped="true" data-unique-id="0ed1f763-f7b1-4736-81c3-5e4ba2d090a9" data-file-name="components/ForwardingRules.tsx">
                    <X className="h-4 w-4" data-unique-id="b36dd7da-c403-4760-9fe3-0803e45021a5" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true" />
                  </button>
                </div>)}
          </div>
        </div>

        {saveStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="ea86a2bd-faa8-457c-9435-94c68cec05b2" data-file-name="components/ForwardingRules.tsx">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span data-unique-id="dff9fffb-50a8-466d-b2c4-7df348651521" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{statusMessage}</span>
          </div>}

        {saveStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="ab0eefb2-0707-4247-8128-0eb46a6cd09a" data-file-name="components/ForwardingRules.tsx">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span data-unique-id="12451e3c-f6fa-459a-9600-5138995e40cf" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{statusMessage}</span>
          </div>}

        <div className="pt-4" data-unique-id="b0380bc9-3294-4b0d-b7a2-1201e83ff85a" data-file-name="components/ForwardingRules.tsx">
          <Card className="bg-muted" data-unique-id="d7d8e1fa-6cb7-44a2-8559-ea74cd6ec1c5" data-file-name="components/ForwardingRules.tsx">
            <CardContent className="p-4" data-unique-id="5bb61176-e4cc-4958-b41d-e8f03ef776b2" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
              <div className="flex justify-between items-center mb-3" data-unique-id="e2b0af11-f720-4748-a7cc-bd19c741c177" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                <h3 className="font-medium" data-unique-id="1957fd7b-e730-4285-bd02-c6a0dced4d3d" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="386d7736-dcf1-4178-98b4-878c7c9edb1c" data-file-name="components/ForwardingRules.tsx">Contoh Pesan yang Akan Diteruskan</span></h3>
                {!isEditingExample ? <Button onClick={() => setIsEditingExample(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="5e934be3-9e17-4fbe-a0ce-f05221b727bf" data-file-name="components/ForwardingRules.tsx">
                    <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="392d4d3d-139d-4bae-a922-4e02f08a1ed0" data-file-name="components/ForwardingRules.tsx">
                    Edit
                  </span></Button> : <div className="flex gap-2" data-unique-id="bbde3dcb-afab-4457-8815-cf9420454d05" data-file-name="components/ForwardingRules.tsx">
                    <Button onClick={() => setIsEditingExample(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="04a219d1-97b3-439d-a6eb-47da6dec3035" data-file-name="components/ForwardingRules.tsx">
                      <X className="h-4 w-4" /><span className="editable-text" data-unique-id="fcedb35e-b4c4-41f5-b5c6-502c63a0f657" data-file-name="components/ForwardingRules.tsx">
                      Batal
                    </span></Button>
                    <Button onClick={saveExampleMessage} variant="default" size="sm" disabled={isSavingExample} className="flex items-center gap-1" data-unique-id="58300476-510c-47b9-bdd2-6d32e8401102" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                      {isSavingExample ? <>
                          <span className="animate-spin mr-2" data-unique-id="2f33ce9f-7cad-4642-a2be-5c361decd4c6" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="b05e4f47-88de-48bb-b9f8-5846dc745794" data-file-name="components/ForwardingRules.tsx">⏳</span></span>
                          Menyimpan...
                        </> : <>
                          <Save className="h-4 w-4" />
                          Simpan
                        </>}
                    </Button>
                  </div>}
              </div>
              
              {exampleStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="402874ac-9f33-432a-890d-0c7e779c8c24" data-file-name="components/ForwardingRules.tsx">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span data-unique-id="dce73f30-a95e-4505-be04-9d0423aa50dd" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{exampleStatusMessage}</span>
                </div>}
              
              {exampleStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="6860b470-72dd-426d-9c39-ba78e276f9f6" data-file-name="components/ForwardingRules.tsx">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span data-unique-id="13b75ca6-2350-4d1e-a040-7f8b0e13a6f5" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{exampleStatusMessage}</span>
                </div>}
              
              {isEditingExample ? <textarea value={exampleMessage} onChange={e => setExampleMessage(e.target.value)} className="w-full h-64 p-3 font-mono text-sm bg-background rounded-md border border-input resize-none" data-unique-id="74a656c6-4a85-42b9-9328-37b0c0fddf0c" data-file-name="components/ForwardingRules.tsx" /> : <div className="bg-background p-3 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="481ea2ab-e8a8-4adb-9547-4717fa1d18e2" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                  {exampleMessage}
                </div>}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>;
}