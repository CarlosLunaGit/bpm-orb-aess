import { fabric } from 'fabric';

export class CanvasComponent {
    private canvas: fabric.Canvas;

    constructor(canvasId: string) {
        this.canvas = new fabric.Canvas(canvasId);
        this.canvas.setDimensions({ width: 800, height: 600 });
        this.canvas.setBackgroundColor('white', this.canvas.renderAll.bind(this.canvas));
        
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
        
        addCircle(): void {
            const circle = new fabric.Circle({
                left: 200,
                top: 200,
                fill: 'blue',
                radius: 30
            });
            this.canvas.add(circle);
        }
        
        this.canvas.on('object:moving', (event) => {
            // Handle object moving
        });
        
        this.canvas.on('object:selected', (event) => {
            // Handle object selection
        });
        
        this.canvas.renderAll();
        
    }
}

