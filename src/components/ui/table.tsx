import * as React from "react";
import { cn } from "@/lib/utils";
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({
  className,
  ...props
}, ref) => <div className="relative w-full overflow-auto" data-unique-id="2b0f99b6-3c33-404b-9c03-828b8802bcf8" data-file-name="components/ui/table.tsx">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} data-unique-id="51bd47a8-03d6-4d38-8c97-8c7685777309" data-file-name="components/ui/table.tsx" />
  </div>);
Table.displayName = "Table";
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} data-unique-id="e914e402-2422-43c9-9447-62f4cd72979e" data-file-name="components/ui/table.tsx" />);
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} data-unique-id="ef3847f6-77d0-4598-b332-b19631305f6a" data-file-name="components/ui/table.tsx" />);
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <tfoot ref={ref} className={cn("bg-primary font-medium text-primary-foreground", className)} {...props} data-unique-id="0073afc2-2a31-4fbe-be9b-477c1f410751" data-file-name="components/ui/table.tsx" />);
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({
  className,
  ...props
}, ref) => <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} data-unique-id="5286482a-2c85-42a5-9011-1737555b6e80" data-file-name="components/ui/table.tsx" />);
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({
  className,
  ...props
}, ref) => <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} data-unique-id="b4543a16-9f65-4501-a73b-224d4af2f71b" data-file-name="components/ui/table.tsx" />);
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({
  className,
  ...props
}, ref) => <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} data-unique-id="88cda579-8a2d-4361-b9ca-fd2d434adfc5" data-file-name="components/ui/table.tsx" />);
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({
  className,
  ...props
}, ref) => <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} data-unique-id="6596f800-4743-479c-a176-a967ce1682d6" data-file-name="components/ui/table.tsx" />);
TableCaption.displayName = "TableCaption";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };