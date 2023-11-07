import { fabric } from "fabric";
import  calculateCoordinates  from "../../utils/calculateCoordinates";

fabric.Task = fabric.util.createClass(fabric.Rect, {
  type: "Task",

  initialize: function (options) {
    options = options || {};
    this.callSuper("initialize", options);
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
        // name: this.get('name')
    });
  },

  _render: function (ctx) {
    this.callSuper("_render", ctx);
  },
});

fabric.Event = fabric.util.createClass(fabric.Circle, {
  Event: "Event",

  initialize: function (options) {
    options = options || {};
    this.callSuper("initialize", options);
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      // any additional properties you want to include when converting to JSON
    });
  },

  _render: function (ctx) {
    this.callSuper("_render", ctx);
  },
});

fabric.Gateway = fabric.util.createClass(fabric.Path, {
  type: "Gateway",

  initialize: function (pathData, options) {
    options = options || {};
    this.callSuper("initialize", pathData, options);
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      // any additional properties you want to include when converting to JSON
    });
  },

  _render: function (ctx) {
    this.callSuper("_render", ctx);
  },
});


// Export methods to add these elements
export function addTask(event) {
  const { x, y } = calculateCoordinates(event.clientX, event.clientY)
  const newTask = new fabric.Task({
    left: x,
    top: y,
    fill: "white",
    stroke: "black",
    width: 120,
    height: 80,
    rx: 10,
    ry: 10,
    type: "Task",
  });

  return newTask;

}

export function addEvent(event) {
    const { x, y } = calculateCoordinates(event.clientX, event.clientY)

  const newEvent = new fabric.Event({
    left: x,
    top: y,
    fill: "white",
    stroke: "black",
    radius: 30,
    type: "Event",
  });


  return newEvent;
}

export function addGateway(event) {
    const { x, y } = calculateCoordinates(event.clientX, event.clientY)

    const newGateway = new fabric.Gateway("M 0 30 L 30 60 L 60 30 L 30 0 z", {
    left: x,
    top: y,
    fill: "white",
    stroke: "black",
    type: "Gateway",
  });

  return newGateway;
}


