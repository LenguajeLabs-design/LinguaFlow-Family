import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/utils'

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn('lf-gradient inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-[0_7px_18px_rgba(23,51,91,.16)] transition hover:-translate-y-0.5 hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/20 active:scale-[.98] disabled:opacity-50', className)} {...props} />
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-[1.35rem] border border-stone-200/80 bg-[#fffdf8] shadow-[0_12px_34px_rgba(31,43,62,.055)]', className)} {...props} />
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-600', className)}>{children}</span>
}
