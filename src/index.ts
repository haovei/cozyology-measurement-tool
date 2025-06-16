import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MeasurementTool from './components/MeasurementTool'

// 将 stepConfig 设为全局变量
declare global {
  interface Window {
    CozyologyMeasurementConfig: any
  }
}

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
    // Load Tailwind CSS first
    this.loadTailwindStyles()

    // Load external styles if provided
    const styleUrl = this.getAttribute('data-style-url')
    if (styleUrl) {
      this.loadStyles(styleUrl)
    }

    this.root = ReactDOM.createRoot(container)
    this.root.render(React.createElement(MeasurementTool, this.getProps()))
  }

  private loadTailwindStyles() {
    const shadow = this.shadowRoot
    if (!shadow) return

    const style = document.createElement('style')
    style.textContent = `
      :host {
        --tw-border-style: solid;
        --tw-leading: initial;
        --tw-font-weight: initial;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-color: initial;
        --tw-shadow-alpha: 100%;
        --tw-inset-shadow: 0 0 #0000;
        --tw-inset-shadow-color: initial;
        --tw-inset-shadow-alpha: 100%;
        --tw-ring-color: initial;
        --tw-ring-shadow: 0 0 #0000;
        --tw-inset-ring-color: initial;
        --tw-inset-ring-shadow: 0 0 #0000;
        --tw-ring-inset: initial;
        --tw-ring-offset-width: 0px;
        --tw-ring-offset-color: #fff;
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-duration: initial;
      }
    `
    shadow.appendChild(style)
  }

  private loadStyles(styleUrl: string) {
    const shadow = this.shadowRoot
    if (!shadow) return

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
    const props: any = {
      stepConfig: window.CozyologyMeasurementConfig || {}, // 优先使用全局配置
    }

    // Extract shop-now-url attribute
    const shopNowUrl = this.getAttribute('shop-now-url')
    if (shopNowUrl) {
      props.shopNowUrl = shopNowUrl
    }

    return props
  }

  // Watch for attribute changes
  static get observedAttributes() {
    return ['shop-now-url']
  }

  attributeChangedCallback(name: string) {
    if (name === 'shop-now-url') {
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
