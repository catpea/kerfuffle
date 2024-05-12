// import deepEqual from 'deep-equal';

let segmentDb = {};

import { DiagnosticText, DiagnosticRectangle, DiagnosticCross, DiagnosticRuler, DiagnosticWidth, DiagnosticHeight, DiagnosticPoint } from "/plug-ins/diagnostic/index.js"

import { svg, update, click, text } from "/plug-ins/domek/index.js"
import {nest} from "/plug-ins/nest/index.js";

import Pan from "/plug-ins/meowse/Pan.js";
import Zoom from "/plug-ins/meowse/Zoom.js";
import Resize from "/plug-ins/meowse/Resize.js";
// import Pan from "/plug-ins/pan/index.js";
// import Zoom from "/plug-ins/zoom/inner.js";

import Node from "/plug-ins/node/Node.js";
import {Instance} from "/plug-ins/object-oriented-programming/index.js";


import TestWindow from "/plug-ins/applications/TestWindow.js";
import ThemeBuilder from "/plug-ins/applications/ThemeBuilder.js";

import Viewport from "/plug-ins/windows/Viewport.js";
import Container from "/plug-ins/windows/Container.js";
import Vertical from "/plug-ins/windows/Vertical.js";
import Horizontal from "/plug-ins/windows/Horizontal.js";

import Junction from "/plug-ins/windows/Junction.js";
import Line from "/plug-ins/windows/Line.js";

import Label from "/plug-ins/windows/Label.js";
import { RelativeLayout } from "/plug-ins/layout-manager/index.js";

