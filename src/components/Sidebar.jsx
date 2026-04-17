import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, Home, Settings, Activity, Clock, History, Zap, Droplets, AlertTriangle } from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: Zap, label: 'Control Dashboard' },
    { path: '/monitoring', icon: Activity, label: 'Monitoring' },
    { path: '/history', icon: History, label: 'History & Logs' },
    { path: '/automation', icon: Clock, label: 'Automation' },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-40 w-64 h-full bg-white border-r border-black-200 shadow-md transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black-900">MyPonie</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-black-50 transition-colors"
            >
              <X className="w-5 h-5 text-black-900" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${isActive(item.path)
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

          {/* System Status */}
          <div className="p-4 border-t border-black-200">
            <div className="card p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-black-900">System Status</span>
              </div>
              <div className="space-y-2 text-xs text-black-600">
                <div className="flex justify-between">
                  <span>Uptime</span>
                  <span>15d 7h</span>
                </div>
                <div className="flex justify-between">
                  <span>pH Level</span>
                  <span className="text-secondary-600 font-medium">6.8</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Alerts</span>
                  <span className="text-primary-600 font-medium">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
