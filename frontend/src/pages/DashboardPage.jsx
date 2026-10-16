import { SummaryMetricCard } from '../components/dashboard/SummaryMetricCard'
import { TicketsByStatusChart } from '../components/dashboard/TicketsByStatusChart'
import { WeeklySalesChart } from '../components/dashboard/WeeklySalesChart'
import {
  mockRecentSales,
  mockSummaryMetrics,
  mockTicketsByStatus,
  mockUpcomingDepartures,
  mockWeeklySales,
} from '../data/mockDashboardData'
import { getTimeOfDayGreeting } from '../lib/getTimeOfDayGreeting'

export function DashboardPage() {
  const timeOfDayGreeting = getTimeOfDayGreeting()
  const todayLabel = new Intl.DateTimeFormat('es-HN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <section className="w-full space-y-6">
      <header className="rounded-xl border border-slate-200 bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-8 text-white shadow-sm">
        <p className="text-sm font-medium text-blue-100">{todayLabel}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {timeOfDayGreeting}, Administrador
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-blue-100">
          Resumen del día en ViaREB. Los datos mostrados son de ejemplo hasta
          conectar la API.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mockSummaryMetrics.map((metric) => (
          <SummaryMetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            change={metric.change}
            changeDirection={metric.changeDirection}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
          <h2 className="text-base font-semibold text-slate-900">
            Ventas de la semana
          </h2>
          <p className="mt-1 text-sm text-slate-500">Montos en lempiras (mock)</p>
          <div className="mt-4">
            <WeeklySalesChart weeklySales={mockWeeklySales} />
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
          <h2 className="text-base font-semibold text-slate-900">
            Boletos por estado
          </h2>
          <p className="mt-1 text-sm text-slate-500">Distribución actual (mock)</p>
          <div className="mt-4">
            <TicketsByStatusChart ticketsByStatus={mockTicketsByStatus} />
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Últimas ventas
            </h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {mockRecentSales.map((sale) => (
              <li
                key={sale.id}
                className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-800">{sale.passengerName}</p>
                  <p className="text-slate-500">{sale.routeName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{sale.amount}</p>
                  <p className="text-xs text-slate-500">{sale.soldAt}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Próximas salidas
            </h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {mockUpcomingDepartures.map((departure) => (
              <li key={departure.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">
                      {departure.routeName}
                    </p>
                    <p className="text-slate-500">
                      {departure.departureTime} · {departure.busPlate}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {departure.occupancyPercent}% ocupación
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${departure.occupancyPercent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
