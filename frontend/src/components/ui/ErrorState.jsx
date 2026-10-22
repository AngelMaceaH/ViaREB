export function ErrorState({ title = 'No se pudo cargar', message, onRetry }) {
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
      role="alert"
    >
      <p className="text-sm font-medium text-red-800">{title}</p>
      {message ? (
        <p className="mt-2 text-sm text-red-700">{message}</p>
      ) : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          Reintentar
        </button>
      ) : null}
    </div>
  )
}
