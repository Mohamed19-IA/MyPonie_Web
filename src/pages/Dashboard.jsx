import React, { useMemo, useState } from 'react'
import { useRealTimeData } from '../contexts/RealTimeDataContext'
import {
  Power,
  Droplets,
  Cpu,
  AlertTriangle,
  Activity,
  Gauge,
  Zap,
  Wifi,
  WifiOff,
} from 'lucide-react'

const normalizeState = (value) => {
  return String(value ?? 'OFF').toUpperCase() === 'ON' ? 'ON' : 'OFF'
}

const safeNumber = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const ActuatorCard = ({ actuator, controlActuator, loading, emergencyStop }) => {
  const level = safeNumber(actuator?.level)
  const state = normalizeState(actuator?.state)

  const isLowLevel = level < 20
  const isCritical = level < 10
  const [isControlling, setIsControlling] = useState(false)

  const handleToggle = async () => {
    if (loading || emergencyStop) return

    if (typeof controlActuator !== 'function') {
      console.error('controlActuator is not available')
      return
    }

    const newState = state === 'ON' ? 'OFF' : 'ON'

    try {
      setIsControlling(true)
      await controlActuator(actuator.id, newState)
    } catch (error) {
      console.error('Failed to toggle actuator:', error)
    } finally {
      setTimeout(() => {
        setIsControlling(false)
      }, 400)
    }
  }

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${
            state === 'ON'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              state === 'ON' ? 'bg-[#08CC0A] animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span>{state}</span>
        </div>
      </div>

      {/* Critical Warning */}
      {isCritical && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>CRITICAL</span>
          </div>
        </div>
      )}

      <div className="pt-8">
        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              actuator.type === 'pump'
                ? 'bg-blue-100 border border-blue-200'
                : 'bg-purple-100 border border-purple-200'
            }`}
          >
            {actuator.type === 'pump' ? (
              <Droplets className="w-8 h-8 text-blue-600" />
            ) : (
              <Cpu className="w-8 h-8 text-purple-600" />
            )}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-black mb-1">{actuator.id}</div>
          <div className="text-sm text-gray-600 mb-2">{actuator.name}</div>
          <div className="text-xs text-[#E02787] font-medium uppercase tracking-wider">
            {actuator.type}
          </div>
        </div>

        {/* Level */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Level</span>
            <span
              className={
                isCritical
                  ? 'text-red-600 font-semibold'
                  : isLowLevel
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
                  : isLowLevel
                  ? 'bg-yellow-500'
                  : 'bg-[#08CC0A]'
              }`}
              style={{ width: `${Math.max(0, Math.min(level, 100))}%` }}
            />
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          disabled={loading || emergencyStop}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition ${
            state === 'ON'
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-[#E02787] hover:opacity-90 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Power className="w-4 h-4" />
          <span>{state === 'ON' ? 'Turn OFF' : 'Turn ON'}</span>
        </button>

        {/* Warning */}
        {isCritical && (
          <div className="mt-3 text-center text-xs text-red-600">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            Tank level critical - refill required
          </div>
        )}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const {
    levels = {},
    status = {},
    loading = false,
    error = '',
    connectionStatus = 'disconnected',
    controlActuator,
    emergencyStop = false,
    handleEmergencyStop,
  } = useRealTimeData()

  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false)

  const realTimeActuators = useMemo(
    () => [
      {
        id: 'P1',
        name: 'pH Down',
        type: 'pump',
        level: safeNumber(levels?.P1),
        state: normalizeState(status?.ledP1),
      },
      {
        id: 'P2',
        name: 'Calcium',
        type: 'pump',
        level: safeNumber(levels?.P2),
        state: normalizeState(status?.ledP2),
      },
      {
        id: 'P3',
        name: 'Blum',
        type: 'pump',
        level: safeNumber(levels?.P3),
        state: normalizeState(status?.ledP3),
      },
      {
        id: 'P4',
        name: 'Grow',
        type: 'pump',
        level: safeNumber(levels?.P4),
        state: normalizeState(status?.ledP4),
      },
      {
        id: 'M1',
        name: 'Bicarbonate',
        type: 'motor',
        level: safeNumber(levels?.M1),
        state: normalizeState(status?.ledP5),
      },
      {
        id: 'M2',
        name: 'Sulfate K',
        type: 'motor',
        level: safeNumber(levels?.M2),
        state: normalizeState(status?.ledP6),
      },
      {
        id: 'M3',
        name: 'Sulfate Mg',
        type: 'motor',
        level: safeNumber(levels?.M3),
        state: normalizeState(status?.ledP7),
      },
      {
        id: 'M4',
        name: 'Racinaire',
        type: 'motor',
        level: safeNumber(levels?.M4),
        state: normalizeState(status?.ledP8),
      },
    ],
    [levels, status]
  )

  const pumps = realTimeActuators.filter((a) => a.type === 'pump')
  const motors = realTimeActuators.filter((a) => a.type === 'motor')

  const activeCount = realTimeActuators.filter((a) => a.state === 'ON').length
  const lowLevelCount = realTimeActuators.filter((a) => a.level < 20).length
  const avgLevel =
    realTimeActuators.length > 0
      ? realTimeActuators.reduce((sum, a) => sum + a.level, 0) / realTimeActuators.length
      : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Control Dashboard</h1>
          <p className="text-gray-600">Manage and monitor all 8 actuators in real-time</p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{activeCount}</div>
            <div className="text-sm text-gray-500">Active</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{lowLevelCount}</div>
            <div className="text-sm text-gray-500">Low Level</div>
          </div>

          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <div className="flex items-center gap-1 text-[#08CC0A]">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-500">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">Disconnected</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowEmergencyConfirm(true)}
            disabled={emergencyStop}
            className="px-6 py-3 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>{emergencyStop ? 'EMERGENCY ACTIVE' : 'EMERGENCY STOP'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {/* Emergency Modal */}
      {showEmergencyConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h3 className="text-2xl font-bold text-black mb-2">Emergency Stop</h3>
              <p className="text-gray-600 mb-6">
                This will immediately turn off all actuators. Are you sure?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (typeof handleEmergencyStop === 'function') {
                      handleEmergencyStop()
                    }
                    setShowEmergencyConfirm(false)
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  EMERGENCY STOP
                </button>

                <button
                  onClick={() => setShowEmergencyConfirm(false)}
                  className="flex-1 border border-gray-300 text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Pumps Active</div>
              <div className="text-xl font-bold text-black">
                {pumps.filter((p) => p.state === 'ON').length}/4
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Motors Active</div>
              <div className="text-xl font-bold text-black">
                {motors.filter((m) => m.state === 'ON').length}/4
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Gauge className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Avg Level</div>
              <div className="text-xl font-bold text-black">{avgLevel.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">System Status</div>
              <div className="text-xl font-bold text-[#08CC0A]">
                {connectionStatus === 'connected' ? 'Healthy' : 'Offline'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pumps */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
          <Droplets className="w-6 h-6 text-blue-600" />
          <span>Pumps</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pumps.map((actuator) => (
            <ActuatorCard
              key={actuator.id}
              actuator={actuator}
              controlActuator={controlActuator}
              loading={loading}
              emergencyStop={emergencyStop}
            />
          ))}
        </div>
      </div>

      {/* Motors */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
          <Cpu className="w-6 h-6 text-purple-600" />
          <span>Motors / Dispensers</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {motors.map((actuator) => (
            <ActuatorCard
              key={actuator.id}
              actuator={actuator}
              controlActuator={controlActuator}
              loading={loading}
              emergencyStop={emergencyStop}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
