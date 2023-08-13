import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CanvasComponent } from "./components/canvas/canvas";
import { SidebarComponent } from "./components/sidebar/sidebar";
import { PropertiesPanelComponent } from "./components/proprertiesPanel/propertiesPanel";

import { library, dom, icon } from "@fortawesome/fontawesome-svg-core";
import {
  faUndo,
  faRedo,
  faRectangleList,
  faCircle,
  faDiamond,
  faDotCircle,
  faBell,
  faCodeBranch,
} from "@fortawesome/free-solid-svg-icons";

// Add icons to the library for convenience
library.add(faUndo, faRedo);
dom.watch();

const undoIcon = icon(faUndo).html;
const redoIcon = icon(faRedo).html;
const taskIcon = icon(faRectangleList).html;
const eventIcon = icon(faDotCircle).html;
const gatewayIcon = icon(faDiamond).html;

@customElement("bpm-app")
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
        this.canvasComponent = new CanvasComponent(canvasEl as HTMLCanvasElement, null); // Temporarily pass null
        const propertiesPanel = new PropertiesPanelComponent(this.canvasComponent, this.shadowRoot, 'propertiesForm');
        this.canvasComponent.propertiesPanel = propertiesPanel; // Assign the propertiesPanel to canvasComponent
        new SidebarComponent(this.canvasComponent, this.shadowRoot);

        // Set initial canvas dimensions
        this.resizeCanvas(canvasEl as HTMLCanvasElement);

        // Listen to window resize events
        window.addEventListener('resize', () => {
            this.resizeCanvas(canvasEl as HTMLCanvasElement);
        });
    }
}

resizeCanvas(canvasEl: HTMLCanvasElement) {
    const containerWidth = canvasEl.parentElement?.clientWidth || 800; // Default to 800 if not found
    const containerHeight = canvasEl.parentElement?.clientHeight || 600; // Default to 600 if not found

    this.canvasComponent?.canvas.setDimensions({ width: containerWidth, height: containerHeight });
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
    <div id="propertiesForm">
    <form >
        <label>Name: <input type="text" name="name" value=''></label>
        <label>Description: <textarea name="description"></textarea></label>
      </form>
    </div>
      

      <div id="sidebar">
        <!-- BPMN Shapes -->
        <div
          id="task"
          draggable="true"
          .innerHTML=${taskIcon}
          title="Task"
        ></div>
        <div
          id="event"
          draggable="true"
          .innerHTML=${eventIcon}
          title="Event"
        ></div>
        <div
          id="gateway"
          draggable="true"
          .innerHTML=${gatewayIcon}
          title="Gateway"
        ></div>

        <!-- Toolbar Icons -->
        <div .innerHTML=${undoIcon} title="Undo"></div>
        <div .innerHTML=${redoIcon} title="Redo"></div>
        <!-- Add other icons for different actions here -->
      </div>

      <div id="canvasContainer">
        <canvas id="processCanvas"></canvas>
      </div>
    `;
}

  

  static styles = css`
  :host {
    display: grid;
    grid-template-areas: 
      "empty properties"
      "sidebar canvas";
      
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr auto;

    max-width: 100vw; /* Ensure it takes the full viewport width */
    width: 100%;
    height: 100%;
    margin: 0 auto;
  
  }

  #propertiesForm {
    grid-area: properties;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: max-content;
  }

  #sidebar {
    width: max-content;
    grid-area: sidebar;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  #canvasContainer {
    grid-area: canvas;
  }




    #sidebar div {
      width: 24px;
      height: 24px;
      margin: 5px;
      display: inline-block;
    }

    #sidebar svg {
      width: 100%;
      height: 100%;
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "bpm-app": BPMApp;
  }
}
