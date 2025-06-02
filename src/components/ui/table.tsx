import * as React from "react";
import { cn } from "@/lib/utils";
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({
  className,
  ...props
}, ref) => <div className="relative w-full overflow-auto" data-unique-id="f7f0b2a1-4586-43ee-9339-bad24c1214d9" data-file-name="components/ui/table.tsx">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} data-unique-id="0c4c3154-9dff-432c-95b9-db30a0bb69ac" data-file-name="components/ui/table.tsx" />
  </div>);
Table.displayName = "Table";
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} data-unique-id="59864847-01af-4a8a-9bb2-61bc2144a87d" data-file-name="components/ui/table.tsx" />);
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} data-unique-id="dcad5054-4221-4f5e-af25-0e787a613a8f" data-file-name="components/ui/table.tsx" />);
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({
  className,
  ...props
}, ref) => <tfoot ref={ref} className={cn("bg-primary font-medium text-primary-foreground", className)} {...props} data-unique-id="7462e224-e218-49ce-b759-bd807c044e12" data-file-name="components/ui/table.tsx" />);
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({
  className,
  ...props
}, ref) => <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} data-unique-id="a2bf742d-5d14-443b-8178-fd5ff0d8e855" data-file-name="components/ui/table.tsx" />);
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({
  className,
  ...props
}, ref) => <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} data-unique-id="a5c974e2-bcfe-4b85-9eb1-32d98c6b2d8c" data-file-name="components/ui/table.tsx" />);
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({
  className,
  ...props
}, ref) => <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} data-unique-id="f22b1ea7-323b-420f-ad87-c23296269bc7" data-file-name="components/ui/table.tsx" />);
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({
  className,
  ...props
}, ref) => <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} data-unique-id="6400f354-f88a-4fb0-b06c-c26a2f95a22d" data-file-name="components/ui/table.tsx" />);
TableCaption.displayName = "TableCaption";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };