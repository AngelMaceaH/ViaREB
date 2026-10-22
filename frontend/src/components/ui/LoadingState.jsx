export function LoadingState({ message = 'Cargando…' }) {
  return (
    <div
      className="flex min-h-[200px] items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-600"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
