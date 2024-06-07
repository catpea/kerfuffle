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
    control: null, // parent who holds the socket, set by socket api
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
        'data-control': this.control.id,
        'data-port': this.name,
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


      this.pad = this.el.Pad;

      this.on('name',  name=>update(this.el.Pad,{name}), );
      this.on('x',      cx=>update(this.el.Pad,{cx}),     );
      this.on('y',      cy=>update(this.el.Pad,{cy}),     );
      this.on('r',      r=>update(this.el.Pad,{r}),     );
      this.appendElements();

      const connect = new Connect({
        area: window,
        handle: this.el.Pad,
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
