export class PropertiesPanelComponent {
    private selectedElement: any; // This will store the currently selected BPMN element
    private propertiesForm: HTMLFormElement; // This will represent the form element in the DOM

    constructor(formId: string) {
        this.propertiesForm = document.getElementById(formId) as HTMLFormElement;
        this.setupEventListeners();
    }

    /**
     * Set the currently selected BPMN element.
     */
    setSelectedElement(element: any): void {
        this.selectedElement = element;
        this.displayPropertiesForm();
    }

    /**
     * Display the properties form based on the selected BPMN element.
     */
    private displayPropertiesForm(): void {
        if (this.selectedElement.type === 'Task') {
            this.propertiesForm.innerHTML = `
                <label>Name: <input type="text" name="name" value="${this.selectedElement.name}"></label>
                <label>Description: <textarea name="description">${this.selectedElement.description}</textarea></label>
                <button type="submit">Update</button>
            `;
        } else if (this.selectedElement.type === 'Event') {
            // ... similar logic for Event
        }
        // ... handle other BPMN element types
    }

    /**
     * Setup event listeners for the form.
     */
    private setupEventListeners(): void {
        this.propertiesForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.updateElementProperties();
        });
    }

    /**
     * Update the selected BPMN element with the form values.
     */
    private updateElementProperties(): void {
        const formData = new FormData(this.propertiesForm);
        this.selectedElement.name = formData.get('name') as string;
        this.selectedElement.description = formData.get('description') as string;

        // Assuming 'canvas' is an instance of your CanvasComponent
        // canvas.updateElement(this.selectedElement);
    }
}
