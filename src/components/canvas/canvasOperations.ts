import { addTask, addEvent, addGateway } from "./bpmnElements";
import { addDataObject, addDataStore } from "./bpmnDataElements";

export class CanvasOperations {
  constructor(private canvasComponent: CanvasComponent) {}

  // initializeCanvas(canvasEl: HTMLCanvasElement) {
  //   // Set initial canvas dimensions
  //   this.resizeCanvas(canvasEl);

  //   // Listen to window resize events
  //   window.addEventListener("resize", () => {
  //     this.resizeCanvas(canvasEl);
  //   });
  // }

  // resizeCanvas(canvasEl: HTMLCanvasElement) {
  //   const containerWidth = canvasEl.parentElement?.clientWidth || 800; // Default to 800 if not found
  //   const containerHeight = canvasEl.parentElement?.clientHeight || 600; // Default to 600 if not found

  //   this.canvasComponent?.canvas.setDimensions({
  //     width: containerWidth,
  //     height: containerHeight,
  //   });
  // }

  /**
   * Generic method to add a BPMN element to the canvas.
   * @param {string} elementType - The type of BPMN element to add.
   */
  addElement(event, elementType: string): void {
    let newElement;

    switch (elementType) {
      case "Task":
        newElement = addTask(event);
        break;
      case "Event":
        newElement = addEvent(event);
        break;
      case "Gateway":
        newElement = addGateway(event);
        break;
      case "DataObject":
        newElement = addDataObject(event);
        break;
      case "DataStore":
        newElement = addDataStore(event);
        break;
      default:
        console.error("Invalid element type");
        return;
    }

    this.canvasComponent.postAddShape(newElement);
  }
}
