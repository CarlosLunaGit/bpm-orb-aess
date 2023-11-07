// src/store/state.ts

export interface CanvasState {
  elements: any[]; // This should ideally be typed more specifically
  otherFields: {
    versionHistory: any[]; // This should also be typed more specifically
    // Add more properties as needed
  };
}

// Define the type for actions that can be recorded in the state
export type CanvasAction = {
  type: string;
  object: fabric.Object;
  from?: any;
  to?: any;
};

/**
 * Manages the state of the canvas, including undo/redo history and other actions.
 */
export class CanvasStateManager {
  private state: CanvasState;
  private undoStack: CanvasAction[] = [];
  private redoStack: CanvasAction[] = [];
  private canvas: fabric.Canvas; // Assuming we have a reference to the fabric canvas
  private isUndoRedoOperation = false;

  constructor(initialState: CanvasState, canvas: fabric.Canvas) {
    this.state = initialState;
    this.canvas = canvas;
  }

  public bindToCanvas(canvasComponent: fabric.Canvas) {
    this.canvas = canvasComponent.canvas;
  }

  public updateState(action: CanvasAction): void {
    // Record the action in the state
    this.undoStack.push(action);
    // Clear the redo stack whenever a new action is performed
    this.redoStack = [];
  }

  public undo(): void {
    const lastAction = this.undoStack.pop();
    if (lastAction) {
      // Push the action to the redo stack before applying the undo action
      this.redoStack.push(lastAction);
      // Apply the reverse of the last action to the canvas
      this.applyAction(lastAction, "undo");
    }
    // Ensure the canvas is re-rendered after the action is applied
    this.canvas.renderAll();
  }
  
  public redo(): void {
    const lastAction = this.redoStack.pop();
    if (lastAction) {
      // Push the action back to the undo stack before applying the redo action
      this.undoStack.push(lastAction);
      // Reapply the last undone action to the canvas
      this.applyAction(lastAction, "redo");
    }
    // Ensure the canvas is re-rendered after the action is applied
    this.canvas.renderAll();
  }
  

  private applyAction(action: CanvasAction, method: "undo" | "redo"): void {
    this.isUndoRedoOperation = true;
    // Apply or reverse the move action
    const position = method === "undo" ? action.from : action.to;

    switch (action.type) {
      case "move":
        action.object.set(position);
        break;

      case "add":
        if (method === "undo") {
          this.canvas.remove(action.object);
        } else {
          this.canvas.add(action.object);
        }
        break;
      case "remove":
        if (method === "undo") {
          this.canvas.add(action.object);
        } else {
          this.canvas.remove(action.object);
        }
        break;
      // Handle other action types (add, remove, etc.)
    }
    this.isUndoRedoOperation = false;
    // After applying the action, re-render the canvas
    // this.canvas.renderAll();
  }
}
