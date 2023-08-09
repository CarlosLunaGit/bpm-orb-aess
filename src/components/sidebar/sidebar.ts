// Assuming you have a SidebarComponent class

export class SidebarComponent {
    constructor(private canvasComponent: CanvasComponent) {
        // Bind the drag and drop events to the BPMN shapes in the sidebar
        document.getElementById('task').addEventListener('dragend', () => {
            this.canvasComponent.addTask();
        });

        document.getElementById('event').addEventListener('dragend', () => {
            this.canvasComponent.addEvent();
        });

        document.getElementById('gateway').addEventListener('dragend', () => {
            this.canvasComponent.addGateway();
        });
    }
}
