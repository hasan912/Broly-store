import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:ring-[3px]',
        className,
      )}
      style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e7e5e4',
        color: '#1c1917',
      }}
      {...props}
    />
  )
}

export { Input }
