import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { bpmAppTemplate } from "../src/templates/bpm-app-template";
import { bpmAppStyles } from "../src/templates/bpm-app-styles";
import { CanvasStateManager, CanvasState } from "./store/state";
import { PropertiesPanelComponent } from "./components/proprertiesPanel/propertiesPanel";
import { CanvasEventHandlers } from "../src/components/canvas/canvasEventHandlers";
import { CanvasComponent } from "./components/canvas/canvas";
import { SidebarComponent } from "./components/sidebar/sidebar";
import { CanvasOperations } from "./components/canvas/canvasOperations";
import { EventHandlers } from "./events/eventHandlers";

import { fabric } from "fabric";

@customElement("bpm-app")
export class BPMApp extends LitElement {
  private fabricCanvas?: fabric.Canvas;
  public canvasComponent: any;
  public canvasOperations: CanvasOperations;
  public eventHandlers: EventHandlers;

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;

    const canvasEl = this.shadowRoot?.getElementById(
      "processCanvas"
    ) as HTMLCanvasElement;
    if (canvasEl) {
      this.initializeFabricCanvas(canvasEl);
    }
  }

  initializeFabricCanvas(canvasEl: HTMLCanvasElement) {
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
      canvasEl, // Assuming canvasEl.id is the ID of the canvas element
      stateManager
    );

    // Bind the canvasComponent to the propertiesPanel and canvasEventHandlers
    propertiesPanel.bindToCanvas(this.canvasComponent);
    canvasEventHandlers.setCanvasComponentInstance(this.canvasComponent);

    this.canvasOperations = new CanvasOperations(this.canvasComponent);
    // After initializing CanvasOperations and SidebarComponent
    const sidebarComponent = new SidebarComponent(this.shadowRoot);
    sidebarComponent.bindToCanvasOperations(this.canvasOperations);

    // this.canvasOperations = new CanvasOperations(this.canvasComponent);
    // this.canvasOperations.initializeCanvas(canvasEl as HTMLCanvasElement);

    this.eventHandlers = new EventHandlers(
      this.canvasComponent,
      this.shadowRoot
    );
    this.eventHandlers.attachEventHandlers();
  }

  render() {
    return bpmAppTemplate({});
  }

  static styles = [bpmAppStyles];
}

declare global {
  interface HTMLElementTagNameMap {
    "bpm-app": BPMApp;
  }
}
