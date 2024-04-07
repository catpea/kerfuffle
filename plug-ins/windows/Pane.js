// import deepEqual from 'deep-equal';

import { DiagnosticText, DiagnosticRectangle, DiagnosticCross, DiagnosticRuler, DiagnosticWidth, DiagnosticHeight, DiagnosticPoint } from "/plug-ins/diagnostic/index.js"

import { svg, update, click, text } from "/plug-ins/domek/index.js"
import {nest} from "/plug-ins/nest/index.js";

import Drag from "/plug-ins/meowse/Drag.js";
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

    panX: 110,
    panY: 110,
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
      if(1){
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

      this.on('panX', panX=>paneBody.panX=panX);
      this.on('panY', panY=>paneBody.panY=panY);
      this.on('zoom', zoom=>paneBody.zoom=zoom);

      // this.on('panX', v=> requestAnimationFrame(() => { paneBody.elements.style.transform = `translate(${(paneBody.x/this.zoom)+(this.panX/this.zoom)}px, ${(paneBody.y/this.zoom)+(this.panY/this.zoom)}px)` }));
      // this.on('panY', v=> requestAnimationFrame(() => { paneBody.elements.style.transform = `translate(${(paneBody.x/this.zoom)+(this.panX/this.zoom)}px, ${(paneBody.y/this.zoom)+(this.panY/this.zoom)}px)` }));
      // this.on('zoom', v=> requestAnimationFrame(() => { paneBody.elements.style.scale = this.zoom }));


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



      if(1){


        // const diagnosticText1 = new DiagnosticText('zoom', paneBody.elements, 'yellow')
        // this.any(['panX', 'panY'],coordinates=>diagnosticText1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));
        // paneBody.any(['x','y'], coordinates=>diagnosticText1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));
        //
        //
        // const diagnosticWidth1 = new DiagnosticWidth('panX', paneBody.background, 'gold')
        // this.any(['panX', 'panY'], coordinates=>diagnosticWidth1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));
        // paneBody.any(['x','y','w','h'], coordinates=>diagnosticWidth1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));
        //
        // const diagnosticHeight1 = new DiagnosticHeight('panY', paneBody.background, 'gold')
        // this.any(['panX', 'panY'],coordinates=>diagnosticHeight1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));
        // paneBody.any(['x','y','w','h'],coordinates=>diagnosticHeight1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));
        //
        //
        // const diagnosticRuler1 = new DiagnosticRuler('scene ruler', this.scene, 'red')
        // this.any(['x','y','w','h'],coordinates=>diagnosticRuler1.draw(coordinates));
        //
        // const diagnosticRuler2 = new DiagnosticRuler('elements/paneBody ruler', paneBody.elements, 'green')
        // paneBody.any(['x','y','w','h'],coordinates=>diagnosticRuler2.draw(coordinates, -350));
        //
        // const diagnosticCross1 = new DiagnosticCross('scene', this.scene, 'red')
        // this.any(['x','y','w','h'],coordinates=>diagnosticCross1.draw(coordinates));
        //
        // const diagnosticCross2 = new DiagnosticCross('elements/paneBody', paneBody.elements, 'green')
        // paneBody.any(['x','y','w','h'], through(  o=>this.transform(o), o=>diagnosticCross2.draw(o) ) );
        //
        //
        // const centerCircle = svg.circle({style:{'pointer-events': 'none'}, stroke:'red', r:5})
        // paneBody.elements.appendChild(centerCircle);
        // paneBody.any(['x','y','w','h'], ({x,y,w,h})=>update(centerCircle, {cx:x+w/2,cy:y+h/2 }))

        // const outlineRectangle1 = svg.rect({style:{'pointer-events': 'none'}, stroke:'blue', fill:'none'})
        // paneBody.componentBackground.appendChild(outlineRectangle1);
        // // paneBody.any(['x','y','w','h'], ({x,y,w,h})=>update(outlineRectangle, {x,y,width:w,height:h}))
        // // paneBody.any(['x','y','w','h'], through( o=>console.log(o), o=>this.transform(o, ['x','y','w','h']), o=>console.log(o), ({x,y,w,h})=>({x,y,width:w,height:h}), o=>update(outlineRectangle, o) ) )
        // paneBody.any(['x','y','w','h'], through( ({x,y,w,h})=>({x:0,y:0,width:w,height:h}), o=>update(outlineRectangle1, o) ) )
        //
        //
        // const outlineRectangle2 = svg.rect({style:{'pointer-events': 'none'}, stroke:'red', fill:'none'})
        // paneBody.elements.appendChild(outlineRectangle2);
        // // paneBody.any(['x','y','w','h'], ({x,y,w,h})=>update(outlineRectangle, {x,y,width:w,height:h}))
        // // paneBody.any(['x','y','w','h'], through( o=>console.log(o), o=>this.transform(o, ['x','y','w','h']), o=>console.log(o), ({x,y,w,h})=>({x,y,width:w,height:h}), o=>update(outlineRectangle, o) ) )
        // paneBody.any(['x','y','w','h'], through( ({x,y,w,h})=>({x:0,y:0,width:w,height:h}), o=>update(outlineRectangle2, o) ) )


        // const diagnosticRectangle1 = new DiagnosticRectangle('viewport background', paneBody.componentBackground, 'green')
        // paneBody.any(['x','y','w','h'], through(  o=>this.transform(o), o=>diagnosticRectangle1.draw(o) ) );
        //


      }


      const pan = new Drag({
        area: window,
        handle: paneBody.background,
        // component: this,
        before: ()=>{},
        movement: ({x,y})=>{
          console.log({x,y});
          this.panX -= x;
          this.panY -= y;
        },
        after: ()=>{},
      });
      this.destructable = ()=>pan.destroy();




      console.warn('these must be configured properly as elemnts are more responsible now. mouse wheel is tracked via the transformed g background rectangle that should have a grid or dot pattern');
      if(0){


      // const pan = new Pan({
      //   component: this,
      //   handle: paneBody.el.Container,
      //   zone: window,
      //   // XXX: transformMovement: (v)=>v/globalThis.project.zoom,
      // }); this.destructable = ()=>pan.destroy()

      //
      // const pan = new Pan({
      //   component: this,
      //   handle: paneBody.el.Container,
      //   zone: window,
      //   // XXX: transformMovement: (v)=>v/globalThis.project.zoom,
      // }); this.destructable = ()=>pan.destroy()
      //








      // const diagnosticPoint1 = new DiagnosticPoint('scrollwheel hit', this.elements, 'yellow')
      //
      // const zoom = new Zoom({
      //   component: this,
      //   area: paneBody,
      //   element: paneBody.el.Container,
      //   zone: paneBody.el.Container,
      //   // transformMovement: (v)=>v/globalThis.project.zoom,
      //   probe: ({cursor})=>{
      //     // diagnosticPoint1.draw(cursor)
      //   },
      // }); this.destructable = ()=>zoom.destroy()

      }





      this.on('url', url=>this.load(this.url));











    },

    async load(url){
      if(!url) return;
      const rehydrated = await (await fetch(url)).json();
      console.log({rehydrated});
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
