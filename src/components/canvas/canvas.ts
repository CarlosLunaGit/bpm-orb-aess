import { fabric } from 'fabric';

/**
 * Represents a Canvas component for designing business processes.
 */
export class CanvasComponent {
    private canvas: fabric.Canvas;

    /**
     * Initializes a new instance of the CanvasComponent class.
     * @param {string} canvasId - The ID of the HTML canvas element.
     */
    constructor(canvasId: string) {
        this.canvas = new fabric.Canvas(canvasId);
        this.canvas.setDimensions({ width: 800, height: 600 });
        this.canvas.setBackgroundColor('white', this.canvas.renderAll.bind(this.canvas));

        this.addEventListeners();

        this.canvas.renderAll();
    }

    /**
     * Adds a rectangle shape to the canvas.
     */
    addRectangle(): void {
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 60,
            height: 60
        });
        this.canvas.add(rect);
    }

    /**
     * Adds a circle shape to the canvas.
     */
    addCircle(): void {
        const circle = new fabric.Circle({
            left: 200,
            top: 200,
            fill: 'blue',
            radius: 30
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
        });
    }
}
