"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";
interface Log {
  id: string;
  timestamp: string;
  messageId: string;
  content: string;
  forwarded: boolean;
  keyword: string | null;
  error?: string;
}
interface ForwardingLogsProps {
  logs: Log[];
}
export default function ForwardingLogs({
  logs
}: ForwardingLogsProps) {
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const toggleExpand = (id: string) => {
    setExpandedLogs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  return <div className="overflow-x-auto" data-unique-id="0d470c6e-75bb-4df6-b956-271e588d525a" data-file-name="components/ForwardingLogs.tsx">
      <Table data-unique-id="1a89ca37-58ea-4906-a5eb-9fdd93b95e26" data-file-name="components/ForwardingLogs.tsx">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]"><span className="editable-text" data-unique-id="28bf133a-a971-42b6-9c4a-57bc44bd79dd" data-file-name="components/ForwardingLogs.tsx">Waktu</span></TableHead>
            <TableHead><span className="editable-text" data-unique-id="08e218da-03cd-4977-8f20-8ab97867d143" data-file-name="components/ForwardingLogs.tsx">Pesan</span></TableHead>
            <TableHead><span className="editable-text" data-unique-id="ac33f53d-d8f8-42d7-b2c4-b68cef73cad3" data-file-name="components/ForwardingLogs.tsx">Kata Kunci</span></TableHead>
            <TableHead className="w-[100px]"><span className="editable-text" data-unique-id="bab7b349-fdd8-4f30-af0b-a6504bfe9fc6" data-file-name="components/ForwardingLogs.tsx">Status</span></TableHead>
            <TableHead className="w-[80px]"><span className="editable-text" data-unique-id="c9dcd2f0-dfda-4d35-b3c3-b3a271b2efb7" data-file-name="components/ForwardingLogs.tsx">Detail</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!logs || logs.length === 0 ? <TableRow>
              <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="9da539fc-2fe1-444f-b383-47283b729212" data-file-name="components/ForwardingLogs.tsx">
                Belum ada log aktivitas. Log akan muncul saat pesan diterima dan diteruskan.
              </span></TableCell>
            </TableRow> : Array.isArray(logs) ? logs.map(log => <>
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {formatDistanceToNow(new Date(log.timestamp), {
                addSuffix: true
              })}
                  </TableCell>
                  <TableCell>
                    {expandedLogs[log.id] ? log.content : `${log.content.substring(0, 50)}${log.content.length > 50 ? '...' : ''}`}
                  </TableCell>
                  <TableCell>{log.keyword || "—"}</TableCell>
                  <TableCell>
                    {log.forwarded ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" data-is-mapped="true" data-unique-id="29d8f10f-6f5c-438e-9ba4-3ca0b3f27e73" data-file-name="components/ForwardingLogs.tsx">
                        <CheckCircle className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="4ce86e83-99c9-4f8f-b55a-32954354e529" data-file-name="components/ForwardingLogs.tsx">
                        Diteruskan
                      </span></span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" data-is-mapped="true" data-unique-id="0130212d-216f-418d-84a7-bbe078960010" data-file-name="components/ForwardingLogs.tsx">
                        <XCircle className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="7ebc010b-124b-43ca-a527-01020252ded8" data-file-name="components/ForwardingLogs.tsx">
                        Difilter
                      </span></span>}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(log.id)} className="p-0 h-8 w-8" data-is-mapped="true" data-unique-id="50fd7e73-bd5f-43ed-b289-dc81512b168e" data-file-name="components/ForwardingLogs.tsx" data-dynamic-text="true">
                      {expandedLogs[log.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedLogs[log.id] && log.error && <TableRow>
                    <TableCell colSpan={5} className="bg-red-50 text-red-800 p-2">
                      <strong data-is-mapped="true" data-unique-id="41f3cf65-9cc1-4988-bbe4-e1bad7911f77" data-file-name="components/ForwardingLogs.tsx"><span className="editable-text" data-unique-id="5151d33b-5f32-4194-a8cb-1f1e5fcf6ff0" data-file-name="components/ForwardingLogs.tsx">Error:</span></strong> {log.error}
                    </TableCell>
                  </TableRow>}
              </>) : <TableRow>
                <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="9d722ea9-9033-4194-afc8-af012244b3fb" data-file-name="components/ForwardingLogs.tsx">
                  Error: Received invalid log data. Please refresh the page.
                </span></TableCell>
              </TableRow>}
        </TableBody>
      </Table>
    </div>;
}