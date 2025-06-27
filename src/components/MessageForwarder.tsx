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
  return <div className="space-y-6" data-unique-id="a30ddff2-749c-4a44-ab40-7311e68a6ddd" data-file-name="components/MessageForwarder.tsx">
      <div className="flex items-center gap-2 mb-6" data-unique-id="0262631c-b3a5-4e24-8cb5-fcd58a5bee77" data-file-name="components/MessageForwarder.tsx">
        <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} data-unique-id="227434c0-bf7b-44de-826d-e4cdff5ad739" data-file-name="components/MessageForwarder.tsx"></div>
        <span className="text-sm font-medium" data-unique-id="ebdac4dc-c41f-4860-a118-a714df88d55d" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
          {isActive ? 'Auto-forward Aktif' : 'Auto-forward Tidak Aktif'}
        </span>
        <Button variant="outline" size="sm" onClick={toggleActive} className={isActive ? 'border-green-500 text-green-500' : ''} data-unique-id="20544d48-225a-425b-b375-227740a394cd" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
          <ToggleRight className="h-4 w-4 mr-1" />
          {isActive ? 'Nonaktifkan' : 'Aktifkan'}
        </Button>
      </div>

      <Tabs defaultValue="setup" className="w-full" data-unique-id="59246023-408b-4fb2-b18e-b3a7f3c42d28" data-file-name="components/MessageForwarder.tsx">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="setup"><span className="editable-text" data-unique-id="3a70229a-4593-46a5-8cde-35b6963f2483" data-file-name="components/MessageForwarder.tsx">Konfigurasi</span></TabsTrigger>
          <TabsTrigger value="preview"><span className="editable-text" data-unique-id="38dc9382-696e-4a85-8652-d9749ef251c5" data-file-name="components/MessageForwarder.tsx">Preview & Uji</span></TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup">
          <Card data-unique-id="ec82aed2-b0f1-4fcf-a963-730dd05dc833" data-file-name="components/MessageForwarder.tsx">
            <CardContent className="space-y-6 pt-6" data-unique-id="f1bc2295-ce7e-43d1-a355-99e4cefa86f7" data-file-name="components/MessageForwarder.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="47afd305-e3c4-429e-9cce-3ca63a5de534" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                {/* Source Filter */}
                <div className="space-y-2" data-unique-id="72682168-c3f1-455d-b873-d420b3d5dd18" data-file-name="components/MessageForwarder.tsx">
                  <Label htmlFor="source-filter" className="font-medium" data-unique-id="425e52a3-c0e7-4449-9ed9-771d7a6a3c1f" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="bfeaf76f-c41e-47bc-aefa-42783694f8c7" data-file-name="components/MessageForwarder.tsx">
                    Username/Nomor Sumber
                  </span></Label>
                  <div className="flex gap-2 items-center" data-unique-id="3bc06caf-36ca-4f9e-89bf-4df4221dd4ad" data-file-name="components/MessageForwarder.tsx">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input id="source-filter" placeholder="628567899393 atau @username" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="flex-1" data-unique-id="14d2958e-b14f-4771-8327-c3c9d54272ad" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <p className="text-sm text-muted-foreground" data-unique-id="5a03b347-2867-4cd9-a959-2e6bb4bf3317" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="c8116533-3b5c-4e34-96ff-8a53f2bde4fd" data-file-name="components/MessageForwarder.tsx">
                    Pesan dari username/nomor ini akan diproses dan diteruskan otomatis
                  </span></p>
                </div>

                {/* Target Bot */}
                <div className="space-y-2" data-unique-id="86366d16-b001-4c95-9d8d-e8172e6b6646" data-file-name="components/MessageForwarder.tsx">
                  <Label htmlFor="target-bot" className="font-medium" data-unique-id="68909851-5fa2-4795-9802-e3d0c77d9539" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="2a5fe337-ded5-4a12-871a-bde1a109213b" data-file-name="components/MessageForwarder.tsx">
                    Username Bot Tujuan
                  </span></Label>
                  <div className="flex gap-2 items-center" data-unique-id="e1525829-c28e-4a8c-883b-82b983e0ae52" data-file-name="components/MessageForwarder.tsx">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <Input id="target-bot" placeholder="@iky2025bot" value={targetBotUsername} onChange={e => setTargetBotUsername(e.target.value)} className="flex-1" data-unique-id="34034a8e-90ea-4112-8e0b-455f21e688b6" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <p className="text-sm text-muted-foreground" data-unique-id="8f71ff3a-b6c3-4ee2-a065-78da9c824007" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="f068b7b4-7d23-4dc2-b7ff-a92d599c9645" data-file-name="components/MessageForwarder.tsx">
                    Pesan akan diteruskan ke bot ini setelah diformat ulang
                  </span></p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6" data-unique-id="5c9737ec-0d31-4774-823a-041c374f8ea0" data-file-name="components/MessageForwarder.tsx">
                <h3 className="text-lg font-medium mb-4" data-unique-id="84fa7ea5-c242-4f42-8196-ec841a06f87f" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="7e3ccf90-c2f8-4fd1-8b7b-8e30ce98b146" data-file-name="components/MessageForwarder.tsx">Pola Ekstraksi Data</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="fcb66c44-ef0f-4af7-b4ef-2c56f71ac921" data-file-name="components/MessageForwarder.tsx">
                  <div className="space-y-2" data-unique-id="6e79dcb9-df32-4115-8aca-c0771e767c02" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-product" className="font-medium" data-unique-id="abc04e70-7a33-4ba1-a8e5-24ab19d2cde5" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="7be7b63f-c28e-4191-a121-2837828bb90a" data-file-name="components/MessageForwarder.tsx">Pola Produk</span></Label>
                    <Input id="extract-product" value={messageExtractRules.product} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    product: e.target.value
                  }))} placeholder="Produk:" data-unique-id="f6fa8086-c699-4d72-8466-f5c12062f17f" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <div className="space-y-2" data-unique-id="76701c3f-0084-437e-8c21-d932831e91af" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-name" className="font-medium" data-unique-id="509a4da9-5e90-4b89-b65f-750caab744c0" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="bb28066f-648e-452d-9c08-4c2b7a73033e" data-file-name="components/MessageForwarder.tsx">Pola Nama</span></Label>
                    <Input id="extract-name" value={messageExtractRules.name} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    name: e.target.value
                  }))} placeholder="Nama:" data-unique-id="00b10202-d011-42bb-869d-adc8afbdbdf8" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <div className="space-y-2" data-unique-id="2c456940-4e35-41a3-ad79-48f5a1fce1fd" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-phone" className="font-medium" data-unique-id="300e45e5-ed4c-4402-aafc-44b5eeba246f" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="f6da05d1-3ee0-4688-b4e8-8ee4d892d5a9" data-file-name="components/MessageForwarder.tsx">Pola Nomor HP</span></Label>
                    <Input id="extract-phone" value={messageExtractRules.phone} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))} placeholder="No HP:" data-unique-id="8f46e39d-70d3-4890-8c5f-a803ec5c9e2e" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2" data-unique-id="e8503553-d92b-4cce-bc07-22806b96b3ad" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="91d41689-2a6f-40c9-b69b-c73b57c9b4dd" data-file-name="components/MessageForwarder.tsx">
                  Pola ini digunakan untuk mengekstrak informasi dari pesan masuk
                </span></p>
              </div>

              <div className="border-t border-slate-100 pt-6" data-unique-id="d9073a14-3f32-47e8-aeb0-a1904bc5231a" data-file-name="components/MessageForwarder.tsx">
                <h3 className="text-lg font-medium mb-4" data-unique-id="8d4fad22-430e-41b2-b5c8-06f97b1fa2b2" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="c7a47c89-ab00-424f-ae1d-684f84f0cd7b" data-file-name="components/MessageForwarder.tsx">Format Output</span></h3>
                <div className="space-y-4" data-unique-id="adf03c91-4ff5-4184-aeb4-69cc808cfc09" data-file-name="components/MessageForwarder.tsx">
                  <div className="space-y-2" data-unique-id="b7cc908d-b612-4f0c-89cf-300ee4997e1b" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="output-format" className="font-medium" data-unique-id="b78f79df-05f1-47e3-94e3-0dd89b45ecc1" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="a1e18cbb-2cb9-417d-a6de-f1ee79f75175" data-file-name="components/MessageForwarder.tsx">Format Pesan Output</span></Label>
                    <textarea id="output-format" className="w-full min-h-[120px] p-3 rounded-md border border-slate-200 bg-white" value={outputFormat} onChange={e => setOutputFormat(e.target.value)} placeholder="PEMBAYARAN&#10;Kategori : {product}&#10;Nama: {name}&#10;No HP: {phone}&#10;Kode Akses: {phone}" data-unique-id="c0b5928e-c2b0-497a-8999-5dc7a0b8cc90" data-file-name="components/MessageForwarder.tsx" />
                    <p className="text-sm text-muted-foreground" data-unique-id="463e96fd-d32d-494d-bead-f6af7cf8baab" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="5e94f59a-7e16-4652-8722-949cdb1f68aa" data-file-name="components/MessageForwarder.tsx">
                      Gunakan </span>{'{product}'}<span className="editable-text" data-unique-id="b3ed9b85-1f3b-4fa0-bbff-2e50f44df429" data-file-name="components/MessageForwarder.tsx">, </span>{'{name}'}<span className="editable-text" data-unique-id="47921a0a-4808-46d0-a8f1-a19642a3d3c0" data-file-name="components/MessageForwarder.tsx">, dan </span>{'{phone}'}<span className="editable-text" data-unique-id="b1dd927b-4949-4a66-bbc2-f26d46393723" data-file-name="components/MessageForwarder.tsx"> sebagai placeholder untuk data yang diekstrak
                    </span></p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4" data-unique-id="c9b0dc15-0ef4-4403-a3a6-6f3666a59665" data-file-name="components/MessageForwarder.tsx">
                <Button variant="default" onClick={saveRule} className="bg-primary text-primary-foreground" data-unique-id="0b1bc23b-0d73-462a-be6a-7aca91d8f782" data-file-name="components/MessageForwarder.tsx">
                  <Settings className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="90d3e5ba-fd7e-431e-97c3-0bd18c4194ef" data-file-name="components/MessageForwarder.tsx">
                  Simpan Konfigurasi
                </span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card data-unique-id="9adb3442-4acf-4d7a-bad8-8983944fc210" data-file-name="components/MessageForwarder.tsx">
            <CardContent className="space-y-6 pt-6" data-unique-id="a6698eb3-2de2-4b5e-ac30-a5223f1c59f8" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="60b6b851-1f99-45df-abfb-c02bcd7c87aa" data-file-name="components/MessageForwarder.tsx">
                <div className="space-y-4" data-unique-id="cc9b6075-6022-4326-9a83-222db53975e7" data-file-name="components/MessageForwarder.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="10b8fc8b-7b50-415d-a5b5-a7e195cd7c7a" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="7d43fdc8-9f88-477b-813e-5a77f16c3514" data-file-name="components/MessageForwarder.tsx">Pesan Asli (Contoh)</span></h3>
                  <div className="border rounded-md bg-slate-50" data-unique-id="f9297b1d-219a-4535-8d58-4c50659555fe" data-file-name="components/MessageForwarder.tsx">
                    <div className="bg-slate-100 p-2 border-b rounded-t-md" data-unique-id="1384d781-be8b-4ad3-90b8-edde3d443e33" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center gap-2" data-unique-id="f56b96d6-80da-4c16-bb5d-556b09fa622b" data-file-name="components/MessageForwarder.tsx">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium" data-unique-id="8f9abc9a-b3c1-4b25-9b31-c457cc9f906e" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1824c671-d0fc-4d49-8691-a680a7d46b27" data-file-name="components/MessageForwarder.tsx">Pesan dari </span>{sourceFilter || "628567899393"}</span>
                      </div>
                    </div>
                    <div className="p-4" data-unique-id="86f279ce-d504-485f-856c-f0080beae9fd" data-file-name="components/MessageForwarder.tsx">
                      <textarea className="w-full min-h-[200px] p-2 bg-slate-50 border-0 focus:ring-0" value={inputFormat} onChange={e => setInputFormat(e.target.value)} data-unique-id="65c8df81-cbc7-422b-94bb-b0e16c781b86" data-file-name="components/MessageForwarder.tsx" />
                    </div>
                  </div>

                  <Button variant="outline" onClick={previewTransformation} className="w-full" data-unique-id="a21e2aca-addb-44c6-bd6e-da34479eb7fc" data-file-name="components/MessageForwarder.tsx">
                    <FileText className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="ca9fcbb1-6782-4f40-a0cc-b8419328c937" data-file-name="components/MessageForwarder.tsx">
                    Lihat Preview Transformasi
                  </span></Button>
                </div>

                <div className="space-y-4" data-unique-id="1f6471a1-c7bd-4e32-a7f9-2800b12be0ea" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  <h3 className="text-lg font-medium" data-unique-id="faf3e9fb-24f1-4dc6-9944-68f6684bf967" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="885d53af-0cf1-402e-afc3-a68f0a9d346d" data-file-name="components/MessageForwarder.tsx">Hasil Transformasi</span></h3>
                  <div className={`border rounded-md ${processingStatus === 'success' ? 'bg-green-50' : processingStatus === 'error' ? 'bg-red-50' : 'bg-slate-50'}`} data-unique-id="30cf13b4-851d-4dfb-938b-07017011485d" data-file-name="components/MessageForwarder.tsx">
                    <div className={`p-2 border-b rounded-t-md ${processingStatus === 'success' ? 'bg-green-100' : processingStatus === 'error' ? 'bg-red-100' : 'bg-slate-100'}`} data-unique-id="ad8f98f7-8f99-4ff0-b112-39dc95ea5433" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center gap-2" data-unique-id="a7758c52-b8b8-4b93-9718-925e521b90b6" data-file-name="components/MessageForwarder.tsx">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium" data-unique-id="979f3fe6-82fc-41aa-8a90-2328da978363" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ab12879c-cd2a-43c9-92a0-28535622a20b" data-file-name="components/MessageForwarder.tsx">
                          Pesan ke </span>{targetBotUsername || "@iky2025bot"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 whitespace-pre-wrap" data-unique-id="ba5dcc4d-585e-450e-9dd0-ac05ccc15c52" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                      {previewResult || "Hasil transformasi akan muncul di sini"}
                    </div>
                  </div>

                  {processingStatus === 'success' && extractedData && Object.keys(extractedData).length > 0 && <div className="mt-4" data-unique-id="59284ee9-577a-4116-b312-ce7fc2d886cd" data-file-name="components/MessageForwarder.tsx">
                      <h4 className="text-sm font-medium mb-2" data-unique-id="9ac290fa-cd42-436e-8122-3cf56e13ee92" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="6f200555-4718-461e-89c4-22b926952559" data-file-name="components/MessageForwarder.tsx">Data yang Berhasil Diekstrak:</span></h4>
                      <div className="bg-slate-50 border rounded-md p-3 text-sm" data-unique-id="ede540a5-2a6c-4e80-94b0-10940cebd89a" data-file-name="components/MessageForwarder.tsx">
                        <div className="grid grid-cols-2 gap-2" data-unique-id="c88cdc15-e2ed-4094-a17d-72fbc271f507" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {Object.entries(extractedData).map(([key, value]) => <div key={key} className="flex items-center gap-1" data-unique-id="ff75a7de-3152-485b-aa93-e25bbb323164" data-file-name="components/MessageForwarder.tsx">
                              <span className="font-medium" data-unique-id="a908dd10-32f9-49c0-afe6-9c426e6118d1" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="59a4356e-f8cb-48aa-9dc2-b725015734b1" data-file-name="components/MessageForwarder.tsx">:</span></span>
                              <span className="truncate" data-unique-id="918ed137-0c5b-4ab5-a2f5-48924bb18036" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{value}</span>
                            </div>)}
                        </div>
                      </div>
                    </div>}

                  <Button variant="default" onClick={forwardMessage} className="w-full bg-primary hover:bg-primary/90" data-unique-id="545c93ce-3791-4b06-b9a8-519fad25b48a" data-file-name="components/MessageForwarder.tsx">
                    <Send className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="d7a678b0-961f-4eca-9ed9-855821085626" data-file-name="components/MessageForwarder.tsx">
                    Uji Kirim Pesan
                  </span></Button>
                </div>
              </div>

              {processingStatus !== 'idle' && <div className={`mt-4 p-3 rounded-md flex items-center ${processingStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="ab68dd4c-f8fb-4a7e-91b0-d74f0cf99ed3" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  {processingStatus === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertTriangle className="h-5 w-5 mr-2" />}
                  <span data-unique-id="dc1f6628-08a6-4b0a-9a25-d301c4497a15" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{statusMessage}</span>
                </div>}

              <div className="border-t border-slate-100 pt-6" data-unique-id="5a7d6e69-7d06-4792-af07-5eed1166166d" data-file-name="components/MessageForwarder.tsx">
                <div className="flex items-center justify-between mb-4" data-unique-id="64cf782d-96a4-4eb7-afcb-d66307bd650d" data-file-name="components/MessageForwarder.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="fb5d0198-3671-402d-b3f7-54b70d840d07" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="4c053935-621d-4d13-98f2-a61f09cb6158" data-file-name="components/MessageForwarder.tsx">Aktivitas Terbaru</span></h3>
                  <span className="text-sm text-muted-foreground" data-unique-id="b7e07b99-30b4-442d-9a90-5dad06209b3b" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {logs.length}<span className="editable-text" data-unique-id="47e75f9c-5623-4ae7-a055-b72875b2f60a" data-file-name="components/MessageForwarder.tsx"> catatan
                  </span></span>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto" data-unique-id="3d390940-c060-45dd-8a21-e163db82dc03" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  {logs.slice(0, 5).map(log => <div key={log.id} className={`p-3 rounded-md border ${log.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`} data-unique-id="a0864acb-6b2f-4bfd-b587-93048b1fa7de" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center justify-between mb-1" data-unique-id="29643224-d0e8-445f-a055-28abc63232d2" data-file-name="components/MessageForwarder.tsx">
                        <div className="flex items-center gap-2" data-unique-id="4ddca5f8-2466-4c8f-a0c6-d34a0e92cb50" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {log.status === 'success' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                          <span className="font-medium" data-unique-id="5fd2ff0c-aaad-4550-a959-6c5fd453593f" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                            {log.status === 'success' ? 'Berhasil' : 'Gagal'}<span className="editable-text" data-unique-id="0b22c40b-6954-416c-80ba-941bbc1ea395" data-file-name="components/MessageForwarder.tsx"> meneruskan pesan
                          </span></span>
                        </div>
                        <span className="text-xs text-muted-foreground" data-unique-id="794c77b4-58eb-43cf-95dc-ed2f06012616" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate" data-unique-id="dc08b215-2d8f-4cdb-a463-74f9e17fd7e7" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="81b6a420-173a-41f7-949e-94e2c985d10e" data-file-name="components/MessageForwarder.tsx">
                        Dari: </span>{log.source}<span className="editable-text" data-unique-id="1c7030de-7308-4188-90e7-ad7955d948d8" data-file-name="components/MessageForwarder.tsx">, Ke: </span>{targetBotUsername}
                      </p>
                    </div>)}

                  {logs.length === 0 && <p className="text-sm text-center text-muted-foreground py-4" data-unique-id="d4ea1853-e1e1-4b2a-878a-d37319a112f5" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="72f32e7a-6bf1-4882-a73f-688ac8b6621c" data-file-name="components/MessageForwarder.tsx">
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