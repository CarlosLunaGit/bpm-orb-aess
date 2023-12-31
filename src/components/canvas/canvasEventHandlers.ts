// src/components/canvas/canvasEventHandlers.ts

import { fabric } from "fabric";
import { CanvasStateManager, CanvasAction } from "../../store/state";

/**
 * Handles canvas-specific events and updates the state accordingly.
 */
export class CanvasEventHandlers {
  public canvas: fabric.Canvas;
  private stateManager: CanvasStateManager;
  public canvasComponent: fabric.Canvas; // Add a setter for the canvas component
  
  private lastPosX: number;
  private lastPosY: number;

  constructor(
    canvasComponent: fabric.Canvas,
    stateManager: CanvasStateManager
  ) {
    this.canvas = canvasComponent.canvas;
    this.stateManager = stateManager;
    this.canvasComponent = canvasComponent;
  }

  public initialize(): void {
    this.addCanvasEventListeners();
  }

  private addCanvasEventListeners(): void {
    //object:moving while an object is being dragged
    this.canvas.on("object:moving", (event) => {
      //   this.saveState();
    });

    this.canvas.on("object:added", (event) => {
      if (!this.stateManager.isUndoRedoOperation) {
        this.handleObjectAdded(event);
      }
    });

    this.canvas.on("object:removed", (event) => {
      if (!this.stateManager.isUndoRedoOperation) {
        this.handleObjectRemoved(event);
      }
    });

    //object:modified at the end of a transform or any change when statefull is true
    this.canvas.on("object:modified", (event) => {
      if (!this.stateManager.isUndoRedoOperation) {
        this.handleObjectMoved(event)
      }
    });

    // Context menu event listener
    this.canvas.on("mouse:down", (options) => {
      if (options.e?.button === 2) {
        // Right-click
        options.e.preventDefault(); // Prevent the default right-click context menu
        options.e.stopPropagation(); // Stop the event from bubbling up
        // Show context menu and get selected action
        this.handleContextMenu(options.e.clientX, options.e.clientY);
      }
    });

     // Add panning event listeners
     this.canvas.on('mouse:down', (opt) => {
      if (this.canvasComponent.isPanning && opt.e) {
        this.canvas.isDragging = true;
        this.lastPosX = opt.e.clientX;
        this.lastPosY = opt.e.clientY;
      }
    });

    this.canvas.on('mouse:move', (opt) => {
      if (this.canvas.isDragging && opt.e) {
        const e = opt.e;
        const vpt = this.canvas.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.canvas.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });

    this.canvas.on('mouse:up', () => {
      this.canvas.isDragging = false;
    });

  }

  private handleObjectAdded(event: fabric.IEvent): void {
    // Handle object added event
    const object = event.target;
    if (object) {
      const action: CanvasAction = {
        type: "add",
        object: object,
        from: { left: object.left, top: object.top },
        to: { left: object.left, top: object.top },
      };
      this.stateManager.updateState(action);
    }
  }

  private handleObjectRemoved(event: fabric.IEvent): void {
    // Handle object added event
    const object = event.target;
    if (object) {
      const action: CanvasAction = {
        type: "remove",
        object: object,
        from: { left: object.left, top: object.top },
        to: { left: object.left, top: object.top },
      };
      this.stateManager.updateState(action);
    }
  }

  private handleObjectMoved(event: fabric.IEvent): void {
    // Handle object moved event
    const object = event.target;
    if (object) {
      const action: CanvasAction = {
        type: "move",
        object: object,
        from: {
          left: object._stateProperties.left,
          top: object._stateProperties.top,
        },
        to: { left: object.left, top: object.top },
      };
      this.stateManager.updateState(action);
    }
  }

  private handleContextMenu(x: number, y: number): string {
    // Remove any existing context menu
    const existingMenu = document.getElementById("customContextMenu");
    if (existingMenu) {
      document.body.removeChild(existingMenu);
    }

    // Create the context menu element
    const contextMenu = document.createElement("div");
    contextMenu.id = "customContextMenu";
    contextMenu.style.position = "absolute";
    contextMenu.style.left = `${x + 10}px`;
    contextMenu.style.top = `${y + 10}px`;
    contextMenu.style.zIndex = "9999";
    contextMenu.innerHTML = `
    <div class="context-menu-item">
      <ul style="list-style-type:none; margin:0; padding:0;">
        <li style="padding:8px; cursor:pointer;" id="move">Move</li>
        <li style="padding:8px; cursor:pointer;" id="resize">Resize</li>
        <li style="padding:8px; cursor:pointer;" id="delete">Delete</li>
      </ul>
    </div>
    `;

    // Append to body
    document.body.appendChild(contextMenu);

    // Listen for menu item clicks
    contextMenu.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const selectedAction = target.id;
      document.body.removeChild(contextMenu);

      // Trigger the corresponding action
      const activeElement = this.canvas.getActiveObject();
      if (selectedAction === "move") {
        this.canvasComponent.moveElement(activeElement, { x: 100, y: 100 });
      } else if (selectedAction === "resize") {
        this.canvasComponent.resizeElement(activeElement, {
          width: 50,
          height: 50,
        });
      } else if (selectedAction === "delete") {
        this.canvasComponent.deleteElement(activeElement);
      }
    });

    // Remove the context menu if clicked outside
    document.addEventListener("click", () => {
      if (document.body.contains(contextMenu)) {
        document.body.removeChild(contextMenu);
      }
    });
  }
}
