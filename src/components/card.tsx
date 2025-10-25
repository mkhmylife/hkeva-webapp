import type { ReactNode } from 'react'

export type CardProps = {
  children?: ReactNode
  className?: string
}

export default function Card({ children, className }: CardProps) {
  const base = "rounded-[20px] p-3 shadow-md bg-white"

  return (
    <div className={`${base}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )

}