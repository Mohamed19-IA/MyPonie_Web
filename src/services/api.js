// API service layer for Node-RED backend integration

const API_BASE_URL = 'http://86.235.73.8:1880';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Get tank/product levels and pH
export const getLevels = async () => {
  try {
    const data = await apiCall('/unity/levels1');

    return {
      P1: Number(data.P1 ?? 0),
      P2: Number(data.P2 ?? 0),
      P3: Number(data.P3 ?? 0),
      P4: Number(data.P4 ?? 0),
      M1: Number(data.M1 ?? 0),
      M2: Number(data.M2 ?? 0),
      M3: Number(data.M3 ?? 0),
      M4: Number(data.M4 ?? 0),
      PH: Number(data.PH ?? 0),
    };
  } catch (error) {
    console.error('Failed to fetch levels:', error);
    return {
      P1: 0, P2: 0, P3: 0, P4: 0,
      M1: 0, M2: 0, M3: 0, M4: 0,
      PH: 0,
    };
  }
};

// Get actuator states
export const getStatus = async () => {
  try {
    const data = await apiCall('/unity/status1');

    return {
      ledP1: data.ledP1 ?? 'OFF',
      ledP2: data.ledP2 ?? 'OFF',
      ledP3: data.ledP3 ?? 'OFF',
      ledP4: data.ledP4 ?? 'OFF',
      ledP5: data.ledP5 ?? 'OFF',
      ledP6: data.ledP6 ?? 'OFF',
      ledP7: data.ledP7 ?? 'OFF',
      ledP8: data.ledP8 ?? 'OFF',
    };
  } catch (error) {
    console.error('Failed to fetch status:', error);
    return {
      ledP1: 'OFF',
      ledP2: 'OFF',
      ledP3: 'OFF',
      ledP4: 'OFF',
      ledP5: 'OFF',
      ledP6: 'OFF',
      ledP7: 'OFF',
      ledP8: 'OFF',
    };
  }
};

// Send control command to actuator
export const controlDevice = async (device, state) => {
  try {
    const payload = {
      device: String(device).toLowerCase(),
      state: String(state).toUpperCase(),
    };

    const response = await apiCall('/unity/device1', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return { success: true, response };
  } catch (error) {
    console.error(`Failed to control device ${device}:`, error);
    throw error;
  }
};

// Get all data in one call
export const getAllData = async () => {
  try {
    const [levels, status] = await Promise.all([
      getLevels(),
      getStatus(),
    ]);

    return { levels, status };
  } catch (error) {
    console.error('Failed to fetch all data:', error);
    throw error;
  }
};

// Test connection to Node-RED
export const testConnection = async () => {
  try {
    await apiCall('/unity/levels1');
    return {
      connected: true,
      message: 'Connected to Node-RED successfully',
    };
  } catch (error) {
    return {
      connected: false,
      message: `Failed to connect: ${error.message}`,
    };
  }
};