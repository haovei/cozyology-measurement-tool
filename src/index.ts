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
    // Load external styles if provided
    const styleUrl = this.getAttribute('data-style-url')
    if (styleUrl) {
      this.loadStyles(styleUrl)
    }

    this.root = ReactDOM.createRoot(container)
    this.root.render(React.createElement(MeasurementTool, this.getProps()))
  }

  private loadStyles(styleUrl: string) {
    const shadow = this.shadowRoot
    if (!shadow) return

    // Remove existing style links
    const existingLinks = shadow.querySelectorAll('link[rel="stylesheet"]')
    existingLinks.forEach(link => link.remove())

    // Create and append new style link
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = styleUrl
    shadow.appendChild(link)
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

    // Extract shop-now-url attribute
    const shopNowUrl = this.getAttribute('shop-now-url')
    if (shopNowUrl) {
      props.shopNowUrl = shopNowUrl
    }

    return props
  }

  // Watch for attribute changes
  static get observedAttributes() {
    return ['data-style-url', 'shop-now-url']
  }

  attributeChangedCallback(name: string) {
    if (name === 'data-style-url') {
      const styleUrl = this.getAttribute('data-style-url')
      if (styleUrl) {
        this.loadStyles(styleUrl)
      }
    } else if (name === 'shop-now-url') {
      // Re-render component with new props when shop-now-url changes
      if (this.root && this.shadowRoot) {
        this.root.render(React.createElement(MeasurementTool, this.getProps()))
      }
    }
  }
}

// Register the custom element
customElements.define('cozyology-measurement-tool', CozyologyMeasurementTool)

export { CozyologyMeasurementTool, MeasurementTool }
