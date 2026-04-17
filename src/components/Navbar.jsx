import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Droplets, Activity } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="card border-b border-black-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black-900">MyPonie</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'nav-link-active' : 'text-black-900'}`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : 'text-black-900'}`}
            >
              Control
            </Link>
            <Link
              to="/monitoring"
              className={`nav-link ${isActive('/monitoring') ? 'nav-link-active' : 'text-black-900'}`}
            >
              Monitoring
            </Link>
            <Link
              to="/history"
              className={`nav-link ${isActive('/history') ? 'nav-link-active' : 'text-black-900'}`}
            >
              History
            </Link>
            <Link
              to="/automation"
              className={`nav-link ${isActive('/automation') ? 'nav-link-active' : 'text-black-900'}`}
            >
              Automation
            </Link>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-black-900 hidden sm:inline">System Online</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-black-900">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">pH 6.8</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
