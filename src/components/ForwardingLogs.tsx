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
  return <div className="overflow-x-auto" data-unique-id="732ce014-44d5-49e0-8fa5-1bb2cf6f537d" data-file-name="components/ForwardingLogs.tsx">
      <Table data-unique-id="80ac04af-8857-417d-ad36-1107660bf915" data-file-name="components/ForwardingLogs.tsx">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]"><span className="editable-text" data-unique-id="1da581fb-699f-4e6e-b97d-ca44685a1fd9" data-file-name="components/ForwardingLogs.tsx">Waktu</span></TableHead>
            <TableHead><span className="editable-text" data-unique-id="650d8de3-121b-45c7-a329-03563c68cb61" data-file-name="components/ForwardingLogs.tsx">Pesan</span></TableHead>
            <TableHead><span className="editable-text" data-unique-id="e6a6f229-a810-4c1b-996e-06d45ebaee1d" data-file-name="components/ForwardingLogs.tsx">Kata Kunci</span></TableHead>
            <TableHead className="w-[100px]"><span className="editable-text" data-unique-id="d2a00784-7b35-4b2f-8280-7dd0b4c5f710" data-file-name="components/ForwardingLogs.tsx">Status</span></TableHead>
            <TableHead className="w-[80px]"><span className="editable-text" data-unique-id="956c9245-d65e-45f1-8373-ddbdaee76b3d" data-file-name="components/ForwardingLogs.tsx">Detail</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!logs || logs.length === 0 ? <TableRow>
              <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="a6b67621-f95d-4a6a-aa82-52fa66a40844" data-file-name="components/ForwardingLogs.tsx">
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
                    {log.forwarded ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" data-is-mapped="true" data-unique-id="f57c47cd-3c89-449b-a1a7-0580412e1110" data-file-name="components/ForwardingLogs.tsx">
                        <CheckCircle className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="abeec127-488f-449e-a42e-229eae4d9432" data-file-name="components/ForwardingLogs.tsx">
                        Diteruskan
                      </span></span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" data-is-mapped="true" data-unique-id="fd8f8ced-ff84-4bb8-b27d-1cf3827df288" data-file-name="components/ForwardingLogs.tsx">
                        <XCircle className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="82ada1d9-65d4-4c2d-b0f3-c17fe5f35372" data-file-name="components/ForwardingLogs.tsx">
                        Difilter
                      </span></span>}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(log.id)} className="p-0 h-8 w-8" data-is-mapped="true" data-unique-id="e0129740-3140-4ecc-978d-4c145432a2f6" data-file-name="components/ForwardingLogs.tsx" data-dynamic-text="true">
                      {expandedLogs[log.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedLogs[log.id] && log.error && <TableRow>
                    <TableCell colSpan={5} className="bg-red-50 text-red-800 p-2">
                      <strong data-is-mapped="true" data-unique-id="8df309fa-dc7e-4161-a8ea-696fc39bffbd" data-file-name="components/ForwardingLogs.tsx"><span className="editable-text" data-unique-id="e5c24d1d-0ff0-4b1f-a28a-b2384268e14c" data-file-name="components/ForwardingLogs.tsx">Error:</span></strong> {log.error}
                    </TableCell>
                  </TableRow>}
              </>) : <TableRow>
                <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="ab85ed0f-2e6e-4c23-aecd-4e796f89a3b7" data-file-name="components/ForwardingLogs.tsx">
                  Error: Received invalid log data. Please refresh the page.
                </span></TableCell>
              </TableRow>}
        </TableBody>
      </Table>
    </div>;
}