import { fabric } from 'fabric';

export class CanvasComponent {
    private canvas: fabric.Canvas;

    constructor(canvasElement: HTMLCanvasElement) {
        this.canvas = new fabric.Canvas(canvasElement);
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
}
