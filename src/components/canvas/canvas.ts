import { fabric } from 'fabric';
import { PropertiesPanelComponent } from '../proprertiesPanel/propertiesPanel';

export class CanvasComponent {
    private canvas: fabric.Canvas;
    private gridSize: number = 20; // Define the size of each grid square
    private propertiesPanel: PropertiesPanelComponent;

    /**
     * Initializes a new instance of the CanvasComponent class.
     * @param {string} canvasId - The ID of the HTML canvas element.
     */
    constructor(canvasId: string) {
        this.canvas = new fabric.Canvas(canvasId);
        this.canvas.setDimensions({ width: 800, height: 600 });
        this.canvas.setBackgroundColor('white', this.canvas.renderAll.bind(this.canvas));

        // Call the addEventListeners method here
        this.addEventListeners();

        this.canvas.renderAll();
        this.drawGrid();
        this.enableSnapToGrid();

        this.propertiesPanel = new PropertiesPanelComponent('propertiesForm');
        this.setupCanvasEventListeners();
    }

    private setupCanvasEventListeners(): void {
        this.canvas.on('object:selected', (event) => {
            // Pass the selected object to the properties panel
            this.propertiesPanel.setSelectedElement(event.target);
        });
    }

    /**
     * Adds a BPMN Task shape to the canvas.
     */
    addTask(): void {
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'lightgray',
            width: 120,
            height: 80,
            rx: 10, // Rounded corners
            ry: 10
        });
        this.canvas.add(rect);
    }

    /**
     * Adds a BPMN Event shape to the canvas.
     */
    addEvent(): void {
        const circle = new fabric.Circle({
            left: 250,
            top: 250,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 2,
            radius: 30
        });
        this.canvas.add(circle);
    }

    /**
     * Adds a BPMN Gateway shape to the canvas.
     */
    addGateway(): void {
        const diamond = new fabric.Path('M 0 30 L 30 60 L 60 30 L 30 0 z', {
            left: 400,
            top: 400,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 2
        });
        this.canvas.add(diamond);
    }

     /**
     * Draws a grid on the canvas.
     */
     private drawGrid(): void {
        const options = {
            distance: this.gridSize,
            width: this.canvas.width,
            height: this.canvas.height,
            param: {
                stroke: '#ebebeb',
                strokeWidth: 1,
                selectable: false
            }
        };

        // Vertical grid lines
        for (let i = 0; i < (options.width / options.distance); i++) {
            this.canvas.add(new fabric.Line([i * options.distance, 0, i * options.distance, options.height], options.param));
        }

        // Horizontal grid lines
        for (let i = 0; i < (options.height / options.distance); i++) {
            this.canvas.add(new fabric.Line([0, i * options.distance, options.width, i * options.distance], options.param));
        }
    } 

    /**
     * Enables snap-to-grid functionality.
     */
    private enableSnapToGrid(): void {
        this.canvas.on('object:moving', (options) => {
            options.target.set({
                left: Math.round(options.target.left / this.gridSize) * this.gridSize,
                top: Math.round(options.target.top / this.gridSize) * this.gridSize
            });
        });
    }

    addRectangle(): void {
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 60,
            height: 60,
            fill: 'red'
        });
        this.canvas.add(rect);
    }

    addCircle(): void {
        const circle = new fabric.Circle({
            left: 200,
            top: 200,
            radius: 30,
            fill: 'blue'
        });
        this.canvas.add(circle);
    }

    /** 
     * Adds event listeners to the canvas for handling object interactions.
     * @private
     */
    private addEventListeners(): void {
        this.canvas.on('object:moving', (event) => {
            // Handle object moving
        });

        this.canvas.on('object:selected', (event) => {
            // Handle object selection
            this.enableObjectControls(event.target);
        });

        // Listen for the 'delete' key to remove the selected object
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.canvas.getActiveObject()) {
                this.canvas.remove(this.canvas.getActiveObject());
                this.canvas.renderAll();
            }
        });
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
            selectable: true
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


}
