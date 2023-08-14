import { CanvasComponent } from '../canvas/canvas'; // Adjust the path accordingly


export class PropertiesPanelComponent {
    private selectedElement: any; // This will store the currently selected BPMN element
    private propertiesForm: HTMLFormElement; // This will represent the form element in the DOM
    private canvasComponent: CanvasComponent; // Add this line

    constructor(canvasComponent: CanvasComponent, private shadowRoot: ShadowRoot | null, formId: string) {
        this.canvasComponent = canvasComponent;
        this.propertiesForm = this.shadowRoot?.querySelector('#'+formId) as HTMLFormElement;
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
        if (!this.selectedElement) return;

        let formContent = '';
        if (this.selectedElement.type === 'Task') {
            formContent = `
            <div id="propertiesForm">
                <form id="propertiesFormElement">
                    <div class="form-floating">
                    <input type="text" name="name" value="${this.selectedElement.name || ''}" class="form-control" id="inputName">
                    <label class="__label" for="inputName">Name</label>
                    </div>
                    <div class="form-floating">
                    <textarea name="description" class="form-control" id="inputDescription">${this.selectedElement.description || ''}</textarea>
                    <label class="__label" for="inputDescription">Description</label>
                    </div>
                
            
            `;
        } 
        else if (this.selectedElement.type === 'Event') {
            formContent = `
            <div id="propertiesForm">
                <form id="propertiesFormElement">
                    <div class="form-floating">
                    <input type="text" name="name" value="${this.selectedElement.name || ''}" class="form-control" id="inputName">
                    <label class="__label" for="inputName">Name</label>
                    </div>
                    <div class="form-floating">
                    <textarea name="description" class="form-control" id="inputDescription">${this.selectedElement.description || ''}</textarea>
                    <label class="__label" for="inputDescription">Description</label>
                    </div>
               
            
            `;
        }
        else if (this.selectedElement.type === 'Gateway') {
            formContent = `
            <div id="propertiesForm">
                <form id="propertiesFormElement">
                    <div class="form-floating">
                    <input type="text" name="name" value="${this.selectedElement.name || ''}" class="form-control" id="inputName">
                    <label class="__label" for="inputName">Name</label>
                    </div>
                    <div class="form-floating">
                    <textarea name="description" class="form-control" id="inputDescription">${this.selectedElement.description || ''}</textarea>
                    <label class="__label" for="inputDescription">Description</label>
                    </div>
                
            
            `;
        }
        // ... handle other BPMN element types

        formContent += '<button type="submit">Update</button></form></div>';
        this.propertiesForm.innerHTML = formContent;
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
        if (this.selectedElement) {
            this.selectedElement.name = formData.get('name') as string;
            this.selectedElement.description = formData.get('description') as string;
            this.canvasComponent.updateElement(this.selectedElement); // Assuming you have an updateElement method in the CanvasComponent
        }
    }
    
}
