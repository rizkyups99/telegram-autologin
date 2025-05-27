import * as React from "react";
import { cn } from "@/lib/utils";
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({
  className,
  ...props
}, ref) => <div className="relative w-full overflow-auto" data-unique-id="510c7620-6357-488e-9b06-8d44bf925a84" data-file-name="components/ui/table.tsx">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} data-unique-id="3668b77e-1bed-455f-a6e5-c65cd8d26e60" data-file-name="components/ui/table.tsx" />
  </div>);
Table.displayName = "Table";
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} data-unique-id="fafa81a8-3701-4591-96a5-e0ba22971aeb" data-file-name="components/ui/table.tsx" />);
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} data-unique-id="4f1b9ba0-a553-47e0-b9cd-9e1dbd288c0f" data-file-name="components/ui/table.tsx" />);
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <tfoot ref={ref} className={cn("bg-primary font-medium text-primary-foreground", className)} {...props} data-unique-id="0a45bbc0-d7cd-4b3f-9ada-3c28bba79446" data-file-name="components/ui/table.tsx" />);
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({
  className,
  ...props
}, ref) => <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} data-unique-id="bfccc9e9-f32e-4427-ad25-09595350084e" data-file-name="components/ui/table.tsx" />);
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({
  className,
  ...props
}, ref) => <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} data-unique-id="72b7ced8-344c-4f29-becc-9c4b6eebe2df" data-file-name="components/ui/table.tsx" />);
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({
  className,
  ...props
}, ref) => <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} data-unique-id="b2800232-53c4-4801-890e-40092c292aa2" data-file-name="components/ui/table.tsx" />);
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({
  className,
  ...props
}, ref) => <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} data-unique-id="fab26d7d-1f00-44f6-a86b-8ad392571d76" data-file-name="components/ui/table.tsx" />);
TableCaption.displayName = "TableCaption";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };