import React from 'react'
import { useMonitoring } from '../contexts/MonitoringContext'
import { useActuators } from '../contexts/ActuatorContext'
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
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'

const PhCard = ({ phData }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'text-green-400'
      case 'high': return 'text-red-400'
      case 'low': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'optimal': return 'bg-green-500/20 border-green-500/30'
      case 'high': return 'bg-red-500/20 border-red-500/30'
      case 'low': return 'bg-yellow-500/20 border-yellow-500/30'
      default: return 'bg-gray-500/20 border-gray-500/30'
    }
  }

  const getTrendIcon = () => {
    if (phData.current > phData.target) {
      return <TrendingUp className="w-4 h-4 text-red-400" />
    } else if (phData.current < phData.target) {
      return <TrendingDown className="w-4 h-4 text-yellow-400" />
    }
    return <Activity className="w-4 h-4 text-green-400" />
  }

  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Beaker className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">pH Level</h3>
            <p className="text-sm text-gray-400">Water Acidity Monitor</p>
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
          <div className="text-sm text-gray-400 mb-1">Current</div>
          <div className="text-3xl font-bold text-white mb-1">{phData.current}</div>
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span className="text-sm text-gray-400">Target: {phData.target}</span>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400 mb-1">Difference</div>
          <div className={`text-3xl font-bold ${getStatusColor(phData.status)}`}>
            {(phData.current - phData.target).toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">from target</div>
        </div>
      </div>

      {/* pH Scale Visual */}
      <div className="relative">
        <div className="h-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-yellow-500 to-blue-500 rounded-full"></div>
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-gray-800 shadow-lg"
          style={{ left: `${((phData.current - 4) / 10) * 100}%` }}
        ></div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>4.0</span>
          <span>7.0</span>
          <span>14.0</span>
        </div>
      </div>
    </div>
  )
}

const TankLevelCard = ({ actuator }) => {
  const isLow = actuator.currentLevel < 20
  const isCritical = actuator.currentLevel < 10

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${actuator.type === 'pump' 
              ? 'bg-blue-500/20 border border-blue-500/30' 
              : 'bg-purple-500/20 border border-purple-500/30'
            }
          `}>
            <Droplets className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <div className="font-semibold text-white">{actuator.id}</div>
            <div className="text-xs text-gray-400">{actuator.name}</div>
          </div>
        </div>
        
        {isCritical && (
          <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>CRITICAL</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Level</span>
          <span className={isCritical ? 'text-red-400 font-semibold' : isLow ? 'text-yellow-400 font-semibold' : 'text-green-400'}>
            {actuator.currentLevel.toFixed(1)}%
          </span>
        </div>
        <div className="tank-gauge">
          <div 
            className={`
              tank-fill
              ${isCritical ? 'bg-red-500' : isLow ? 'bg-yellow-500' : 'bg-green-500'}
            `}
            style={{ width: `${actuator.currentLevel}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Status</span>
        <span className={actuator.status ? 'text-green-400' : 'text-gray-500'}>
          {actuator.status ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  )
}

const AlertCard = ({ alert, onClear }) => {
  const getAlertStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-400'
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-400'
      default:
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400'
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-4 h-4" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />
      case 'success':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  return (
    <div className={`glass-card p-4 border ${getAlertStyles(alert.type)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getAlertIcon(alert.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{alert.message}</p>
            <p className="text-xs opacity-75 mt-1">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => onClear(alert.id)}
          className="ml-2 text-xs opacity-60 hover:opacity-100 transition-opacity"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

const SystemHealthCard = ({ healthData }) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">System Health</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          healthData.status === 'healthy' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
        }`}>
          {healthData.status.toUpperCase()}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Uptime</span>
          </div>
          <span className="text-sm font-medium text-white">{healthData.uptime}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Last Maintenance</span>
          </div>
          <span className="text-sm font-medium text-white">{healthData.lastMaintenance}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Performance</span>
          </div>
          <span className="text-sm font-medium text-green-400">Optimal</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Thermometer className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Temperature</span>
          </div>
          <span className="text-sm font-medium text-white">22°C</span>
        </div>
      </div>
    </div>
  )
}

const Monitoring = () => {
  const { monitoringData, clearAlert } = useMonitoring()
  const { actuators } = useActuators()

  const allActuators = [
    ...Object.values(actuators.pumps),
    ...Object.values(actuators.motors)
  ]

  const criticalTanks = allActuators.filter(a => a.currentLevel < 10)
  const lowTanks = allActuators.filter(a => a.currentLevel < 20 && a.currentLevel >= 10)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">System Monitoring</h1>
        <p className="text-gray-400">Real-time monitoring of tank levels, pH, and system health</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Critical Tanks</div>
              <div className="text-2xl font-bold text-red-400">{criticalTanks.length}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Low Level</div>
              <div className="text-2xl font-bold text-yellow-400">{lowTanks.length}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Beaker className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">pH Level</div>
              <div className="text-2xl font-bold text-white">{monitoringData.ph.current}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">System Status</div>
              <div className="text-2xl font-bold text-green-400">Online</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* pH Monitor */}
        <div className="lg:col-span-1">
          <PhCard phData={monitoringData.ph} />
        </div>

        {/* System Health */}
        <div className="lg:col-span-1">
          <SystemHealthCard healthData={monitoringData.systemHealth} />
        </div>

        {/* Recent Alerts */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Alerts</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {monitoringData.alerts.length > 0 ? (
                monitoringData.alerts.map(alert => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onClear={clearAlert}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-400">No active alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tank Levels */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Tank Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allActuators.map(actuator => (
            <TankLevelCard
              key={actuator.id}
              actuator={actuator}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Monitoring
