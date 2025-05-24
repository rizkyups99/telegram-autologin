import * as React from "react";
import { cn } from "@/lib/utils";
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({
  className,
  ...props
}, ref) => <div className="relative w-full overflow-auto" data-unique-id="a652a603-da4b-415c-b76e-13ab42064c74" data-file-name="components/ui/table.tsx">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} data-unique-id="e6213297-e0db-4880-b138-77502d2ed4ed" data-file-name="components/ui/table.tsx" />
  </div>);
Table.displayName = "Table";
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} data-unique-id="d5c4e135-4cb4-4956-987c-4dcb624251cc" data-file-name="components/ui/table.tsx" />);
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} data-unique-id="be1242b2-54d1-4d18-b28b-b260b463118c" data-file-name="components/ui/table.tsx" />);
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <tfoot ref={ref} className={cn("bg-primary font-medium text-primary-foreground", className)} {...props} data-unique-id="2220bc81-74a5-4f8e-8ede-49b4a21ec14e" data-file-name="components/ui/table.tsx" />);
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({
  className,
  ...props
}, ref) => <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} data-unique-id="2fd7850e-74b0-4279-a2ce-60271b469476" data-file-name="components/ui/table.tsx" />);
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({
  className,
  ...props
}, ref) => <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} data-unique-id="ce74b08a-25cf-4f20-8bfe-e9cac9d2d143" data-file-name="components/ui/table.tsx" />);
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({
  className,
  ...props
}, ref) => <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} data-unique-id="a3c196ab-27a7-4d7e-90e7-a4326b0e45d4" data-file-name="components/ui/table.tsx" />);
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({
  className,
  ...props
}, ref) => <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} data-unique-id="795f9417-2844-4740-882f-6c2d453885e1" data-file-name="components/ui/table.tsx" />);
TableCaption.displayName = "TableCaption";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };