import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { PermissionsPage } from './pages/access/PermissionsPage'
import { RolesPage } from './pages/access/RolesPage'
import { UsersPage } from './pages/access/UsersPage'
import { PassengersPage } from './pages/customers/PassengersPage'
import { DashboardPage } from './pages/DashboardPage'
import { BusesPage } from './pages/fleet/BusesPage'
import { DriversPage } from './pages/fleet/DriversPage'
import { RoutesPage } from './pages/fleet/RoutesPage'
import { SchedulesPage } from './pages/fleet/SchedulesPage'
import { ReportsPage } from './pages/reports/ReportsPage'
import { SalesPage } from './pages/sales/SalesPage'
import { TicketsPage } from './pages/sales/TicketsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="access/users" element={<UsersPage />} />
          <Route path="access/roles" element={<RolesPage />} />
          <Route path="access/permissions" element={<PermissionsPage />} />
          <Route path="fleet/buses" element={<BusesPage />} />
          <Route path="fleet/routes" element={<RoutesPage />} />
          <Route path="fleet/drivers" element={<DriversPage />} />
          <Route path="fleet/schedules" element={<SchedulesPage />} />
          <Route path="customers/passengers" element={<PassengersPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="sales/tickets" element={<TicketsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
