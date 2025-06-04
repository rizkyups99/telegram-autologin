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
  return <div className="space-y-6" data-unique-id="9173f3b8-3716-488b-aa82-a014f5a1ca82" data-file-name="components/MessageForwarder.tsx">
      <div className="flex items-center gap-2 mb-6" data-unique-id="77c63550-8003-4755-9b0f-8616a1da417e" data-file-name="components/MessageForwarder.tsx">
        <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} data-unique-id="5d0218ed-a117-4ebe-a991-6956bd2af69d" data-file-name="components/MessageForwarder.tsx"></div>
        <span className="text-sm font-medium" data-unique-id="c11d9c0b-4d17-433f-840a-332c1a672ab4" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
          {isActive ? 'Auto-forward Aktif' : 'Auto-forward Tidak Aktif'}
        </span>
        <Button variant="outline" size="sm" onClick={toggleActive} className={isActive ? 'border-green-500 text-green-500' : ''} data-unique-id="9f16dfdf-9a77-43d5-aa3d-855e17eb7e63" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
          <ToggleRight className="h-4 w-4 mr-1" />
          {isActive ? 'Nonaktifkan' : 'Aktifkan'}
        </Button>
      </div>

      <Tabs defaultValue="setup" className="w-full" data-unique-id="e2894f4c-5c44-431e-900b-c8f3093dfe7d" data-file-name="components/MessageForwarder.tsx">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="setup"><span className="editable-text" data-unique-id="2c987fdf-13c4-401f-bdfa-e10fc0a453e5" data-file-name="components/MessageForwarder.tsx">Konfigurasi</span></TabsTrigger>
          <TabsTrigger value="preview"><span className="editable-text" data-unique-id="5e2635ec-6236-4b71-b31a-85936e840385" data-file-name="components/MessageForwarder.tsx">Preview & Uji</span></TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup">
          <Card data-unique-id="dd9fc497-a8b4-4e00-a064-0bc0c5674bc9" data-file-name="components/MessageForwarder.tsx">
            <CardContent className="space-y-6 pt-6" data-unique-id="4aa0b8c3-50a0-41bf-92b6-5ba247e9c4b4" data-file-name="components/MessageForwarder.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="0d26b178-a1c9-4cdc-b360-55d04a58383f" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                {/* Source Filter */}
                <div className="space-y-2" data-unique-id="fd5c6bee-fc9c-4246-bc2a-3268ff838e5c" data-file-name="components/MessageForwarder.tsx">
                  <Label htmlFor="source-filter" className="font-medium" data-unique-id="1c8f0c2a-f4b0-4f0e-858e-5f76b54aa8c0" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="01b13e1e-d31a-460e-987b-e4090231c5b4" data-file-name="components/MessageForwarder.tsx">
                    Username/Nomor Sumber
                  </span></Label>
                  <div className="flex gap-2 items-center" data-unique-id="dde56d4c-663d-4b05-a724-cd2d1aae6474" data-file-name="components/MessageForwarder.tsx">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input id="source-filter" placeholder="628567899393 atau @username" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="flex-1" data-unique-id="4f17c534-ab8b-4553-ba10-373eba94e5fd" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <p className="text-sm text-muted-foreground" data-unique-id="f6e4eefd-890f-4917-8db5-1e4e1c8ee366" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="1840d439-8d80-4d75-8016-64e0d474fdc5" data-file-name="components/MessageForwarder.tsx">
                    Pesan dari username/nomor ini akan diproses dan diteruskan otomatis
                  </span></p>
                </div>

                {/* Target Bot */}
                <div className="space-y-2" data-unique-id="364610d8-106e-4c93-a879-982ab88f8737" data-file-name="components/MessageForwarder.tsx">
                  <Label htmlFor="target-bot" className="font-medium" data-unique-id="07f3a55e-c393-4d77-9870-60c131b8081a" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="3236bfe7-079d-46df-883b-095fa35405b7" data-file-name="components/MessageForwarder.tsx">
                    Username Bot Tujuan
                  </span></Label>
                  <div className="flex gap-2 items-center" data-unique-id="fc74fb98-f5f5-408a-87c6-623e4a13b03a" data-file-name="components/MessageForwarder.tsx">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <Input id="target-bot" placeholder="@iky2025bot" value={targetBotUsername} onChange={e => setTargetBotUsername(e.target.value)} className="flex-1" data-unique-id="4ff4db04-449d-41ed-b5cf-9af6d43576b1" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <p className="text-sm text-muted-foreground" data-unique-id="a83d8d5c-7aca-4784-a73b-c68689acf133" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="09d3e643-4751-467d-bd62-f35eb49bb6a5" data-file-name="components/MessageForwarder.tsx">
                    Pesan akan diteruskan ke bot ini setelah diformat ulang
                  </span></p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6" data-unique-id="7ecc9e02-4724-474a-8e3e-db3144d6fe18" data-file-name="components/MessageForwarder.tsx">
                <h3 className="text-lg font-medium mb-4" data-unique-id="5cf58f96-17e2-4437-8af5-210db809619e" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="cac76b98-cf7a-4f26-b087-313767a6e129" data-file-name="components/MessageForwarder.tsx">Pola Ekstraksi Data</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="f90d255e-8801-4854-a047-f57c0a7381fe" data-file-name="components/MessageForwarder.tsx">
                  <div className="space-y-2" data-unique-id="ad1a0528-75d6-4216-9319-dc9f883bf960" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-product" className="font-medium" data-unique-id="cf56db5e-688e-4771-be17-15eddbd21c33" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="f119e9a6-6de3-456f-be05-ef2da8546392" data-file-name="components/MessageForwarder.tsx">Pola Produk</span></Label>
                    <Input id="extract-product" value={messageExtractRules.product} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    product: e.target.value
                  }))} placeholder="Produk:" data-unique-id="c240db0b-a474-4583-9846-102dd99d3e89" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <div className="space-y-2" data-unique-id="cd0309df-8af6-4494-9ddd-6a18f1fc7da4" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-name" className="font-medium" data-unique-id="830d8610-9899-4ee9-a0e8-7ee9b7b048b6" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="7ee3a14e-8cbd-411c-aeed-fbf36470b4b0" data-file-name="components/MessageForwarder.tsx">Pola Nama</span></Label>
                    <Input id="extract-name" value={messageExtractRules.name} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    name: e.target.value
                  }))} placeholder="Nama:" data-unique-id="a140eb53-254c-4c6a-9587-b47f846a3b46" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                  <div className="space-y-2" data-unique-id="01995859-a1ec-444e-8e0b-b5ead06d64a6" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="extract-phone" className="font-medium" data-unique-id="53d60f14-6d30-4108-ad5d-907513b0ded1" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="a4177efe-0ce0-4036-95fc-422183dfc921" data-file-name="components/MessageForwarder.tsx">Pola Nomor HP</span></Label>
                    <Input id="extract-phone" value={messageExtractRules.phone} onChange={e => setMessageExtractRules(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))} placeholder="No HP:" data-unique-id="f9efbcac-8866-48ea-8bf4-114ce1622a6f" data-file-name="components/MessageForwarder.tsx" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2" data-unique-id="b18e9c64-1b26-46f6-be49-0378a0f2524e" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="6536f305-1f26-436d-8aa6-b0140e846fda" data-file-name="components/MessageForwarder.tsx">
                  Pola ini digunakan untuk mengekstrak informasi dari pesan masuk
                </span></p>
              </div>

              <div className="border-t border-slate-100 pt-6" data-unique-id="b7fb14b4-bb8d-4917-95a9-03531c4df2cc" data-file-name="components/MessageForwarder.tsx">
                <h3 className="text-lg font-medium mb-4" data-unique-id="92303dd7-d036-4fd0-a092-c0b0a1277b35" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="ce8decb0-04e5-45dc-824a-c30708ccb905" data-file-name="components/MessageForwarder.tsx">Format Output</span></h3>
                <div className="space-y-4" data-unique-id="b1bc9c3a-f3e5-4fb9-8ed2-a70a2da2e788" data-file-name="components/MessageForwarder.tsx">
                  <div className="space-y-2" data-unique-id="5fdf8560-02d7-4282-9c28-f191b92cbe7e" data-file-name="components/MessageForwarder.tsx">
                    <Label htmlFor="output-format" className="font-medium" data-unique-id="d84cc127-3b77-4495-a14c-0afc0e7ee269" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="a375470f-9a2c-4cb3-a85e-73b5a511331c" data-file-name="components/MessageForwarder.tsx">Format Pesan Output</span></Label>
                    <textarea id="output-format" className="w-full min-h-[120px] p-3 rounded-md border border-slate-200 bg-white" value={outputFormat} onChange={e => setOutputFormat(e.target.value)} placeholder="PEMBAYARAN&#10;Kategori : {product}&#10;Nama: {name}&#10;No HP: {phone}&#10;Kode Akses: {phone}" data-unique-id="dd4b3140-d622-445e-8e58-2460fa56fc5b" data-file-name="components/MessageForwarder.tsx" />
                    <p className="text-sm text-muted-foreground" data-unique-id="a1f4df58-890b-44d9-bf09-56eb51259b2d" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="a1d5355a-0563-4744-adcf-87c69ab508a8" data-file-name="components/MessageForwarder.tsx">
                      Gunakan </span>{'{product}'}<span className="editable-text" data-unique-id="b8d5bfa9-243c-485c-a4fe-d50cdb407a91" data-file-name="components/MessageForwarder.tsx">, </span>{'{name}'}<span className="editable-text" data-unique-id="209c8bb0-3a60-4aa5-b891-4d397541e531" data-file-name="components/MessageForwarder.tsx">, dan </span>{'{phone}'}<span className="editable-text" data-unique-id="885bf5f9-8859-4bbc-934e-72672ca8aa74" data-file-name="components/MessageForwarder.tsx"> sebagai placeholder untuk data yang diekstrak
                    </span></p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4" data-unique-id="6e1f8a6a-4b35-4e90-922d-c7eeaf820e94" data-file-name="components/MessageForwarder.tsx">
                <Button variant="default" onClick={saveRule} className="bg-primary text-primary-foreground" data-unique-id="af9cfc86-012d-4e58-9488-0196b3452c01" data-file-name="components/MessageForwarder.tsx">
                  <Settings className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="194441bb-f06d-4e1e-bf72-8751117eb9f8" data-file-name="components/MessageForwarder.tsx">
                  Simpan Konfigurasi
                </span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card data-unique-id="bf8c60f0-2835-4a58-94a9-c7e2317b7638" data-file-name="components/MessageForwarder.tsx">
            <CardContent className="space-y-6 pt-6" data-unique-id="3a07d3ab-cfff-4f93-8acf-f927304ab23c" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="6d1ef836-bae9-4e68-9637-5a5b91b9ab69" data-file-name="components/MessageForwarder.tsx">
                <div className="space-y-4" data-unique-id="00f10bb8-3a91-480c-aa46-fe6dd5f900a9" data-file-name="components/MessageForwarder.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="4fe622ec-33b0-4996-8148-e48a75ac150b" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="0e3efa5b-5ddb-4734-98bf-8814c7371790" data-file-name="components/MessageForwarder.tsx">Pesan Asli (Contoh)</span></h3>
                  <div className="border rounded-md bg-slate-50" data-unique-id="7ab42f1c-9407-4a09-b5f6-42550b88a711" data-file-name="components/MessageForwarder.tsx">
                    <div className="bg-slate-100 p-2 border-b rounded-t-md" data-unique-id="8f15d9c7-dc31-476d-bf7d-f458945c7d63" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center gap-2" data-unique-id="23a0df37-e6a7-4db2-923b-d27b1be1d2cf" data-file-name="components/MessageForwarder.tsx">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium" data-unique-id="bfb347b0-98b9-42ad-9561-0056a87bc536" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="120523aa-fda3-4670-9a15-e88c5ec4b5ba" data-file-name="components/MessageForwarder.tsx">Pesan dari </span>{sourceFilter || "628567899393"}</span>
                      </div>
                    </div>
                    <div className="p-4" data-unique-id="b1539c7d-ca9f-45f7-b0a3-90385c4b29bc" data-file-name="components/MessageForwarder.tsx">
                      <textarea className="w-full min-h-[200px] p-2 bg-slate-50 border-0 focus:ring-0" value={inputFormat} onChange={e => setInputFormat(e.target.value)} data-unique-id="2914bf70-002e-43c1-9de0-71ed2ea19c1c" data-file-name="components/MessageForwarder.tsx" />
                    </div>
                  </div>

                  <Button variant="outline" onClick={previewTransformation} className="w-full" data-unique-id="58c663d4-450e-4edd-931a-70d6f6077df2" data-file-name="components/MessageForwarder.tsx">
                    <FileText className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="b9de665a-7b0c-45b6-8a0b-1596f892fb96" data-file-name="components/MessageForwarder.tsx">
                    Lihat Preview Transformasi
                  </span></Button>
                </div>

                <div className="space-y-4" data-unique-id="d6b9ded0-9c11-4981-bbaf-1475db316b6b" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  <h3 className="text-lg font-medium" data-unique-id="7eb08fdd-dcc8-4473-b86e-1dd7e6e2fc61" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="1893afe2-5dec-4f71-a790-dc561cc07dc3" data-file-name="components/MessageForwarder.tsx">Hasil Transformasi</span></h3>
                  <div className={`border rounded-md ${processingStatus === 'success' ? 'bg-green-50' : processingStatus === 'error' ? 'bg-red-50' : 'bg-slate-50'}`} data-unique-id="2376ec27-8a4b-4955-a711-b7028bd615ac" data-file-name="components/MessageForwarder.tsx">
                    <div className={`p-2 border-b rounded-t-md ${processingStatus === 'success' ? 'bg-green-100' : processingStatus === 'error' ? 'bg-red-100' : 'bg-slate-100'}`} data-unique-id="e6f1f63d-a84c-4d0c-af04-1b753c0030bf" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center gap-2" data-unique-id="67c8d07f-31da-40bd-82f5-22971e7fb67c" data-file-name="components/MessageForwarder.tsx">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium" data-unique-id="8285436b-0321-4a64-80d0-c57accb4cd8c" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="582f7596-20d7-4e1f-b0e4-6d807858c579" data-file-name="components/MessageForwarder.tsx">
                          Pesan ke </span>{targetBotUsername || "@iky2025bot"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 whitespace-pre-wrap" data-unique-id="d6afc1ce-6f4d-4350-ac77-559864fdb174" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                      {previewResult || "Hasil transformasi akan muncul di sini"}
                    </div>
                  </div>

                  {processingStatus === 'success' && extractedData && Object.keys(extractedData).length > 0 && <div className="mt-4" data-unique-id="e1b0cee9-fd66-4c9d-bf46-eeb29dfbc0c6" data-file-name="components/MessageForwarder.tsx">
                      <h4 className="text-sm font-medium mb-2" data-unique-id="ab0356d5-b4de-4c8e-96e2-e6b928ca1dc5" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="e59863d5-c1fc-42e5-af77-ee0441725319" data-file-name="components/MessageForwarder.tsx">Data yang Berhasil Diekstrak:</span></h4>
                      <div className="bg-slate-50 border rounded-md p-3 text-sm" data-unique-id="4bce4ede-9e4d-485d-a51e-6ee9e401ab2a" data-file-name="components/MessageForwarder.tsx">
                        <div className="grid grid-cols-2 gap-2" data-unique-id="044b02e1-c3b2-4e57-9b94-a1489029dff3" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {Object.entries(extractedData).map(([key, value]) => <div key={key} className="flex items-center gap-1" data-unique-id="3d6a4c81-4613-4e30-aaf8-c1103444ce95" data-file-name="components/MessageForwarder.tsx">
                              <span className="font-medium" data-unique-id="7f49d0fd-cc35-4347-8530-97fbc6cc1da7" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="d785ab51-a2bd-4954-b49d-24564d761ba9" data-file-name="components/MessageForwarder.tsx">:</span></span>
                              <span className="truncate" data-unique-id="f67d63c0-6c83-4607-8485-d86b1d32d01d" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{value}</span>
                            </div>)}
                        </div>
                      </div>
                    </div>}

                  <Button variant="default" onClick={forwardMessage} className="w-full bg-primary hover:bg-primary/90" data-unique-id="52c15cf6-e7ad-47ed-88c8-44431a775e22" data-file-name="components/MessageForwarder.tsx">
                    <Send className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="3b177ea8-6096-47ef-8918-75ce52a67271" data-file-name="components/MessageForwarder.tsx">
                    Uji Kirim Pesan
                  </span></Button>
                </div>
              </div>

              {processingStatus !== 'idle' && <div className={`mt-4 p-3 rounded-md flex items-center ${processingStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="255c8bc7-5ae3-43e9-a83f-3c502fe4b270" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  {processingStatus === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertTriangle className="h-5 w-5 mr-2" />}
                  <span data-unique-id="8b7222d0-63cb-48dc-aa5b-9fbbabac08c6" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">{statusMessage}</span>
                </div>}

              <div className="border-t border-slate-100 pt-6" data-unique-id="8fe12056-4588-405b-a439-fb0300df76a9" data-file-name="components/MessageForwarder.tsx">
                <div className="flex items-center justify-between mb-4" data-unique-id="777f6bf5-b399-49d1-90dc-df383398edf3" data-file-name="components/MessageForwarder.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="8f0b40f5-d7f5-418c-8f08-b17baed28e3b" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="1f855dba-b033-4257-bcc4-d6d1eea8d41d" data-file-name="components/MessageForwarder.tsx">Aktivitas Terbaru</span></h3>
                  <span className="text-sm text-muted-foreground" data-unique-id="2ffab7aa-8d1b-4fb9-b6bd-b2d47192e860" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {logs.length}<span className="editable-text" data-unique-id="980b62a3-1961-46e9-b7e3-e463c90e49d7" data-file-name="components/MessageForwarder.tsx"> catatan
                  </span></span>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto" data-unique-id="a356beca-ad43-428b-8728-e19bae300c3e" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                  {logs.slice(0, 5).map(log => <div key={log.id} className={`p-3 rounded-md border ${log.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`} data-unique-id="9f3ac42a-f49d-41ec-8980-cfeab573497b" data-file-name="components/MessageForwarder.tsx">
                      <div className="flex items-center justify-between mb-1" data-unique-id="ca005977-f4bd-4c48-948b-be6dc02e44a9" data-file-name="components/MessageForwarder.tsx">
                        <div className="flex items-center gap-2" data-unique-id="c52b4cc1-02aa-4774-9436-fa1360c3040f" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {log.status === 'success' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                          <span className="font-medium" data-unique-id="6a4e2b81-5a51-469d-8121-0993f3fc8c21" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                            {log.status === 'success' ? 'Berhasil' : 'Gagal'}<span className="editable-text" data-unique-id="6e44b733-62f5-4055-8594-f73469ddb37a" data-file-name="components/MessageForwarder.tsx"> meneruskan pesan
                          </span></span>
                        </div>
                        <span className="text-xs text-muted-foreground" data-unique-id="5808a0aa-3c47-4763-bd06-ee1191849b0e" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate" data-unique-id="16a6c294-3e3e-487a-9df3-46657920cb25" data-file-name="components/MessageForwarder.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f6b33697-f970-4982-ba3d-8edb315dcc83" data-file-name="components/MessageForwarder.tsx">
                        Dari: </span>{log.source}<span className="editable-text" data-unique-id="57ec40c2-5085-400f-b12a-dbd4d9c2e1b0" data-file-name="components/MessageForwarder.tsx">, Ke: </span>{targetBotUsername}
                      </p>
                    </div>)}

                  {logs.length === 0 && <p className="text-sm text-center text-muted-foreground py-4" data-unique-id="4597734a-ce76-438a-a571-2f88d312b5b7" data-file-name="components/MessageForwarder.tsx"><span className="editable-text" data-unique-id="73a5ba2f-61c4-4c57-ad0e-f552d57797a7" data-file-name="components/MessageForwarder.tsx">
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