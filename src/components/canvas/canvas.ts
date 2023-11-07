import { fabric } from "fabric";
import {
  CanvasState,
  CanvasStateManager,
  CanvasAction,
} from "../../store/state";

import { CanvasEventHandlers } from "./canvasEventHandlers";
import { PropertiesPanelComponent } from "../proprertiesPanel/propertiesPanel";
import "fabric-history";

export class CanvasComponent {
  public canvas: fabric.Canvas;
  public state: CanvasState;
  public stateManager: CanvasStateManager;
  private gridSize: number = 20;

  /**
   * Initializes a new instance of the CanvasComponent class.
   * @param {string} canvasElement - The HTML canvas element.
   */
  constructor(canvasElement: string, instanceStateManager: CanvasStateManager) {
    this.canvas = new fabric.Canvas(canvasElement, {
      backgroundColor: "white",
      selection: true,
      fireRightClick: true, // <-- enable firing of right click events
      fireMiddleClick: true, // <-- enable firing of middle click events
      stopContextMenu: true, // <--  prevent context menu from showing
      stateful: true,
    });

    this.setCanvasSize();
    window.addEventListener("resize", this.setCanvasSize.bind(this));

    this.setGridBackground();

    this.enableSnapToGrid();

    this.addKeyboardListeners();

    this.stateManager = instanceStateManager;

    this.state = {
      elements: [],
      otherFields: {
        versionHistory: [],
      },
    };

    this.canvas.renderAll();
  }

  /**
   * Common logic to execute after adding a shape.
   * @param {fabric.Object} shape - The newly added shape.
   */
  public postAddShape(shape: fabric.Object): void {
    shape.on("selected", (event) => {
      this.handleElementSelected(event.target);
    });

    this.canvas.add(shape);

  }

  public setCanvasSize(): void {
    // Access the shadow root of the 'bpm-app' custom element
    const shadowRoot = document.getElementsByTagName("bpm-app")[0]?.shadowRoot;

    if (!shadowRoot) {
      console.error("Shadow root not found!");
      return;
    }

    this.canvas.setDimensions({
      width: shadowRoot.getElementById("canvasContainer")?.clientWidth,
      height: shadowRoot.getElementById("canvasContainer")?.clientHeight,
    });
    this.setGridBackground();
  }

