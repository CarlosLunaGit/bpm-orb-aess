import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CanvasStateManager, CanvasState } from "./store/state";
import { CanvasComponent } from "./components/canvas/canvas";
import { SidebarComponent } from "./components/sidebar/sidebar";
import { PropertiesPanelComponent } from "./components/proprertiesPanel/propertiesPanel";
import { CanvasEventHandlers } from "../src/components/canvas/canvasEventHandlers";
import { CanvasOperations } from "./components/canvas/canvasOperations";
import { EventHandlers } from "./events/eventHandlers";

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
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

// Add icons to the library for convenience
library.add(faUndo, faRedo);
dom.watch();

const undoIcon = icon(faUndo).html;
const redoIcon = icon(faRedo).html;
const saveIcon = icon(faDownload).html;
const loadIcon = icon(faUpload).html;
const taskIcon = icon(faRectangleList).html;
const eventIcon = icon(faDotCircle).html;
const gatewayIcon = icon(faDiamond).html;

@customElement("bpm-app")
export class BPMApp extends LitElement {
  private canvasComponent?: CanvasComponent;
  private canvasOperations: CanvasOperations;
  private eventHandlers: EventHandlers;

  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete; // Wait for the component to render

    const canvasEl = this.shadowRoot?.querySelector("#processCanvas");
    if (canvasEl) {
      // Initialize the state manager with the initial state
      const initialState: CanvasState = {
        elements: [],
        otherFields: {
          versionHistory: [],
          // ... other initial state fields
        },
      };
      const stateManager = new CanvasStateManager(initialState);

      // Initialize propertiesPanel with null for canvasComponent
      const propertiesPanel = new PropertiesPanelComponent(
        this.shadowRoot,
        "propertiesFormElement"
      );

      // Initialize canvasEventHandlers with a setter for the canvasComponent
      const canvasEventHandlers = new CanvasEventHandlers(
        canvasEl as HTMLCanvasElement,
        stateManager,
        (canvasComponent) => {
          this.canvasComponent = canvasComponent;
        }
      );

      // Now create the canvasComponent with all required dependencies
      this.canvasComponent = new CanvasComponent(
        canvasEl.id, // Assuming canvasEl.id is the ID of the canvas element
        stateManager
      );

      // Bind the canvasComponent to the propertiesPanel and canvasEventHandlers
      propertiesPanel.bindToCanvas(this.canvasComponent);
      canvasEventHandlers.setCanvasComponentInstance(this.canvasComponent);

      // Initialize the sidebar component

      new SidebarComponent(this.canvasComponent, this.shadowRoot);

      this.canvasOperations = new CanvasOperations(this.canvasComponent);
      this.canvasOperations.initializeCanvas(canvasEl as HTMLCanvasElement);

      this.eventHandlers = new EventHandlers(
        this.canvasComponent,
        this.shadowRoot
      );
      this.eventHandlers.attachEventHandlers();
    }
  }

  render() {
    return html`
      <div id="propertiesForm">
        <form id="propertiesFormElement" class="editor">
          Editor
          <div class="form-floating editor-item">
            <textarea
              name="bpmnType"
              class="form-control"
              id="bpmnType"
            ></textarea>
            <label class="__label" for="bpmnType">BPMN Type</label>
          </div>
          <div class="form-floating editor-item">
            <input
              type="text"
              name="name"
              value=""
              class="form-control"
              id="inputName"
            />
            <label class="__label" for="inputName">Name</label>
          </div>
          <div class="form-floating editor-item">
            <textarea
              name="description"
              class="form-control"
              id="inputDescription"
            ></textarea>
            <label class="__label" for="inputDescription">Description</label>
          </div>
          <div class="form-floating editor-item">
            <textarea
              name="Integration"
              class="form-control"
              id="inputIntegration"
            ></textarea>
            <label class="__label" for="inputIntegration">Integration</label>
          </div>
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
        <div id="undoIconId" .innerHTML=${undoIcon} title="Undo"></div>
        <div id="redoIconId" .innerHTML=${redoIcon} title="Redo"></div>
        <div id="saveIconId" .innerHTML=${saveIcon} title="Save/Download"></div>
        <div id="loadIconId" .innerHTML=${loadIcon} title="Load/Open"></div>
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
    }

    #propertiesFormElement {
      display: flex;
      flex-flow: wrap;
      gap: 1rem;
      width: max-content;
      place-content: center;
      align-items: center;
      font-family: monospace;
    }

    #sidebar {
      width: max-content;
      grid-area: sidebar;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    #sidebar > div {
      cursor: pointer;
    }

    #canvasContainer {
      grid-area: canvas;
    }

    .form-floating {
      position: relative;
      padding-top: 0.25rem;
      padding-right: 0px;
      padding-bottom: 0.25rem;
      padding-left: 0px;
      display: flex;
    }

    .form-floating > .form-control,
    .form-floating > .form-select {
      height: 15px;
      color: slategrey;
      padding-top: 0.95rem;
      padding-right: 0.75rem;
      padding-bottom: 0.25rem;
      padding-left: 0.75rem;
      border-radius: 0.25rem;
      background-color: var(--bs-input-bg, #fff);
      border: 1px solid var(--bs-input-border-color, #ced4da);
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .form-floating > label {
      position: absolute;
      top: 0;
      height: 100%;
      padding-right: 0.75rem;

      padding-left: 0.75rem;
      pointer-events: none;
      border: 1px solid transparent;
      transform-origin: 0 0;
      transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
      transform: translate(0, 1.5rem) scale(0.75);
    }

    .form-floating > .form-control:focus ~ label,
    .form-floating > .form-control:not(:placeholder-shown) ~ label,
    .form-floating > .form-select:focus ~ label {
      opacity: 0.65;
      transform: translate(0, 0.5rem) scale(0.75);
    }

    .__label {
      font-family: "Volvo Novum";
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: #575757;
      text-align: left;
      line-height: 12px;
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
      border-radius: 8px;
      border: 1px solid #656565;
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

    .editor .editor-item:first-child {
      border-left: 1px solid #646464;
      margin-left: 0.7vw !important;
      padding-left: 0.7vw !important;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "bpm-app": BPMApp;
  }
}
