// calculateCoordinates.ts

/**
 * Calculates the x, y coordinates relative to the canvasContainer.
 * @param clientX - The clientX value from the user event.
 * @param clientY - The clientY value from the user event.
 * @returns An object containing the adjusted x, y coordinates.
 */
function calculateCoordinates(clientX: number, clientY: number): { x: number, y: number } {
    // Get the canvasContainer element
    const canvasContainer = document.getElementsByTagName('bpm-app')[0].shadowRoot?.getElementById('canvasContainer');
  
    if (!canvasContainer) {
      throw new Error('canvasContainer element not found');
    }
  
    // Get the bounding rectangle of the canvasContainer
    const rect = canvasContainer.getBoundingClientRect();
  
    // Calculate the x, y coordinates relative to the canvasContainer
    const x = clientX - rect.left;
    const y = clientY - rect.top;
  
    return { x, y };
  }
  
  export default calculateCoordinates;
  