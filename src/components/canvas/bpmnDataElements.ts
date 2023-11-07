import { fabric } from "fabric";
import  calculateCoordinates  from "../../utils/calculateCoordinates";

fabric.DataObject = fabric.util.createClass(fabric.Rect, {
    type: "dataObject",
    initialize: function (options) {
      options = options || {};
      this.callSuper("initialize", options);
      this.fill = "#D9D9D9";
      this.width = 50;
      this.height = 50;
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper("toObject"), {
        fill: this.fill,
        width: this.width,
        height: this.height,
      });
    },
    _render: function (ctx) {
      this.callSuper("_render", ctx);
    },
  });
  
  fabric.DataStore = fabric.util.createClass(fabric.Circle, {
    type: "dataStore",
    initialize: function (options) {
      options = options || {};
      this.callSuper("initialize", options);
      this.fill = "#D9D9FF";
      this.width = 55;
      this.height = 50;
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper("toObject"), {
        fill: this.fill,
        width: this.width,
        height: this.height,
      });
    },
    _render: function (ctx) {
      this.callSuper("_render", ctx);
    },
  });

  export function addDataObject(event) {
    const dataObject = new fabric.DataObject({
        left: event.clientX,
        top: event.clientY,
    });
  
    return dataObject;
  }
  
  export function addDataStore(event) {
      const dataStore = new fabric.DataStore({
        left: event.clientX,
        top: event.clientY,
          fill: "white",
          stroke: "black",
          radius: 40,
          type: "DataStore",
        });
      
        return dataStore;
  }