  /**
   * Sets a repeating grid background image for the canvas.
   */
  public setGridBackground(): void {
    if (this.canvas.width === 0 || this.canvas.height === 0) {
      console.warn("Canvas dimensions are zero. Grid background not set.");
      return;
    }
    const gridSize = this.gridSize;
    const gridCanvas = document.createElement("canvas");
    gridCanvas.width = this.canvas.width;
    gridCanvas.height = this.canvas.height;
    const ctx = gridCanvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "#ebebeb";
      ctx.lineWidth = 1;
      for (let i = 0; i < this.canvas.width; i += gridSize) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, this.canvas.height);
      }
      for (let j = 0; j < this.canvas.height; j += gridSize) {
        ctx.moveTo(0, j);
        ctx.lineTo(this.canvas.width, j);
      }
      ctx.stroke();
    }

    const gridImg = new Image();
    gridImg.src = gridCanvas.toDataURL();

    gridImg.onload = () => {
      this.canvas.setBackgroundImage(
        gridImg.src,
        this.canvas.renderAll.bind(this.canvas),
        {
          width: this.canvas.width, // Set to gridSize
          height: this.canvas.height, // Set to gridSize
          repeat: "repeat",
        }
      );
    };
  }

  /**
   * Enables snap-to-grid functionality.
   */
  private enableSnapToGrid(): void {
    this.canvas.on("object:moving", (options) => {
      options.target.set({
        left: Math.round(options.target.left / this.gridSize) * this.gridSize,
        top: Math.round(options.target.top / this.gridSize) * this.gridSize,
      });
    });
  }

  undo(): void {
    this.stateManager.undo();
    this.canvas.renderAll();
  }

  redo(): void {
    this.stateManager.redo();
    this.canvas.renderAll();
  }

  // Method to update CanvasState
  private handleStateUpdate(
    actionType: string,
    element: fabric.Object,
    from?: any,
    to?: any
  ): void {
    const action: CanvasAction = {
      type: actionType,
      object: element,
      from: from,
      to: to,
    };
    this.stateManager.updateState(action);
  }

  /**
   * Saves the current state of the canvas to localStorage.
   */
  public saveCanvasState() {
    try {
      const canvasJSON = this.canvas.toJSON();
      localStorage.setItem("canvasState", JSON.stringify(canvasJSON));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Loads the saved state of the canvas from localStorage.
   */
  public loadCanvasState() {
    try {
      const savedCanvas = localStorage.getItem("canvasState");
      if (savedCanvas) {
        this.canvas.loadFromJSON(
          JSON.parse(savedCanvas),
          this.canvas.renderAll.bind(this.canvas)
        );
      } else {
        console.warn("No saved canvas state found in localStorage.");
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Enable controls for resizing, rotating, and other interactions.
   * @param object - The selected fabric object.
   * @private
   */
  private enableObjectControls(object: fabric.Object): void {
    object.set({
      hasBorders: true,
      hasControls: true,
      lockMovementX: false,
      lockMovementY: false,
      lockRotation: false,
      lockScalingX: false,
      lockScalingY: false,
      lockUniScaling: false,
      selectable: true,
    });
  }

  private handleElementSelected(element: fabric.Object) {
    // Emit an event or call a callback function here
    // For example:
    this.onElementSelected?.(element);
  }

  /**
   * Adds event listeners to the canvas for handling object interactions.
   * @private
   */
  private addKeyboardListeners(): void {
    // Listen for the 'delete' key to remove the selected object
    document.addEventListener("keydown", (e) => {
      if (e.key === "Delete" && this.canvas.getActiveObject()) {
        this.canvas.remove(this.canvas.getActiveObject());
        this.canvas.renderAll();
      }

      if (e.keyCode === 90) {
        this.canvas.undo();
      }

      // Check pressed button is Y - Ctrl+Y.
      if (e.keyCode === 89) {
        this.canvas.redo();
      }
    });
  }

  /**
   * Zooms in the canvas.
   */
  zoomIn(): void {
    let zoom = this.canvas.getZoom();
    zoom = zoom + 0.1;
    this.canvas.setZoom(zoom);
  }

  /**
   * Zooms out the canvas.
   */
  zoomOut(): void {
    let zoom = this.canvas.getZoom();
    if (zoom > 0.1) {
      zoom = zoom - 0.1;
      this.canvas.setZoom(zoom);
    }
  }

  /**
   * Updates the element on the canvas.
   * @param {fabric.Object} element - The element to update.
   */
  public updateElement(element: fabric.Object): void {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject && activeObject.type === element.type) {
      activeObject.set(element);
      this.canvas.renderAll();
    }
  }

  // Method to move an element
  public moveElement(
    element: fabric.Object,
    newPosition: { x: number; y: number }
  ) {
    const originalPosition = { left: element.left, top: element.top };
    element.set({ left: newPosition.x, top: newPosition.y });
    this.canvas.renderAll();
    this.handleStateUpdate(
      "moveElement",
      element,
      originalPosition,
      newPosition
    );
  }

  // Method to resize an element
  public resizeElement(
    element: fabric.Object,
    newSize: { width: number; height: number }
  ) {
    element.set({ width: newSize.width, height: newSize.height });
    this.canvas.renderAll();
    this.handleStateUpdate("resize", element);
  }

  // Method to delete an element
  public deleteElement(element: fabric.Object) {
    this.canvas.remove(element);
    this.handleStateUpdate("delete", element);
  }
}
