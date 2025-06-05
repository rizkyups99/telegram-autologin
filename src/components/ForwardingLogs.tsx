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
  return <div className="overflow-x-auto" data-unique-id="72c668e7-ce0e-4c54-8c06-0a0eb71b5ff2" data-file-name="components/ForwardingLogs.tsx">
      <Table data-unique-id="726a55b5-d14b-4384-a52f-a20372596f97" data-file-name="components/ForwardingLogs.tsx">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]"><span className="editable-text" data-unique-id="ac75bfea-3579-4bef-84ce-a1bc4298e318" data-file-name="components/ForwardingLogs.tsx">Waktu</span></TableHead>
            <TableHead><span className="editable-text" data-unique-id="cbfd4e59-9919-4e52-a0fc-3e18459c8ff6" data-file-name="components/ForwardingLogs.tsx">Pesan</span></TableHead>
            <TableHead><span className="editable-text" data-unique-id="9f39234d-4680-4555-86b8-e1a390d290d1" data-file-name="components/ForwardingLogs.tsx">Kata Kunci</span></TableHead>
            <TableHead className="w-[100px]"><span className="editable-text" data-unique-id="a22f6fd3-f558-45e5-b95f-e40242c51c19" data-file-name="components/ForwardingLogs.tsx">Status</span></TableHead>
            <TableHead className="w-[80px]"><span className="editable-text" data-unique-id="691c5745-6454-40cd-8f9e-0698dc4e25a2" data-file-name="components/ForwardingLogs.tsx">Detail</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!logs || logs.length === 0 ? <TableRow>
              <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="8bc1f16c-2ff0-4a00-8426-ea4f59e3ce05" data-file-name="components/ForwardingLogs.tsx">
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
                    {log.forwarded ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" data-is-mapped="true" data-unique-id="b4c40da2-e0b9-45ca-85c9-e9b56baed685" data-file-name="components/ForwardingLogs.tsx">
                        <CheckCircle className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="ff83bcba-bf60-4b10-a088-5b3086fea51a" data-file-name="components/ForwardingLogs.tsx">
                        Diteruskan
                      </span></span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" data-is-mapped="true" data-unique-id="12f1bdfe-4643-4e92-9b87-d3bff577dfd5" data-file-name="components/ForwardingLogs.tsx">
                        <XCircle className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="e8663727-e619-4ed0-ad56-303b635acf23" data-file-name="components/ForwardingLogs.tsx">
                        Difilter
                      </span></span>}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(log.id)} className="p-0 h-8 w-8" data-is-mapped="true" data-unique-id="be642fa3-a417-4776-baf3-f72884aeb7e4" data-file-name="components/ForwardingLogs.tsx" data-dynamic-text="true">
                      {expandedLogs[log.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedLogs[log.id] && log.error && <TableRow>
                    <TableCell colSpan={5} className="bg-red-50 text-red-800 p-2">
                      <strong data-is-mapped="true" data-unique-id="e49505af-e1af-4cef-a02e-668cb5743adf" data-file-name="components/ForwardingLogs.tsx"><span className="editable-text" data-unique-id="382e62b1-2fa4-4850-8c1f-271d42edacf0" data-file-name="components/ForwardingLogs.tsx">Error:</span></strong> {log.error}
                    </TableCell>
                  </TableRow>}
              </>) : <TableRow>
                <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="34c44268-5a2b-4696-bcf5-1b1d6d30b478" data-file-name="components/ForwardingLogs.tsx">
                  Error: Received invalid log data. Please refresh the page.
                </span></TableCell>
              </TableRow>}
        </TableBody>
      </Table>
    </div>;
}