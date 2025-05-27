import * as React from "react";
import { cn } from "@/lib/utils";
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("rounded-lg border border-border bg-card text-card-foreground shadow-sm", className)} {...props} data-unique-id="5a7655ba-3544-45aa-a16e-7814744d4e1c" data-file-name="components/ui/card.tsx" />);
Card.displayName = "Card";
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} data-unique-id="dcc9f980-f951-4d58-aec8-66cbe64b0ef2" data-file-name="components/ui/card.tsx" />);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({
  className,
  ...props
}, ref) => <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} data-unique-id="e838f3b2-31a4-4f05-9212-ba2fd7529106" data-file-name="components/ui/card.tsx" />);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({
  className,
  ...props
}, ref) => <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} data-unique-id="41011a9a-3f26-4dfb-aa56-53112a3ea067" data-file-name="components/ui/card.tsx" />);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} data-unique-id="73c313e5-859c-4897-8643-29541dc59135" data-file-name="components/ui/card.tsx" />);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} data-unique-id="798572af-cd0f-4a80-b9e5-2483566bb9d3" data-file-name="components/ui/card.tsx" />);
CardFooter.displayName = "CardFooter";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };