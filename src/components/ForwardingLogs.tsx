"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";
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

export default function ForwardingLogs({ logs }: ForwardingLogsProps) {
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedLogs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Waktu</TableHead>
            <TableHead>Pesan</TableHead>
            <TableHead>Kata Kunci</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[80px]">Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!logs || logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Belum ada log aktivitas. Log akan muncul saat pesan diterima dan diteruskan.
              </TableCell>
            </TableRow>
          ) : (
            Array.isArray(logs) ? logs.map((log) => (
              <>
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {expandedLogs[log.id] 
                      ? log.content 
                      : `${log.content.substring(0, 50)}${log.content.length > 50 ? '...' : ''}`}
                  </TableCell>
                  <TableCell>{log.keyword || "—"}</TableCell>
                  <TableCell>
                    {log.forwarded ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Diteruskan
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Difilter
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(log.id)}
                      className="p-0 h-8 w-8"
                    >
                      {expandedLogs[log.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedLogs[log.id] && log.error && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-red-50 text-red-800 p-2">
                      <strong>Error:</strong> {log.error}
                    </TableCell>
                  </TableRow>
                )}
              </>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Error: Received invalid log data. Please refresh the page.
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
