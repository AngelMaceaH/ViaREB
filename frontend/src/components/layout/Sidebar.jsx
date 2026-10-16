import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { navigationSections } from '../../navigation/navigationSections'
import { classNames } from '../../lib/classNames'

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={classNames(
          'fixed inset-0 z-30 bg-slate-900/50 transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={classNames(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-sidebar text-slate-200 transition-transform lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4">
          <span className="text-sm font-semibold tracking-wide text-white">
            Menú
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-sidebar-hover hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navigationSections.map((section) => (
            <div key={section.id} className="mb-6 last:mb-0">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/' || item.path === '/sales'}
                        onClick={onClose}
                        className={({ isActive }) =>
                          classNames(
                            'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-brand-600 text-white'
                              : 'text-slate-300 hover:bg-sidebar-hover hover:text-white',
                          )
                        }
                      >
                        <Icon className="size-4 shrink-0 opacity-90" />
                        {item.label}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
