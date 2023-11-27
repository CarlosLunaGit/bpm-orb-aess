import { CanvasOperations } from "./components/canvas/canvasOperations";

export class SidebarComponent {
  private canvasOperations: CanvasOperations | null = null;

  constructor(private shadowRoot: ShadowRoot | null) {
    // Event listeners will be bound later after canvasOperations is set
  }

  public bindToCanvasOperations(canvasOperations: CanvasOperations) {
    this.canvasOperations = canvasOperations;

    // Now that we have canvasOperations, we can bind the drag and drop events
    this.shadowRoot
      ?.querySelector("#task")
      ?.addEventListener("dragend", (event) => {
        this.canvasOperations.addElement(event, "Task");
      });

    this.shadowRoot
      ?.querySelector("#event")
      ?.addEventListener("dragend", (event) => {
        this.canvasOperations.addElement(event, "Event");
      });

    this.shadowRoot
      ?.querySelector("#gateway")
      ?.addEventListener("dragend", (event) => {
        this.canvasOperations.addElement(event, "Gateway");
      });

    // Bind the undo and redo actions to the respective icons
    this.shadowRoot
      ?.querySelector("#undoIconId")
      ?.addEventListener("click", () => {
        this.canvasOperations.undo();
      });

    this.shadowRoot
      ?.querySelector("#redoIconId")
      ?.addEventListener("click", () => {
        this.canvasOperations.redo();
      });

    // Bind zoom and pan controls
    this.shadowRoot
      ?.querySelector("#zoomInIconId")
      ?.addEventListener("click", () => {
        canvasOperations.zoomIn();
      });

    this.shadowRoot
      ?.querySelector("#zoomOutIconId")
      ?.addEventListener("click", () => {
        canvasOperations.zoomOut();
      });

    this.shadowRoot
      ?.querySelector("#togglePanIconId")
      ?.addEventListener("click", () => {
        canvasOperations.togglePanning();
      });
  }
}
