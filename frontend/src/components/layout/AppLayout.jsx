import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-full">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex min-h-full min-w-0 flex-1 flex-col">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex w-full flex-1 flex-col p-4 lg:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
