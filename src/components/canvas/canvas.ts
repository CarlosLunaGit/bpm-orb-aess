import { fabric } from "fabric";
import { PropertiesPanelComponent } from "../proprertiesPanel/propertiesPanel";
import "fabric-history";
import { CanvasState } from "../../store/state";

fabric.Task = fabric.util.createClass(fabric.Rect, {
  type: "Task",

  initialize: function (options) {
    options = options || {};
    this.callSuper("initialize", options);
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      // any additional properties you want to include when converting to JSON
    });
  },

  _render: function (ctx) {
    this.callSuper("_render", ctx);
  },
});

fabric.Task.fromObject = function (object, callback) {
  return fabric.Object._fromObject("Task", object, callback);
};

fabric.Gateway = fabric.util.createClass(fabric.Path, {
  type: "Gateway",

  initialize: function (pathData, options) {
    options = options || {};
    this.callSuper("initialize", pathData, options);
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      // any additional properties you want to include when converting to JSON
    });
  },

  _render: function (ctx) {
    this.callSuper("_render", ctx);
  },
});

fabric.Gateway.fromObject = function (object, callback) {
  return fabric.Object._fromObject("Gateway", object, callback);
};

fabric.Event = fabric.util.createClass(fabric.Circle, {
  Event: "Event",

  initialize: function (options) {
    options = options || {};
    this.callSuper("initialize", options);
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      // any additional properties you want to include when converting to JSON
    });
  },

  _render: function (ctx) {
    this.callSuper("_render", ctx);
  },
});

fabric.Event.fromObject = function (object, callback) {
  return fabric.Object._fromObject("Event", object, callback);
};

export class CanvasComponent {
  public canvas: fabric.Canvas;
  private gridSize: number = 20; // Define the size of each grid square
  public propertiesPanel?: PropertiesPanelComponent;
  public state: CanvasState;
  private undoStack: any[] = [];
  private redoStack: any[] = [];

  /**
   * Initializes a new instance of the CanvasComponent class.
   * @param {string} canvasId - The ID of the HTML canvas element.
   */
  constructor(canvasId: string, propertiesPanel: PropertiesPanelComponent) {
    this.propertiesPanel = propertiesPanel;

    this.canvas = new fabric.Canvas(canvasId);
    this.state = {
      elements: [],
      otherFields: {},
      // Initialize other state properties
    };

    this.setCanvasSize();
    this.canvas.setBackgroundColor(
      "white",
      this.canvas.renderAll.bind(this.canvas)
    );

    this.canvas.renderAll();

    // Listen to window resize events
    window.addEventListener("resize", this.setCanvasSize.bind(this));

    this.setGridBackground();

    // this.canvas.renderAll()
    this.enableSnapToGrid();

    // Call the addEventListeners method here
    this.addEventListeners();

    // Initial save state
    // this.saveState();
  }

  private setCanvasSize(): void {
    // Access the shadow root of the 'bpm-app' custom element
    const shadowRoot = document.getElementsByTagName("bpm-app")[0]?.shadowRoot;

    if (!shadowRoot) {
      console.error("Shadow root not found!");
      return;
    }

    // Get the widths of the sidebar and properties panel inside the Shadow DOM
    const sidebarWidth = shadowRoot.getElementById("sidebar")?.clientWidth || 0;
    const propertiesPanelHeight =
      shadowRoot.getElementById("propertiesFormElement")?.clientHeight || 0;

    // Calculate the available width and height for the canvas
    const containerWidth =
      (window.innerWidth > 0 ? window.innerWidth : screen.width) - sidebarWidth;
    const containerHeight =
      window.innerHeight > 0
        ? window.innerHeight
        : screen.height - propertiesPanelHeight; // Adjust this if you have horizontal elements

    this.canvas.setDimensions({
      width: containerWidth,
      height: containerHeight,
    });
    this.setGridBackground();
  }

  /**
   * Adds a BPMN Task shape to the canvas.
   */
  addTask(): void {
    const fotask = new fabric.Task({
      left: 100,
      top: 100,
      fill: "white",
      stroke: "black",
      width: 120,
      height: 80,
      rx: 10,
      ry: 10,
      type: "Task",
    });

    fotask.on("selected", (event) => {
      this.propertiesPanel?.setSelectedElement(event.target);
    });

    this.canvas.add(fotask);
    this.setState({ elements: [...this.state.elements, fotask] });
    this.undoStack.push({ action: "addElement", element: fotask });
    this.redoStack = [];
  }

  /**
   * Adds a BPMN Event shape to the canvas.
   */
  addEvent(): void {
    const foevent = new fabric.Event({
      left: 250,
      top: 250,
      fill: "white",
      stroke: "black",
      radius: 30,
      type: "Event",
    });

    foevent.on("selected", (event) => {
      this.propertiesPanel?.setSelectedElement(event.target);
    });

    this.canvas.add(foevent);
    this.setState({ elements: [...this.state.elements, foevent] });
    this.undoStack.push({ action: "addElement", element: foevent });
    this.redoStack = [];
  }

  /**
   * Adds a BPMN Gateway shape to the canvas.
   */
  addGateway(): void {
    const fogateway = new fabric.Gateway("M 0 30 L 30 60 L 60 30 L 30 0 z", {
      left: 400,
      top: 400,
      fill: "white",
      stroke: "black",
      type: "Gateway",
    });

    fogateway.on("selected", (event) => {
      this.propertiesPanel?.setSelectedElement(event.target);
    });

    this.canvas.add(fogateway);
    this.setState({ elements: [...this.state.elements, fogateway] });
    this.undoStack.push({ action: "addElement", element: fogateway });
    this.redoStack = [];
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

  /**
   * Adds event listeners to the canvas for handling object interactions.
   * @private
   */
  private addEventListeners(): void {
    this.canvas.on("object:moving", (event) => {
      console.log("Object selected moving triggered");
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

    this.canvas.on("object:selected", (event) => {
      console.log("Object selected event triggered");
      // Handle object selection
      this.enableObjectControls(event.target);
      this.propertiesPanel?.setSelectedElement(event.target);
    });

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

  undo(): void {
    const lastAction = this.undoStack.pop();
    if (lastAction?.action === "addElement") {
      this.canvas.remove(lastAction.element);
      this.setState({
        elements: this.state.elements.filter((el) => el !== lastAction.element),
      });
      this.redoStack.push(lastAction);
    } else {
      // Handle other redo actions
      // Update this.state.otherFields accordingly
    }
    // Handle other undo actions
  }

  redo(): void {
    const lastAction = this.redoStack.pop();
    if (lastAction?.action === "addElement") {
      this.canvas.add(lastAction.element);
      this.setState({ elements: [...this.state.elements, lastAction.element] });
      this.undoStack.push(lastAction);
    } else {
      // Handle other redo actions
      // Update this.state.otherFields accordingly
    }
    // Handle other redo actions
  }

  // Helper method to update state
  setState(newState: Partial<CanvasState>) {
    this.state = { ...this.state, ...newState };
  }

  /**
   * Saves the current state of the canvas to localStorage.
   */
  saveCanvasState() {
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
  loadCanvasState() {
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

  public updateElement(element: any): void {
    // Logic to update the element on the canvas
    this.canvas.renderAll();
  }
}