const uuid = bundle['uuid'];
const xml2js = bundle['xml2js'];

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
    classes: '', // css classes
    feed: [],
  };

  observables = {
    url:null,

    panX: 100,
    panY: 100,
    zoom: .4,

    applications: [],
    elements: [],
    anchors: [],
    pipes: [],

    types: [
      TestWindow,
      ThemeBuilder,
      Junction,
      Line
    ],

  };

  methods = {

    initialize(){
      this.name = 'pane';
      if(this.getRootContainer().isRootWindow) return;
      this.h = 400;
      this.flexible = true;

    },

    mount(){
      // console.log(Δ);

      // Add Menu
      if(1){
        const [horizontal1, [ addButton, delButton ]] = nest(Horizontal, [
          [Label, {h: 24, W:32, text: 'File', parent:this}, (c,p)=>p.children.create(c)],
          [Label, {h: 24, W:32, text: 'Info', parent:this}, (c,p)=>p.children.create(c)],
        ], (c)=>this.children.create(c));


        // Add Menu Listeners
        this.disposable = click(addButton.handle, e=>{
          const id = uuid();
          const node = new Instance( Node, {id, origin:this.getRootContainer().id, type: "Junction", x: 300, y: 300, data:{}} );
          this.elements.create(node);
        })

      }
      // Add Viewport

      const paneBody = new Instance(Viewport, {h: 700, parent: this, classes:this.classes} );
      this.viewport = paneBody;
      this.getApplication().viewport = paneBody;

      this.children.create( paneBody );
      globalThis.project.origins.create({ id: this.getRootContainer().id, root: this, scene:paneBody.el.Mask })


      if(!this.parent.isRootWindow){

        const [horizontal, [ statusBar, resizeHandle ]] = nest(Horizontal, [
          [Label, {h: 24,   text: 'Status: nominal', parent:this}, (c,p)=>p.children.create(c)],
          [Label, {h: 24, W:24, text: '///', parent:this}, (c,p)=>p.children.create(c)],

        ], (c)=>this.children.create(c));

        this.any(['x','y','zoom','w','h'], ({x,y,zoom,w,h})=>statusBar.text=`${x.toFixed(0)}x${y.toFixed(0)} zoom:${zoom.toFixed(2)} win=${this.getApplication().w.toFixed(0)}:${this.getApplication().h.toFixed(0)} pane=${w.toFixed(0)}:${h.toFixed(0)} id:${this.getApplication().id}`);
        // this.any(['x','y','zoom','w','h'], ({x,y,zoom,w,h})=>console.log({x,y,zoom,w,h}));

        const resize = new Resize({
          area: window,
          minimumX:320,
          minimumY:200,
          handle: resizeHandle.el.Container,
          scale: ()=>this.getParentScale(this),
          box:  this.getApplication(this),
          before: ()=>{},
          movement: ({x,y})=>{},
          after: ()=>{},
        });
        this.destructable = ()=>resize.destroy();

      }












      // CODE ANOMALY FOR ROOT EDGECASE
      if(this.parent.isRootWindow){
        this.parent.on('h', parentH=>{
          const childrenHeight = this.children.filter(c=>!(c===paneBody)).reduce((total, c) => total + (c.h), 0);
          const freeSpace = parentH - childrenHeight - (this.parent.b*2) - (this.parent.p*2);
          paneBody.h = freeSpace;
          paneBody.H = freeSpace;
        })

      };


      // Based on pan and zoom adjust the viewport.

      // Send to viewport
      this.on('panX', panX=>paneBody.panX=panX);
      this.on('panY', panY=>paneBody.panY=panY);
      this.on('zoom', zoom=>paneBody.zoom=zoom);

      this.on("elements.created", (node) => {

        const Ui = this.types.find(o=>o.name==node.type); // concept as in conceptmap is a component as it is a GUI thing.
        if(!Ui) return console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);

        let root = svg.g({ name: 'element' });
        paneBody.content.appendChild(root);
        console.log('FEED .created phase', node.type, node.content);
        const ui = new Instance(Ui, {id:node.id, node, scene: root, parent: this, content:node.content});
        this.applications.create(ui);
        ui.start();

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

      this.on('url',     url=>this.load(this.url));
      // this.on('content', content=>this.feed(content));


      if(this.getApplication().content) this.feed(this.getApplication().content)


      console.log('FEED', this.content);
    },

    feed(content){

      console.log('BBB arrived', content);

      for (const [type, contents] of  Object.entries( content ) ) {
        console.log('BBB decoded type/contents', type, contents);


        for (const element of contents ) {
          // console.log('QQQ', Object.entries( element ).filter(([name])=>name!=='attributes'));
            const node = new Instance(Node, { origin: this.getApplication().id });
            const data = {}; //? can use await...
            const c = Object.fromEntries( Object.entries( element ).filter(([name])=>name!=='attributes') );
            console.log('BBB raw', c);
            node.assign({type, ...element.attributes}, data, c);
            this.elements.create( node ); // -> see project #onStart for creation.

 
        }


        // for (const element of Object.entries( group ).filter(([name])=>name!=='attributes') ) {
        //   console.log('BBB instancing', type, element);
        //
        // }

        // element.attributes
        // for (const [index, element] of Object.entries( group ).filter(([name])=>name!=='attributes')  ) {
        //   for (const element of contents ) {
        //       const node = new Instance(Node, { origin: this.getApplication().id });
        //       const data = {}; //? can use await...
        //       const c = Object.fromEntries( Object.entries( element ).filter(([name])=>name!=='attributes') );
        //       // node.assign({type, ...element.attributes}, data, c);
        //       // this.elements.create( node ); // -> see project #onStart for creation.
        //       console.log('BBB', c);
        //   }
        // }


      }

    },

    async load(url){
      const parser = new xml2js.Parser({attrkey:'attributes'});

      if(!url) return;
      const str = await (await fetch(url)).text();

      if(url.endsWith('.json')){
        const rehydrated = globalThis.bundle.JSON5.parse(str);
        this.meta = rehydrated.meta;
        for (const {meta, data} of rehydrated.data) {
          const node = new Instance(Node, {origin: this.getApplication().id});
          node.assign(meta, data);
          this.elements.create( node ); // -> see project #onStart for creation.
        }
      }else if(url.endsWith('.xml')){
        const xml = {...await parser.parseStringPromise(str, )};
        //TODO: do something with data in xml.Workspace.attributes
        console.log('XXXX', xml);
        for (const [type, contents] of Object.entries( xml.Workspace ).filter(([name])=>name!=='attributes') ) {

          for (const element of contents ) {
            // console.log('QQQ', Object.entries( element ).filter(([name])=>name!=='attributes'));
              const node = new Instance(Node, { origin: this.getApplication().id });
              const data = {}; //? can use await...
              const c = Object.fromEntries( Object.entries( element ).filter(([name])=>name!=='attributes') );
              console.log('BBB raw', c);
              node.assign({type, ...element.attributes}, data, c);
              this.elements.create( node ); // -> see project #onStart for creation.

            // for (const [type, data] of Object.entries( element ).filter(([name])=>name!=='attributes') ) {
            //
            //   const node = new Instance(Node, { origin: this.getApplication().id });
            //   const data = {}; //? can use await...
            //   node.assign({type, ...xml.Workspace.attributes}, data);
            //   this.elements.create( node ); // -> see project #onStart for creation.
            //
            // }

          }



        }

        // console.log(xml);
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
