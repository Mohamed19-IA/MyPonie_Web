import React, { useState } from 'react'
import { useActuators } from '../contexts/ActuatorContext'
import { 
  Power, 
  Droplets, 
  Cpu, 
  AlertTriangle, 
  Activity,
  Gauge,
  Zap
} from 'lucide-react'

const ActuatorCard = ({ actuator, onToggle, emergencyStop }) => {
  const isLowLevel = actuator.currentLevel < 20
  const isCritical = actuator.currentLevel < 10

  return (
    <div className="actuator-card relative">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`
          px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1
          ${actuator.status 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }
        `}>
          <div className={`w-2 h-2 rounded-full ${actuator.status ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span>{actuator.status ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      {/* Low Level Warning */}
      {isCritical && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>CRITICAL</span>
          </div>
        </div>
      )}

      <div className="pt-8">
        {/* Icon and Title */}
        <div className="flex items-center justify-center mb-4">
          <div className={`
            w-16 h-16 rounded-xl flex items-center justify-center
            ${actuator.type === 'pump' 
              ? 'bg-blue-500/20 border border-blue-500/30' 
              : 'bg-purple-500/20 border border-purple-500/30'
            }
          `}>
            {actuator.type === 'pump' ? (
              <Droplets className="w-8 h-8 text-blue-400" />
            ) : (
              <Cpu className="w-8 h-8 text-purple-400" />
            )}
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-white mb-1">{actuator.id}</div>
          <div className="text-sm text-gray-300 mb-2">{actuator.name}</div>
          <div className="text-xs text-primary-400 font-medium uppercase tracking-wider">
            {actuator.type}
          </div>
        </div>

        {/* Level Indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Level</span>
            <span className={isCritical ? 'text-red-400 font-semibold' : isLowLevel ? 'text-yellow-400 font-semibold' : 'text-green-400'}>
              {actuator.currentLevel.toFixed(1)}%
            </span>
          </div>
          <div className="tank-gauge">
            <div 
              className={`
                tank-fill
                ${isCritical ? 'bg-red-500' : isLowLevel ? 'bg-yellow-500' : 'bg-green-500'}
              `}
              style={{ width: `${actuator.currentLevel}%` }}
            ></div>
          </div>
        </div>

        {/* Control Button */}
        <button
          onClick={() => onToggle(actuator.id)}
          disabled={emergencyStop || isCritical}
          className={`
            control-button
            ${actuator.status 
              ? 'control-button-on' 
              : 'control-button-off'
            }
            ${(emergencyStop || isCritical) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <Power className="w-5 h-5" />
            <span>{actuator.status ? 'TURN OFF' : 'TURN ON'}</span>
          </div>
        </button>

        {/* Warning Message */}
        {isCritical && (
          <div className="mt-3 text-center">
            <p className="text-xs text-red-400">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Tank level critical - refill required
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { actuators, toggleActuator, emergencyStop, handleEmergencyStop } = useActuators()
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false)

  const activeCount = Object.values(actuators.pumps).filter(p => p.status).length + 
                     Object.values(actuators.motors).filter(m => m.status).length

  const lowLevelCount = Object.values(actuators.pumps).filter(p => p.currentLevel < 20).length + 
                       Object.values(actuators.motors).filter(m => m.currentLevel < 20).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Control Dashboard</h1>
          <p className="text-gray-400">Manage and monitor all system actuators</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
          {/* Status Overview */}
          <div className="glass-card px-6 py-3">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{activeCount}</div>
                <div className="text-xs text-gray-400">Active</div>
              </div>
              <div className="w-px h-8 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{lowLevelCount}</div>
                <div className="text-xs text-gray-400">Low Level</div>
              </div>
            </div>
          </div>

          {/* Emergency Stop */}
          <button
            onClick={() => setShowEmergencyConfirm(true)}
            disabled={emergencyStop}
            className={`
              emergency-stop px-8 py-3 font-semibold
              ${emergencyStop ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>{emergencyStop ? 'EMERGENCY ACTIVE' : 'EMERGENCY STOP'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Emergency Stop Confirmation Modal */}
      {showEmergencyConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Emergency Stop</h3>
              <p className="text-gray-400 mb-6">
                This will immediately turn off all actuators. Are you sure you want to continue?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    handleEmergencyStop()
                    setShowEmergencyConfirm(false)
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  EMERGENCY STOP
                </button>
                <button
                  onClick={() => setShowEmergencyConfirm(false)}
                  className="flex-1 glass-button text-white px-6 py-3 rounded-lg font-semibold"
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
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Pumps Active</div>
              <div className="text-xl font-bold text-white">
                {Object.values(actuators.pumps).filter(p => p.status).length}/4
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Motors Active</div>
              <div className="text-xl font-bold text-white">
                {Object.values(actuators.motors).filter(m => m.status).length}/4
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Gauge className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Avg Level</div>
              <div className="text-xl font-bold text-white">
                {(
                  (Object.values(actuators.pumps).reduce((sum, p) => sum + p.currentLevel, 0) +
                   Object.values(actuators.motors).reduce((sum, m) => sum + m.currentLevel, 0)
                ) / 8
                ).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">System Status</div>
              <div className="text-xl font-bold text-green-400">Healthy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pumps Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Droplets className="w-6 h-6 text-blue-400" />
          <span>Pumps</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(actuators.pumps).map(pump => (
            <ActuatorCard
              key={pump.id}
              actuator={pump}
              onToggle={toggleActuator}
              emergencyStop={emergencyStop}
            />
          ))}
        </div>
      </div>

      {/* Motors Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Cpu className="w-6 h-6 text-purple-400" />
          <span>Motors / Dispensers</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(actuators.motors).map(motor => (
            <ActuatorCard
              key={motor.id}
              actuator={motor}
              onToggle={toggleActuator}
              emergencyStop={emergencyStop}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
