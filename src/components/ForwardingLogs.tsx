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
  return <div className="overflow-x-auto" data-unique-id="0038e043-b4a7-4d90-996a-4cca6a0f751b" data-file-name="components/ForwardingLogs.tsx">
      <Table data-unique-id="7e5ca448-5e58-457e-9541-801dcaa9238d" data-file-name="components/ForwardingLogs.tsx">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]"><span className="editable-text" data-unique-id="5fcb10b5-c394-4ee8-a77d-9d892ff14fe8" data-file-name="components/ForwardingLogs.tsx">Waktu</span></TableHead>
            <TableHead><span className="editable-text" data-unique-id="21abc0f2-da2d-4c30-9501-a2e479e209ed" data-file-name="components/ForwardingLogs.tsx">Pesan</span></TableHead>
            <TableHead><span className="editable-text" data-unique-id="f9c98ddf-ea6c-49ab-b217-d11d52e885c1" data-file-name="components/ForwardingLogs.tsx">Kata Kunci</span></TableHead>
            <TableHead className="w-[100px]"><span className="editable-text" data-unique-id="7e84d904-411a-4bdd-a328-e465a6ab8580" data-file-name="components/ForwardingLogs.tsx">Status</span></TableHead>
            <TableHead className="w-[80px]"><span className="editable-text" data-unique-id="62443392-d891-4965-bebd-cf9aa34870fa" data-file-name="components/ForwardingLogs.tsx">Detail</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!logs || logs.length === 0 ? <TableRow>
              <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="ecc3b734-ac71-45e5-b84a-b1df437cd7d1" data-file-name="components/ForwardingLogs.tsx">
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
                    {log.forwarded ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" data-is-mapped="true" data-unique-id="2b895f7f-31d5-4f37-928c-64a669a6eaef" data-file-name="components/ForwardingLogs.tsx">
                        <CheckCircle className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="aa423555-0bd0-48d8-a1fd-34fc76b600ff" data-file-name="components/ForwardingLogs.tsx">
                        Diteruskan
                      </span></span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" data-is-mapped="true" data-unique-id="18beda60-ad8d-463e-b637-152d773444b9" data-file-name="components/ForwardingLogs.tsx">
                        <XCircle className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="aefbf747-3c48-475c-9d75-c33a5fa75ba7" data-file-name="components/ForwardingLogs.tsx">
                        Difilter
                      </span></span>}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(log.id)} className="p-0 h-8 w-8" data-is-mapped="true" data-unique-id="e5fd12c3-ceb5-4009-8495-2cd9a7c90bec" data-file-name="components/ForwardingLogs.tsx" data-dynamic-text="true">
                      {expandedLogs[log.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedLogs[log.id] && log.error && <TableRow>
                    <TableCell colSpan={5} className="bg-red-50 text-red-800 p-2">
                      <strong data-is-mapped="true" data-unique-id="ba8586fa-ed54-4276-aed9-2c885abe8c39" data-file-name="components/ForwardingLogs.tsx"><span className="editable-text" data-unique-id="efe5631e-6d06-479a-be8e-238ff732ad76" data-file-name="components/ForwardingLogs.tsx">Error:</span></strong> {log.error}
                    </TableCell>
                  </TableRow>}
              </>) : <TableRow>
                <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="1f0c4eac-73ca-4095-b307-64a70fbaf052" data-file-name="components/ForwardingLogs.tsx">
                  Error: Received invalid log data. Please refresh the page.
                </span></TableCell>
              </TableRow>}
        </TableBody>
      </Table>
    </div>;
}