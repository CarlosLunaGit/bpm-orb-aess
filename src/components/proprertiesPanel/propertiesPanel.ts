export class PropertiesPanelComponent {
  private selectedElement: any; // This will store the currently selected BPMN element
  private propertiesForm: HTMLFormElement; // This will represent the form element in the DOM
  //public canvasComponent: CanvasComponent; // Add this line

  constructor(private shadowRoot: ShadowRoot | null, formId: string) {
    // this.canvasComponent = canvasComponent;
    this.propertiesForm = this.shadowRoot?.querySelector(
      "#" + formId
    ) as HTMLFormElement;
    this.setupEventListeners();
  }

  /**
   * Set the currently selected BPMN element.
   */
  setSelectedElement(element: any): void {
    this.selectedElement = element;
    this.displayPropertiesForm();
  }

  public bindToCanvas(canvasComponent: CanvasComponent) {
    canvasComponent.onElementSelected = this.setSelectedElement.bind(this);
  }

  /**
   * Generate form content based on the selected BPMN element type.
   * @param {string} elementType - The type of the BPMN element.
   * @returns {string} - The form content.
   */
  private generateFormContent(elementType: string): string {
    return `
        <div class="form-floating">
            <input type="text" name="name" value="${
              this.selectedElement.name || ""
            }" class="form-control" id="inputName">
            <label class="__label" for="inputName">Name</label>
        </div>
        <div class="form-floating">
            <textarea name="description" class="form-control" id="inputDescription">${
              this.selectedElement.description || ""
            }</textarea>
            <label class="__label" for="inputDescription">Description</label>
        </div>
    `;
  }

  /**
   * Display the properties form based on the selected BPMN element.
   */
  private displayPropertiesForm(): void {
    if (!this.selectedElement) return;

    let formContent = this.generateFormContent(this.selectedElement.type);
    formContent += '<button type="submit">Update</button>';
    this.propertiesForm.innerHTML = formContent;
  }

  /**
   * Setup event listeners for the form.
   */
  private setupEventListeners(): void {
    this.propertiesForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.updateElementProperties();
    });
  }

  /**
   * Update the selected BPMN element with the form values.
   */
  private updateElementProperties(): void {
    const formData = new FormData(this.propertiesForm);
    if (this.selectedElement) {
      this.selectedElement.name = formData.get("name") as string;
      this.selectedElement.description = formData.get("description") as string;
      this.canvasComponent.updateElement(this.selectedElement); // Assuming you have an updateElement method in the CanvasComponent
    }
  }
}
