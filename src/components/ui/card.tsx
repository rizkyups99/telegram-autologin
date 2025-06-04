import * as React from "react";
import { cn } from "@/lib/utils";
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("rounded-lg border border-border bg-card text-card-foreground shadow-sm", className)} {...props} data-unique-id="a6931a07-9221-46b1-bddf-4f7a12d4f499" data-file-name="components/ui/card.tsx" />);
Card.displayName = "Card";
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} data-unique-id="9ced0726-a685-408c-b0d2-aa2b2b3a76fe" data-file-name="components/ui/card.tsx" />);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({
  className,
  ...props
}, ref) => <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} data-unique-id="8c4726cc-746f-4193-9e30-ab27dc2b7186" data-file-name="components/ui/card.tsx" />);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({
  className,
  ...props
}, ref) => <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} data-unique-id="95ff4e36-ed7c-453e-9ccd-1454ab458719" data-file-name="components/ui/card.tsx" />);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} data-unique-id="0e2cefca-d1cb-463d-9413-551941392c95" data-file-name="components/ui/card.tsx" />);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} data-unique-id="ea3b45f7-64bd-4734-8a3f-e33fa7d835dd" data-file-name="components/ui/card.tsx" />);
CardFooter.displayName = "CardFooter";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };