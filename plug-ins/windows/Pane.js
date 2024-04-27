// import deepEqual from 'deep-equal';

let segmentDb = {};

import { DiagnosticText, DiagnosticRectangle, DiagnosticCross, DiagnosticRuler, DiagnosticWidth, DiagnosticHeight, DiagnosticPoint } from "/plug-ins/diagnostic/index.js"

import { svg, update, click, text } from "/plug-ins/domek/index.js"
import {nest} from "/plug-ins/nest/index.js";

import Pan from "/plug-ins/meowse/Pan.js";
import Zoom from "/plug-ins/meowse/Zoom.js";
// import Pan from "/plug-ins/pan/index.js";
// import Zoom from "/plug-ins/zoom/inner.js";

import Node from "/plug-ins/node/Node.js";
import {Instance} from "/plug-ins/object-oriented-programming/index.js";


import TestWindow from "/plug-ins/applications/TestWindow.js";

import Viewport from "/plug-ins/windows/Viewport.js";
import Container from "/plug-ins/windows/Container.js";
import Vertical from "/plug-ins/windows/Vertical.js";
import Horizontal from "/plug-ins/windows/Horizontal.js";

import Junction from "/plug-ins/windows/Junction.js";
import Line from "/plug-ins/windows/Line.js";

import Label from "/plug-ins/windows/Label.js";
import { RelativeLayout } from "/plug-ins/layout-manager/index.js";

const uuid = bundle['uuid'];

const through = (...functions) => {
  return (data) => {
    let response = data;
    for (const funct of functions) {
      response = funct(response) ?? response;
    }
    return response;
  }
}

export default class Pane {

  static extends = [Vertical];

  properties = {
    contain:true,
  };

  observables = {
    url:null,

    panX: 150,
    panY: 150,
    zoom: .5,

    applications: [],
    elements: [],
    anchors: [],
    pipes: [],
    types: [ TestWindow, Junction, Line ],
  };

