import { svg, update } from "/plug-ins/domek/index.js"


import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Socket from "/plug-ins/windows/Socket.js";
import WithSockets from "/plug-ins/windows/api/Sockets.js";
import { SocketLayout } from "/plug-ins/layout-manager/index.js";


import Vertical from "/plug-ins/windows/Vertical.js";
import Control from "/plug-ins/windows/Control.js";
import Caption from "/plug-ins/windows/Caption.js";

import Move from "/plug-ins/meowse/Move.js";
import Focus from "/plug-ins/meowse/Focus.js";
import Resize from "/plug-ins/meowse/Resize.js";


export default class Window {

  static extends = [WithSockets, Vertical];

  observables = {
    caption: 'Untitled',

    showCaption: true,
    isResizable: true,
    showMenu: false,
    showStatus: false,

    socketRegistry: [],
    sockets: [],
  };

  properties = {
    contain:true,
  };

  traits = {
    createWindowComponent(component){
      component.parent = this;
      this.children.create(component);
    },
  };

  methods = {




    initialize(){

      this.caption = `${this.name||this.oo.name} (${this.id})`;

      if(this.isRootWindow) return;
      if(this.oo.name == 'Pipe') return;

        this.r = 5;
        this.b = 5;
        this.s = 3;

      if(this.isResizable){
        let width = 32;
        let height = 32;

        this.el.ResizeHandle = svg.rect({
          class: 'window-resize-handle',
          'stroke-width': 0,
          'fill': 'magenta',
          width,
          height,
        });

        this.any('w h x y', ({w,h,x,y})=>{
          update(this.el.ResizeHandle,{x:(this.x+this.w)-(width*.8), y:(this.y+this.h)-(height*.8)})
        });
        this.on('r',     ry=>update(this.el.ResizeHandle,{ry}),     );

        const resize = new Resize({
          area: window,
          minimumX:320,
          minimumY:200,
          handle: this.el.ResizeHandle,
          scale: ()=>this.getScale(this),
          box:  this.getApplication(this),
          before: ()=>{},
          movement: ({x,y})=>{},
          after: ()=>{},
        });

        this.destructable = ()=>resize.destroy();

      }

    },

    mount(){

      // ADD DRAGGABLE CAPTION (aka handle)
      this.draw(); // WARNING: you must draw the window before drawing the caption, so that the caption is on top

      if(this.isRootWindow) return;



      if(this.showCaption){

        let caption = new Instance(Caption, {h: 24, text: this.caption});
        this.on('caption', v=>caption.text=v)
        this.createWindowComponent(caption);
        this.on("node", (node) => {
          if(node.caption) node.on("caption", caption => this.caption = caption);
        });

        const move = new Move({
          area: window,
          handle: caption.handle,
          scale: ()=>this.getScale(this),
          before: ()=>{},
          movement: ({x,y})=>{
            this.node.x -= x;
            this.node.y -= y;
          },
          after: ()=>{},
        });

        this.destructable = ()=>move.destroy();
      }



      const focus = new Focus({
        handle: this.scene, // TIP: set to caption above to react to window captions only
        component: this,
        element: ()=> this.scene,
      });
      this.destructable = ()=>focus.destroy()

      // const select = new Select({
      //   component: this,
      //   handle: caption.handle,
      // }); this.destructable = ()=>focus.destroy()
      // this.on("selected", selected => caption.selected = selected);









    },














  };

  constraints = {
  };

}
