import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Vertical from "/plug-ins/windows/Vertical.js";
import Control from "/plug-ins/windows/Control.js";
import Caption from "/plug-ins/windows/Caption.js";

import Move from "/plug-ins/move/index.js";
import Focus from "/plug-ins/focus/index.js";
import Select from "/plug-ins/select/index.js";


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

      const move = new Move({
        component: this,
        handle: caption.handle,
        window: this,
        zone: window,
      }); this.destructable = ()=>move.destroy()

      const focus = new Focus({
        component: this,
        handle: this.scene, // set to caption above to react to window captions only
      }); this.destructable = ()=>focus.destroy()

      const select = new Select({
        component: this,
        handle: caption.handle,
      }); this.destructable = ()=>focus.destroy()
      this.on("selected", selected => caption.selected = selected);



    },

    createWindowComponent(component){
      component.parent = this;
      this.children.create(component);
    },


  };

  constraints = {
  };

}
