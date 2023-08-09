export class SidebarComponent {
    constructor(private canvasComponent: CanvasComponent, private shadowRoot: ShadowRoot | null) {
        // Bind the drag and drop events to the BPMN shapes in the sidebar
        this.shadowRoot?.querySelector('#task')?.addEventListener('dragend', () => {
            this.canvasComponent.addTask();
        });

        this.shadowRoot?.querySelector('#event')?.addEventListener('dragend', () => {
            this.canvasComponent.addEvent();
        });

        this.shadowRoot?.querySelector('#gateway')?.addEventListener('dragend', () => {
            this.canvasComponent.addGateway();
        });
    }
}
