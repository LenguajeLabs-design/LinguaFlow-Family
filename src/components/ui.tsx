import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/utils'

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn('lf-gradient inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(45,165,221,.22)] transition hover:brightness-[.96] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#36aaca]/20 active:scale-[.98] disabled:opacity-50', className)} {...props} />
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-[1.5rem] border border-stone-200/80 bg-white/95 shadow-[0_12px_36px_rgba(52,63,99,.07)]', className)} {...props} />
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-600', className)}>{children}</span>
}
