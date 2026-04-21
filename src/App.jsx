import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  Droplets,
  Home,
  Zap,
  Activity,
  Clock,
  History as HistoryIcon,
} from 'lucide-react'

import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Monitoring from './pages/Monitoring'
import History from './pages/History'
import Automation from './pages/Automation'
import { ActuatorProvider } from './contexts/ActuatorContext'
import { MonitoringProvider } from './contexts/MonitoringContext'
import { RealTimeDataProvider } from './contexts/RealTimeDataContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: Zap, label: 'Control Dashboard' },
    { path: '/monitoring', icon: Activity, label: 'Monitoring' },
    { path: '/history', icon: HistoryIcon, label: 'History & Logs' },
    { path: '/automation', icon: Clock, label: 'Automation' },
  ]

  return (
    <RealTimeDataProvider>
      <ActuatorProvider>
        <MonitoringProvider>
          <div className="min-h-screen bg-white relative overflow-x-hidden">
            {/* Backdrop */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar - overlay, does NOT push content */}
            <aside
              className={`
                fixed top-0 left-0 h-full z-50 bg-white border-r border-gray-200 shadow-lg
                transition-transform duration-300 ease-in-out
                w-56
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}
            >
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#E02787] rounded-lg flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-black">
                      MyPonie
                    </span>
                  </div>

                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg bg-[#E02787] text-white hover:opacity-90 transition"
                    aria-label="Toggle sidebar"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                  <ul className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path

                      return (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={`
                              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                              ${
                                isActive
                                  ? 'bg-[#E02787] text-white font-medium'
                                  : 'text-black hover:bg-gray-100'
                              }
                            `}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Floating open button when sidebar is closed */}
            {!sidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-[#E02787] text-white shadow-md hover:opacity-90 transition"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Main content - stays fixed, does NOT move */}
            <div className="relative z-10 min-h-screen">
              <Navbar />

              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/monitoring" element={<Monitoring />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/automation" element={<Automation />} />
                </Routes>
              </main>
            </div>
          </div>
        </MonitoringProvider>
      </ActuatorProvider>
    </RealTimeDataProvider>
  )
}

export default App
