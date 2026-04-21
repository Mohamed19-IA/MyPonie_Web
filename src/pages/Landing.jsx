import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Droplets, 
  Zap, 
  Activity, 
  Clock, 
  Shield, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Cpu,
  Wifi,
  AlertCircle,
  WifiOff
} from 'lucide-react'
import { useRealTimeData } from '../contexts/RealTimeDataContext'

const Landing = () => {
  const { 
    levels, 
    status, 
    loading, 
    error, 
    connectionStatus, 
    lastUpdated, 
    derivedData,
    getActuatorState,
    getLevelValue 
  } = useRealTimeData()

  const features = [
    {
      icon: Zap,
      title: 'Smart Control',
      description: 'Manual and automated control of 8 actuators with real-time status monitoring.'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Track pH levels, tank levels, and system health with instant alerts.'
    },
    {
      icon: Clock,
      title: 'Scheduled Automation',
      description: 'Program automatic dosing schedules for optimal plant nutrition.'
    },
    {
      icon: Shield,
      title: 'System Protection',
      description: 'Emergency stop functionality and safety alerts for your system.'
    },
    {
      icon: TrendingUp,
      title: 'Data Analytics',
      description: 'Comprehensive logging and history tracking for optimization.'
    },
    {
      icon: Wifi,
      title: 'IoT Ready',
      description: 'MQTT integration and REST API support for Node-RED connectivity.'
    }
  ]

  const stats = [
    { label: 'Active Actuators', value: derivedData.activeActuators },
    { label: 'pH Level', value: levels.PH.toFixed(1) },
    { label: 'System Status', value: derivedData.systemHealth },
    { label: 'Total Pumps', value: derivedData.totalPumps }
  ]

  const actuators = [
    { id: 'P1', name: 'pH Down', type: 'Pump', icon: Droplets, level: levels.P1, state: status.ledP1 },
    { id: 'P2', name: 'Calcium', type: 'Pump', icon: Droplets, level: levels.P2, state: status.ledP2 },
    { id: 'P3', name: 'Blum', type: 'Pump', icon: Droplets, level: levels.P3, state: status.ledP3 },
    { id: 'P4', name: 'Grow', type: 'Pump', icon: Droplets, level: levels.P4, state: status.ledP4 },
    { id: 'M1', name: 'Bicarbonate', type: 'Motor', icon: Cpu, level: levels.M1, state: status.ledM1 },
    { id: 'M2', name: 'Sulfate K', type: 'Motor', icon: Cpu, level: levels.M2, state: status.ledM2 },
    { id: 'M3', name: 'Sulfate Mg', type: 'Motor', icon: Cpu, level: levels.M3, state: status.ledM3 },
    { id: 'M4', name: 'Racinaire', type: 'Motor', icon: Cpu, level: levels.M4, state: status.ledM4 }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black-900 mb-2">MyPonie Dashboard</h1>
              <p className="text-black-600">Smart Fertigation System Overview</p>
            </div>
            <div className="flex items-center space-x-2">
              {connectionStatus === 'connected' ? (
                <div className="flex items-center space-x-1 text-secondary-600">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm">Connected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-primary-600">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm">Disconnected</span>
                </div>
              )}
              <span className="text-xs text-black-600">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-primary-600" />
              <span className="text-sm text-primary-800">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center space-x-2 text-black-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
              <span>Loading data...</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-4 text-center">
              <div className="text-2xl font-bold text-black-900 mb-1">
                {loading ? '...' : stat.value}
              </div>
              <div className="text-sm text-black-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* System Overview */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-black-900 mb-4">System Overview</h2>
              <p className="text-black-600 mb-6">
                Advanced control and monitoring solution for modern hydroponic systems. 
                Manage nutrients, monitor pH levels, and automate your fertigation process.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {features.slice(0, 4).map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black text-sm">{feature.title}</h3>
                        <p className="text-xs text-black-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Quick Status */}
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-black-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black-600">Status</span>
                  <span className={`px-2 py-1 text-xs ${
                    connectionStatus === 'connected' 
                      ? 'status-online' 
                      : 'status-offline'
                  }`}>
                    {connectionStatus === 'connected' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black-600">pH Level</span>
                  <span className="text-sm font-medium text-secondary-600">
                    {loading ? '...' : levels.PH.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black-600">Active Actuators</span>
                  <span className="text-sm font-medium text-primary-600">
                    {loading ? '...' : derivedData.activeActuators}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black-600">pH Status</span>
                  <span className="text-sm font-medium text-black-900">
                    {loading ? '...' : derivedData.phStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black-600">Total Pumps</span>
                  <span className="text-sm font-medium text-black-900">
                    {loading ? '...' : derivedData.totalPumps}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-black-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/dashboard" className="button-primary w-full block text-center">
                  Open Dashboard
                </Link>
                <Link to="/automation" className="button-outline w-full block text-center">
                  View Schedules
                </Link>
                <Link to="/history" className="button-outline w-full block text-center">
                  Check History
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Actuators Grid */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-black-900 mb-4">Actuator Status</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {actuators.map((actuator) => {
              const Icon = actuator.icon
              const isOn = actuator.state === 'ON'
              return (
                <div key={actuator.id} className={`border rounded-lg p-4 text-center transition-colors ${
                  isOn 
                    ? 'border-secondary-300 bg-secondary-50' 
                    : 'border-black-200 hover:border-primary-300'
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 mx-auto ${
                    isOn 
                      ? 'bg-secondary-100' 
                      : 'bg-primary-50'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isOn 
                        ? 'text-secondary-600' 
                        : 'text-primary-600'
                    }`} />
                  </div>
                  <div className="font-bold text-black-900 mb-1">{actuator.id}</div>
                  <div className="text-xs text-black-600">{actuator.name}</div>
                  <div className="text-xs text-primary-600 font-medium mt-1">{actuator.type}</div>
                  <div className="mt-2 space-y-1">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      isOn 
                        ? 'bg-secondary-100 text-secondary-700' 
                        : 'bg-black-100 text-black-700'
                    }`}>
                      {isOn ? 'ON' : 'OFF'}
                    </div>
                    {actuator.level > 0 && (
                      <div className="text-xs text-black-600">
                        Level: {actuator.level}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-black-900 mb-4">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black text-sm">{feature.title}</h3>
                      <p className="text-xs text-black-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
