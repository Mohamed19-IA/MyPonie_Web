import React from 'react'
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react'

const StatusIndicator = ({ status, size = 'md', showLabel = false }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'online':
      case 'active':
      case 'healthy':
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          label: status.charAt(0).toUpperCase() + status.slice(1)
        }
      case 'warning':
      case 'low':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          label: 'Warning'
        }
      case 'offline':
      case 'error':
      case 'critical':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          label: status.charAt(0).toUpperCase() + status.slice(1)
        }
      case 'pending':
      case 'loading':
        return {
          icon: Clock,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          label: 'Pending'
        }
      default:
        return {
          icon: Clock,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30',
          label: 'Unknown'
        }
    }
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  if (showLabel) {
    return (
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${config.bgColor} ${config.borderColor}`}>
        <Icon className={`${sizeClasses[size]} ${config.color}`} />
        <span className={`text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <Icon className={`w-full h-full ${config.color}`} />
      {status === 'online' || status === 'active' ? (
        <div className="absolute inset-0 animate-ping">
          <div className={`w-full h-full ${config.color} opacity-30 rounded-full`}></div>
        </div>
      ) : null}
    </div>
  )
}

export default StatusIndicator
