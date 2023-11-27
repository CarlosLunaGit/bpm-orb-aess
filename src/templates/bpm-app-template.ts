// bpm-app-template.ts
import { html } from 'lit';
import { context } from './context';

export const bpmAppTemplate = (data) => html`
<div id="propertiesForm">
  <form id="propertiesFormElement" class="editor">
    Editor
    <div class="form-floating editor-item">
      <textarea
        name="bpmnType"
        class="form-control"
        id="bpmnType"
      ></textarea>
      <label class="__label" for="bpmnType">BPMN Type</label>
    </div>
    <div class="form-floating editor-item">
      <input
        type="text"
        name="name"
        value=""
        class="form-control"
        id="inputName"
      />
      <label class="__label" for="inputName">Name</label>
    </div>
    <div class="form-floating editor-item">
      <textarea
        name="description"
        class="form-control"
        id="inputDescription"
      ></textarea>
      <label class="__label" for="inputDescription">Description</label>
    </div>
    <div class="form-floating editor-item">
      <textarea
        name="Integration"
        class="form-control"
        id="inputIntegration"
      ></textarea>
      <label class="__label" for="inputIntegration">Integration</label>
    </div>
  </form>
</div>

<div id="sidebar">
  <!-- BPMN Shapes -->
  <div
    id="task"
    draggable="true"
    .innerHTML=${context.taskIcon}
    title="Task"
  ></div>
  <div
    id="event"
    draggable="true"
    .innerHTML=${context.eventIcon}
    title="Event"
  ></div>
  <div
    id="gateway"
    draggable="true"
    .innerHTML=${context.gatewayIcon}
    title="Gateway"
  ></div>

  <!-- Toolbar Icons -->
  <div id="undoIconId" .innerHTML=${context.undoIcon} title="Undo"></div>
  <div id="redoIconId" .innerHTML=${context.redoIcon} title="Redo"></div>
  <div id="saveIconId" .innerHTML=${context.saveIcon} title="Save/Download"></div>
  <div id="loadIconId" .innerHTML=${context.loadIcon} title="Load/Open"></div>
  <div id="zoomInIconId" .innerHTML=${context.zoomInIcon} title="Zoom In"></div>
  <div id="zoomOutIconId" .innerHTML=${context.zoomOutIcon} title="Zoom Out"></div>
  <div id="togglePanIconId" .innerHTML=${context.togglePanIcon} title="Toggle Pan"></div>
  <!-- Add other icons for different actions here -->
</div>

<div id="canvasContainer">
  <canvas id="processCanvas"></canvas>
</div>
`;
