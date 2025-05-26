import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { MeasurementTool } from './components/MeasurementTool'

// Web Component wrapper for React component
class CozyologyMeasurementTool extends HTMLElement {
  private root: ReactDOM.Root | null = null

  connectedCallback() {
    // Create shadow DOM for encapsulation
    const shadow = this.attachShadow({ mode: 'open' })
    
    // Create link element for Tailwind CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.tailwindcss.com'
    link.crossOrigin = 'anonymous'
    shadow.appendChild(link)
    
    // Add fallback styles in case CDN fails
    const fallbackStyle = document.createElement('style')
    fallbackStyle.textContent = `
      /* Fallback styles */
      .p-8 { padding: 2rem; }
      .rounded-lg { border-radius: 0.5rem; }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
      .bg-white { background-color: white; }
      .bg-gray-900 { background-color: #111827; }
      .text-white { color: white; }
      .text-gray-900 { color: #111827; }
      .text-gray-600 { color: #4b5563; }
      .max-w-2xl { max-width: 42rem; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .text-3xl { font-size: 1.875rem; }
      .font-bold { font-weight: 700; }
      .mb-6 { margin-bottom: 1.5rem; }
      .text-center { text-align: center; }
      .text-lg { font-size: 1.125rem; }
      .space-y-4 > * + * { margin-top: 1rem; }
      .mt-8 { margin-top: 2rem; }
      .p-6 { padding: 1.5rem; }
      .bg-blue-50 { background-color: #eff6ff; }
      .text-xl { font-size: 1.25rem; }
      .font-semibold { font-weight: 600; }
      .mb-3 { margin-bottom: 0.75rem; }
      .text-blue-800 { color: #1e40af; }
      .list-disc { list-style-type: disc; }
      .list-inside { list-style-position: inside; }
      .space-y-2 > * + * { margin-top: 0.5rem; }
      .text-blue-700 { color: #1d4ed8; }
      .mt-6 { margin-top: 1.5rem; }
      .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .bg-blue-500 { background-color: #3b82f6; }
      .rounded-lg { border-radius: 0.5rem; }
      .hover\\:bg-blue-600:hover { background-color: #2563eb; }
      .focus\\:outline-none:focus { outline: none; }
      .focus\\:ring-2:focus { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }
      .focus\\:ring-blue-500:focus { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }
    `
    shadow.appendChild(fallbackStyle)
    
    // Create container for React app
    const container = document.createElement('div')
    shadow.appendChild(container)
    
    // Wait for styles to load before mounting React component
    const mountComponent = () => {
      this.root = ReactDOM.createRoot(container)
      this.root.render(React.createElement(MeasurementTool, this.getProps()))
    }
    
    // Mount immediately with fallback styles, CDN styles will enhance when loaded
    mountComponent()
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
  }

  private getProps() {
    // Extract attributes as props
    const props: any = {}
    
    // Example: data-title attribute becomes title prop
    if (this.hasAttribute('data-title')) {
      props.title = this.getAttribute('data-title')
    }
    
    if (this.hasAttribute('data-theme')) {
      props.theme = this.getAttribute('data-theme')
    }
    
    return props
  }

  // Watch for attribute changes
  static get observedAttributes() {
    return ['data-title', 'data-theme']
  }

  attributeChangedCallback() {
    if (this.root) {
      this.root.render(React.createElement(MeasurementTool, this.getProps()))
    }
  }
}

// Register the custom element
customElements.define('cozyology-measurement-tool', CozyologyMeasurementTool)

export { CozyologyMeasurementTool, MeasurementTool }
