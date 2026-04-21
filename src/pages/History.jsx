import React, { useState, useMemo } from 'react'
import {
  History,
  Download,
  Search,
  Droplets,
  Cpu,
  Power,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
} from 'lucide-react'

// Mock historical data
const generateMockHistory = () => {
  const actions = ['turned_on', 'turned_off', 'emergency_stop', 'low_level_alert', 'refill', 'maintenance']
  const actuators = ['P1', 'P2', 'P3', 'P4', 'M1', 'M2', 'M3', 'M4']
  const products = [
    'pH Down',
    'Calcium',
    'Blum',
    'Grow',
    'Bicarbonate Potassium',
    'Sulfate Potassium',
    'Sulfate Magnesium',
    'Activateur Racinaire',
  ]

  const history = []
  const now = new Date()

  for (let i = 0; i < 100; i++) {
    const timestamp = new Date(now - i * 5 * 60 * 1000)
    const action = actions[Math.floor(Math.random() * actions.length)]
    const actuatorId = actuators[Math.floor(Math.random() * actuators.length)]
    const product = products[actuators.indexOf(actuatorId)]

    let dose = null
    let remainingLevel = null

    if (action.includes('turned')) {
      dose = (Math.random() * 50 + 10).toFixed(1)
      remainingLevel = (Math.random() * 100).toFixed(1)
    }

    history.push({
      id: `log-${i}`,
      timestamp,
      action,
      actuatorId,
      product,
      dose,
      remainingLevel,
      user: Math.random() > 0.5 ? 'System' : 'Operator',
      status: Math.random() > 0.1 ? 'success' : 'warning',
    })
  }

  return history
}

const HistoryPage = () => {
  const [history] = useState(generateMockHistory())
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [filterActuator, setFilterActuator] = useState('all')
  const [dateRange, setDateRange] = useState('today')

  const filteredHistory = useMemo(() => {
    return history.filter((log) => {
      const matchesSearch =
        searchTerm === '' ||
        log.actuatorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAction = filterAction === 'all' || log.action === filterAction
      const matchesActuator = filterActuator === 'all' || log.actuatorId === filterActuator

      const now = new Date()
      const logDate = new Date(log.timestamp)
      let matchesDate = true

      if (dateRange === 'today') {
        matchesDate = logDate.toDateString() === now.toDateString()
      } else if (dateRange === 'week') {
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
        matchesDate = logDate >= weekAgo
      } else if (dateRange === 'month') {
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)
        matchesDate = logDate >= monthAgo
      }

      return matchesSearch && matchesAction && matchesActuator && matchesDate
    })
  }, [history, searchTerm, filterAction, filterActuator, dateRange])

  const getActionIcon = (action) => {
    switch (action) {
      case 'turned_on':
        return <Power className="w-4 h-4 text-[#08CC0A]" />
      case 'turned_off':
        return <Power className="w-4 h-4 text-gray-500" />
      case 'emergency_stop':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'low_level_alert':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'refill':
        return <Droplets className="w-4 h-4 text-blue-500" />
      case 'maintenance':
        return <CheckCircle className="w-4 h-4 text-purple-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getActionText = (action) => {
    switch (action) {
      case 'turned_on':
        return 'Turned ON'
      case 'turned_off':
        return 'Turned OFF'
      case 'emergency_stop':
        return 'Emergency Stop'
      case 'low_level_alert':
        return 'Low Level Alert'
      case 'refill':
        return 'Tank Refilled'
      case 'maintenance':
        return 'Maintenance'
      default:
        return action
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-green-100 text-green-700 border-green-200',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      error: 'bg-red-100 text-red-700 border-red-200',
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.success}`}>
        {status}
      </span>
    )
  }

  const getActuatorIcon = (actuatorId) => {
    return actuatorId.startsWith('P') ? (
      <Droplets className="w-4 h-4 text-blue-500" />
    ) : (
      <Cpu className="w-4 h-4 text-purple-500" />
    )
  }

  const exportHistory = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Actuator', 'Product', 'Dose (ml)', 'Remaining Level (%)', 'User', 'Status'],
      ...filteredHistory.map((log) => [
        log.timestamp.toISOString(),
        getActionText(log.action),
        log.actuatorId,
        log.product,
        log.dose || '',
        log.remainingLevel || '',
        log.user,
        log.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `myponie-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const todayLogs = history.filter((log) => new Date(log.timestamp).toDateString() === today)

    return {
      totalActions: todayLogs.length,
      activations: todayLogs.filter((log) => log.action === 'turned_on').length,
      deactivations: todayLogs.filter((log) => log.action === 'turned_off').length,
      alerts: todayLogs.filter((log) => log.action.includes('alert')).length,
    }
  }, [history])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">History & Logs</h1>
          <p className="text-gray-600">Track all system actions and events</p>
        </div>

        <button
          onClick={exportHistory}
          className="bg-[#E02787] hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center space-x-2 transition"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Actions</div>
              <div className="text-2xl font-bold text-black">{stats.totalActions}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Power className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Activations</div>
              <div className="text-2xl font-bold text-black">{stats.activations}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Power className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Deactivations</div>
              <div className="text-2xl font-bold text-black">{stats.deactivations}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Alerts</div>
              <div className="text-2xl font-bold text-black">{stats.alerts}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E02787] focus:border-[#E02787]"
            />
          </div>

          {/* Action Filter */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#E02787] focus:border-[#E02787]"
          >
            <option value="all">All Actions</option>
            <option value="turned_on">Turned ON</option>
            <option value="turned_off">Turned OFF</option>
            <option value="emergency_stop">Emergency Stop</option>
            <option value="low_level_alert">Low Level Alert</option>
            <option value="refill">Refill</option>
            <option value="maintenance">Maintenance</option>
          </select>

          {/* Actuator Filter */}
          <select
            value={filterActuator}
            onChange={(e) => setFilterActuator(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#E02787] focus:border-[#E02787]"
          >
            <option value="all">All Actuators</option>
            <option value="P1">P1 - pH Down</option>
            <option value="P2">P2 - Calcium</option>
            <option value="P3">P3 - Blum</option>
            <option value="P4">P4 - Grow</option>
            <option value="M1">M1 - Bicarbonate Potassium</option>
            <option value="M2">M2 - Sulfate Potassium</option>
            <option value="M3">M3 - Sulfate Magnesium</option>
            <option value="M4">M4 - Activateur Racinaire</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#E02787] focus:border-[#E02787]"
          >
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-black">Recent Actions</h3>
          <span className="text-sm text-gray-500">{filteredHistory.length} entries found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actuator</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Dose</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Level</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredHistory.slice(0, 50).map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700">{log.timestamp.toLocaleString()}</td>

                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm text-black">{getActionText(log.action)}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getActuatorIcon(log.actuatorId)}
                      <span className="text-sm text-black font-medium">{log.actuatorId}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-sm text-gray-700">{log.product}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{log.dose ? `${log.dose} ml` : '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{log.remainingLevel ? `${log.remainingLevel}%` : '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{log.user}</td>
                  <td className="py-3 px-4">{getStatusBadge(log.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No logs found matching your criteria</p>
          </div>
        )}

        {filteredHistory.length > 50 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Showing first 50 of {filteredHistory.length} entries</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
