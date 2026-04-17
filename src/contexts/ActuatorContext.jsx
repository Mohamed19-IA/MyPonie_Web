import React, { createContext, useContext, useState, useEffect } from 'react'

// Mock data for actuators - will be replaced with API calls
const initialActuators = {
  pumps: {
    P1: { id: 'P1', name: 'pH Down', type: 'pump', status: false, product: 'pH Down', currentLevel: 75 },
    P2: { id: 'P2', name: 'Calcium', type: 'pump', status: false, product: 'Calcium', currentLevel: 60 },
    P3: { id: 'P3', name: 'Blum', type: 'pump', status: false, product: 'Blum', currentLevel: 45 },
    P4: { id: 'P4', name: 'Grow', type: 'pump', status: false, product: 'Grow', currentLevel: 80 }
  },
  motors: {
    M1: { id: 'M1', name: 'Bicarbonate Potassium', type: 'motor', status: false, product: 'Bicarbonate Potassium', currentLevel: 90 },
    M2: { id: 'M2', name: 'Sulfate Potassium', type: 'motor', status: false, product: 'Sulfate Potassium', currentLevel: 55 },
    M3: { id: 'M3', name: 'Sulfate Magnesium', type: 'motor', status: false, product: 'Sulfate Magnesium', currentLevel: 70 },
    M4: { id: 'M4', name: 'Activateur Racinaire', type: 'motor', status: false, product: 'Activateur Racinaire', currentLevel: 30 }
  }
}

const ActuatorContext = createContext()

export const useActuators = () => {
  const context = useContext(ActuatorContext)
  if (!context) {
    throw new Error('useActuators must be used within an ActuatorProvider')
  }
  return context
}

export const ActuatorProvider = ({ children }) => {
  const [actuators, setActuators] = useState(initialActuators)
  const [emergencyStop, setEmergencyStop] = useState(false)

  // Toggle actuator status
  const toggleActuator = (id) => {
    if (emergencyStop) return
    
    setActuators(prev => {
      const newActuators = { ...prev }
      
      // Check in pumps
      if (newActuators.pumps[id]) {
        newActuators.pumps[id] = {
          ...newActuators.pumps[id],
          status: !newActuators.pumps[id].status
        }
      }
      
      // Check in motors
      if (newActuators.motors[id]) {
        newActuators.motors[id] = {
          ...newActuators.motors[id],
          status: !newActuators.motors[id].status
        }
      }
      
      return newActuators
    })

    // TODO: Send command to backend API/MQTT
    // await fetch(`/api/actuators/${id}/toggle`, { method: 'POST' })
  }

  // Emergency stop - turn off all actuators
  const handleEmergencyStop = () => {
    setEmergencyStop(true)
    
    setActuators(prev => {
      const newActuators = { ...prev }
      
      // Turn off all pumps
      Object.keys(newActuators.pumps).forEach(id => {
        newActuators.pumps[id] = { ...newActuators.pumps[id], status: false }
      })
      
      // Turn off all motors
      Object.keys(newActuators.motors).forEach(id => {
        newActuators.motors[id] = { ...newActuators.motors[id], status: false }
      })
      
      return newActuators
    })

    // TODO: Send emergency stop signal to backend
    // await fetch('/api/emergency-stop', { method: 'POST' })
    
    // Reset emergency stop after 5 seconds
    setTimeout(() => setEmergencyStop(false), 5000)
  }

  // Update actuator levels (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      setActuators(prev => {
        const newActuators = { ...prev }
        
        // Simulate level changes for active actuators
        Object.keys(newActuators.pumps).forEach(id => {
          if (newActuators.pumps[id].status && newActuators.pumps[id].currentLevel > 0) {
            newActuators.pumps[id] = {
              ...newActuators.pumps[id],
              currentLevel: Math.max(0, newActuators.pumps[id].currentLevel - 0.5)
            }
          }
        })
        
        Object.keys(newActuators.motors).forEach(id => {
          if (newActuators.motors[id].status && newActuators.motors[id].currentLevel > 0) {
            newActuators.motors[id] = {
              ...newActuators.motors[id],
              currentLevel: Math.max(0, newActuators.motors[id].currentLevel - 0.3)
            }
          }
        })
        
        return newActuators
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const value = {
    actuators,
    toggleActuator,
    emergencyStop,
    handleEmergencyStop
  }

  return (
    <ActuatorContext.Provider value={value}>
      {children}
    </ActuatorContext.Provider>
  )
}
