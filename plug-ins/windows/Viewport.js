import { svg, update, click, text } from "/plug-ins/domek/index.js"

import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import { VerticalLayout } from "/plug-ins/layout-manager/index.js";

import Container from "/plug-ins/windows/Container.js";

export default class Viewport {
  static extends = [Container];
  methods = {

    initialize(){
      // this.layout = new VerticalLayout(this);
    },

    mount(){

      // Create The Clipping System used in the main Mask
      this.el.ClipPath = svg.clipPath({id: `clip-path-${this.id}`});
      this.maskRectangle = svg.rect();
      this.el.ClipPath.appendChild(this.maskRectangle);
      // Resize the mask rectangle to leech coordinaes off of the  pane body - pane body is not used for anything other than x and y
      this.any(['x','y','w', 'h'], ({x,y,w:width,h:height})=>{ update(this.maskRectangle, {x,y,width,height} ) })

      // Create The Mask <g>
      this.el.Mask = svg.g({'clip-path': `url(#clip-path-${this.id})`})

      // Create The Masked Elements <g> that accept transforms - they never overflow the mask.
      this.background = svg.g({name:'background', style:{}})
      this.el.Mask.appendChild(this.background);
      console.log(this.background);

      this.elements = svg.g({name:'elements', style:{'transform-origin': 'top left'}})
      this.el.Mask.appendChild(this.elements);

      console.warn(`this.elements needs a background to track actusl x and y of mouse wheel hits`)

      this.appendElements();

    },
  };
}
