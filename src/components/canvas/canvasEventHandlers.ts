// src/components/canvas/canvasEventHandlers.ts

// import { fabric } from "fabric";
import { CanvasStateManager, CanvasAction } from '../../store/state';

/**
 * Handles canvas-specific events and updates the state accordingly.
 */
export class CanvasEventHandlers {
  private stateManager: CanvasStateManager;

  constructor(stateManager: CanvasStateManager) {
    this.stateManager = stateManager;
  }

  public bindToCanvas(canvasComponent: CanvasComponent) {
    canvasComponent.onEventActive = this.setSelectedElement.bind(this);
  }

  private initialize(): void {
    this.addCanvasEventListeners();
  }

  private addCanvasEventListeners(): void {
    this.canvas.on("object:moving", (event) => {
      // Handle object moving
    });

    // Updated event listeners for undo/redo
    this.canvas.on("object:added", () => {
      //   this.saveState();
    });

    this.canvas.on("object:removed", () => {
      //   this.saveState();
    });

    this.canvas.on("object:modified", () => {
      //   this.saveState();
    });

    // Add all canvas event listeners here
    this.canvas.on("object:moved", this.handleObjectMoved.bind(this));
    
    this.canvas.on("object:selected", (event) => {

      });

    // Context menu event listener
    this.canvas.on("mouse:down", (options) => {
        if (options.e?.button === 3) {
          // Right-click
          options.e.preventDefault(); // Prevent the default right-click context menu
          options.e.stopPropagation(); // Stop the event from bubbling up
          // Show context menu and get selected action
          this.handleContextMenu(options.e.clientX, options.e.clientY);
        }
      });
    
  }

  private handleObjectMoved(event: fabric.IEvent): void {
    // Handle object moved event
    const object = event.target;
    if (object) {
      const action: CanvasAction = {
        type: 'move',
        object: object,
        from: { left: object.originalState.left, top: object.originalState.top },
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
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
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
    contextMenu.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const selectedAction = target.id;
      document.body.removeChild(contextMenu);

      // Trigger the corresponding action
      const activeElement = this.canvas.getActiveObject();
      if (selectedAction === 'move') {
        this.moveElement(activeElement, { x: 100, y: 100 });
      } else if (selectedAction === 'resize') {
        this.resizeElement(activeElement, { width: 50, height: 50 });
      } else if (selectedAction === 'delete') {
        this.deleteElement(activeElement);
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
