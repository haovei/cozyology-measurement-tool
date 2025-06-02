import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MeasurementTool from './components/MeasurementTool'

// Web Component wrapper for React component
class CozyologyMeasurementTool extends HTMLElement {
  private root: ReactDOM.Root | null = null

  connectedCallback() {
    // Create shadow DOM for encapsulation
    const shadow = this.attachShadow({ mode: 'open' })

    // Create container for React app
    const container = document.createElement('div')
    shadow.appendChild(container)

    // Mount React component
    this.mountComponent(container)
  }

  private mountComponent(container: HTMLElement) {
    this.root = ReactDOM.createRoot(container)
    this.root.render(React.createElement(MeasurementTool, this.getProps()))
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
