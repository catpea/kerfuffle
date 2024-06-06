import { svg, update } from "/plug-ins/domek/index.js"

import Component from "/plug-ins/windows/Component.js";
import Select from "/plug-ins/select/index.js";


// import Connect from "/plug-ins/connect/index.js";
import Connect from "/plug-ins/meowse/Connect.js";

export default class Anchor {

  static extends = [Component];

  properties = {
    pad: null
  };

  observables = {
    side: 0,
    color: 'transparent',
  };

  constraints = {
    mount: {
      '.scene is required': function(){ if(!this.scene){return {error:'.svg not found'}} },
    }
  }

  methods = {

    initialize(){

      this.r = 8;
      this.s = 4;

      this.w = this.r*2;
      this.h = this.r*2+this.s;

      this.x = 0;
      this.y = 0;





    },

    mount(){

      this.el.Pad = svg.circle({
        name: this.name,
        class: 'editor-socket-pad',
        'vector-effect': 'non-scaling-stroke',
        r: this.r,
        cx: this.x,
        cy: this.y,
      });

      this.on("selected", selected => selected?this.el.Pad.classList.add('selected'):this.el.Pad.classList.remove('selected'));

      const select = new Select({
        component: this,
        handle: this.el.Pad,
      }); this.destructable = ()=>select.destroy()

      this.el.Pad.dataset.target = [this.name, this.getRootContainer().id].join(':')

      this.pad = this.el.Pad;

      this.on('name',  name=>update(this.el.Pad,{name}), );
      this.on('x',      cx=>update(this.el.Pad,{cx}),     );
      this.on('y',      cy=>update(this.el.Pad,{cy}),     );
      this.on('r',      r=>update(this.el.Pad,{r}),     );
      this.appendElements();

      // OLD CONNECT
      // const connect = new Connect({
      //   anchor: this,
      //   zone: this.getApplication().pane.viewport.background,
      //   parent: this,
      // }); this.destructable = ()=>connect.destroy()

      const connect = new Connect({
        area: window,
        handle: this.el.Pad, //.parent.getApplication().pane.viewport.background,
        scale: ()=>this.getScale(this),
        // ---
        scene: this.scene,
        component: this,
      });
      this.destructable = ()=>connect.destroy();

    },

    destroy(){
      this.removeElements()
    }

  }

}
