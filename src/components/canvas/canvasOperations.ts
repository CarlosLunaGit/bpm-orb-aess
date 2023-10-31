export class CanvasOperations {
    constructor(private canvasComponent: CanvasComponent) {}
  
    initializeCanvas(canvasEl: HTMLCanvasElement) {
        // Set initial canvas dimensions
        this.resizeCanvas(canvasEl);
    
        // Listen to window resize events
        window.addEventListener('resize', () => {
            this.resizeCanvas(canvasEl);
        });
      }

    resizeCanvas(canvasEl: HTMLCanvasElement) {
        const containerWidth = canvasEl.parentElement?.clientWidth || 800; // Default to 800 if not found
        const containerHeight = canvasEl.parentElement?.clientHeight || 600; // Default to 600 if not found
    
        this.canvasComponent?.canvas.setDimensions({ width: containerWidth, height: containerHeight });
        
    }
  }
  