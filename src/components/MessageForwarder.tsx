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
  return <div className="space-y-6" data-unique-id="d21f77c2-18b7-4b91-a1bb-8384578c04f7" data-file-name="components/MessageForwarder.tsx">
      <div className="flex items-center gap-2 mb-6" data-unique-id="29b659a9-956f-4977-95ae-a9acae43889b" data-file-name="components/MessageForwarder.tsx">
        <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} data-unique-id="b868381a-f2a4-4529-ac6e-565a86623587" data-file-name="components/MessageForwarder.tsx"></div>
        <span className="text-sm font-medium" data-unique-id="46a0481a-162a-4581-befb-07d6aef75315" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
          {isActive ? 'Auto-forward Aktif' : 'Auto-forward Tidak Aktif'}
        </span>
        <Button variant="outline" size="sm" onClick={toggleActive} className={isActive ? 'border-green-500 text-green-500' : ''} data-unique-id="ab3dd2ac-f787-4246-915c-2cc1432f75a5" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
          <ToggleRight className="h-4 w-4 mr-1" />
          {isActive ? 'Nonaktifkan' : 'Aktifkan'}
        </Button>
      </div>

      <Tabs defaultValue="setup" className="w-full" data-unique-id="188adda8-c7fd-495b-af5d-e5f8ee61a887" data-file-name="components/MessageForwarder.tsx">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="setup"><span className="editable-text" data-unique-id="72c6ab04-8757-42aa-a562-ea5e20a75219" data-file-name="components/MessageForwarder.tsx">Konfigurasi</span></TabsTrigger>
          <TabsTrigger value="preview"><span className="editable-text" data-unique-id="b40e803d-6f30-434d-b493-1669aaaffa1c" data-file-name="components/MessageForwarder.tsx">Preview & Uji</span></TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup">
          <Card data-unique-id="0b3ac98e-ba90-4404-a073-285a98fa0d6c" data-file-name="components/MessageForwarder.tsx">
            <CardContent className="space-y-6 pt-6" data-unique-id="e988ad1e-b3fb-429b-bc8c-14b1408423cc" data-file-name="components/MessageForwarder.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="9eb6f197-cff0-42e3-8202-1212dab68cb1" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                {/* Source Filter */}
                <div className="space-y-2" data-unique-id="e090b86f-7161-474b-a74c-1620d05e83a0" data-file-name="components/MessageForwarder.tsx">
                  <Label htmlFor="source-filter" className="font-medium" data-unique-id="852b9ae9-1baf-4e2b-921e-1d008d13fa38" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="731f9f55-4d4c-4d9b-864e-435c3cd0599e" data-file-name="components/MessageForwarder.tsx">
                    Username/Nomor Sumber
                  </span></Label>
                  <div className="flex gap-2 items-center" data-unique-id="85a170ca-695c-4654-ac7f-57f23d1a7754" data-file-name="components/MessageForwarder.tsx">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input id="source-filter" placeholder="628567899393 atau @username" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="flex-1" data-unique-id="4a9d5162-ad13-4c4f-a781-3f18a71a116f" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <p className="text-sm text-muted-foreground" data-unique-id="32033334-9988-419a-b202-c2330422afeb" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="70418d3a-4453-4a45-a383-efb12def6744" data-file-name="components/MessageForwarder.tsx">
                    Pesan dari username/nomor ini akan diproses dan diteruskan otomatis
                  </span></p>
                </div>

                {/* Target Bot */}
                <div className="space-y-2" data-unique-id="1c6c1ad1-71fc-41ff-bcc8-c7f9e6d0c43c" data-file-name="components/MessageForwarder.tsx">
                  <Label htmlFor="target-bot" className="font-medium" data-unique-id="761582b6-667f-42c8-be81-465c85e447b8" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="54981272-dd2a-427c-bdfb-b9778aae2445" data-file-name="components/MessageForwarder.tsx">
                    Username Bot Tujuan
                  </span></Label>
                  <div className="flex gap-2 items-center" data-unique-id="832f4aef-ee24-498f-9dab-5de78bddaa3d" data-file-name="components/MessageForwarder.tsx">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <Input id="target-bot" placeholder="@iky2025bot" value={targetBotUsername} onChange={e => setTargetBotUsername(e.target.value)} className="flex-1" data-unique-id="105bc8f5-0949-4ebc-9d7a-e6606784e654" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <p className="text-sm text-muted-foreground" data-unique-id="c81f4682-2bf8-47d5-b229-d113ac79a76e" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="bdbd192f-e2cb-411e-b07a-3490b855705e" data-file-name="components/MessageForwarder.tsx">
                    Pesan akan diteruskan ke bot ini setelah diformat ulang
                  </span></p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6" data-unique-id="1db84db8-f3cf-47dc-a621-dc61ab0eaaee" data-file-name="components/MessageForwarder.tsx">
                <h3 className="text-lg font-medium mb-4" data-unique-id="abae0ecb-97f8-4be2-8e7c-c4a8ba5d64d2" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="b32d1351-88c4-46e8-9e52-8c0c33c16018" data-file-name="components/MessageForwarder.tsx">Pola Ekstraksi Data</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="93273034-4b67-4b41-a434-71aea9291cef" data-file-name="components/MessageForwarder.tsx">
                  <div className="space-y-2" data-unique-id="07e66728-d113-4b40-a401-cf08100aee8b" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-product" className="font-medium" data-unique-id="75d518db-38bc-4d35-b2ea-14b20157abcd" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="c9af9db8-5883-4785-93fb-790fcf6561ec" data-file-name="components/MessageForwarder.tsx">Pola Produk</span></Label>
                    <Input id="extract-product" value={messageExtractRules.product} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    product: e.target.value
                  }))} placeholder="Produk:" data-unique-id="5c45f8ab-e944-46a2-977c-70bd883a82c8" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <div className="space-y-2" data-unique-id="6e5ef894-6bac-471f-8442-f37f54bd37fd" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-name" className="font-medium" data-unique-id="c27af55a-83b0-43cb-a98c-f43a894e41c8" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="aced2a49-f4c6-4b39-9be6-8fd75fe8aa2c" data-file-name="components/MessageForwarder.tsx">Pola Nama</span></Label>
                    <Input id="extract-name" value={messageExtractRules.name} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    name: e.target.value
                  }))} placeholder="Nama:" data-unique-id="d46f19ae-843b-4806-9d9d-991d593dec0c" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <div className="space-y-2" data-unique-id="5fc0caa3-9f2a-4dfe-bd12-0b7aa83881ce" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-phone" className="font-medium" data-unique-id="c88e8e55-f628-49cc-9423-7d4fdecdd6cc" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="05b13d2a-6aa9-4abd-b82f-f845f760a28b" data-file-name="components/MessageForwarder.tsx">Pola Nomor HP</span></Label>
                    <Input id="extract-phone" value={messageExtractRules.phone} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))} placeholder="No HP:" data-unique-id="872769df-b17a-44dc-b009-8aa07d04e19f" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2" data-unique-id="c9f5be02-ae3c-475c-9d14-5314cb541c5f" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="8d898d7a-655e-4cd6-9012-a84b72085049" data-file-name="components/MessageForwarder.tsx">
                  Pola ini digunakan untuk mengekstrak informasi dari pesan masuk
                </span></p>
              </div>

              <div className="border-t border-slate-100 pt-6" data-unique-id="3af19d29-ce71-4685-b8e6-544357a379e2" data-file-name="components/MessageForwarder.tsx">
                <h3 className="text-lg font-medium mb-4" data-unique-id="20d5edc2-e8b5-44f8-b300-ab0c5db890d4" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="e7805c1c-95c4-4475-867d-eee993f4e884" data-file-name="components/MessageForwarder.tsx">Format Output</span></h3>
                <div className="space-y-4" data-unique-id="2c34637f-de5f-4477-abb5-e9b07b4091cb" data-file-name="components/MessageForwarder.tsx">
                  <div className="space-y-2" data-unique-id="e9684fa3-5f24-4544-a42a-212ca3907d7b" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="output-format" className="font-medium" data-unique-id="e209cae0-1430-4b02-9a90-ba7bafca0408" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="369399a1-f868-4135-839a-1629ccf93ddd" data-file-name="components/MessageForwarder.tsx">Format Pesan Output</span></Label>
                    <textarea id="output-format" className="w-full min-h-[120px] p-3 rounded-md border border-slate-200 bg-white" value={outputFormat} onChange={e => setOutputFormat(e.target.value)} placeholder="PEMBAYARAN&#10;Kategori : {product}&#10;Nama: {name}&#10;No HP: {phone}&#10;Kode Akses: {phone}" data-unique-id="a27497ab-ec7e-4f5b-b28e-54661bd8efc7" data-file-name="components/MessageForwarder.tsx" />
                    <p className="text-sm text-muted-foreground" data-unique-id="7842f6f7-7222-41b8-b061-8dd7ed1aaa47" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="f8a36db5-1de6-431d-8b72-9bfaf14f00c1" data-file-name="components/MessageForwarder.tsx">
                      Gunakan </span>{'{product}'}<span className="editable-text" data-unique-id="8528eaa3-fb27-4102-9574-a2bb95353bee" data-file-name="components/MessageForwarder.tsx">, </span>{'{name}'}<span className="editable-text" data-unique-id="e0955a7a-2c61-441c-9d00-7ac55d91434c" data-file-name="components/MessageForwarder.tsx">, dan </span>{'{phone}'}<span className="editable-text" data-unique-id="70b0c5d7-e88c-4f3e-a5c8-afd262684e0a" data-file-name="components/MessageForwarder.tsx"> sebagai placeholder untuk data yang diekstrak
                    </span></p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4" data-unique-id="0af2ff48-3edc-4ee9-9ccb-bd08d2371d25" data-file-name="components/MessageForwarder.tsx">
                <Button variant="default" onClick={saveRule} className="bg-primary text-primary-foreground" data-unique-id="13d6ca45-60ef-43df-a29b-0c8c97f181b1" data-file-name="components/MessageForwarder.tsx">
                  <Settings className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="d7fdf521-1b00-4979-9cda-ca5d0104cac2" data-file-name="components/MessageForwarder.tsx">
                  Simpan Konfigurasi
                </span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card data-unique-id="631d5564-d12f-4ae3-aad9-8b432948988c" data-file-name="components/MessageForwarder.tsx">
            <CardContent className="space-y-6 pt-6" data-unique-id="61fb177e-7274-44f6-82a2-6452f73b93ac" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="753383fc-7183-4e7b-9ecb-2be971901305" data-file-name="components/MessageForwarder.tsx">
                <div className="space-y-4" data-unique-id="ce01c129-0b64-4f7b-ad0b-e23ec7458baa" data-file-name="components/MessageForwarder.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="d588fb82-a95b-42cd-af97-d972cd42002a" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="a1f5bd2c-7861-414e-b2e7-9cfc95a8aacd" data-file-name="components/MessageForwarder.tsx">Pesan Asli (Contoh)</span></h3>
                  <div className="border rounded-md bg-slate-50" data-unique-id="5d05b871-fc8d-4b72-83d4-bbd329c3f33d" data-file-name="components/MessageForwarder.tsx">
                    <div className="bg-slate-100 p-2 border-b rounded-t-md" data-unique-id="d942181b-2fbc-46ed-a064-9c77d12feb27" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center gap-2" data-unique-id="2cccaa1a-12e2-4a52-a223-3a6069012088" data-file-name="components/MessageForwarder.tsx">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium" data-unique-id="91b0d08c-882e-41ab-a4a0-a32dc8805f49" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="18b3eaa8-2d5b-41df-926a-caef53fcacba" data-file-name="components/MessageForwarder.tsx">Pesan dari </span>{sourceFilter || "628567899393"}</span>
                      </div>
                    </div>
                    <div className="p-4" data-unique-id="c4a0e41c-440b-48a8-8c63-3780a20dc7c8" data-file-name="components/MessageForwarder.tsx">
                      <textarea className="w-full min-h-[200px] p-2 bg-slate-50 border-0 focus:ring-0" value={inputFormat} onChange={e => setInputFormat(e.target.value)} data-unique-id="9ac0d2b4-e1f5-4321-9998-f9c76ebf64ac" data-file-name="components/MessageForwarder.tsx" />
                    </div>
                  </div>

                  <Button variant="outline" onClick={previewTransformation} className="w-full" data-unique-id="d7867435-029e-4241-9d1b-fc751f19201f" data-file-name="components/MessageForwarder.tsx">
                    <FileText className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="f020becf-80ee-4349-a767-874e1294f664" data-file-name="components/MessageForwarder.tsx">
                    Lihat Preview Transformasi
                  </span></Button>
                </div>

                <div className="space-y-4" data-unique-id="39285492-8983-4731-b08a-77d9c1919c25" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  <h3 className="text-lg font-medium" data-unique-id="25eb761a-0a1c-4173-9a56-61b1fe9b5863" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="8c9265ea-06a3-40b7-8f39-3185b16adcda" data-file-name="components/MessageForwarder.tsx">Hasil Transformasi</span></h3>
                  <div className={`border rounded-md ${processingStatus === 'success' ? 'bg-green-50' : processingStatus === 'error' ? 'bg-red-50' : 'bg-slate-50'}`} data-unique-id="385ef296-a037-4fe5-b7a1-c95205c6a9eb" data-file-name="components/MessageForwarder.tsx">
                    <div className={`p-2 border-b rounded-t-md ${processingStatus === 'success' ? 'bg-green-100' : processingStatus === 'error' ? 'bg-red-100' : 'bg-slate-100'}`} data-unique-id="2beec06e-3413-4fd6-b289-bf20b163a98e" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center gap-2" data-unique-id="481de1f5-f6f0-4b76-af1e-feb8173195d9" data-file-name="components/MessageForwarder.tsx">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium" data-unique-id="54604a3e-b5c7-4096-98b9-3cfc40ce35cf" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="621b0320-0676-4256-9cea-4e4a2057bb42" data-file-name="components/MessageForwarder.tsx">
                          Pesan ke </span>{targetBotUsername || "@iky2025bot"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 whitespace-pre-wrap" data-unique-id="45dbd2e6-0d93-4430-b413-2f0fee40b55e" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                      {previewResult || "Hasil transformasi akan muncul di sini"}
                    </div>
                  </div>

                  {processingStatus === 'success' && extractedData && Object.keys(extractedData).length > 0 && <div className="mt-4" data-unique-id="31809d65-9248-4408-988d-0714f0b1b38b" data-file-name="components/MessageForwarder.tsx">
                      <h4 className="text-sm font-medium mb-2" data-unique-id="549e3b76-ac1c-412d-baa1-f9c3cfb0217c" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="7a5feb3c-e8ef-4863-b5ff-823cf0da8284" data-file-name="components/MessageForwarder.tsx">Data yang Berhasil Diekstrak:</span></h4>
                      <div className="bg-slate-50 border rounded-md p-3 text-sm" data-unique-id="017cbdab-b063-4572-834c-b24f67a08d45" data-file-name="components/MessageForwarder.tsx">
                        <div className="grid grid-cols-2 gap-2" data-unique-id="125d43a2-faa7-405e-b391-55931ec8581c" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {Object.entries(extractedData).map(([key, value]) => <div key={key} className="flex items-center gap-1" data-unique-id="44b05b7c-a1f3-4327-bcdc-c8963e3486a9" data-file-name="components/MessageForwarder.tsx">
                              <span className="font-medium" data-unique-id="569dde2c-0422-41da-9e44-16a0f3303458" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="c72432dc-375d-4b2c-a44c-a4151ed9d58a" data-file-name="components/MessageForwarder.tsx">:</span></span>
                              <span className="truncate" data-unique-id="f234f4da-17ec-4726-bee0-c4f9aebc91d6" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{value}</span>
                            </div>)}
                        </div>
                      </div>
                    </div>}

                  <Button variant="default" onClick={forwardMessage} className="w-full bg-primary hover:bg-primary/90" data-unique-id="54a8d80b-e78e-45b8-b278-4099b2b1e2bb" data-file-name="components/MessageForwarder.tsx">
                    <Send className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="27af576c-d350-4048-8e25-33b36d6204b6" data-file-name="components/MessageForwarder.tsx">
                    Uji Kirim Pesan
                  </span></Button>
                </div>
              </div>

              {processingStatus !== 'idle' && <div className={`mt-4 p-3 rounded-md flex items-center ${processingStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="31804d09-f8f3-4a12-92cc-a844dd8d4da5" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  {processingStatus === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertTriangle className="h-5 w-5 mr-2" />}
                  <span data-unique-id="c877d1c5-2274-4e83-a75b-9a1d6a505867" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{statusMessage}</span>
                </div>}

              <div className="border-t border-slate-100 pt-6" data-unique-id="6016846d-8532-4254-894b-9f6f997165d3" data-file-name="components/MessageForwarder.tsx">
                <div className="flex items-center justify-between mb-4" data-unique-id="dc767c9a-34ac-4fa2-8f43-3250a40da257" data-file-name="components/MessageForwarder.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="e3f26f5f-97aa-4233-9d93-7de6783fdb0d" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="5e09a64c-b456-45ab-b57d-08aa4b056fcd" data-file-name="components/MessageForwarder.tsx">Aktivitas Terbaru</span></h3>
                  <span className="text-sm text-muted-foreground" data-unique-id="a1ce0e9c-9d94-4f01-a180-2e30ea27b043" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {logs.length}<span className="editable-text" data-unique-id="6dfda01b-1503-4ffb-9b1e-c11cd20f7e95" data-file-name="components/MessageForwarder.tsx"> catatan
                  </span></span>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto" data-unique-id="9c51a1e6-36d2-433e-9b93-13d7df21f5f5" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  {logs.slice(0, 5).map(log => <div key={log.id} className={`p-3 rounded-md border ${log.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`} data-unique-id="f96ded39-85d3-4965-8d5e-7065afcbd074" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center justify-between mb-1" data-unique-id="11299a8e-ac02-48b4-9e2a-05c3d915aa09" data-file-name="components/MessageForwarder.tsx">
                        <div className="flex items-center gap-2" data-unique-id="5dd96ef7-be7e-4ffc-9c42-e52da8bc0efb" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {log.status === 'success' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                          <span className="font-medium" data-unique-id="9f92ecfd-1089-4210-b7fd-80182f90e64f" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                            {log.status === 'success' ? 'Berhasil' : 'Gagal'}<span className="editable-text" data-unique-id="db4f4555-2a89-47d5-babf-0269d6a47280" data-file-name="components/MessageForwarder.tsx"> meneruskan pesan
                          </span></span>
                        </div>
                        <span className="text-xs text-muted-foreground" data-unique-id="a2926048-8670-4ad5-95aa-b3b19e89073d" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate" data-unique-id="a28bc266-f70f-4a5f-9ec9-bfeaa2ae54d2" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="da22cdaf-f2c1-4006-9e16-35e4eb89de6f" data-file-name="components/MessageForwarder.tsx">
                        Dari: </span>{log.source}<span className="editable-text" data-unique-id="24e946bc-1ae8-4f64-9ce0-16c82efbb3b3" data-file-name="components/MessageForwarder.tsx">, Ke: </span>{targetBotUsername}
                      </p>
                    </div>)}

                  {logs.length === 0 && <p className="text-sm text-center text-muted-foreground py-4" data-unique-id="afc4d00b-63d3-4712-851c-3c62c2a6a263" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="6883b292-d817-44c1-9be2-b5297148d36c" data-file-name="components/MessageForwarder.tsx">
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