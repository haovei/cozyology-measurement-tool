import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MeasurementTool from './components/MeasurementTool'
import stepConfig from './assets/step-config.json'
import './index'

// Development mode: Mount React component directly
const devRoot = document.getElementById('measurement-tool-app')
if (devRoot) {
  ReactDOM.createRoot(devRoot).render(
    <React.StrictMode>
      <MeasurementTool stepConfig={stepConfig} />
    </React.StrictMode>
  )
}
