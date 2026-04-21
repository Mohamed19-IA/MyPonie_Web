import React, { useMemo } from 'react'
import { useRealTimeData } from '../contexts/RealTimeDataContext'
import {
  Droplets,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Gauge,
  Beaker,
  Thermometer,
  Clock,
  Wifi,
  WifiOff,
  AlertCircle,
} from 'lucide-react'

const normalizeState = (value) => {
  return String(value ?? 'OFF').toUpperCase() === 'ON' ? 'ON' : 'OFF'
}

const safeNumber = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const PhCard = ({ phData }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600'
      case 'high':
        return 'text-red-600'
      case 'low':
        return 'text-yellow-600'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 border-green-200'
      case 'high':
        return 'bg-red-100 border-red-200'
      case 'low':
        return 'bg-yellow-100 border-yellow-200'
      default:
        return 'bg-gray-100 border-gray-200'
    }
  }

  const getTrendIcon = () => {
    if (phData.current > phData.target) {
      return <TrendingUp className="w-4 h-4 text-red-500" />
    } else if (phData.current < phData.target) {
      return <TrendingDown className="w-4 h-4 text-yellow-500" />
    }
    return <Activity className="w-4 h-4 text-green-500" />
  }

  const pointerLeft = Math.max(0, Math.min(((phData.current - 4) / 10) * 100, 100))

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Beaker className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-black">pH Level</h3>
            <p className="text-sm text-gray-500">Water Acidity Monitor</p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBg(phData.status)}`}>
          <span className={getStatusColor(phData.status)}>
            {phData.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-sm text-gray-500 mb-1">Current</div>
          <div className="text-3xl font-bold text-black mb-1">{phData.current.toFixed(1)}</div>
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span className="text-sm text-gray-500">Target: {phData.target}</span>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Difference</div>
          <div className={`text-3xl font-bold ${getStatusColor(phData.status)}`}>
            {(phData.current - phData.target).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">from target</div>
        </div>
      </div>

      <div className="relative">
        <div className="h-4 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-yellow-400 to-blue-500 rounded-full"></div>
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full border-2 border-gray-800 shadow-lg"
          style={{ left: `${pointerLeft}%` }}
        ></div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>4.0</span>
          <span>7.0</span>
          <span>14.0</span>
        </div>
      </div>
    </div>
  )
}

const TankLevelCard = ({ actuator }) => {
  const level = safeNumber(actuator?.level)
  const state = normalizeState(actuator?.state)
  const isLow = level < 20
  const isCritical = level < 10

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              actuator.type === 'pump'
                ? 'bg-blue-100 border border-blue-200'
                : 'bg-purple-100 border border-purple-200'
            }`}
          >
            <Droplets className="w-5 h-5 text-[#E02787]" />
          </div>

          <div>
            <div className="font-semibold text-black">{actuator.id}</div>
            <div className="text-xs text-gray-500">{actuator.name}</div>
          </div>
        </div>

        {isCritical && (
          <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>CRITICAL</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Level</span>
          <span
            className={
              isCritical
                ? 'text-red-600 font-semibold'
                : isLow
                ? 'text-yellow-600 font-semibold'
                : 'text-[#08CC0A] font-semibold'
            }
          >
            {level.toFixed(1)}%
          </span>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isCritical
                ? 'bg-red-500'
                : isLow
                ? 'bg-yellow-500'
                : 'bg-[#08CC0A]'
            }`}
            style={{ width: `${Math.max(0, Math.min(level, 100))}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Status</span>
        <span className={state === 'ON' ? 'text-[#08CC0A] font-semibold' : 'text-gray-500'}>
          {state === 'ON' ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  )
}

const SystemHealthCard = ({ connectionStatus, lastUpdated }) => {
  const isConnected = connectionStatus === 'connected'

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-black">System Health</h3>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            isConnected
              ? 'bg-green-100 text-green-600 border-green-200'
              : 'bg-red-100 text-red-600 border-red-200'
          }`}
        >
          {isConnected ? 'ONLINE' : 'OFFLINE'}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Last Update</span>
          </div>
          <span className="text-sm font-medium text-black">
            {lastUpdated?.toLocaleTimeString?.() || '--:--:--'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Connection</span>
          </div>
          <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Stable' : 'Unavailable'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gauge className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Performance</span>
          </div>
          <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-yellow-600'}`}>
            {isConnected ? 'Optimal' : 'Limited'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Thermometer className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Environment</span>
          </div>
          <span className="text-sm font-medium text-black">22°C</span>
        </div>
      </div>
    </div>
  )
}

