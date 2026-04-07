import * as React from "react"
import { cn } from "@/lib/utils"

export interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  depth?: 'sm' | 'md' | 'lg'
}

const Card3D = React.forwardRef<HTMLDivElement, Card3DProps>(
  ({ className, hover = true, depth = 'md', children, ...props }, ref) => {
    const depthClasses = {
      sm: 'shadow-soft',
      md: 'shadow-soft-lg',
      lg: 'shadow-elevated',
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-none bg-card border border-border/50 p-6 transition-all duration-300",
          depthClasses[depth],
          hover && "card-lift cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card3D.displayName = "Card3D"

const Card3DHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 mb-4", className)}
    {...props}
  />
))
Card3DHeader.displayName = "Card3DHeader"

const Card3DTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
Card3DTitle.displayName = "Card3DTitle"

const Card3DDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
Card3DDescription.displayName = "Card3DDescription"

const Card3DContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
Card3DContent.displayName = "Card3DContent"

const Card3DFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 mt-4 border-t border-border/50", className)}
    {...props}
  />
))
Card3DFooter.displayName = "Card3DFooter"

export { Card3D, Card3DHeader, Card3DFooter, Card3DTitle, Card3DDescription, Card3DContent }
