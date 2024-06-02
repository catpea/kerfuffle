import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Window from "/plug-ins/windows/Window.js";
import Foreign from "/plug-ins/windows/Foreign.js";

import QueueUI from "./Queue.svelte";

export default class Queue {
  static extends = [Window];

  methods = {

    initialize (){
      this.counter = 1;
      this.createSocket('out', 1);

    },

    mount(){

      this.foreign = new Instance(Foreign);
      this.createWindowComponent( this.foreign );
      this.ui = new QueueUI({ target: this.foreign.body, });

      this.getApplication().controller.on('step', x=>{
          if(this.counter<10) this.step();
      });

    },

    stop(){
      console.log('todo: stopping root application');
    },

    destroy(){
      console.log('todo: destroying root application');
      this.dispose()
    },

    // --- //

    step(){
      const packet = {
        count: this.counter++,
        timestamp: (new Date()).toISOString(),
      };
      this.ui.$set({count: packet.count});

      this.pipe.emit('out', {source:this, detail:packet});
      this.el.ComponentBackground.classList.add('indicate');
      setTimeout(()=>this.el.ComponentBackground.classList.remove('indicate'), 333)
      this.packet = null;
    },

  };
}
