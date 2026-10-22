import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import {
  mockSalePassengerOptions,
  mockSaleScheduleOptions,
} from '../../data/mockSalesWizardData'

const wizardSteps = [
  { id: 1, label: 'Horario' },
  { id: 2, label: 'Pasajero' },
  { id: 3, label: 'Confirmar' },
]

export function SalesPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedScheduleId, setSelectedScheduleId] = useState('')
  const [selectedPassengerId, setSelectedPassengerId] = useState('')
  const [seatNumber, setSeatNumber] = useState('')

  const selectedSchedule = useMemo(
    () =>
      mockSaleScheduleOptions.find(
        (option) => option.id === selectedScheduleId,
      ),
    [selectedScheduleId],
  )

  const selectedPassenger = useMemo(
    () =>
      mockSalePassengerOptions.find(
        (option) => option.id === selectedPassengerId,
      ),
    [selectedPassengerId],
  )

  function goToNextStep() {
    setCurrentStep((step) => Math.min(step + 1, wizardSteps.length))
  }

  function goToPreviousStep() {
    setCurrentStep((step) => Math.max(step - 1, 1))
  }

  function handleMockSubmit(event) {
    event.preventDefault()
    window.alert(
      'Venta simulada (Fase 1). La API de ventas la conectarás cuando horarios y pasajeros estén listos.',
    )
  }

  return (
    <section className="w-full space-y-6">
      <PageHeader
        title="Ventas"
        description="Flujo guiado de venta de boleto (datos mock hasta integrar API)."
      />

      <ol className="flex flex-wrap gap-2">
        {wizardSteps.map((step) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep

          return (
            <li
              key={step.id}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : isCompleted
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-slate-100 text-slate-600'
              }`}
            >
              {step.id}. {step.label}
            </li>
          )
        })}
      </ol>

      <form
        onSubmit={handleMockSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {currentStep === 1 ? (
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Selecciona horario</span>
            <select
              value={selectedScheduleId}
              onChange={(event) => setSelectedScheduleId(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              required
            >
              <option value="">— Elegir —</option>
              {mockSaleScheduleOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} — L {option.price}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {currentStep === 2 ? (
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Pasajero</span>
              <select
                value={selectedPassengerId}
                onChange={(event) => setSelectedPassengerId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                required
              >
                <option value="">— Elegir —</option>
                {mockSalePassengerOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-slate-700">Asiento (opcional)</span>
              <input
                type="number"
                min={1}
                value={seatNumber}
                onChange={(event) => setSeatNumber(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-medium">Horario:</span>{' '}
              {selectedSchedule?.label ?? '—'}
            </p>
            <p>
              <span className="font-medium">Pasajero:</span>{' '}
              {selectedPassenger?.label ?? '—'}
            </p>
            <p>
              <span className="font-medium">Asiento:</span>{' '}
              {seatNumber || 'Sin asignar'}
            </p>
            <p>
              <span className="font-medium">Total:</span> L{' '}
              {selectedSchedule?.price ?? 0}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-between gap-2">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            Atrás
          </button>

          {currentStep < wizardSteps.length ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Confirmar venta (mock)
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
