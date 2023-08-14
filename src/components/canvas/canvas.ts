import { fabric } from "fabric";
import { PropertiesPanelComponent } from "../proprertiesPanel/propertiesPanel";
import 'fabric-history';

fabric.Task = fabric.util.createClass(fabric.Rect, {
    type: 'Task',
  
    initialize: function(options) {
      options = options || {};
      this.callSuper('initialize', options);
    },
  
    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        // any additional properties you want to include when converting to JSON
      });
    },
  
    _render: function(ctx) {
      this.callSuper('_render', ctx);
    }
  });
  
  fabric.Task.fromObject = function(object, callback) {
    return fabric.Object._fromObject('Task', object, callback);
  };

  fabric.Gateway = fabric.util.createClass(fabric.Path, {
    type: 'Gateway',
  
    initialize: function(pathData, options) {
      options = options || {};
      this.callSuper('initialize', pathData, options);
    },
  
    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        // any additional properties you want to include when converting to JSON
      });
    },
  
    _render: function(ctx) {
      this.callSuper('_render', ctx);
    }
});

fabric.Gateway.fromObject = function(object, callback) {
    return fabric.Object._fromObject('Gateway', object, callback);
};


  fabric.Event = fabric.util.createClass(fabric.Circle, {
    Event: 'Event',
  
    initialize: function(options) {
      options = options || {};
      this.callSuper('initialize', options);
    },
  
    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        // any additional properties you want to include when converting to JSON
      });
    },
  
    _render: function(ctx) {
      this.callSuper('_render', ctx);
    }
  });
  
  fabric.Event.fromObject = function(object, callback) {
    return fabric.Object._fromObject('Event', object, callback);
  };
  


export class CanvasComponent {
  public canvas: fabric.Canvas;
  private gridSize: number = 20; // Define the size of each grid square
  public propertiesPanel?: PropertiesPanelComponent;

//   public state: string[] = [];
//   public mods: number = 0;

//   private isUndoRedoOperation: boolean = false;
  /**
   * Initializes a new instance of the CanvasComponent class.
   * @param {string} canvasId - The ID of the HTML canvas element.
   */
  constructor(canvasId: string, propertiesPanel: PropertiesPanelComponent) {
    this.propertiesPanel = propertiesPanel;

    this.canvas = new fabric.Canvas(canvasId);
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

    const task = new fabric.Task({
        left: 100,
      top: 100,
      fill: "white",
      stroke: "black",
      width: 120,
      height: 80,
      rx: 10, // Rounded corners
      ry: 10,
      type: "Task",
      });

    task.on("selected", (event) => {
      console.log("Object selected task triggered");
      this.propertiesPanel?.setSelectedElement(event.target);
    });

    this.canvas.add(task);
  }

  /**
   * Adds a BPMN Event shape to the canvas.
   */
  addEvent(): void {
    const Event = new fabric.Event({
      left: 250,
      top: 250,
      fill: "white",
      stroke: "black",
      radius: 30,
      type: "Event",
    });
  
    Event.on("selected", (event) => {
      console.log("Object selected Event triggered");
      this.propertiesPanel?.setSelectedElement(event.target);
    });

    this.canvas.add(Event);
  }

  /**
 * Adds a BPMN Gateway shape to the canvas.
 */
addGateway(): void {
    const Gateway = new fabric.Gateway("M 0 30 L 30 60 L 60 30 L 30 0 z", {
      left: 400,
      top: 400,
      fill: "white",
      stroke: "black",
      type: "Gateway",
    });

    Gateway.on("selected", (event) => {
      console.log("Object selected Gateway triggered");
      this.propertiesPanel?.setSelectedElement(event.target);
    });

    this.canvas.add(Gateway);
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
    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = this.canvas.width;
    gridCanvas.height = this.canvas.height;
    const ctx = gridCanvas.getContext('2d');
    if (ctx) {
        ctx.strokeStyle = '#ebebeb';
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
      this.canvas.setBackgroundImage(gridImg.src, this.canvas.renderAll.bind(this.canvas), {
        width: this.canvas.width,  // Set to gridSize
        height: this.canvas.height, // Set to gridSize
        repeat: 'repeat',
      });
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
        this.canvas.undo()
      }
  
      // Check pressed button is Y - Ctrl+Y.
      if (e.keyCode === 89) {
          this.canvas.redo()
      }
    });
  }

//   saveState(): void {
//     let myjson = JSON.stringify(this.canvas);
//     this.state.push(myjson);
// }


// undo(): void {
//     this.canvas.off('object:added', this.saveState);
//     this.canvas.off('object:modified', this.saveState);
//     if (this.mods < this.state.length) {
//         this.canvas.clear().renderAll();
//         this.canvas.loadFromJSON(this.state[this.state.length - 1 - this.mods - 1], () => {
//             this.canvas.renderAll();
//         });
//         this.canvas.on('object:added', this.saveState);
//         this.canvas.on('object:modified', this.saveState);
//         console.log("state " + this.state.length);
//         this.mods += 1;
//         console.log("mods " + this.mods);
//     }
// }

// redo(): void {
//     this.canvas.off('object:added', this.saveState);
//     this.canvas.off('object:modified', this.saveState);
//     if (this.mods > 0) {
//         this.canvas.clear().renderAll();
//         this.canvas.loadFromJSON(this.state[this.state.length - 1 - this.mods + 1], () => {
//             this.canvas.renderAll();
//         });
//         this.canvas.on('object:added', this.saveState);
//         this.canvas.on('object:modified', this.saveState);
//         this.mods -= 1;
//         console.log("state " + this.state.length);
//         console.log("mods " + this.mods);
//     }
// }

undo(): void {
    this.canvas.undo();
    this.setGridBackground();
}

redo(): void {
    this.canvas.redo();
    this.setGridBackground();
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
