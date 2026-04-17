import React, { createContext, useContext, useState, useEffect } from 'react'

// Mock data for monitoring
const initialMonitoringData = {
  ph: {
    current: 6.8,
    target: 6.5,
    status: 'optimal',
    history: []
  },
  alerts: [
    { id: 1, type: 'warning', message: 'M4 tank level below 35%', timestamp: new Date(Date.now() - 300000) },
    { id: 2, type: 'info', message: 'System check completed', timestamp: new Date(Date.now() - 600000) }
  ],
  systemHealth: {
    status: 'healthy',
    uptime: '15 days, 7 hours',
    lastMaintenance: '2024-01-15'
  }
}

const MonitoringContext = createContext()

export const useMonitoring = () => {
  const context = useContext(MonitoringContext)
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider')
  }
  return context
}

export const MonitoringProvider = ({ children }) => {
  const [monitoringData, setMonitoringData] = useState(initialMonitoringData)

  // Simulate pH monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setMonitoringData(prev => {
        const newPh = 6.5 + (Math.random() - 0.5) * 0.4 // Random pH between 6.3 and 6.7
        const status = newPh > 6.7 ? 'high' : newPh < 6.3 ? 'low' : 'optimal'
        
        const newHistory = [...prev.ph.history, { value: newPh, timestamp: new Date() }].slice(-20)
        
        return {
          ...prev,
          ph: {
            ...prev.ph,
            current: parseFloat(newPh.toFixed(2)),
            status,
            history: newHistory
          }
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Generate random alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const alertTypes = ['info', 'warning', 'success']
      const messages = [
        'System performance optimal',
        'Tank level monitoring active',
        'pH calibration completed',
        'Scheduled maintenance reminder'
      ]
      
      if (Math.random() > 0.8) { // 20% chance every 30 seconds
        const newAlert = {
          id: Date.now(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date()
        }

        setMonitoringData(prev => ({
          ...prev,
          alerts: [newAlert, ...prev.alerts].slice(0, 10) // Keep only last 10 alerts
        }))
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const addAlert = (type, message) => {
    const newAlert = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    }

    setMonitoringData(prev => ({
      ...prev,
      alerts: [newAlert, ...prev.alerts].slice(0, 10)
    }))

    // TODO: Send alert to backend
    // await fetch('/api/alerts', { 
    //   method: 'POST', 
    //   body: JSON.stringify({ type, message }) 
    // })
  }

  const clearAlert = (alertId) => {
    setMonitoringData(prev => ({
      ...prev,
      alerts: prev.alerts.filter(alert => alert.id !== alertId)
    }))
  }

  const value = {
    monitoringData,
    addAlert,
    clearAlert
  }

  return (
    <MonitoringContext.Provider value={value}>
      {children}
    </MonitoringContext.Provider>
  )
}
