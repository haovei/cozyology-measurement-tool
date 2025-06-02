import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MeasurementTool from './components/MeasurementTool'

// Import the web component for demo
import './index'

// Development mode: Mount React component directly
const devRoot = document.getElementById('dev-app')
if (devRoot) {
  ReactDOM.createRoot(devRoot).render(
    <React.StrictMode>
      <div className="container mx-auto">
        <MeasurementTool />
      </div>
    </React.StrictMode>
  )
}
