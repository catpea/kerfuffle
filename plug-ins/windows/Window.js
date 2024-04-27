import {Instance} from "/plug-ins/object-oriented-programming/index.js";

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
  };

  properties = {
    contain:true,
  };

  methods = {

    initialize(){
    },

    mount(){

      // ADD DRAGGABLE CAPTION (aka handle)
      this.draw(); // WARNING: you must draw the window before drawing the caption, so that the caption is on top

      if(this.isRootWindow) return;

      let caption = new Instance(Caption, {h: 24, text: this.caption});
      this.on('caption', v=>caption.text=v)
      this.createWindowComponent(caption);
      //

      this.on("node", (node) => {
        if(node.caption) node.on("caption", caption => this.caption = caption);
      });

      // const move = new Move({
      //   component: this,
      //   handle: caption.handle,
      //   window: this,
      //   zone: window,
      // }); this.destructable = ()=>move.destroy()



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

      const focus = new Focus({
        handle: this.scene, // TIP: set to caption above to react to window captions only
        component: this,
        element: ()=> this.getApplication().scene,
      });
      this.destructable = ()=>focus.destroy()

      // const select = new Select({
      //   component: this,
      //   handle: caption.handle,
      // }); this.destructable = ()=>focus.destroy()
      // this.on("selected", selected => caption.selected = selected);



    },

    createWindowComponent(component){
      component.parent = this;
      this.children.create(component);
    },


  };

  constraints = {
  };

}