  methods = {

    initialize(){
      // console.assert(deepEqual({X:200,Y:200},this.transform({X:100, Y:100}, null, 2)), 'this.transform calculations are incorrect.')
      // console.assert(deepEqual({X:50,Y:50},this.transform({X:100, Y:100}, null, .5)), 'this.transform calculations are incorrect.')

      if(this.getRootContainer().isRootWindow) return;


      console.info('Line must detect the g it should be placed into');
      this.h = 400;

    },

    mount(){


      console.log('Pane Mount', this.url);

      if(0){
        let v = 0;
        setInterval(x=>{;
          let Δ = Math.sin(v);
          v=v+0.001;
          if(v>=Math.PI) v = 0
          this.panX = (100*Δ);
          this.panY = (100*Δ);
        }, 1_000/32)
      }

      if(0){
        let u = Math.PI/2;
        let v = 0-u;
        setInterval(x=>{;
          let Δ = Math.sin(v);
          v=v+0.01;
          let z = 1.5+Δ
          this.zoom = (z);
          console.log(this.zoom);
          // console.log(v);
          // console.log(Δ);

            if(v>=Math.PI+u) v = 0-u
        }, 1_000/32)

      }



      /*
      - standard scene set by parent
        - Horizontal based menu
          - some Label buttons
        - Viewport paneBody (container for UI elements)
      */

      // Add Menu
      if(0){
        const [horizontal, [ addButton, delButton ]] = nest(Horizontal, [
          [Label, {h: 32, W:32, text: 'Add', parent:this}, (c,p)=>p.children.create(c)],
          [Label, {h: 32, W:32, text: 'Del', parent:this}, (c,p)=>p.children.create(c)],
        ], (c)=>this.children.create(c));

        // Add Menu Listeners
        this.disposable = click(addButton.handle, e=>{
          const id = uuid();
          const node = new Instance( Node, {id, origin:this.getRootContainer().id, type: "Junction", x: 300, y: 300, data:{}} );
          this.elements.create(node);
        })
      }

      // Add Viewport

      const paneBody = new Instance(Viewport, {h: 700,   parent: this});
      this.children.create( paneBody );
      globalThis.project.origins.create({ id: this.getRootContainer().id, root: this, scene:paneBody.el.Mask })
      console.log('hhh this.getRootContainer().isRootWindow', this.getRootContainer().isRootWindow);

      // CODE ANOMALY FOR ROOT EDGECASE
      if(this.parent.isRootWindow){
        this.parent.on('h', parentH=>{
          const childrenHeight = this.children.filter(c=>!(c===paneBody)).reduce((total, c) => total + (c.h), 0);
          const freeSpace = parentH - childrenHeight;
          paneBody.h = freeSpace;
          paneBody.H = freeSpace;
        })

      };


      // Based on pan and zoom adjust the viewport.
      console.warn(`viewport is moved down by .25 of menu?.. this is a bug`);

      // Send to viewport
      this.on('panX', panX=>paneBody.panX=panX);
      this.on('panY', panY=>paneBody.panY=panY);
      this.on('zoom', zoom=>paneBody.zoom=zoom);

      this.on("elements.created", (node) => {
        const Ui = this.types.find(o=>o.name==node.type); // concept as in conceptmap is a component as it is a GUI thing.
        if(!Ui) return console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
        const ui = new Instance(Ui, {id:node.id, node, scene: paneBody.content, parent: this});
        this.applications.create(ui);
        ui.start()
      }, {replay:true});

      this.on("elements.removed", ({id}) => {
        this.applications.get(id).stop();
        this.applications.get(id).destroy();
        this.applications.remove(id);
      });




      this.appendElements();




      const pan = new Pan({
        area: window,
        handle: paneBody.background,
        scale: ()=>this.getParentScale(this),
        before: ()=>{},
        movement: ({x,y})=>{
          this.panX -= x;
          this.panY -= y;
        },
        after: ()=>{},
      });
      this.destructable = ()=>pan.destroy();

      // const showCursorPosition = new DiagnosticPoint('wheel cursor', paneBody.body, 45, 100, 'red')
      function segmentHandler(requests, {container}){
        for (const [key, request] of requests) {
          let lineExists = segmentDb[key];
          if(!lineExists) segmentDb[key] = new DiagnosticWidth({...request, container});
          segmentDb[key].update(request);
        }
      }


      const zoom = new Zoom({
        magnitude: 0.1,
        area: paneBody.background,
        component: paneBody,
        handle: paneBody.background,
        getter: (key)=>this[key],
        transforms: ()=>this.getTransforms(this),
        before: ()=>{
          // console.log({zoom:this.zoom,panX:this.panX,panY:this.panY});
        },
        change: ({zoom,panX,panY})=>{

          this.zoom = zoom;
          this.panX = panX;
          this.panY = panY;

        },
        feedback: (debug) => {
          // showCursorPosition.draw({x:debug.cursorX, y:debug.cursorY, text: `cursor @${debug.zoom}/${this.zoom}` })
          // segmentHandler(debug.segments, {container: globalThis.scene})

        },
        after: (data,debug)=>{
          // lineHandler(debug.lines, {container: globalThis.scene})
          // // console.log({zoom:this.zoom,panX:this.panX,panY:this.panY});
          // // console.log({debug});
          // lineA.update({ x:debug.lineA.x, y:debug.lineA.y, length:debug.lineA.length, label: debug.lineA.label })
          // lineB.update({ x:debug.lineB.x, y:debug.lineB.y, length:debug.lineB.length, label: debug.lineB.label })
          // lineC.update({ x:debug.lineC.x, y:debug.lineC.y, length:debug.lineC.length, label: debug.lineC.label })
          // lineD.update(debug.lineD)
          // // console.log(this.panX);
        },
      });
      this.destructable = ()=>zoom.destroy();

      this.on('url', url=>this.load(this.url));

    },

    async load(url){
      if(!url) return;
      const rehydrated = await (await fetch(url)).json();
      // console.log({rehydrated});
      this.meta = rehydrated.meta;
      for (const {meta, data} of rehydrated.data) {
        const node = new Instance(Node, {origin: this.getApplication().id});
        node.assign(meta, data);
        this.elements.create( node ); // -> see project #onStart for creation.
      }
    },

    transform(o, keys=null, scale=null){
      let zoom = scale??this.zoom;
      let response = o;
      for (const transform of this.getTransforms(this)) {
        response = Object.fromEntries(Object.entries(response).map(([k,v])=>{
          if(keys===null){ // transform all
            return [k, v*zoom]
          } else if(keys.length){
            if(keys.includes(k)){ // picked
              return [k,v*zoom];
            }else{ // do nothing
              return [k,v];
            }
          }
        }));
      }
      return response;

    }

  }

}
