import { useCallback, useEffect, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { PageHeader } from '../../components/ui/PageHeader'
import { ApiError, salesApi } from '../../lib/apiClient'

const ticketStatusLabels = {
  VALID: 'Válido',
  USED: 'Usado',
  CANCELLED: 'Cancelado',
  EXPIRED: 'Expirado',
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const loadTickets = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const response = await salesApi.listTickets()
      setTickets(response.data)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Error inesperado al cargar boletos.'
      setLoadError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  const columns = [
    {
      id: 'ticketCode',
      header: 'Código',
      cell: (row) => (
        <span className="font-mono text-xs sm:text-sm">{row.ticketCode}</span>
      ),
    },
    {
      id: 'passengerName',
      header: 'Pasajero',
      cell: (row) => row.passengerName,
    },
    {
      id: 'routeLabel',
      header: 'Ruta',
      cell: (row) => row.routeLabel,
    },
    {
      id: 'status',
      header: 'Estado',
      cell: (row) => ticketStatusLabels[row.status] ?? row.status,
    },
    {
      id: 'price',
      header: 'Precio',
      cell: (row) => formatCurrency(row.price),
    },
  ]

  return (
    <section className="w-full">
      <PageHeader
        title="Boletos"
        description="Listado desde GET /api/sales/tickets (ejecuta backend/prisma/seed.js para datos demo)."
      />

      {isLoading ? <LoadingState message="Cargando boletos…" /> : null}

      {!isLoading && loadError ? (
        <ErrorState message={loadError} onRetry={loadTickets} />
      ) : null}

      {!isLoading && !loadError ? (
        <DataTable
          columns={columns}
          rows={tickets}
          emptyMessage="No hay boletos. Corre las migraciones y opcionalmente node prisma/seed.js en backend."
        />
      ) : null}
    </section>
  )
}
