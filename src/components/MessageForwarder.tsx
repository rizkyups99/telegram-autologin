'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowRight, MessageCircle, CheckCircle, AlertTriangle, Send, FileText, Bot, Settings, Clock, ToggleRight, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
type MessageRule = {
  sourcePattern: string;
  extract: {
    product?: string;
    name?: string;
    phone?: string;
  };
  targetBot: string;
  outputFormat: string;
  active: boolean;
};
type ForwardingLog = {
  id: string;
  timestamp: Date;
  source: string;
  originalMessage: string;
  transformedMessage: string;
  status: 'success' | 'failed';
  error?: string;
};
export default function MessageForwarder() {
  // Input states
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [targetBotUsername, setTargetBotUsername] = useState<string>('@iky2025bot');
  const [messageExtractRules, setMessageExtractRules] = useState<Record<string, string>>({
    product: 'Produk:',
    name: 'Nama:',
    phone: 'No HP:'
  });
  const [inputFormat, setInputFormat] = useState<string>(`*Assallamualaikum*
dari Toko IKHTIAR JALUR LANGIT
Terima kasih kak, Selangkah lagi untuk Mendapatkan
*Produk: AUDIO RUQYAH PENARIK REZEKI, EBOOK ORANG ISLAM HARUS KAYA*

Dikirim ke:
Nama: Devi Susanti
No HP: 6285822259715
Email : devisusantiaj@gmail.com`);
  const [outputFormat, setOutputFormat] = useState<string>(`PEMBAYARAN
Kategori : {product}
Nama: {name}
No HP: {phone}
Kode Akses: {phone}`);

  // Output/Preview states
  const [previewResult, setPreviewResult] = useState<string>('');
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});
  const [isActive, setIsActive] = useState<boolean>(true);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Rules and logs
  const [rules, setRules] = useState<MessageRule[]>([]);
  const [logs, setLogs] = useState<ForwardingLog[]>([]);

  // Load saved settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load saved settings from localStorage
      const savedSourceFilter = localStorage.getItem('forwardSourceFilter');
      const savedTargetBot = localStorage.getItem('forwardTargetBot');
      const savedOutputFormat = localStorage.getItem('forwardOutputFormat');
      const savedIsActive = localStorage.getItem('forwardIsActive');
      if (savedSourceFilter) setSourceFilter(savedSourceFilter);
      if (savedTargetBot) setTargetBotUsername(savedTargetBot);
      if (savedOutputFormat) setOutputFormat(savedOutputFormat);
      if (savedIsActive) setIsActive(savedIsActive === 'true');

      // Try to load saved rules
      try {
        const savedRules = localStorage.getItem('forwardRules');
        if (savedRules) {
          setRules(JSON.parse(savedRules));
        }
      } catch (e) {
        console.error('Failed to load saved rules:', e);
      }

      // Try to load logs
      try {
        const savedLogs = localStorage.getItem('forwardLogs');
        if (savedLogs) {
          setLogs(JSON.parse(savedLogs));
        }
      } catch (e) {
        console.error('Failed to load logs:', e);
      }
    }
  }, []);

  // Preview message transformation
  const previewTransformation = () => {
    try {
      const extracted = extractDataFromMessage(inputFormat);
      setExtractedData(extracted);
      const transformed = transformMessage(extracted);
      setPreviewResult(transformed);
      setProcessingStatus('success');
      setStatusMessage('Transformasi pesan berhasil!');
    } catch (error) {
      console.error('Error transforming message:', error);
      setProcessingStatus('error');
      setStatusMessage('Error: Gagal melakukan transformasi pesan');
    }
  };

  // Extract data from message using the rules
  const extractDataFromMessage = (message: string): Record<string, string> => {
    const result: Record<string, string> = {};

    // Extract product/kategori
    try {
      const productPattern = new RegExp(`\\*?${messageExtractRules.product}\\s*([^\\n\\*]+)\\*?`, 'i');
      const productMatch = message.match(productPattern);
      if (productMatch && productMatch[1]) {
        result.product = productMatch[1].trim();
      }
    } catch (e) {
      console.error('Error extracting product:', e);
    }

    // Extract name
    try {
      const namePattern = new RegExp(`${messageExtractRules.name}\\s*([^\\n]+)`, 'i');
      const nameMatch = message.match(namePattern);
      if (nameMatch && nameMatch[1]) {
        result.name = nameMatch[1].trim();
      }
    } catch (e) {
      console.error('Error extracting name:', e);
    }

    // Extract phone
    try {
      const phonePattern = new RegExp(`${messageExtractRules.phone}\\s*([^\\n]+)`, 'i');
      const phoneMatch = message.match(phonePattern);
      if (phoneMatch && phoneMatch[1]) {
        result.phone = phoneMatch[1].trim();
      }
    } catch (e) {
      console.error('Error extracting phone:', e);
    }
    return result;
  };

  // Transform message using extracted data
  const transformMessage = (data: Record<string, string>): string => {
    let result = outputFormat;

    // Replace all occurrences of {key} with the corresponding value
    Object.entries(data).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    return result;
  };

  // Save rule
  const saveRule = () => {
    if (!sourceFilter) {
      setProcessingStatus('error');
      setStatusMessage('Mohon masukkan filter sumber pesan (nomor/username)');
      return;
    }
    if (!targetBotUsername) {
      setProcessingStatus('error');
      setStatusMessage('Mohon masukkan username bot tujuan');
      return;
    }
    const newRule: MessageRule = {
      sourcePattern: sourceFilter,
      extract: {
        product: messageExtractRules.product,
        name: messageExtractRules.name,
        phone: messageExtractRules.phone
      },
      targetBot: targetBotUsername,
      outputFormat,
      active: isActive
    };

    // Check for duplicates
    const existingRuleIndex = rules.findIndex(rule => rule.sourcePattern === sourceFilter);
    let updatedRules: MessageRule[];
    if (existingRuleIndex >= 0) {
      // Update existing rule
      updatedRules = [...rules];
      updatedRules[existingRuleIndex] = newRule;
    } else {
      // Add new rule
      updatedRules = [...rules, newRule];
    }
    setRules(updatedRules);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('forwardRules', JSON.stringify(updatedRules));
      localStorage.setItem('forwardSourceFilter', sourceFilter);
      localStorage.setItem('forwardTargetBot', targetBotUsername);
      localStorage.setItem('forwardOutputFormat', outputFormat);
      localStorage.setItem('forwardIsActive', String(isActive));
    }
    setProcessingStatus('success');
    setStatusMessage('Rule berhasil disimpan!');
  };

  // Toggle rule active status
  const toggleActive = () => {
    setIsActive(!isActive);
  };

  // Simulate forwarding message
  const forwardMessage = () => {
    try {
      const extracted = extractDataFromMessage(inputFormat);
      const transformed = transformMessage(extracted);

      // Add to logs
      const newLog: ForwardingLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        source: sourceFilter,
        originalMessage: inputFormat,
        transformedMessage: transformed,
        status: 'success'
      };
      const updatedLogs = [newLog, ...logs.slice(0, 99)]; // Keep only the last 100 logs
      setLogs(updatedLogs);

      // Save logs to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('forwardLogs', JSON.stringify(updatedLogs));
      }
      setProcessingStatus('success');
      setStatusMessage(`Pesan berhasil diteruskan ke ${targetBotUsername}`);
    } catch (error) {
      console.error('Error forwarding message:', error);

      // Add to logs
      const newLog: ForwardingLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        source: sourceFilter,
        originalMessage: inputFormat,
        transformedMessage: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      const updatedLogs = [newLog, ...logs.slice(0, 99)];
      setLogs(updatedLogs);

      // Save logs to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('forwardLogs', JSON.stringify(updatedLogs));
      }
      setProcessingStatus('error');
      setStatusMessage('Error: Gagal meneruskan pesan');
    }
  };
  return <div className="space-y-6" data-unique-id="e0a96894-29cd-4bc3-98a1-adceddb51f56" data-file-name="components/MessageForwarder.tsx">
      <div className="flex items-center gap-2 mb-6" data-unique-id="b7338ee0-ab3b-4a8b-bfc1-b1c6357e3d22" data-file-name="components/MessageForwarder.tsx">
        <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} data-unique-id="e76e154b-f7ff-4460-859e-56e563664870" data-file-name="components/MessageForwarder.tsx"></div>
        <span className="text-sm font-medium" data-unique-id="7a486b3d-52d3-4dbd-b6f7-13dc011c4920" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
          {isActive ? 'Auto-forward Aktif' : 'Auto-forward Tidak Aktif'}
        </span>
        <Button variant="outline" size="sm" onClick={toggleActive} className={isActive ? 'border-green-500 text-green-500' : ''} data-unique-id="212092d5-abcf-4c53-9935-902ad359e094" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
          <ToggleRight className="h-4 w-4 mr-1" />
          {isActive ? 'Nonaktifkan' : 'Aktifkan'}
        </Button>
      </div>

      <Tabs defaultValue="setup" className="w-full" data-unique-id="d28e09b8-0e2a-4705-acf3-fe2a26a9a683" data-file-name="components/MessageForwarder.tsx">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="setup"><span className="editable-text" data-unique-id="dbb5cc5e-b62c-4a51-9fb9-1a78e9ad1f4d" data-file-name="components/MessageForwarder.tsx">Konfigurasi</span></TabsTrigger>
          <TabsTrigger value="preview"><span className="editable-text" data-unique-id="b6f3140a-47fa-404d-b46e-26b489585894" data-file-name="components/MessageForwarder.tsx">Preview & Uji</span></TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup">
          <Card data-unique-id="34cb00e2-8c87-490a-b2f8-8e47bb42aacd" data-file-name="components/MessageForwarder.tsx">
            <CardContent className="space-y-6 pt-6" data-unique-id="74b9c93e-5d2f-4a31-ae57-949835e0ce39" data-file-name="components/MessageForwarder.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="73ae19a3-e63f-4569-9d10-c37beb24c589" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                {/* Source Filter */}
                <div className="space-y-2" data-unique-id="83daf036-c019-4806-97cb-c721b770287f" data-file-name="components/MessageForwarder.tsx">
                  <Label htmlFor="source-filter" className="font-medium" data-unique-id="4e2a4e28-2fdc-440a-b1ae-021f92939483" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="84eb426c-6e1f-49e3-a9a8-1ffbc005c645" data-file-name="components/MessageForwarder.tsx">
                    Username/Nomor Sumber
                  </span></Label>
                  <div className="flex gap-2 items-center" data-unique-id="eefa5ebb-f819-4b96-ab15-a41a2076d822" data-file-name="components/MessageForwarder.tsx">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input id="source-filter" placeholder="628567899393 atau @username" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="flex-1" data-unique-id="7851f9f8-75f8-4a74-b7a0-e7f71d8cc339" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <p className="text-sm text-muted-foreground" data-unique-id="d953556d-d5da-4ddd-8047-477ba69c8d56" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="62b28bd4-5e6f-452e-b226-3a7ef8e4ea48" data-file-name="components/MessageForwarder.tsx">
                    Pesan dari username/nomor ini akan diproses dan diteruskan otomatis
                  </span></p>
                </div>

                {/* Target Bot */}
                <div className="space-y-2" data-unique-id="63bec7cc-1f9a-4c4f-be03-3da653af55d4" data-file-name="components/MessageForwarder.tsx">
                  <Label htmlFor="target-bot" className="font-medium" data-unique-id="70285ffc-5ffd-433a-be1b-a312d1858ac6" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="c0a10b7c-a16a-4f39-851f-fd946b805fdb" data-file-name="components/MessageForwarder.tsx">
                    Username Bot Tujuan
                  </span></Label>
                  <div className="flex gap-2 items-center" data-unique-id="b4876021-7c63-46a0-b0d5-cff01eb0be63" data-file-name="components/MessageForwarder.tsx">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <Input id="target-bot" placeholder="@iky2025bot" value={targetBotUsername} onChange={e => setTargetBotUsername(e.target.value)} className="flex-1" data-unique-id="9a9614fe-78e8-4d1d-a9d5-624fb6ec83e9" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <p className="text-sm text-muted-foreground" data-unique-id="ce634f52-9c5b-467a-b26a-82d62eaedd05" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="bf0c9f58-74b3-4989-9a53-8032b39cd385" data-file-name="components/MessageForwarder.tsx">
                    Pesan akan diteruskan ke bot ini setelah diformat ulang
                  </span></p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6" data-unique-id="9ece4aab-7200-42a0-b5ce-db06132d2907" data-file-name="components/MessageForwarder.tsx">
                <h3 className="text-lg font-medium mb-4" data-unique-id="b0ffbcbf-bd25-4167-9451-4cd326c65a86" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="c3e6898a-89e4-419c-9237-c8a678898d06" data-file-name="components/MessageForwarder.tsx">Pola Ekstraksi Data</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="42a15b54-d6f2-4876-8615-36a7e95e7b1f" data-file-name="components/MessageForwarder.tsx">
                  <div className="space-y-2" data-unique-id="68e87c1c-3a7a-4bc5-a7c0-3eebf05e9e8e" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-product" className="font-medium" data-unique-id="5ab2deef-4459-4bef-bbf3-31a12f444793" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="a8b6f865-d4ab-4c09-a085-39eec73be57c" data-file-name="components/MessageForwarder.tsx">Pola Produk</span></Label>
                    <Input id="extract-product" value={messageExtractRules.product} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    product: e.target.value
                  }))} placeholder="Produk:" data-unique-id="5b0e1a26-9c4b-43ae-b282-166b48ca8b8e" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <div className="space-y-2" data-unique-id="81014177-b963-4ddc-9e57-13d792abdc09" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-name" className="font-medium" data-unique-id="1d52801c-04cc-45ca-a0a7-1694cede0295" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="bb45932c-cbe5-4365-a064-f9255b7e2677" data-file-name="components/MessageForwarder.tsx">Pola Nama</span></Label>
                    <Input id="extract-name" value={messageExtractRules.name} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    name: e.target.value
                  }))} placeholder="Nama:" data-unique-id="811a0699-c6d9-4155-943c-e3c23d0c8f9c" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <div className="space-y-2" data-unique-id="fc476fde-b624-4b4b-8243-fcb32010f12d" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-phone" className="font-medium" data-unique-id="ed4ec6bf-5b3b-4392-a524-1841719bbe28" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="ad834ad2-bf01-4ae4-adc2-49dd76c6fa07" data-file-name="components/MessageForwarder.tsx">Pola Nomor HP</span></Label>
                    <Input id="extract-phone" value={messageExtractRules.phone} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))} placeholder="No HP:" data-unique-id="6aebbf34-b890-4a5a-a4ad-6e8d89b9650b" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2" data-unique-id="c896b858-15a6-45cc-972e-94269258207e" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="9e6803e7-727f-44ed-a299-74a297e868db" data-file-name="components/MessageForwarder.tsx">
                  Pola ini digunakan untuk mengekstrak informasi dari pesan masuk
                </span></p>
              </div>

              <div className="border-t border-slate-100 pt-6" data-unique-id="5670e476-cefe-4810-af15-66fac6c31f7c" data-file-name="components/MessageForwarder.tsx">
                <h3 className="text-lg font-medium mb-4" data-unique-id="45ae23b5-f156-43f8-af7f-c513c07ed780" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="982d829b-322c-4b52-9790-2c109820fef8" data-file-name="components/MessageForwarder.tsx">Format Output</span></h3>
                <div className="space-y-4" data-unique-id="f3e912ff-d90b-4fad-9295-c4167b276b6a" data-file-name="components/MessageForwarder.tsx">
                  <div className="space-y-2" data-unique-id="13f9baee-e848-4960-8957-7ef37541c426" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="output-format" className="font-medium" data-unique-id="617fe14e-a03c-4b41-ae39-aa430b828392" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="0dfb0c5e-651e-4d72-af8c-86f8ceb5fe27" data-file-name="components/MessageForwarder.tsx">Format Pesan Output</span></Label>
                    <textarea id="output-format" className="w-full min-h-[120px] p-3 rounded-md border border-slate-200 bg-white" value={outputFormat} onChange={e => setOutputFormat(e.target.value)} placeholder="PEMBAYARAN&#10;Kategori : {product}&#10;Nama: {name}&#10;No HP: {phone}&#10;Kode Akses: {phone}" data-unique-id="13955166-af45-417e-b3f3-1c619e5c3100" data-file-name="components/MessageForwarder.tsx" />
                    <p className="text-sm text-muted-foreground" data-unique-id="46a3b0d1-d0d5-4c53-9174-6850aadb1c74" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="92dba6a6-3e88-4936-a6e8-1424990714c9" data-file-name="components/MessageForwarder.tsx">
                      Gunakan </span>{'{product}'}<span className="editable-text" data-unique-id="9bae9f8d-33f7-41f1-9be9-089df55abbb0" data-file-name="components/MessageForwarder.tsx">, </span>{'{name}'}<span className="editable-text" data-unique-id="ca7dc2b0-e95d-4037-a94d-9a94b13a96f6" data-file-name="components/MessageForwarder.tsx">, dan </span>{'{phone}'}<span className="editable-text" data-unique-id="0665499d-2110-4ea8-8562-9d181f1e2ceb" data-file-name="components/MessageForwarder.tsx"> sebagai placeholder untuk data yang diekstrak
                    </span></p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4" data-unique-id="a5d5a402-f1ec-4b86-b1c0-530478c29aad" data-file-name="components/MessageForwarder.tsx">
                <Button variant="default" onClick={saveRule} className="bg-primary text-primary-foreground" data-unique-id="59ca0bc2-f867-4201-ba41-6a879c39f113" data-file-name="components/MessageForwarder.tsx">
                  <Settings className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="b4e7b256-2e17-4f8c-88cd-712330a8a307" data-file-name="components/MessageForwarder.tsx">
                  Simpan Konfigurasi
                </span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card data-unique-id="38c8f511-ce5d-4f20-9918-c8aad904d50e" data-file-name="components/MessageForwarder.tsx">
            <CardContent className="space-y-6 pt-6" data-unique-id="4db980a6-b7c9-4dff-a7fa-bafcd8a6df5d" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="42ddde79-46af-4996-8d5d-b4c5d61b3286" data-file-name="components/MessageForwarder.tsx">
                <div className="space-y-4" data-unique-id="f8a9d8ed-422c-4cea-8ea0-37d620b8f1ab" data-file-name="components/MessageForwarder.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="2863e47e-f390-4d24-9c9a-32ed2f029bd7" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="52143396-dafe-485c-a422-1f3f8c6fe5bd" data-file-name="components/MessageForwarder.tsx">Pesan Asli (Contoh)</span></h3>
                  <div className="border rounded-md bg-slate-50" data-unique-id="561351fb-b947-4f87-8fdd-0805a357f8ab" data-file-name="components/MessageForwarder.tsx">
                    <div className="bg-slate-100 p-2 border-b rounded-t-md" data-unique-id="45e2a880-a2f0-4127-ae88-eb9b173bb8d3" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center gap-2" data-unique-id="9d6a3705-8b62-4d26-859f-7123685baf99" data-file-name="components/MessageForwarder.tsx">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium" data-unique-id="cb3055e2-55a8-457e-b7df-f6268888f47c" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2151e1f8-53a6-4151-ae12-9a5c229ba31a" data-file-name="components/MessageForwarder.tsx">Pesan dari </span>{sourceFilter || "628567899393"}</span>
                      </div>
                    </div>
                    <div className="p-4" data-unique-id="6b11be58-58b9-447a-9bdd-a65626bf8b50" data-file-name="components/MessageForwarder.tsx">
                      <textarea className="w-full min-h-[200px] p-2 bg-slate-50 border-0 focus:ring-0" value={inputFormat} onChange={e => setInputFormat(e.target.value)} data-unique-id="7ba72f4e-3ed1-4abc-bc84-23c3f379c438" data-file-name="components/MessageForwarder.tsx" />
                    </div>
                  </div>

                  <Button variant="outline" onClick={previewTransformation} className="w-full" data-unique-id="1a2c3512-83d9-4302-9e75-611eac4076e5" data-file-name="components/MessageForwarder.tsx">
                    <FileText className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="0ca90977-4b32-4c7c-bd67-4085aeb270ae" data-file-name="components/MessageForwarder.tsx">
                    Lihat Preview Transformasi
                  </span></Button>
                </div>

                <div className="space-y-4" data-unique-id="00722fd1-ac28-441f-bc9d-3200a48d1b27" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  <h3 className="text-lg font-medium" data-unique-id="145c8fa7-1a6c-4cc5-8eca-28eb0c21ff1b" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="08c5bb71-5bb4-4b8d-a849-a00ddb449895" data-file-name="components/MessageForwarder.tsx">Hasil Transformasi</span></h3>
                  <div className={`border rounded-md ${processingStatus === 'success' ? 'bg-green-50' : processingStatus === 'error' ? 'bg-red-50' : 'bg-slate-50'}`} data-unique-id="39d969bd-7e3c-4891-bd80-05d8972e0c7d" data-file-name="components/MessageForwarder.tsx">
                    <div className={`p-2 border-b rounded-t-md ${processingStatus === 'success' ? 'bg-green-100' : processingStatus === 'error' ? 'bg-red-100' : 'bg-slate-100'}`} data-unique-id="d767f53b-315a-42dc-a17e-7de62f1f7abb" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center gap-2" data-unique-id="4692daa8-4921-40d7-972c-b8313895d913" data-file-name="components/MessageForwarder.tsx">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium" data-unique-id="d73ed7f8-7606-41dc-8cee-cd3ba509bdce" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c062b757-c23e-4c64-a258-ade242ac5a0e" data-file-name="components/MessageForwarder.tsx">
                          Pesan ke </span>{targetBotUsername || "@iky2025bot"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 whitespace-pre-wrap" data-unique-id="d7b0aa75-26dc-4b98-951f-a35e59cc9a9a" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                      {previewResult || "Hasil transformasi akan muncul di sini"}
                    </div>
                  </div>

                  {processingStatus === 'success' && extractedData && Object.keys(extractedData).length > 0 && <div className="mt-4" data-unique-id="676ef1bc-9057-401d-b64a-087457c2d77b" data-file-name="components/MessageForwarder.tsx">
                      <h4 className="text-sm font-medium mb-2" data-unique-id="7080df06-81fb-4ca4-9ea8-c64c8b8d95a6" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="8868fe24-ce24-4a32-9a65-66804b15e20f" data-file-name="components/MessageForwarder.tsx">Data yang Berhasil Diekstrak:</span></h4>
                      <div className="bg-slate-50 border rounded-md p-3 text-sm" data-unique-id="974b8139-b96f-4ab5-97bc-d66537efa622" data-file-name="components/MessageForwarder.tsx">
                        <div className="grid grid-cols-2 gap-2" data-unique-id="5a4f5464-2e07-4fd0-8c28-704f2674c411" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {Object.entries(extractedData).map(([key, value]) => <div key={key} className="flex items-center gap-1" data-unique-id="8b0d1e16-2a10-4b61-8cd1-c62979a18e36" data-file-name="components/MessageForwarder.tsx">
                              <span className="font-medium" data-unique-id="4723665b-82f6-4601-8517-da4a3986fdc4" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="6be0d842-3db3-4022-902f-0012e23c1181" data-file-name="components/MessageForwarder.tsx">:</span></span>
                              <span className="truncate" data-unique-id="00cc5ad1-42d0-454a-b2c6-e682d1285ad5" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{value}</span>
                            </div>)}
                        </div>
                      </div>
                    </div>}

                  <Button variant="default" onClick={forwardMessage} className="w-full bg-primary hover:bg-primary/90" data-unique-id="8eb26cd5-31d3-4768-a55e-07046228c0b1" data-file-name="components/MessageForwarder.tsx">
                    <Send className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="bee3fadd-8676-4d8d-8a5a-2e72071bec87" data-file-name="components/MessageForwarder.tsx">
                    Uji Kirim Pesan
                  </span></Button>
                </div>
              </div>

              {processingStatus !== 'idle' && <div className={`mt-4 p-3 rounded-md flex items-center ${processingStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="6a96e6f9-580e-4a7d-bb93-d930bbaef16a" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  {processingStatus === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertTriangle className="h-5 w-5 mr-2" />}
                  <span data-unique-id="32bc4dee-be3d-48ce-8e62-9f8a46ba453e" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{statusMessage}</span>
                </div>}

              <div className="border-t border-slate-100 pt-6" data-unique-id="c169dc5a-71b8-44b4-8920-c82041992923" data-file-name="components/MessageForwarder.tsx">
                <div className="flex items-center justify-between mb-4" data-unique-id="79827608-cad5-429a-b3e3-608c2c36a3b4" data-file-name="components/MessageForwarder.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="21292d4c-e682-4766-9745-83fbcda81c09" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="ec0fcfbf-d1e2-41b5-b77c-6f2b991b4677" data-file-name="components/MessageForwarder.tsx">Aktivitas Terbaru</span></h3>
                  <span className="text-sm text-muted-foreground" data-unique-id="f5a49db2-d2ff-4b62-b568-156b5a5d40d4" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {logs.length}<span className="editable-text" data-unique-id="b805de16-0fe1-4785-97db-f17887144eb9" data-file-name="components/MessageForwarder.tsx"> catatan
                  </span></span>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto" data-unique-id="d1013df6-623c-457f-91e0-1b504380656d" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  {logs.slice(0, 5).map(log => <div key={log.id} className={`p-3 rounded-md border ${log.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`} data-unique-id="4f28e368-cdf3-4359-bb6d-558901082399" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center justify-between mb-1" data-unique-id="a9df1e12-1b65-41af-b77f-77fc6d6bdf5b" data-file-name="components/MessageForwarder.tsx">
                        <div className="flex items-center gap-2" data-unique-id="ee28727e-7d97-453f-a5fe-d5b8ff6d01b6" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {log.status === 'success' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                          <span className="font-medium" data-unique-id="e0d9817e-09c0-4a86-a8a0-e10daa9e73d4" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                            {log.status === 'success' ? 'Berhasil' : 'Gagal'}<span className="editable-text" data-unique-id="e96e4bcf-9cb3-49db-ba96-679e68e81eac" data-file-name="components/MessageForwarder.tsx"> meneruskan pesan
                          </span></span>
                        </div>
                        <span className="text-xs text-muted-foreground" data-unique-id="a10dcf75-fefc-4bb4-85aa-eeeff14329a5" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate" data-unique-id="23b5fd80-1260-486f-9621-af08d350b160" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="464acdfb-915c-4966-9e05-6ecb6dfc6ef8" data-file-name="components/MessageForwarder.tsx">
                        Dari: </span>{log.source}<span className="editable-text" data-unique-id="8540983d-8ab4-4e5b-ba8d-730d9e1a83af" data-file-name="components/MessageForwarder.tsx">, Ke: </span>{targetBotUsername}
                      </p>
                    </div>)}

                  {logs.length === 0 && <p className="text-sm text-center text-muted-foreground py-4" data-unique-id="895c11b7-4680-4558-ace7-b7cc2d23bebb" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="b9f885f4-8e0c-400d-b8d1-42f5b4f89043" data-file-name="components/MessageForwarder.tsx">
                      Belum ada aktivitas pencatatan
                    </span></p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}