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
  return <Card data-unique-id="eaa4b83f-cfdf-4b0d-988c-e36a97edc924" data-file-name="components/ForwardingRules.tsx">
      <CardHeader data-unique-id="1d4dac9b-1e9a-4dbc-bc5d-29ad28e73f4b" data-file-name="components/ForwardingRules.tsx">
        <CardTitle data-unique-id="95f8adf9-e0ad-4b09-a98b-2b6bd6446920" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="f69f245b-8d16-49e8-9d56-f8926fd582fc" data-file-name="components/ForwardingRules.tsx">Aturan Filter</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="908d2346-20e4-4781-b699-c92220f052e7" data-file-name="components/ForwardingRules.tsx">
          Tentukan kata kunci untuk memfilter pesan yang akan diteruskan
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="b941ed84-40f7-4f02-b575-72583b87092e" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
        <div className="space-y-2" data-unique-id="789b4dd6-62f3-4b4c-b7a5-b811e39dad40" data-file-name="components/ForwardingRules.tsx">
          <Label htmlFor="new-keyword" data-unique-id="eb7500fb-7f8b-47b5-92de-1339c7c7a16a" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="1c311960-8d5f-42c0-b1a1-c57810fa7ce3" data-file-name="components/ForwardingRules.tsx">Tambah Kata Kunci</span></Label>
          <div className="flex gap-2" data-unique-id="89ecff86-aca1-4443-81c9-e4ee118155fc" data-file-name="components/ForwardingRules.tsx">
            <Input id="new-keyword" type="text" placeholder="Masukkan kata kunci baru" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') {
              handleAddKeyword();
            }
          }} data-unique-id="2b29a6f5-455e-4935-9f26-30ea9cfee4f4" data-file-name="components/ForwardingRules.tsx" />
            <Button onClick={handleAddKeyword} variant="outline" size="icon" title="Tambah kata kunci" data-unique-id="a284482a-7ad9-49ab-9032-4b235c712009" data-file-name="components/ForwardingRules.tsx">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground" data-unique-id="941fc222-3e71-40aa-bce0-6a53e7dacda5" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="3f5d2a4c-3965-4cad-9bc2-087b17e9e2d3" data-file-name="components/ForwardingRules.tsx">
            Pesan yang mengandung kata kunci ini akan diteruskan ke bot Telegram Anda
          </span></p>
        </div>

        <div className="space-y-2" data-unique-id="0dcacfee-cf7b-4f5c-a8e1-44f20eac9a86" data-file-name="components/ForwardingRules.tsx">
          <Label data-unique-id="4ec50207-c0dd-4dff-b7b0-6a2ae26e2e30" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="2e76f8e1-6561-4f11-a301-32b19e35f733" data-file-name="components/ForwardingRules.tsx">Kata Kunci Aktif</span></Label>
          <div className="flex flex-wrap gap-2" data-unique-id="22b57c00-9026-4791-a0c8-efba6f36a0cd" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
            {keywords.length === 0 ? <p className="text-sm text-muted-foreground italic" data-unique-id="3717f640-9e32-4080-9bdb-3d8f0c400908" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="5055b46e-5ea0-4d9c-b7f1-f71816f5a59a" data-file-name="components/ForwardingRules.tsx">Belum ada kata kunci yang ditambahkan</span></p> : keywords.map((keyword, index) => <div key={index} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full" data-is-mapped="true" data-unique-id="4c1202fd-a2e7-4922-bb65-82668781823d" data-file-name="components/ForwardingRules.tsx">
                  <span data-is-mapped="true" data-unique-id="f1644af2-0f73-4772-91c4-55de7c18cd17" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{keyword}</span>
                  <button onClick={() => handleRemoveKeyword(keyword)} className="text-muted-foreground hover:text-destructive focus:outline-none" title="Hapus kata kunci" data-is-mapped="true" data-unique-id="17362ac5-bcd1-4dde-99e8-49c1b0df2788" data-file-name="components/ForwardingRules.tsx">
                    <X className="h-4 w-4" data-unique-id="f8736a68-c9b0-43e4-ada4-53e0add014b6" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true" />
                  </button>
                </div>)}
          </div>
        </div>

        {saveStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="2f3cfb62-f171-4d12-84dc-274004395186" data-file-name="components/ForwardingRules.tsx">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span data-unique-id="0858ae8b-e4ab-431a-9cfb-62fdb581f2dd" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{statusMessage}</span>
          </div>}

        {saveStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="50ce3067-ce42-4e64-b191-4d19212f1f00" data-file-name="components/ForwardingRules.tsx">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span data-unique-id="c529b42f-3a98-400d-af85-d023445b6420" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{statusMessage}</span>
          </div>}

        <div className="pt-4" data-unique-id="930cf2b2-05cd-48b7-bbba-914da065629a" data-file-name="components/ForwardingRules.tsx">
          <Card className="bg-muted" data-unique-id="1db05f03-2184-4796-ad2b-a5b38ec52ba6" data-file-name="components/ForwardingRules.tsx">
            <CardContent className="p-4" data-unique-id="59bba387-a9f1-4d5f-bebc-81c8d878800d" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
              <div className="flex justify-between items-center mb-3" data-unique-id="1b07bbda-2fbf-4cfc-9936-f3a82ad0d6ba" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                <h3 className="font-medium" data-unique-id="3c4f87ad-0941-47fe-b1bc-1adc6bb52d48" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="30f57744-f264-4538-a018-4f11be28f58f" data-file-name="components/ForwardingRules.tsx">Contoh Pesan yang Akan Diteruskan</span></h3>
                {!isEditingExample ? <Button onClick={() => setIsEditingExample(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="22ac72e1-b4f5-4e7e-ab60-3a86f354e73d" data-file-name="components/ForwardingRules.tsx">
                    <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="f28aad7e-4de7-41fd-ae0a-d5b962a62cae" data-file-name="components/ForwardingRules.tsx">
                    Edit
                  </span></Button> : <div className="flex gap-2" data-unique-id="2cf34abb-f522-4d72-a240-784b8036a979" data-file-name="components/ForwardingRules.tsx">
                    <Button onClick={() => setIsEditingExample(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="1d2b57b8-6019-49fc-818a-33c2915f4493" data-file-name="components/ForwardingRules.tsx">
                      <X className="h-4 w-4" /><span className="editable-text" data-unique-id="e50a90c0-c9de-44c3-9092-18921724a5e8" data-file-name="components/ForwardingRules.tsx">
                      Batal
                    </span></Button>
                    <Button onClick={saveExampleMessage} variant="default" size="sm" disabled={isSavingExample} className="flex items-center gap-1" data-unique-id="d9517f22-dfad-42cc-b8a9-3969e9a0ca02" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                      {isSavingExample ? <>
                          <span className="animate-spin mr-2" data-unique-id="d18b1693-2da7-4f9d-8a4d-9a7df1a81f21" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="2479ba83-b736-4973-829d-98c23ba0cb38" data-file-name="components/ForwardingRules.tsx">⏳</span></span>
                          Menyimpan...
                        </> : <>
                          <Save className="h-4 w-4" />
                          Simpan
                        </>}
                    </Button>
                  </div>}
              </div>
              
              {exampleStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="d468eb03-16fe-4f02-9582-6224884d8005" data-file-name="components/ForwardingRules.tsx">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span data-unique-id="ccc6295c-7c95-45f1-a33b-f7ae86389099" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{exampleStatusMessage}</span>
                </div>}
              
              {exampleStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="e6e2c943-f24d-4dff-88e8-5f40942d4f49" data-file-name="components/ForwardingRules.tsx">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span data-unique-id="bd1626d3-bc69-421c-b863-2a127d876793" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{exampleStatusMessage}</span>
                </div>}
              
              {isEditingExample ? <textarea value={exampleMessage} onChange={e => setExampleMessage(e.target.value)} className="w-full h-64 p-3 font-mono text-sm bg-background rounded-md border border-input resize-none" data-unique-id="f0f0f2fc-7a31-486a-93e5-a41d2b980592" data-file-name="components/ForwardingRules.tsx" /> : <div className="bg-background p-3 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="504dd21f-8e93-42a2-b801-07473be523ab" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                  {exampleMessage}
                </div>}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>;
}