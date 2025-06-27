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
  return <div className="overflow-x-auto" data-unique-id="329e31eb-e35d-4db2-b4ab-a4b1e5f852c3" data-file-name="components/ForwardingLogs.tsx">
      <Table data-unique-id="24eb4d63-8e18-4092-a8d4-0aaf18478cc5" data-file-name="components/ForwardingLogs.tsx">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]"><span className="editable-text" data-unique-id="0248d32f-0616-4370-9377-1458105fe859" data-file-name="components/ForwardingLogs.tsx">Waktu</span></TableHead>
            <TableHead><span className="editable-text" data-unique-id="ee50dbcb-f7b4-4d92-9d35-df9b9538b3b7" data-file-name="components/ForwardingLogs.tsx">Pesan</span></TableHead>
            <TableHead><span className="editable-text" data-unique-id="eef23770-0734-409b-a877-8dc70408b9f8" data-file-name="components/ForwardingLogs.tsx">Kata Kunci</span></TableHead>
            <TableHead className="w-[100px]"><span className="editable-text" data-unique-id="de72c303-8a85-414a-b929-9f2d627a8123" data-file-name="components/ForwardingLogs.tsx">Status</span></TableHead>
            <TableHead className="w-[80px]"><span className="editable-text" data-unique-id="6474a95f-8df0-490d-98e3-c79cc6f8fb25" data-file-name="components/ForwardingLogs.tsx">Detail</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!logs || logs.length === 0 ? <TableRow>
              <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="42795f37-77d4-432e-8efe-0e93530961cf" data-file-name="components/ForwardingLogs.tsx">
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
                    {log.forwarded ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" data-is-mapped="true" data-unique-id="5716ad44-9a8c-49eb-b5d9-aea37c9febfa" data-file-name="components/ForwardingLogs.tsx">
                        <CheckCircle className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="48551b86-aee3-4750-a8c1-c10f96f3e676" data-file-name="components/ForwardingLogs.tsx">
                        Diteruskan
                      </span></span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" data-is-mapped="true" data-unique-id="6a7ffd5b-ba61-4dbb-ac67-3baff2f786d4" data-file-name="components/ForwardingLogs.tsx">
                        <XCircle className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="53e9ab39-4b5d-475c-b341-e2897ff58214" data-file-name="components/ForwardingLogs.tsx">
                        Difilter
                      </span></span>}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(log.id)} className="p-0 h-8 w-8" data-is-mapped="true" data-unique-id="44281c1c-0415-4313-8452-292e7d967b96" data-file-name="components/ForwardingLogs.tsx" data-dynamic-text="true">
                      {expandedLogs[log.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedLogs[log.id] && log.error && <TableRow>
                    <TableCell colSpan={5} className="bg-red-50 text-red-800 p-2">
                      <strong data-is-mapped="true" data-unique-id="0cb31ddd-6318-45c1-ad0b-3d1a1737c0c5" data-file-name="components/ForwardingLogs.tsx"><span className="editable-text" data-unique-id="49131596-2041-436d-bd21-e4b54e7c8f77" data-file-name="components/ForwardingLogs.tsx">Error:</span></strong> {log.error}
                    </TableCell>
                  </TableRow>}
              </>) : <TableRow>
                <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="049f3c49-decf-4c2f-b9f5-f35ba5b3c65a" data-file-name="components/ForwardingLogs.tsx">
                  Error: Received invalid log data. Please refresh the page.
                </span></TableCell>
              </TableRow>}
        </TableBody>
      </Table>
    </div>;
}