const Monitoring = () => {
  const {
    levels = {},
    status = {},
    loading = false,
    error = '',
    connectionStatus = 'disconnected',
    lastUpdated = new Date(),
  } = useRealTimeData()

  const realTimeActuators = useMemo(
    () => [
      { id: 'P1', name: 'pH Down', type: 'pump', level: safeNumber(levels?.P1), state: normalizeState(status?.ledP1) },
      { id: 'P2', name: 'Calcium', type: 'pump', level: safeNumber(levels?.P2), state: normalizeState(status?.ledP2) },
      { id: 'P3', name: 'Blum', type: 'pump', level: safeNumber(levels?.P3), state: normalizeState(status?.ledP3) },
      { id: 'P4', name: 'Grow', type: 'pump', level: safeNumber(levels?.P4), state: normalizeState(status?.ledP4) },

      // Motors map to ledP5..ledP8 in your Node-RED status
      { id: 'M1', name: 'Bicarbonate', type: 'motor', level: safeNumber(levels?.M1), state: normalizeState(status?.ledP5) },
      { id: 'M2', name: 'Sulfate K', type: 'motor', level: safeNumber(levels?.M2), state: normalizeState(status?.ledP6) },
      { id: 'M3', name: 'Sulfate Mg', type: 'motor', level: safeNumber(levels?.M3), state: normalizeState(status?.ledP7) },
      { id: 'M4', name: 'Racinaire', type: 'motor', level: safeNumber(levels?.M4), state: normalizeState(status?.ledP8) },
    ],
    [levels, status]
  )

  const criticalTanks = realTimeActuators.filter((a) => a.level < 10)
  const lowTanks = realTimeActuators.filter((a) => a.level < 20 && a.level >= 10)

  const phCurrent = safeNumber(levels?.PH)
  const phData = {
    current: phCurrent,
    target: 6.8,
    status: phCurrent > 7 ? 'high' : phCurrent < 6 ? 'low' : 'optimal',
    lastUpdated,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">System Monitoring</h1>
          <p className="text-gray-600">Real-time monitoring of tank levels, pH, and system health</p>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {connectionStatus === 'connected' ? (
            <div className="flex items-center space-x-1 text-[#08CC0A]">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">Connected</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-500">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm">Disconnected</span>
            </div>
          )}

          <span className="text-xs text-gray-500">
            {lastUpdated?.toLocaleTimeString?.() || '--:--:--'}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E02787]"></div>
            <span>Loading monitoring data...</span>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Critical Tanks</div>
              <div className="text-2xl font-bold text-red-600">
                {loading ? '...' : criticalTanks.length}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Low Level</div>
              <div className="text-2xl font-bold text-yellow-600">
                {loading ? '...' : lowTanks.length}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Beaker className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">pH Level</div>
              <div className="text-2xl font-bold text-black">
                {loading ? '...' : phCurrent.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">System Status</div>
              <div className="text-2xl font-bold text-black">
                {loading ? '...' : connectionStatus === 'connected' ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <PhCard phData={phData} />
        </div>

        <div className="lg:col-span-1">
          <SystemHealthCard connectionStatus={connectionStatus} lastUpdated={lastUpdated} />
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h3 className="text-xl font-semibold text-black mb-4">System Summary</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Connection</span>
                <span
                  className={`text-sm font-medium ${
                    connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Active Actuators</span>
                <span className="text-sm font-medium text-black">
                  {realTimeActuators.filter((a) => a.state === 'ON').length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">pH Status</span>
                <span className="text-sm font-medium text-black">
                  {phCurrent > 7 ? 'Alkaline' : phCurrent < 6 ? 'Acidic' : 'Neutral'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Last Update</span>
                <span className="text-sm font-medium text-black">
                  {lastUpdated?.toLocaleTimeString?.() || '--:--:--'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tank Levels */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-6">Tank Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {realTimeActuators.map((actuator) => (
            <TankLevelCard key={actuator.id} actuator={actuator} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Monitoring
