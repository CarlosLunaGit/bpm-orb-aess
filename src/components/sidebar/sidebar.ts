export class SidebarComponent {
    constructor(private canvasComponent: CanvasComponent, private shadowRoot: ShadowRoot | null) {
        // Bind the drag and drop events to the BPMN shapes in the sidebar
        this.shadowRoot?.querySelector('#task')?.addEventListener('dragend', () => {
            this.canvasComponent.addElement('Task');
        });

        this.shadowRoot?.querySelector('#event')?.addEventListener('dragend', () => {
            this.canvasComponent.addElement('Event');
        });

        this.shadowRoot?.querySelector('#gateway')?.addEventListener('dragend', () => {
            this.canvasComponent.addElement('Gateway');
        });

        // Bind the undo and redo actions to the respective icons
        this.shadowRoot?.querySelector('#undo-icon')?.addEventListener('click', () => {
            this.canvasComponent.undo();
        });

        this.shadowRoot?.querySelector('#redo-icon')?.addEventListener('click', () => {
            this.canvasComponent.redo();
        });
    }
}
