// EventHandlers.ts
export class EventHandlers {
  constructor(private canvasComponent: CanvasComponent, private shadowRoot: ShadowRoot) {}

  showToast(message: string, type: 'success' | 'error' = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }
  
  attachEventHandlers() {
    const undoIconEl = this.shadowRoot?.querySelector('#undoIconId');
    const redoIconEl = this.shadowRoot?.querySelector('#redoIconId');
    undoIconEl?.addEventListener('click', () => this.canvasComponent?.undo());
    redoIconEl?.addEventListener('click', () => this.canvasComponent?.redo());

    const saveIconEl = this.shadowRoot?.querySelector('#saveIconId');
    const loadIconEl = this.shadowRoot?.querySelector('#loadIconId');

    saveIconEl?.addEventListener('click', () => {
      if (this.canvasComponent?.saveCanvasState()) {
        this.showToast('Canvas saved successfully.');
      } else {
        this.showToast('Failed to save canvas.', 'error');
      }
    });
  
    loadIconEl?.addEventListener('click', () => {
      if (this.canvasComponent?.loadCanvasState()) {
        this.showToast('Canvas loaded successfully.');
      } else {
        this.showToast('Failed to load canvas.', 'error');
      }
    });
  }
}
