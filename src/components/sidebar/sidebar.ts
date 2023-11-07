import { CanvasOperations } from "./components/canvas/canvasOperations";

export class SidebarComponent {
    private canvasOperations: CanvasOperations | null = null;

    constructor(private shadowRoot: ShadowRoot | null) {
        // Event listeners will be bound later after canvasOperations is set
    }

    public bindToCanvasOperations(canvasOperations: CanvasOperations) {
        this.canvasOperations = canvasOperations;

        // Now that we have canvasOperations, we can bind the drag and drop events
        this.shadowRoot?.querySelector('#task')?.addEventListener('dragend', (event) => {
            this.canvasOperations.addElement(event,'Task');
        });

        this.shadowRoot?.querySelector('#event')?.addEventListener('dragend', (event) => {
            this.canvasOperations.addElement(event,'Event');
        });

        this.shadowRoot?.querySelector('#gateway')?.addEventListener('dragend', (event) => {
            this.canvasOperations.addElement(event,'Gateway');
        });

        // Bind the undo and redo actions to the respective icons
        this.shadowRoot?.querySelector('#undo-icon')?.addEventListener('click', () => {
            this.canvasOperations.undo();
        });

        this.shadowRoot?.querySelector('#redo-icon')?.addEventListener('click', () => {
            this.canvasOperations.redo();
        });
    }
}
