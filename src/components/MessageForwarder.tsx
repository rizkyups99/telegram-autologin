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
  return <div className="space-y-6" data-unique-id="ffbad77b-2dd2-4f82-ba5c-5a9401739cf4" data-file-name="components/MessageForwarder.tsx">
      <div className="flex items-center gap-2 mb-6" data-unique-id="efd23826-0a27-48d0-baa6-2764b753b9fe" data-file-name="components/MessageForwarder.tsx">
        <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} data-unique-id="24b84afc-c29d-4089-a0a7-05864fa0b306" data-file-name="components/MessageForwarder.tsx"></div>
        <span className="text-sm font-medium" data-unique-id="095f6074-b1c9-4d42-8237-822cb1ff5b20" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
          {isActive ? 'Auto-forward Aktif' : 'Auto-forward Tidak Aktif'}
        </span>
        <Button variant="outline" size="sm" onClick={toggleActive} className={isActive ? 'border-green-500 text-green-500' : ''} data-unique-id="df0807bf-74df-4645-b55f-8ab404fc486d" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
          <ToggleRight className="h-4 w-4 mr-1" />
          {isActive ? 'Nonaktifkan' : 'Aktifkan'}
        </Button>
      </div>

      <Tabs defaultValue="setup" className="w-full" data-unique-id="84949b4a-92d5-4185-9048-0bb105bd0018" data-file-name="components/MessageForwarder.tsx">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="setup"><span className="editable-text" data-unique-id="66b39abd-0c15-40e6-94a6-05983ccaa1ed" data-file-name="components/MessageForwarder.tsx">Konfigurasi</span></TabsTrigger>
          <TabsTrigger value="preview"><span className="editable-text" data-unique-id="52d9ec6d-1792-468c-813f-bb5eab412acf" data-file-name="components/MessageForwarder.tsx">Preview & Uji</span></TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup">
          <Card data-unique-id="932102b9-eaaa-4ca2-823e-7692f6b7f468" data-file-name="components/MessageForwarder.tsx">
            <CardContent className="space-y-6 pt-6" data-unique-id="aeda9f71-3788-4cc0-8ac9-ddb02f770dc7" data-file-name="components/MessageForwarder.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="6dd07222-754c-4992-9bcc-fef6bd0245b5" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                {/* Source Filter */}
                <div className="space-y-2" data-unique-id="57b5f7eb-5713-4acc-8870-a431216248cd" data-file-name="components/MessageForwarder.tsx">
                  <Label htmlFor="source-filter" className="font-medium" data-unique-id="b3081935-452d-416f-be06-04f3b536cf5e" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="b5e5566e-9648-4fb2-ab01-e73ee3ee9aab" data-file-name="components/MessageForwarder.tsx">
                    Username/Nomor Sumber
                  </span></Label>
                  <div className="flex gap-2 items-center" data-unique-id="5c7775f3-a9c3-436c-89c8-f8e404c9ec29" data-file-name="components/MessageForwarder.tsx">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input id="source-filter" placeholder="628567899393 atau @username" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="flex-1" data-unique-id="168afb8c-74fd-4dcd-84cc-888177f8a55c" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <p className="text-sm text-muted-foreground" data-unique-id="584db1f8-5c4d-4721-9b26-228c10ef97be" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="e053e40d-7aa7-4f2e-88c0-aa3f28a3a2ab" data-file-name="components/MessageForwarder.tsx">
                    Pesan dari username/nomor ini akan diproses dan diteruskan otomatis
                  </span></p>
                </div>

                {/* Target Bot */}
                <div className="space-y-2" data-unique-id="5777bada-ce4b-430d-97c7-ab851e10d65b" data-file-name="components/MessageForwarder.tsx">
                  <Label htmlFor="target-bot" className="font-medium" data-unique-id="070360ba-3653-4a33-9e6d-727be5611b19" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="51d34998-3597-485b-ba6f-961f55bbdcbe" data-file-name="components/MessageForwarder.tsx">
                    Username Bot Tujuan
                  </span></Label>
                  <div className="flex gap-2 items-center" data-unique-id="6d4b2f34-0efc-4b89-aa36-ab0e8dc98e22" data-file-name="components/MessageForwarder.tsx">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <Input id="target-bot" placeholder="@iky2025bot" value={targetBotUsername} onChange={e => setTargetBotUsername(e.target.value)} className="flex-1" data-unique-id="986db447-e771-4291-9fc3-f87966928977" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <p className="text-sm text-muted-foreground" data-unique-id="c2d2be1f-7a6c-4cd9-8fac-55831fccd00a" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="5a9a76a4-46ca-44d6-9559-b0b03af1eed0" data-file-name="components/MessageForwarder.tsx">
                    Pesan akan diteruskan ke bot ini setelah diformat ulang
                  </span></p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6" data-unique-id="c3ddb701-c1c2-459d-a12e-8f9aae1cb114" data-file-name="components/MessageForwarder.tsx">
                <h3 className="text-lg font-medium mb-4" data-unique-id="429c5920-2db3-4bab-922b-2a22f4d73f07" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="99ce2e6f-c1d7-482a-a770-0c938f8bff38" data-file-name="components/MessageForwarder.tsx">Pola Ekstraksi Data</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="269f7fa3-8175-4a6c-b3d7-b547cd5f1503" data-file-name="components/MessageForwarder.tsx">
                  <div className="space-y-2" data-unique-id="bf365e2a-9d86-4f22-aa79-552b867c690e" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-product" className="font-medium" data-unique-id="afbffc93-dc06-4289-9e43-4154a1e8851d" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="0e429045-ab86-4d35-9c1b-d8636a7c169e" data-file-name="components/MessageForwarder.tsx">Pola Produk</span></Label>
                    <Input id="extract-product" value={messageExtractRules.product} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    product: e.target.value
                  }))} placeholder="Produk:" data-unique-id="d09becc4-d765-437b-b803-6ca48a40f093" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <div className="space-y-2" data-unique-id="9af2c689-5ab9-4755-83c3-bc096ac41a73" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-name" className="font-medium" data-unique-id="d0a0f2a6-05e1-46d8-9695-adbda477cdd9" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="dabe8623-fbbb-414c-bb64-4d8a81eda9d6" data-file-name="components/MessageForwarder.tsx">Pola Nama</span></Label>
                    <Input id="extract-name" value={messageExtractRules.name} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    name: e.target.value
                  }))} placeholder="Nama:" data-unique-id="6bdb505f-74be-46d0-82a6-bdf7734ac6e4" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <div className="space-y-2" data-unique-id="55185b4c-dff7-4f8b-a944-e72303708847" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-phone" className="font-medium" data-unique-id="c678f360-4d2f-40cf-b04d-7ac184acc5e3" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="e6292f1b-037d-4ce4-bd5b-0806b48bad6c" data-file-name="components/MessageForwarder.tsx">Pola Nomor HP</span></Label>
                    <Input id="extract-phone" value={messageExtractRules.phone} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))} placeholder="No HP:" data-unique-id="2b056aa5-7406-4a61-a542-2f6f143a4c3f" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2" data-unique-id="8bac98f0-7f9f-4c68-8559-732fefd4cc60" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="a7d4ef77-986d-4a4f-8a69-6c64586074f8" data-file-name="components/MessageForwarder.tsx">
                  Pola ini digunakan untuk mengekstrak informasi dari pesan masuk
                </span></p>
              </div>

              <div className="border-t border-slate-100 pt-6" data-unique-id="4f12c9e0-4b64-435c-94a3-d90dee10656a" data-file-name="components/MessageForwarder.tsx">
                <h3 className="text-lg font-medium mb-4" data-unique-id="cca0f489-0d73-4bb3-a607-a5b1eb91c091" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="794ccf62-dc84-418e-b41e-fabf7cfe3414" data-file-name="components/MessageForwarder.tsx">Format Output</span></h3>
                <div className="space-y-4" data-unique-id="d7287710-cb9d-4712-a5ff-c48eaaf15b8f" data-file-name="components/MessageForwarder.tsx">
                  <div className="space-y-2" data-unique-id="62f1667e-6178-4560-a953-d239ea5d8612" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="output-format" className="font-medium" data-unique-id="6cd19f13-8f0a-4645-8d25-3cd910f39f67" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="853aab9d-9364-4473-a553-54f3fed3d2a1" data-file-name="components/MessageForwarder.tsx">Format Pesan Output</span></Label>
                    <textarea id="output-format" className="w-full min-h-[120px] p-3 rounded-md border border-slate-200 bg-white" value={outputFormat} onChange={e => setOutputFormat(e.target.value)} placeholder="PEMBAYARAN&#10;Kategori : {product}&#10;Nama: {name}&#10;No HP: {phone}&#10;Kode Akses: {phone}" data-unique-id="636f84ab-b141-4dca-8387-efe6daffb154" data-file-name="components/MessageForwarder.tsx" />
                    <p className="text-sm text-muted-foreground" data-unique-id="21d956b2-0525-4919-b338-1612baace346" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="f7d01d8e-f7d6-428b-9396-5afa28e1e5a3" data-file-name="components/MessageForwarder.tsx">
                      Gunakan </span>{'{product}'}<span className="editable-text" data-unique-id="887155c4-250d-4309-a91a-91a4e1e182c6" data-file-name="components/MessageForwarder.tsx">, </span>{'{name}'}<span className="editable-text" data-unique-id="594b286d-60c4-4d09-9ed1-00e831c0e550" data-file-name="components/MessageForwarder.tsx">, dan </span>{'{phone}'}<span className="editable-text" data-unique-id="7214f453-3c76-4818-b215-0ec2e5cc217e" data-file-name="components/MessageForwarder.tsx"> sebagai placeholder untuk data yang diekstrak
                    </span></p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4" data-unique-id="37ec4024-e900-4189-80a6-2b64b42d9602" data-file-name="components/MessageForwarder.tsx">
                <Button variant="default" onClick={saveRule} className="bg-primary text-primary-foreground" data-unique-id="4966534d-ee10-4dd2-807d-89cf78c4d830" data-file-name="components/MessageForwarder.tsx">
                  <Settings className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="ae599252-77cf-44e0-bef9-c749250cb00c" data-file-name="components/MessageForwarder.tsx">
                  Simpan Konfigurasi
                </span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card data-unique-id="6ca2f632-9e13-481b-a694-26e55d743893" data-file-name="components/MessageForwarder.tsx">
            <CardContent className="space-y-6 pt-6" data-unique-id="652f8a60-1f44-4ee2-bbad-e9d828c31177" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="c8945b5b-a1d5-4711-8b13-ca3802b11247" data-file-name="components/MessageForwarder.tsx">
                <div className="space-y-4" data-unique-id="2313625a-eea3-484f-a77e-7f90eee3aeba" data-file-name="components/MessageForwarder.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="2c554d55-63ec-4e6e-a1a3-b027b7a4a118" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="d0d02b20-009d-44bc-9d20-97c5e2783961" data-file-name="components/MessageForwarder.tsx">Pesan Asli (Contoh)</span></h3>
                  <div className="border rounded-md bg-slate-50" data-unique-id="26fa6bea-ab49-43b3-8bbd-53d6498ac4da" data-file-name="components/MessageForwarder.tsx">
                    <div className="bg-slate-100 p-2 border-b rounded-t-md" data-unique-id="e29fd8f1-8e74-43d8-9037-2db49fbd1004" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center gap-2" data-unique-id="1c3a4c9b-a804-4968-891c-a66b332a5c67" data-file-name="components/MessageForwarder.tsx">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium" data-unique-id="5cde1ad5-83fd-4979-b871-21059c8c88b0" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5a86b0cf-37ef-4b09-9d6b-d5471ee54241" data-file-name="components/MessageForwarder.tsx">Pesan dari </span>{sourceFilter || "628567899393"}</span>
                      </div>
                    </div>
                    <div className="p-4" data-unique-id="7ad7a764-7e63-44c2-8206-3a4be330ba3e" data-file-name="components/MessageForwarder.tsx">
                      <textarea className="w-full min-h-[200px] p-2 bg-slate-50 border-0 focus:ring-0" value={inputFormat} onChange={e => setInputFormat(e.target.value)} data-unique-id="e5fcf1ea-ff30-4c8f-979a-4aa609a481fa" data-file-name="components/MessageForwarder.tsx" />
                    </div>
                  </div>

                  <Button variant="outline" onClick={previewTransformation} className="w-full" data-unique-id="aa88e939-3c55-46d4-9b75-2425a3417b95" data-file-name="components/MessageForwarder.tsx">
                    <FileText className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="4bd9ab47-60cf-4317-bdee-ba443dfabafd" data-file-name="components/MessageForwarder.tsx">
                    Lihat Preview Transformasi
                  </span></Button>
                </div>

                <div className="space-y-4" data-unique-id="82210139-e76f-4dcd-a56e-7b797f707e26" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  <h3 className="text-lg font-medium" data-unique-id="d2783e07-5567-4e12-ba67-6dcf3c9dbc9f" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="b1afcf1f-02f3-48f5-92bb-b5a9f0b1c980" data-file-name="components/MessageForwarder.tsx">Hasil Transformasi</span></h3>
                  <div className={`border rounded-md ${processingStatus === 'success' ? 'bg-green-50' : processingStatus === 'error' ? 'bg-red-50' : 'bg-slate-50'}`} data-unique-id="9058ef6e-719c-4beb-8970-7a413aae6dea" data-file-name="components/MessageForwarder.tsx">
                    <div className={`p-2 border-b rounded-t-md ${processingStatus === 'success' ? 'bg-green-100' : processingStatus === 'error' ? 'bg-red-100' : 'bg-slate-100'}`} data-unique-id="38c30145-a404-4761-9265-7aaa06c8cf82" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center gap-2" data-unique-id="0876c0d6-8020-483e-a6ee-ef8b513a3f61" data-file-name="components/MessageForwarder.tsx">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium" data-unique-id="368716c7-bd48-48bb-948f-73194f4ee529" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="13871753-e4cc-4600-85b5-1ce7ef3f1fb1" data-file-name="components/MessageForwarder.tsx">
                          Pesan ke </span>{targetBotUsername || "@iky2025bot"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 whitespace-pre-wrap" data-unique-id="95350cbb-7894-4d25-abed-807455acef0c" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                      {previewResult || "Hasil transformasi akan muncul di sini"}
                    </div>
                  </div>

                  {processingStatus === 'success' && extractedData && Object.keys(extractedData).length > 0 && <div className="mt-4" data-unique-id="8bbf8d23-f855-4134-beea-4fe935479ca6" data-file-name="components/MessageForwarder.tsx">
                      <h4 className="text-sm font-medium mb-2" data-unique-id="f1b606ee-b6eb-4bc4-aa49-314d8bed3dd8" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="26d3cb2e-1adb-446a-889e-22144b4f333c" data-file-name="components/MessageForwarder.tsx">Data yang Berhasil Diekstrak:</span></h4>
                      <div className="bg-slate-50 border rounded-md p-3 text-sm" data-unique-id="8cc55ae1-dd04-41f7-bc2f-67fb6626b74f" data-file-name="components/MessageForwarder.tsx">
                        <div className="grid grid-cols-2 gap-2" data-unique-id="15db1e3f-ae25-4205-9dda-449cad81263c" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {Object.entries(extractedData).map(([key, value]) => <div key={key} className="flex items-center gap-1" data-unique-id="7f1d4168-7e43-4e12-a53f-45a55b4f6f19" data-file-name="components/MessageForwarder.tsx">
                              <span className="font-medium" data-unique-id="94ff09e1-9aa0-4ff5-87c6-391bcfdbb72d" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="63f4bce2-185f-434a-8152-5b35e9a3ddcd" data-file-name="components/MessageForwarder.tsx">:</span></span>
                              <span className="truncate" data-unique-id="c264a018-8c25-4c97-b0a4-cd46cf76e159" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{value}</span>
                            </div>)}
                        </div>
                      </div>
                    </div>}

                  <Button variant="default" onClick={forwardMessage} className="w-full bg-primary hover:bg-primary/90" data-unique-id="4ec01138-8432-4d22-8166-695353ce83b7" data-file-name="components/MessageForwarder.tsx">
                    <Send className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="ac1f670e-5496-4fda-8092-f726c64f29a7" data-file-name="components/MessageForwarder.tsx">
                    Uji Kirim Pesan
                  </span></Button>
                </div>
              </div>

              {processingStatus !== 'idle' && <div className={`mt-4 p-3 rounded-md flex items-center ${processingStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="7385f759-6ad6-4b0f-822c-cba265451a33" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  {processingStatus === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertTriangle className="h-5 w-5 mr-2" />}
                  <span data-unique-id="0178d3c6-7b00-4a31-8f30-be504f5fc164" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{statusMessage}</span>
                </div>}

              <div className="border-t border-slate-100 pt-6" data-unique-id="de55c12f-409b-4a84-b845-4455bbc9c03f" data-file-name="components/MessageForwarder.tsx">
                <div className="flex items-center justify-between mb-4" data-unique-id="bffd8292-a415-4f59-b994-e466c2c9d1d3" data-file-name="components/MessageForwarder.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="96d9b0b1-9ca0-4339-b5f5-d0f3ada63453" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="0206f240-2589-45cc-8d11-ed5cc1b3f720" data-file-name="components/MessageForwarder.tsx">Aktivitas Terbaru</span></h3>
                  <span className="text-sm text-muted-foreground" data-unique-id="c27c51f7-790c-4bad-81fc-de13bba001c8" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {logs.length}<span className="editable-text" data-unique-id="e48be110-0aee-44bd-b3b5-07d34eb6f268" data-file-name="components/MessageForwarder.tsx"> catatan
                  </span></span>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto" data-unique-id="32b843d4-a696-4e3f-90d9-ae89a261f50f" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  {logs.slice(0, 5).map(log => <div key={log.id} className={`p-3 rounded-md border ${log.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`} data-unique-id="76d0c462-de8a-4d42-b660-e6289ee549c0" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center justify-between mb-1" data-unique-id="42daafc8-6d12-4e80-bb70-f7d9887114cc" data-file-name="components/MessageForwarder.tsx">
                        <div className="flex items-center gap-2" data-unique-id="8afcfedb-7a34-4569-8251-8cb0aced9173" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {log.status === 'success' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                          <span className="font-medium" data-unique-id="f605f9de-2b8d-4549-ac97-39d2475d3c70" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                            {log.status === 'success' ? 'Berhasil' : 'Gagal'}<span className="editable-text" data-unique-id="2f426142-b394-4f29-a3db-d344ea9150ca" data-file-name="components/MessageForwarder.tsx"> meneruskan pesan
                          </span></span>
                        </div>
                        <span className="text-xs text-muted-foreground" data-unique-id="19af96ac-b1c3-444a-b277-eb07f7fa1381" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate" data-unique-id="24fc2a32-fc54-4809-80c6-b627a07710a3" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="86f9d576-0d57-420b-bc18-f8728b60277b" data-file-name="components/MessageForwarder.tsx">
                        Dari: </span>{log.source}<span className="editable-text" data-unique-id="33bf9b4e-80db-4bdb-937c-30e9316ae95c" data-file-name="components/MessageForwarder.tsx">, Ke: </span>{targetBotUsername}
                      </p>
                    </div>)}

                  {logs.length === 0 && <p className="text-sm text-center text-muted-foreground py-4" data-unique-id="087500a1-9e60-4906-8b4a-92ef567c7315" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="2e27ec59-005c-49c2-a141-30f9f05a366a" data-file-name="components/MessageForwarder.tsx">
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