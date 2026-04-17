# MyPonie - Smart Fertigation System

A modern, responsive web application for intelligent fertigation and hydroponic supervision and control.

## 🌱 Features

### Core Functionality
- **8 Actuator Control**: Manage 4 pumps (P1-P4) and 4 motors/dispensers (M1-M4)
- **Real-time Monitoring**: Track pH levels, tank levels, and system health
- **Automated Scheduling**: Create and manage dosing schedules and programs
- **Emergency Stop**: Instant shutdown of all actuators
- **Alert System**: Real-time notifications for low levels and system issues
- **Action Logging**: Complete history of all system actions with timestamps

### Product Mapping
- **Pumps**:
  - P1 = pH Down
  - P2 = Calcium
  - P3 = Blum
  - P4 = Grow
- **Motors**:
  - M1 = Bicarbonate Potassium
  - M2 = Sulfate Potassium
  - M3 = Sulfate Magnesium
  - M4 = Activateur Racinaire

### Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Glassmorphism design with dark theme
- **Real-time Updates**: Live status updates and animations
- **Export Functionality**: CSV export for history and logs
- **IoT Ready**: Structured for MQTT and REST API integration

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd myponie
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Main navigation
│   └── Sidebar.jsx     # Side navigation
├── contexts/           # React context providers
│   ├── ActuatorContext.jsx    # Actuator state management
│   └── MonitoringContext.jsx  # Monitoring data management
├── pages/              # Main application pages
│   ├── Landing.jsx     # Landing page
│   ├── Dashboard.jsx   # Control dashboard
│   ├── Monitoring.jsx  # System monitoring
│   ├── History.jsx     # History and logs
│   └── Automation.jsx  # Schedules and programs
├── App.jsx            # Main app component
├── main.jsx           # Application entry point
└── index.css          # Global styles and Tailwind
```

## 📱 Pages Overview

### 1. Landing Page
- Hero section with project overview
- Feature highlights
- System statistics
- Integration capabilities

### 2. Control Dashboard
- 8 actuator control cards (P1-P4, M1-M4)
- Real-time status indicators
- Tank level monitoring
- Emergency stop functionality
- Quick stats overview

### 3. Monitoring
- Real-time pH monitoring with visual scale
- Tank level gauges for all actuators
- System health dashboard
- Alert management system
- Critical level warnings

### 4. History & Logs
- Complete action history
- Advanced filtering and search
- CSV export functionality
- Real-time log updates
- Status tracking

### 5. Automation
- Schedule management (create, edit, delete)
- Dosing programs (vegetative, flowering stages)
- Nutrient level configuration
- Program activation
- System status monitoring

## 🔧 Backend Integration

The application is structured for easy backend integration:

### MQTT Topics
```javascript
// Actuator control
myponie/actuators/{id}/command
myponie/actuators/{id}/status
myponie/actuators/{id}/level

// System monitoring
myponie/system/ph
myponie/system/alerts
myponie/system/health

// Automation
myponie/schedules/update
myponie/programs/activate
```

### REST API Endpoints
```javascript
// Actuators
GET /api/actuators
POST /api/actuators/{id}/toggle
POST /api/emergency-stop

// Monitoring
GET /api/monitoring/ph
GET /api/monitoring/alerts
POST /api/monitoring/alerts

// History
GET /api/history
GET /api/history/export

// Automation
GET /api/schedules
POST /api/schedules
PUT /api/schedules/{id}
DELETE /api/schedules/{id}
```

## 🎨 Design System

### Color Palette
- **Primary Green**: #22c55e (success, active states)
- **Secondary Blue**: #0ea5e9 (information, pumps)
- **Purple**: #a855f7 (motors, special features)
- **Yellow**: #eab308 (warnings)
- **Red**: #ef4444 (errors, emergency)
- **Dark Theme**: #0f172a (background)

### Components
- **Glass Cards**: Semi-transparent with backdrop blur
- **Status Badges**: Color-coded status indicators
- **Control Buttons**: Gradient backgrounds with hover effects
- **Tank Gauges**: Visual level indicators
- **Alert Cards**: Type-styled notification system

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🔒 Safety Features

- Emergency stop functionality
- Critical level warnings
- Confirmation dialogs for destructive actions
- Input validation and sanitization
- Error boundary handling

## 🚀 Performance Optimizations

- Lazy loading for large datasets
- Debounced search inputs
- Optimized re-renders with React.memo
- Efficient state management with contexts
- CSS animations using transforms

## 📊 Mock Data

The application includes comprehensive mock data for:
- Actuator states and levels
- pH monitoring with realistic fluctuations
- Historical logs with various action types
- Automation schedules and programs
- System alerts and notifications

## 🔮 Future Enhancements

- Real-time WebSocket connections
- Advanced analytics dashboard
- Mobile app (React Native)
- Multi-user support with authentication
- Advanced reporting features
- Integration with more IoT platforms

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📞 Support

For support and questions, please open an issue in the repository.

---

**MyPonie** - Intelligent fertigation for modern agriculture 🌱
