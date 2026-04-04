import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  gradient?: boolean
  noPadding?: boolean
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, gradient = false, noPadding = false, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full",
          !noPadding && "py-16 md:py-24",
          gradient && "bg-gradient-calm",
          className
        )}
        {...props}
      >
        {children}
      </section>
    )
  }
)
Section.displayName = "Section"

const SectionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4", className)}
    {...props}
  >
    {children}
  </div>
))
SectionHeader.displayName = "SectionHeader"

const SectionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4",
      className
    )}
    {...props}
  />
))
SectionTitle.displayName = "SectionTitle"

const SectionDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-lg text-muted-foreground max-w-2xl mx-auto", className)}
    {...props}
  />
))
SectionDescription.displayName = "SectionDescription"

const SectionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}
    {...props}
  />
))
SectionContent.displayName = "SectionContent"

export { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent }
