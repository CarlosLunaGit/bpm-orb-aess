import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CanvasComponent } from './components/canvas/canvas';
import { SidebarComponent } from './components/sidebar/sidebar';


@customElement('bpm-app')
export class BPMApp extends LitElement {
  private canvasComponent?: CanvasComponent;

  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete; // Wait for the component to render

    const canvasEl = this.shadowRoot?.querySelector('#processCanvas');
    if (canvasEl) {
        this.canvasComponent = new CanvasComponent(canvasEl as HTMLCanvasElement);
        new SidebarComponent(this.canvasComponent, this.shadowRoot);
    }
}


  /**
   * Add a rectangle shape to the canvas.
   */
  addRectangleToCanvas() {
    this.canvasComponent?.addRectangle();
  }

  /**
   * Add a circle shape to the canvas.
   */
  addCircleToCanvas() {
    this.canvasComponent?.addCircle();
  }

  render() {
    return html`
      <div id="sidebar">
        <div id="task" draggable="true">Task</div>
        <div id="event" draggable="true">Event</div>
        <div id="gateway" draggable="true">Gateway</div>
      </div>

      <div id="canvasContainer">
        <canvas id="processCanvas" width="800" height="600"></canvas>

      </div>
      <form id="propertiesForm"></form>
      <button @click=${this.addRectangleToCanvas}>Add Rectangle</button>
      <button @click=${this.addCircleToCanvas}>Add Circle</button>
    `;
  }

  static styles = css`
    :host {
      display: block;
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    #canvasContainer {
      width: 800px;
      height: 600px;
      border: 1px solid #ccc;
      margin: 20px auto;
    }

    button {
      margin-top: 1rem;
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      color: #fff;
      cursor: pointer;
      transition: border-color 0.25s;
    }

    button:hover {
      border-color: #646cff;
    }

    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'bpm-app': BPMApp;
  }
}
