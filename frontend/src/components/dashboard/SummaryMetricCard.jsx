import { classNames } from '../../lib/classNames'

export function SummaryMetricCard({
  label,
  value,
  change,
  changeDirection = 'neutral',
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      <p
        className={classNames(
          'mt-2 text-xs font-medium',
          changeDirection === 'up' && 'text-emerald-600',
          changeDirection === 'down' && 'text-red-600',
          changeDirection === 'neutral' && 'text-slate-500',
        )}
      >
        {change}
      </p>
    </article>
  )
}
