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
  Wifi
} from 'lucide-react'

const Landing = () => {
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
    { label: 'Actuators', value: '8' },
    { label: 'Products', value: '8' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'Response', value: '<100ms' }
  ]

  const actuators = [
    { id: 'P1', name: 'pH Down', type: 'Pump', icon: Droplets },
    { id: 'P2', name: 'Calcium', type: 'Pump', icon: Droplets },
    { id: 'P3', name: 'Blum', type: 'Pump', icon: Droplets },
    { id: 'P4', name: 'Grow', type: 'Pump', icon: Droplets },
    { id: 'M1', name: 'Bicarbonate', type: 'Motor', icon: Cpu },
    { id: 'M2', name: 'Sulfate K', type: 'Motor', icon: Cpu },
    { id: 'M3', name: 'Sulfate Mg', type: 'Motor', icon: Cpu },
    { id: 'M4', name: 'Racinaire', type: 'Motor', icon: Cpu }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black-900 mb-2">MyPonie Dashboard</h1>
          <p className="text-black-600">Smart Fertigation System Overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-4 text-center">
              <div className="text-2xl font-bold text-black-900 mb-1">{stat.value}</div>
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
                  <span className="status-online px-2 py-1 text-xs">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black-600">pH Level</span>
                  <span className="text-sm font-medium text-secondary-600">6.8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black-600">Active Alerts</span>
                  <span className="text-sm font-medium text-primary-600">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black-600">Uptime</span>
                  <span className="text-sm text-black-900">15d 7h</span>
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
          <h2 className="text-xl font-bold text-black-900 mb-4">Actuator Control</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {actuators.map((actuator) => {
              const Icon = actuator.icon
              return (
                <div key={actuator.id} className="border border-black-200 rounded-lg p-4 text-center hover:border-primary-300 transition-colors">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="font-bold text-black-900 mb-1">{actuator.id}</div>
                  <div className="text-xs text-black-600">{actuator.name}</div>
                  <div className="text-xs text-primary-600 font-medium mt-1">{actuator.type}</div>
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
