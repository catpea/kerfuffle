import { svg, update } from "/plug-ins/domek/index.js"


import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Socket from "/plug-ins/windows/Socket.js";
import { SocketLayout } from "/plug-ins/layout-manager/index.js";


import Vertical from "/plug-ins/windows/Vertical.js";
import Control from "/plug-ins/windows/Control.js";
import Caption from "/plug-ins/windows/Caption.js";

import Move from "/plug-ins/meowse/Move.js";
import Focus from "/plug-ins/meowse/Focus.js";

// import Select from "/plug-ins/select/index.js";


export default class Window {

  static extends = [Vertical];

  observables = {
    caption: 'Untitled',

    showCaption: true,
    showMenu: false,
    showStatus: false,

    socketRegistry: [],
    sockets: [],
  };

  properties = {
    contain:true,
  };

  methods = {




    initialize(){
      if(!this.isRootWindow){
        this.r = 5;
        this.b = 5;
        this.s = 3;
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






      this.socketLayout = new SocketLayout(this, {source: 'sockets'});

      this.on("sockets.created", (socket) => {
        socket.start();
        this.socketLayout.manage(socket);
        this.getApplication().socketRegistry.create(socket);
        // this.createPipe(socket.name, socket.side);
      }, {replay: true});

      this.on("sockets.removed", (socket) => {
        socket.stop();
        // this.removePipe(socket.name);
        this.getApplication().socketRegistry.remove(id);
        this.removeControlAnchor(socket.id);
        this.socketLayout.forget(socket);
      });


    },

    createWindowComponent(component){
      component.parent = this;
      this.children.create(component);
    },








    createSocket(name, side){

      if(!name) throw new Error(`It is not possible to create an socket without an socket name.`);
      if(!side===undefined) throw new Error(`It is not possible to create an socket without specifying a side, 0 or 1.`);

      const id = [this.id, name].join('/');
      const socket = new Instance(Socket, { id, name, side, parent: this, scene: this.scene } )

      this.sockets.create(socket);
    },

    removeSocket(id){
      this.sockets.remove(id);
    },



  };

  constraints = {
  };

}
