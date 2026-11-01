import type { ReactNode } from 'react'

export function CrtFrame({ children, badge }: { children: ReactNode; badge?: ReactNode }) {
  return (
    <div className="crt">
      <div className="crt-screen">
        <div className="crt-menu">{children}</div>
        <div className="crt-scan" aria-hidden="true" />
        <div className="crt-roll" aria-hidden="true" />
        <div className="crt-vignette" aria-hidden="true" />
        {badge}
      </div>
    </div>
  )
}
