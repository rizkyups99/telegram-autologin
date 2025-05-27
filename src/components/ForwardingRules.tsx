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
  return <Card data-unique-id="12f40630-ce64-4670-87be-89ea32504ebf" data-file-name="components/ForwardingRules.tsx">
      <CardHeader data-unique-id="f88d7b80-6cf1-4baf-8a35-8b24df61128c" data-file-name="components/ForwardingRules.tsx">
        <CardTitle data-unique-id="f278a8ec-8380-4fdd-98da-604df3223395" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="895df2b0-45a0-4364-b5f0-399cd8d0477b" data-file-name="components/ForwardingRules.tsx">Aturan Filter</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="6640da76-b161-40a9-9186-61bf0d9a08a4" data-file-name="components/ForwardingRules.tsx">
          Tentukan kata kunci untuk memfilter pesan yang akan diteruskan
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="3416a84e-a3eb-4325-9864-5963cbfed8f0" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
        <div className="space-y-2" data-unique-id="b18bfcbd-fcdc-4bd1-a537-a41a6f143792" data-file-name="components/ForwardingRules.tsx">
          <Label htmlFor="new-keyword" data-unique-id="692ce551-cf04-4074-b7f5-960ed6060743" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="7f5c3b2a-d293-4240-b1a4-7206750431fb" data-file-name="components/ForwardingRules.tsx">Tambah Kata Kunci</span></Label>
          <div className="flex gap-2" data-unique-id="c98fb4b2-1809-495b-a72c-d202743cdfe4" data-file-name="components/ForwardingRules.tsx">
            <Input id="new-keyword" type="text" placeholder="Masukkan kata kunci baru" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') {
              handleAddKeyword();
            }
          }} data-unique-id="9c6472a8-b3ac-4983-baf0-fffb761e08ce" data-file-name="components/ForwardingRules.tsx" />
            <Button onClick={handleAddKeyword} variant="outline" size="icon" title="Tambah kata kunci" data-unique-id="937474c0-b293-47be-87de-cfc143c32c3c" data-file-name="components/ForwardingRules.tsx">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground" data-unique-id="a406569f-3d7a-4ba3-b1b6-5e8088fd13e6" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="c06fb60b-96be-4e18-a990-33b2eaddee3c" data-file-name="components/ForwardingRules.tsx">
            Pesan yang mengandung kata kunci ini akan diteruskan ke bot Telegram Anda
          </span></p>
        </div>

        <div className="space-y-2" data-unique-id="01da8952-7a46-4ae1-82a1-0c64daabf59b" data-file-name="components/ForwardingRules.tsx">
          <Label data-unique-id="37873d07-efb3-44b0-a809-20d97f90dc0c" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="0ac0b328-7519-403c-ab73-d9e2075cb1fa" data-file-name="components/ForwardingRules.tsx">Kata Kunci Aktif</span></Label>
          <div className="flex flex-wrap gap-2" data-unique-id="e4d711f6-ce3e-410c-a821-29d35a7df5e7" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
            {keywords.length === 0 ? <p className="text-sm text-muted-foreground italic" data-unique-id="5be792d6-45a5-4850-a4af-41e3878aa3da" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="9c288bf7-5964-41e6-bdb2-700abeabe3b8" data-file-name="components/ForwardingRules.tsx">Belum ada kata kunci yang ditambahkan</span></p> : keywords.map((keyword, index) => <div key={index} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full" data-is-mapped="true" data-unique-id="1d0a1569-7ded-4519-9cd0-4ef63569ab05" data-file-name="components/ForwardingRules.tsx">
                  <span data-is-mapped="true" data-unique-id="f3a498a3-2bcb-48fc-973f-cc84bcd9075b" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{keyword}</span>
                  <button onClick={() => handleRemoveKeyword(keyword)} className="text-muted-foreground hover:text-destructive focus:outline-none" title="Hapus kata kunci" data-is-mapped="true" data-unique-id="22ef985c-22de-4965-83b5-327101590046" data-file-name="components/ForwardingRules.tsx">
                    <X className="h-4 w-4" data-unique-id="c96a511c-0c55-4758-b1c2-32ec792dbdd0" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true" />
                  </button>
                </div>)}
          </div>
        </div>

        {saveStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="918d3ff1-3d1f-48ed-8a30-deffc515120d" data-file-name="components/ForwardingRules.tsx">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span data-unique-id="2706917a-9bd1-45bc-986d-3c4bae859a2d" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{statusMessage}</span>
          </div>}

        {saveStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="10bad527-56a0-4888-a679-b9d9cac1229d" data-file-name="components/ForwardingRules.tsx">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span data-unique-id="867e34aa-1386-40ff-a8f6-f0134efae684" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{statusMessage}</span>
          </div>}

        <div className="pt-4" data-unique-id="8af78617-21ed-4b06-b0c4-a78643136fe3" data-file-name="components/ForwardingRules.tsx">
          <Card className="bg-muted" data-unique-id="6d1e4613-5b77-48f1-9c3f-12294bd9b30a" data-file-name="components/ForwardingRules.tsx">
            <CardContent className="p-4" data-unique-id="d9d3f5fd-ed77-41d0-a691-06d19f73866a" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
              <div className="flex justify-between items-center mb-3" data-unique-id="601e3675-6607-427c-9367-c3f35c54697f" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                <h3 className="font-medium" data-unique-id="a5941f11-f907-41a4-a785-905cb1566050" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="d164089d-ad00-4e21-831b-f443e2aec393" data-file-name="components/ForwardingRules.tsx">Contoh Pesan yang Akan Diteruskan</span></h3>
                {!isEditingExample ? <Button onClick={() => setIsEditingExample(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="1818f240-f1dc-4225-9242-ac162430a518" data-file-name="components/ForwardingRules.tsx">
                    <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="c37a77d3-0396-41f7-910d-e28167acc6dd" data-file-name="components/ForwardingRules.tsx">
                    Edit
                  </span></Button> : <div className="flex gap-2" data-unique-id="3fcfb45d-b00a-4df2-a9e1-f65099542d59" data-file-name="components/ForwardingRules.tsx">
                    <Button onClick={() => setIsEditingExample(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="cc11df3e-5c07-47ae-90ca-8cfa5df5409e" data-file-name="components/ForwardingRules.tsx">
                      <X className="h-4 w-4" /><span className="editable-text" data-unique-id="1cdb7219-fcbd-46ab-b4f7-fe69047ac326" data-file-name="components/ForwardingRules.tsx">
                      Batal
                    </span></Button>
                    <Button onClick={saveExampleMessage} variant="default" size="sm" disabled={isSavingExample} className="flex items-center gap-1" data-unique-id="ffdbc7f8-0b73-40ec-bdf3-3933e37c3929" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                      {isSavingExample ? <>
                          <span className="animate-spin mr-2" data-unique-id="85fb285a-8d20-4d70-9fdf-ef5cb95d2660" data-file-name="components/ForwardingRules.tsx"><span className="editable-text" data-unique-id="152f0b59-df0a-4ace-b70c-7f54140e3963" data-file-name="components/ForwardingRules.tsx">⏳</span></span>
                          Menyimpan...
                        </> : <>
                          <Save className="h-4 w-4" />
                          Simpan
                        </>}
                    </Button>
                  </div>}
              </div>
              
              {exampleStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="e5f1c4c5-52a6-439c-9266-164602b9bd57" data-file-name="components/ForwardingRules.tsx">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span data-unique-id="8f5333b9-861f-4700-9a61-c21f1b38b224" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{exampleStatusMessage}</span>
                </div>}
              
              {exampleStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="ade30257-b6f4-4a11-ae81-82a0a78f3c9b" data-file-name="components/ForwardingRules.tsx">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span data-unique-id="68c3c155-44fb-40f8-a7de-2ce0b38e352a" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">{exampleStatusMessage}</span>
                </div>}
              
              {isEditingExample ? <textarea value={exampleMessage} onChange={e => setExampleMessage(e.target.value)} className="w-full h-64 p-3 font-mono text-sm bg-background rounded-md border border-input resize-none" data-unique-id="97ee6a0a-2f8a-4e66-a3a2-a3f68051c0d8" data-file-name="components/ForwardingRules.tsx" /> : <div className="bg-background p-3 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="a9c61f88-8c0f-4343-a2e6-31b8c08a5f70" data-file-name="components/ForwardingRules.tsx" data-dynamic-text="true">
                  {exampleMessage}
                </div>}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>;
}