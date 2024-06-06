import { svg, update } from "/plug-ins/domek/index.js"

import Drag from "/plug-ins/meowse/Drag.js";

class Connect extends Drag {

  line;
  geometry = { x1: 0, y1: 0, x2: 0, y2: 0, };

  before(){
    console.log(`Connect: before`);
    this.line = svg.line({
      class: 'editor-anchor-line',
      style: {
        'pointer-events': 'none' /* required, otherwise the line will mousedrop on it self */
      },
      'vector-effect': 'non-scaling-stroke',
    });
    
    this.geometry = {
      x1: this.component.x,
      y1: this.component.y,
      x2: this.component.x, // 0 length line
      y2: this.component.y, // 0 length line
    };
    this.scene.appendChild(this.line);
  }

  movement({x,y}){
    console.log(`Connect: movement`);
    let dx = this.geometry.x2 - x;
    let dy = this.geometry.y2 - y;

    console.log({dx, dy});

    this.geometry = {
      // origin of th eindicator line is the port
      x1: this.component.x,
      y1: this.component.y,
      // target of the indicator line is where the cursor is dragging
      x2: dx,
      y2: dy,
    };

    update(this.line, this.geometry);

  }

  after(){
    console.log(`Connect: after`);
    if(this.line) this.scene.removeChild(this.line);
    this.line = undefined;
  }

}

export default Connect;
