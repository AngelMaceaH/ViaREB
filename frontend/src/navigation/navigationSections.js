import {
  Bus,
  CalendarClock,
  ChartColumn,
  LayoutDashboard,
  MapPinned,
  Shield,
  Ticket,
  UserCog,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react'

export const navigationSections = [
  {
    id: 'overview',
    label: 'General',
    items: [
      {
        id: 'dashboard',
        label: 'Panel',
        path: '/',
        icon: LayoutDashboard,
      },
      {
        id: 'reports',
        label: 'Reportes',
        path: '/reports',
        icon: ChartColumn,
      },
    ],
  },
  {
    id: 'access',
    label: 'Acceso',
    items: [
      {
        id: 'users',
        label: 'Usuarios',
        path: '/access/users',
        icon: Users,
      },
      {
        id: 'roles',
        label: 'Roles',
        path: '/access/roles',
        icon: UserCog,
      },
      {
        id: 'permissions',
        label: 'Permisos',
        path: '/access/permissions',
        icon: Shield,
      },
    ],
  },
  {
    id: 'fleet',
    label: 'Flota',
    items: [
      {
        id: 'buses',
        label: 'Autobuses',
        path: '/fleet/buses',
        icon: Bus,
      },
      {
        id: 'routes',
        label: 'Rutas',
        path: '/fleet/routes',
        icon: MapPinned,
      },
      {
        id: 'drivers',
        label: 'Choferes',
        path: '/fleet/drivers',
        icon: UserRound,
      },
      {
        id: 'schedules',
        label: 'Horarios',
        path: '/fleet/schedules',
        icon: CalendarClock,
      },
    ],
  },
  {
    id: 'customers',
    label: 'Clientes',
    items: [
      {
        id: 'passengers',
        label: 'Pasajeros',
        path: '/customers/passengers',
        icon: Users,
      },
    ],
  },
  {
    id: 'sales',
    label: 'Ventas',
    items: [
      {
        id: 'sales',
        label: 'Ventas',
        path: '/sales',
        icon: Wallet,
      },
      {
        id: 'tickets',
        label: 'Boletos',
        path: '/sales/tickets',
        icon: Ticket,
      },
    ],
  },
]
