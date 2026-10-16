import { Menu } from 'lucide-react'
import { ProfileMenu } from './ProfileMenu'

export function Header({ onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            V
          </span>
          <div className="text-left leading-tight">
            <p className="text-sm font-semibold text-slate-900">ViaREB</p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Gestión de boletos
            </p>
          </div>
        </div>
      </div>
      <ProfileMenu />
    </header>
  )
}
