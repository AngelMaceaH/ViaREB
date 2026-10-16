export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500 lg:px-6">
      <p>
        © {currentYear} ViaREB · USAP · Venta y validación de boletos
      </p>
    </footer>
  )
}
