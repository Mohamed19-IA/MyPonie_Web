import React, { useState } from 'react'
import { 
  Clock, 
  Calendar, 
  Play, 
  Pause, 
  Edit, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Droplets,
  Cpu,
  Settings,
  TrendingUp,
  Activity
} from 'lucide-react'

// Mock automation data
const mockSchedules = [
  {
    id: 1,
    name: 'Morning Nutrient Mix',
    enabled: true,
    time: '06:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    actions: [
      { actuatorId: 'P1', duration: 30, dose: 15 },
      { actuatorId: 'P2', duration: 45, dose: 25 },
      { actuatorId: 'M1', duration: 60, dose: 20 }
    ],
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000)
  },
  {
    id: 2,
    name: 'Evening pH Adjustment',
    enabled: true,
    time: '18:00',
    days: ['monday', 'wednesday', 'friday'],
    actions: [
      { actuatorId: 'P1', duration: 20, dose: 10 }
    ],
    lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000)
  },
  {
    id: 3,
    name: 'Weekly Calcium Boost',
    enabled: false,
    time: '09:00',
    days: ['sunday'],
    actions: [
      { actuatorId: 'P2', duration: 90, dose: 50 }
    ],
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    name: 'Growth Phase Mix',
    enabled: true,
    time: '12:00',
    days: ['tuesday', 'thursday', 'saturday'],
    actions: [
      { actuatorId: 'P3', duration: 40, dose: 30 },
      { actuatorId: 'P4', duration: 35, dose: 28 },
      { actuatorId: 'M2', duration: 50, dose: 35 },
      { actuatorId: 'M3', duration: 45, dose: 32 }
    ],
    lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000)
  }
]

const mockPrograms = [
  {
    id: 1,
    name: 'Vegetative Stage',
    description: 'Optimized for leafy growth and vegetative development',
    duration: '4 weeks',
    status: 'active',
    nutrients: {
      nitrogen: 'high',
      phosphorus: 'medium',
      potassium: 'medium',
      calcium: 'high',
      magnesium: 'medium'
    },
    ph: { min: 5.8, max: 6.2 },
    schedule: mockSchedules.filter(s => [1, 2].includes(s.id))
  },
  {
    id: 2,
    name: 'Flowering Stage',
    description: 'Enhanced phosphorus and potassium for bloom development',
    duration: '8 weeks',
    status: 'inactive',
    nutrients: {
      nitrogen: 'medium',
      phosphorus: 'high',
      potassium: 'high',
      calcium: 'medium',
      magnesium: 'medium'
    },
    ph: { min: 6.0, max: 6.5 },
    schedule: mockSchedules.filter(s => [3, 4].includes(s.id))
  }
]

