import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react'
import { classNames } from '../../lib/classNames'

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuContainerReference = useRef(null)

  useEffect(() => {
    function handlePointerDown(event) {
      if (!menuContainerReference.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  function handleProfileClick() {
    setIsOpen(false)
  }

  function handleSettingsClick() {
    setIsOpen(false)
  }

  function handleLogoutClick() {
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuContainerReference}>
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-100"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
          AD
        </span>
        <div className="hidden text-xs sm:block">
          <p className="font-medium text-slate-700">Administrador</p>
          <p className="text-slate-500">Sesión local</p>
        </div>
        <ChevronDown
          className={classNames(
            'size-4 text-slate-500 transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleProfileClick}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <UserRound className="size-4 text-slate-500" />
            Perfil
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleSettingsClick}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <Settings className="size-4 text-slate-500" />
            Configuraciones
          </button>
          <div className="my-1 border-t border-slate-100" />
          <button
            type="button"
            role="menuitem"
            onClick={handleLogoutClick}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  )
}
