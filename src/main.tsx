import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { MeasurementTool } from './components/MeasurementTool'

// Import the web component for demo
import './index'

// Development mode: Mount React component directly
const devRoot = document.getElementById('dev-app')
if (devRoot) {
  ReactDOM.createRoot(devRoot).render(
    <React.StrictMode>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Development Mode</h1>
        <MeasurementTool title="Development Measurement Tool" />
      </div>
    </React.StrictMode>
  )
}