const ScheduleCard = ({ schedule, onToggle, onEdit, onDelete }) => {
  const getActuatorIcon = (actuatorId) => {
    return actuatorId.startsWith('P') ? 
      <Droplets className="w-4 h-4 text-blue-400" /> : 
      <Cpu className="w-4 h-4 text-purple-400" />
  }

  const getActuatorName = (actuatorId) => {
    const names = {
      P1: 'pH Down', P2: 'Calcium', P3: 'Blum', P4: 'Grow',
      M1: 'Bicarbonate Potassium', M2: 'Sulfate Potassium', 
      M3: 'Sulfate Magnesium', M4: 'Activateur Racinaire'
    }
    return names[actuatorId] || actuatorId
  }

  const dayNames = {
    monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
    thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun'
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{schedule.name}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
              schedule.enabled 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {schedule.enabled ? 'ACTIVE' : 'INACTIVE'}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{schedule.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{schedule.days.map(d => dayNames[d]).join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggle(schedule.id)}
            className={`p-2 rounded-lg transition-colors ${
              schedule.enabled 
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
            }`}
          >
            {schedule.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(schedule.id)}
            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(schedule.id)}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Actions</h4>
        <div className="space-y-2">
          {schedule.actions.map((action, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                {getActuatorIcon(action.actuatorId)}
                <span className="text-white">{getActuatorName(action.actuatorId)}</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-400">
                <span>{action.duration}s</span>
                <span>{action.dose}ml</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Run Times */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-white/10">
        <div>
          Last run: {schedule.lastRun.toLocaleString()}
        </div>
        <div>
          Next run: {schedule.nextRun.toLocaleString()}
        </div>
      </div>
    </div>
  )
}

const ProgramCard = ({ program, onActivate }) => {
  const getNutrientColor = (level) => {
    switch (level) {
      case 'high': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{program.name}</h3>
          <p className="text-sm text-gray-400">{program.description}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          program.status === 'active'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        }`}>
          {program.status.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-400 mb-1">Duration</div>
          <div className="text-white font-medium">{program.duration}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">pH Range</div>
          <div className="text-white font-medium">{program.ph.min} - {program.ph.max}</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Nutrient Levels</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(program.nutrients).map(([nutrient, level]) => (
            <div key={nutrient} className="flex justify-between">
              <span className="text-gray-300 capitalize">{nutrient}</span>
              <span className={getNutrientColor(level)}>{level.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Active Schedules</h4>
        <div className="space-y-1">
          {program.schedule.map(schedule => (
            <div key={schedule.id} className="text-sm text-gray-300">
              {schedule.name} - {schedule.time}
            </div>
          ))}
        </div>
      </div>

      {program.status !== 'active' && (
        <button
          onClick={() => onActivate(program.id)}
          className="w-full glass-button bg-primary-600 hover:bg-primary-700 text-white py-2 font-semibold"
        >
          Activate Program
        </button>
      )}
    </div>
  )
}

const Automation = () => {
  const [schedules, setSchedules] = useState(mockSchedules)
  const [programs] = useState(mockPrograms)
  const [activeTab, setActiveTab] = useState('schedules')

  const handleToggleSchedule = (scheduleId) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, enabled: !schedule.enabled }
        : schedule
    ))
    
    // TODO: Send update to backend
    // await fetch(`/api/schedules/${scheduleId}/toggle`, { method: 'POST' })
  }

  const handleEditSchedule = (scheduleId) => {
    // TODO: Open edit modal
    console.log('Edit schedule:', scheduleId)
  }

  const handleDeleteSchedule = (scheduleId) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId))
    
    // TODO: Send delete request to backend
    // await fetch(`/api/schedules/${scheduleId}`, { method: 'DELETE' })
  }

  const handleActivateProgram = (programId) => {
    // TODO: Activate program and update schedules
    console.log('Activate program:', programId)
    
    // await fetch(`/api/programs/${programId}/activate`, { method: 'POST' })
  }

  const activeSchedules = schedules.filter(s => s.enabled).length
  const todaySchedules = schedules.filter(s => {
    const today = new Date().toLocaleLowerCase().slice(0, 3)
    return s.enabled && s.days.includes(today)
  }).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Automation</h1>
          <p className="text-gray-400">Manage schedules and dosing programs</p>
        </div>
        
        <button className="glass-button bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 font-semibold inline-flex items-center space-x-2 mt-4 lg:mt-0">
          <Plus className="w-4 h-4" />
          <span>New Schedule</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Active Schedules</div>
              <div className="text-2xl font-bold text-white">{activeSchedules}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Today's Runs</div>
              <div className="text-2xl font-bold text-white">{todaySchedules}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Programs</div>
              <div className="text-2xl font-bold text-white">{programs.length}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Next Run</div>
              <div className="text-2xl font-bold text-white">
                {schedules.filter(s => s.enabled).length > 0 ? '2h 15m' : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('schedules')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'schedules'
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Schedules
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'programs'
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Programs
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'schedules' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Automated Schedules</h2>
            <div className="text-sm text-gray-400">
              {schedules.length} total schedules
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {schedules.map(schedule => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onToggle={handleToggleSchedule}
                onEdit={handleEditSchedule}
                onDelete={handleDeleteSchedule}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'programs' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Dosing Programs</h2>
            <button className="glass-button bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 font-semibold inline-flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Program</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map(program => (
              <ProgramCard
                key={program.id}
                program={program}
                onActivate={handleActivateProgram}
              />
            ))}
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-sm text-gray-400">Automation Engine</div>
              <div className="text-white font-medium">Running</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm text-gray-400">Last Schedule Run</div>
              <div className="text-white font-medium">2 hours ago</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-sm text-gray-400">Success Rate</div>
              <div className="text-white font-medium">99.2%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Automation
