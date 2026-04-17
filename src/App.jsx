import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Menu, X, Droplets, Home, Zap, Activity, Clock, History as HistoryIcon } from 'lucide-react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Monitoring from './pages/Monitoring'
import History from './pages/History'
import Automation from './pages/Automation'
import { ActuatorProvider } from './contexts/ActuatorContext'
import { MonitoringProvider } from './contexts/MonitoringContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  return (
    <ActuatorProvider>
      <MonitoringProvider>
        <div className="min-h-screen bg-white">
          {/* Mobile Backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar - always rendered but visibility controlled */}
          <div className={`
            fixed top-0 left-0 z-50 h-full w-56 bg-white border-r border-black-200 shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}>
            {/* Sidebar Content */}
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-black-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-black-900">MyPonie</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-black-50 transition-colors bg-primary-500 text-white hover:bg-primary-600"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-2 rounded-lg hover:bg-black-50 transition-colors"
                  >
                    <X className="w-5 h-5 text-black-900" />
                  </button>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {[
                    { path: '/', icon: Home, label: 'Home' },
                    { path: '/dashboard', icon: Zap, label: 'Control Dashboard' },
                    { path: '/monitoring', icon: Activity, label: 'Monitoring' },
                    { path: '/history', icon: HistoryIcon, label: 'History & Logs' },
                    { path: '/automation', icon: Clock, label: 'Automation' },
                  ].map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                            ${isActive
                              ? 'bg-primary-500 text-white font-medium'
                              : 'text-black-900 hover:bg-black-50'
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
          </div>

          {/* Main Content Area */}
          <div className={`${sidebarOpen ? 'lg:ml-56' : ''} transition-all duration-300`}>
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
  )
}

export default App
