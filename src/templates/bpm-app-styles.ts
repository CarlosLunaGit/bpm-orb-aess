import { css } from 'lit';

export const bpmAppStyles = css`

:host {
  display: grid;
  grid-template-areas:
    "mainmenu mainmenu mainmenu"
    "sidebar canvas operations";
  grid-template-columns: auto 3fr minmax(200px, 1fr);
  grid-template-rows: auto 2fr;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#canvasContainer {
  grid-area: canvas;
  display: flex; /* Use flex to center the canvas element */
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden; /* Prevent scrolling inside the canvas container */
}

#processCanvas {
  max-width: 100%;
  max-height: 100%;
  border: 1px solid #ccc; /* Optional: for visual reference */
}

.canvas-container,
.upper-canvas,
#processCanvas {
  width: 100%!important;
  height: 100%!important;
}

#propertiesForm {
  grid-area: mainmenu;
}

#propertiesFormElement {
  display: flex;
  flex-flow: wrap;
  gap: 1rem;
  width: max-content;
  place-content: center;
  align-items: center;
  font-family: monospace;
}

#sidebar {
  width: max-content;
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

#sidebar > div {
  cursor: pointer;
}


.form-floating {
  position: relative;
  padding-top: 0.25rem;
  padding-right: 0px;
  padding-bottom: 0.25rem;
  padding-left: 0px;
  display: flex;
}

.form-floating > .form-control,
.form-floating > .form-select {
  height: 15px;
  color: slategrey;
  padding-top: 0.95rem;
  padding-right: 0.75rem;
  padding-bottom: 0.25rem;
  padding-left: 0.75rem;
  border-radius: 0.25rem;
  background-color: var(--bs-input-bg, #fff);
  border: 1px solid var(--bs-input-border-color, #ced4da);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-floating > label {
  position: absolute;
  top: 0;
  height: 100%;
  padding-right: 0.75rem;

  padding-left: 0.75rem;
  pointer-events: none;
  border: 1px solid transparent;
  transform-origin: 0 0;
  transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
  transform: translate(0, 1.5rem) scale(0.75);
}

.form-floating > .form-control:focus ~ label,
.form-floating > .form-control:not(:placeholder-shown) ~ label,
.form-floating > .form-select:focus ~ label {
  opacity: 0.65;
  transform: translate(0, 0.5rem) scale(0.75);
}

.__label {
  font-family: "Volvo Novum";
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  color: #575757;
  text-align: left;
  line-height: 12px;
}

#sidebar div {
  width: 24px;
  height: 24px;
  margin: 5px;
  display: inline-block;
}

#sidebar svg {
  width: 100%;
  height: 100%;
}

button {
  border-radius: 8px;
  border: 1px solid #656565;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

.editor .editor-item:first-child {
  border-left: 1px solid #646464;
  margin-left: 0.7vw !important;
  padding-left: 0.7vw !important;
}
`;