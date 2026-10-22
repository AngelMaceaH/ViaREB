import { useCallback, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { DataTable } from '../../components/ui/DataTable'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { ApiError, fleetApi } from '../../lib/apiClient'

const initialFormState = {
  licensePlate: '',
  capacity: '',
  modelName: '',
  isActive: true,
}

export function BusesPage() {
  const [buses, setBuses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formState, setFormState] = useState(initialFormState)
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadBuses = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const response = await fleetApi.listBuses()
      setBuses(response.data)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Error inesperado al cargar autobuses.'
      setLoadError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBuses()
  }, [loadBuses])

  function openCreateModal() {
    setFormState(initialFormState)
    setFormError(null)
    setIsModalOpen(true)
  }

  function closeCreateModal() {
    if (isSubmitting) {
      return
    }
    setIsModalOpen(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError(null)

    const capacityValue = Number(formState.capacity)
    if (!formState.licensePlate.trim()) {
      setFormError('La placa es obligatoria.')
      return
    }
    if (!Number.isInteger(capacityValue) || capacityValue < 1) {
      setFormError('La capacidad debe ser un número entero mayor que cero.')
      return
    }

    setIsSubmitting(true)
    try {
      const createdBus = await fleetApi.createBus({
        licensePlate: formState.licensePlate.trim(),
        capacity: capacityValue,
        modelName: formState.modelName.trim() || undefined,
        isActive: formState.isActive,
      })

      setBuses((currentBuses) =>
        [...currentBuses, createdBus].sort((left, right) =>
          left.licensePlate.localeCompare(right.licensePlate),
        ),
      )
      setIsModalOpen(false)
      setFormState(initialFormState)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'No se pudo crear el autobús.'
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    {
      id: 'licensePlate',
      header: 'Placa',
      cell: (row) => <span className="font-medium">{row.licensePlate}</span>,
    },
    {
      id: 'capacity',
      header: 'Capacidad',
      cell: (row) => row.capacity,
    },
    {
      id: 'modelName',
      header: 'Modelo',
      cell: (row) => row.modelName ?? '—',
    },
    {
      id: 'isActive',
      header: 'Estado',
      cell: (row) =>
        row.isActive ? (
          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            Activo
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            Inactivo
          </span>
        ),
    },
  ]

  return (
    <section className="w-full">
      <PageHeader
        title="Autobuses"
        description="Flota de vehículos conectada a la API (módulo de referencia para el equipo)."
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Plus className="size-4" aria-hidden />
            Agregar autobús
          </button>
        }
      />

      {isLoading ? <LoadingState message="Cargando autobuses…" /> : null}

      {!isLoading && loadError ? (
        <ErrorState message={loadError} onRetry={loadBuses} />
      ) : null}

      {!isLoading && !loadError ? (
        <DataTable
          columns={columns}
          rows={buses}
          emptyMessage="No hay autobuses registrados. Agrega el primero con el botón superior."
        />
      ) : null}

      <Modal
        isOpen={isModalOpen}
        title="Nuevo autobús"
        onClose={closeCreateModal}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Placa</span>
            <input
              type="text"
              value={formState.licensePlate}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  licensePlate: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Capacidad</span>
            <input
              type="number"
              min={1}
              value={formState.capacity}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  capacity: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Modelo (opcional)</span>
            <input
              type="text"
              value={formState.modelName}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  modelName: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formState.isActive}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  isActive: event.target.checked,
                }))
              }
              className="size-4 rounded border-slate-300"
            />
            Activo en flota
          </label>

          {formError ? (
            <p className="text-sm text-red-600" role="alert">{formError}</p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeCreateModal}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
