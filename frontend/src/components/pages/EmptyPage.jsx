export function EmptyPage({ title, description }) {
  return (
    <section className="w-full">
      <header className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        ) : null}
      </header>
      <div
        className="flex min-h-[280px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center"
        aria-label="Contenido pendiente"
      >
        <p className="text-sm text-slate-500">
          Contenido de esta sección en construcción.
        </p>
      </div>
    </section>
  )
}
