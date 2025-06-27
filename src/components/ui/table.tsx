import * as React from "react";
import { cn } from "@/lib/utils";
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({
  className,
  ...props
}, ref) => <div className="relative w-full overflow-auto" data-unique-id="c26e976d-1f22-4c72-ae3b-b5bc46c969f4" data-file-name="components/ui/table.tsx">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} data-unique-id="42b5f1c2-fb88-4e09-9324-87862a0b4996" data-file-name="components/ui/table.tsx" />
  </div>);
Table.displayName = "Table";
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} data-unique-id="d661c0d9-4103-4771-b0af-e6c04687b216" data-file-name="components/ui/table.tsx" />);
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} data-unique-id="790781fa-cd1b-4aa4-ae89-3966864b27ef" data-file-name="components/ui/table.tsx" />);
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <tfoot ref={ref} className={cn("bg-primary font-medium text-primary-foreground", className)} {...props} data-unique-id="f791cddf-b472-4a52-bb7a-5ca1bb345252" data-file-name="components/ui/table.tsx" />);
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({
  className,
  ...props
}, ref) => <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} data-unique-id="7fd80080-d7fc-4b82-84b4-5ecf9fd00486" data-file-name="components/ui/table.tsx" />);
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({
  className,
  ...props
}, ref) => <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} data-unique-id="be9613d7-b116-44b9-a5ea-82c3fb12d4ba" data-file-name="components/ui/table.tsx" />);
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({
  className,
  ...props
}, ref) => <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} data-unique-id="958c06a9-e289-460c-874a-2decf6e32b65" data-file-name="components/ui/table.tsx" />);
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({
  className,
  ...props
}, ref) => <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} data-unique-id="cf6cc287-8d9c-4f02-94de-31753d66543f" data-file-name="components/ui/table.tsx" />);
TableCaption.displayName = "TableCaption";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };