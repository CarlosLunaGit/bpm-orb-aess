import { addTask, addEvent, addGateway } from "./bpmnElements";
import { addDataObject, addDataStore } from "./bpmnDataElements";

export class CanvasOperations {
  constructor(private canvasComponent: CanvasComponent) {}

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

  undo(): void {
    this.canvasComponent.undo();
  }

  redo(): void {
    this.canvasComponent.redo();
  }
  
  zoomIn(): void {
    this.canvasComponent.zoomIn();
  }

  zoomOut(): void {
    this.canvasComponent.zoomOut();
  }

  togglePanning(): void {
    this.canvasComponent.togglePanning();
  }
}
