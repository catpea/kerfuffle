import { svg, update, click, text } from "/plug-ins/domek/index.js"

import { DiagnosticText, DiagnosticRectangle, DiagnosticCross, DiagnosticRuler, DiagnosticWidth, DiagnosticHeight, DiagnosticPoint } from "/plug-ins/diagnostic/index.js"

import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import { VerticalLayout } from "/plug-ins/layout-manager/index.js";

import Container from "/plug-ins/windows/Container.js";

export default class Viewport {
  static extends = [Container];

  properties = {
    debugBody: true,
    debugContent: true,
  };

  observables = {
    toX: 0,
    toY: 0,
    panX: 0,
    panY: 0,
    zoom: 1,
  };

  methods = {

    initialize(){
      // this.layout = new VerticalLayout(this);
    },

    mount(){

      // Create The Clipping System used in the main Mask
      this.el.ClipPath = svg.clipPath({id: `clip-path-${this.id}`});
      this.maskRectangle = svg.rect();
      this.el.ClipPath.appendChild(this.maskRectangle);
      // maskRectangle perfectly covers the component, hiding all overflow
      this.any(['x','y','w', 'h'], ({x,y,w:width,h:height})=>{ update(this.maskRectangle, {x,y,width,height} ) })
      // Create The Mask <g> that uses ClipPath and maskRectangle
      this.el.Mask = svg.g({'clip-path': `url(#clip-path-${this.id})`})

      // Create the component body, for the purpose of transforming where 0x0 is located - this moves 0x0 into component corner.
      // NOTE: body is in the mask
      this.body = svg.g({
        name: 'pane-body',
        style:{'pointer-events': 'all', },

      })
      this.el.Mask.appendChild(this.body);
      this.any(['x','y'], ({x,y})=>this.body.style.transform = `translate(${x}px, ${y}px)` ) // transform the coordinate system so that 0x0 is always in the corner of this component.

      // Give the component a background
      const bgColor = `hsla(${parseInt(360*Math.random())}, 30%, 70%, 0.2)`;
      // console.log(bgColor);
      this.background = svg.rect({name:'component-background', style:{ 'transform-origin': '0px 0px', fill: bgColor}})
      this.body.appendChild(this.background);
      this.any(['x','y','w','h'], ({x, y, w:width,h:height})=>update(this.background, {x:0,y:0,width,height}))

      if(this.debugBody){
        const p1 = new DiagnosticPoint(`${this.oo.name} body 0x0`, this.body, 45, 64, 'yellow')
        this.any(['x','y'], ({x,y})=>p1.draw({x:0,y:0}) );
        const r1 = new DiagnosticRectangle(`${this.oo.name} body`, this.body, 'red')
        this.any(['w','h'], ({w:width,h:height})=>r1.draw({x:0,y:0,width,height}) );
      }

      // on top of the background create the zoom pan container
      // Create The Masked Elements <g> that accept transforms - they never overflow the mask.
      this.content = svg.g({name:'elements', style:{}})
      this.body.appendChild(this.content);

      this.on('panX', v=> requestAnimationFrame(() => {this.content.style.transform = `translate(${this.panX/this.zoom}px, ${this.panY/this.zoom}px)`} ));
      this.on('panY', v=> requestAnimationFrame(() => {this.content.style.transform = `translate(${this.panX/this.zoom}px, ${this.panY/this.zoom}px)`} ));
      this.on('zoom', v=> requestAnimationFrame(() => { this.content.style.scale = this.zoom }));

      if(this.debugContent){
        const p1 = new DiagnosticPoint(`${this.oo.name} content 0x0`, this.content, 24, 64, 'yellow')
        this.any(['x','y'], ({x,y})=>p1.draw({x:0,y:0}) );

        const r1 = new DiagnosticRectangle(`${this.oo.name} content`, this.content, 'green')
        this.any(['w','h'], ({w:width,h:height})=>r1.draw({x:0,y:0,width,height}) );
      }


      console.warn(`this.elements needs a background to track actusl x and y of mouse wheel hits`)

      this.appendElements();

    },
  };
}
