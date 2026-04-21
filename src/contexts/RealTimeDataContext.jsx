import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getLevels, getStatus, controlDevice, testConnection } from '../services/api'

const RealTimeDataContext = createContext()

export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext)
  if (!context) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider')
  }
  return context
}

export const RealTimeDataProvider = ({ children }) => {
  const [levels, setLevels] = useState({
    P1: 0, P2: 0, P3: 0, P4: 0,
    M1: 0, M2: 0, M3: 0, M4: 0,
    PH: 0,
  })

  const [status, setStatus] = useState({
    ledP1: 'OFF', ledP2: 'OFF', ledP3: 'OFF', ledP4: 'OFF',
    ledP5: 'OFF', ledP6: 'OFF', ledP7: 'OFF', ledP8: 'OFF',
  })

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [emergencyStop, setEmergencyStop] = useState(false)

  const fetchData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      setError(null)

      const [levelsData, statusData] = await Promise.all([
        getLevels(),
        getStatus(),
      ])

      setLevels(levelsData)
      setStatus(statusData)
      setConnectionStatus('connected')
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError(err.message || 'Failed to fetch real-time data')
      setConnectionStatus('error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const controlActuator = useCallback(async (device, state) => {
    try {
      setError(null)

      // 1) send command
      await controlDevice(device, state)

      // 2) optimistic UI update immediately
      setStatus((prev) => {
        const next = { ...prev }

        const upperDevice = String(device).toUpperCase()
        const normalizedState = String(state).toUpperCase() === 'ON' ? 'ON' : 'OFF'

        const mapping = {
          P1: 'ledP1',
          P2: 'ledP2',
          P3: 'ledP3',
          P4: 'ledP4',
          M1: 'ledP5',
          M2: 'ledP6',
          M3: 'ledP7',
          M4: 'ledP8',
        }

        const key = mapping[upperDevice]
        if (key) {
          next[key] = normalizedState
        }

        return next
      })

      // 3) then refresh real data in background
      fetchData(false)

      return { success: true }
    } catch (err) {
      console.error('Failed to control device:', err)
      setError(err.message || 'Failed to control actuator')
      throw err
    }
  }, [fetchData])

  const handleEmergencyStop = useCallback(async () => {
    try {
      setEmergencyStop(true)
      setError(null)

      const devices = ['P1', 'P2', 'P3', 'P4', 'M1', 'M2', 'M3', 'M4']

      await Promise.all(
        devices.map((device) => controlDevice(device, 'OFF'))
      )

      // optimistic UI
      setStatus({
        ledP1: 'OFF',
        ledP2: 'OFF',
        ledP3: 'OFF',
        ledP4: 'OFF',
        ledP5: 'OFF',
        ledP6: 'OFF',
        ledP7: 'OFF',
        ledP8: 'OFF',
      })

      fetchData(false)
    } catch (err) {
      console.error('Emergency stop failed:', err)
      setError(err.message || 'Emergency stop failed')
    } finally {
      setTimeout(() => setEmergencyStop(false), 3000)
    }
  }, [fetchData])

  const testBackendConnection = useCallback(async () => {
    try {
      const result = await testConnection()
      setConnectionStatus(result.connected ? 'connected' : 'disconnected')
      return result
    } catch (err) {
      setConnectionStatus('error')
      return { connected: false, message: err.message }
    }
  }, [])

  useEffect(() => {
    fetchData(true)
    testBackendConnection()
  }, [fetchData, testBackendConnection])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(false)
    }, 3000)

    return () => clearInterval(interval)
  }, [fetchData])

  const derivedData = {
    totalPumps: levels.P1 + levels.P2 + levels.P3 + levels.P4,
    totalMotors: levels.M1 + levels.M2 + levels.M3 + levels.M4,
    activeActuators: Object.values(status).filter((s) => s === 'ON').length,
    phStatus: levels.PH > 7 ? 'Alkaline' : levels.PH < 6 ? 'Acidic' : 'Neutral',
    systemHealth: connectionStatus === 'connected' ? 'Online' : 'Offline',
  }

  const value = {
    levels,
    status,
    derivedData,
    loading,
    refreshing,
    error,
    connectionStatus,
    lastUpdated,
    emergencyStop,
    fetchData,
    controlActuator,
    handleEmergencyStop,
    testConnection: testBackendConnection,
    getActuatorState: (actuator) => status[`led${actuator}`] || 'OFF',
    getLevelValue: (product) => levels[product] || 0,
    isActuatorOn: (actuator) => status[`led${actuator}`] === 'ON',
  }

  return (
    <RealTimeDataContext.Provider value={value}>
      {children}
    </RealTimeDataContext.Provider>
  )
}

export default RealTimeDataContext