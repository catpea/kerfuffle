import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Application from "/plug-ins/windows/Application.js";
import Foreign from "/plug-ins/windows/Foreign.js";

import Interface from '/plug-ins/components/architecture/Interface.svelte';
import stores from '/plug-ins/components/architecture/stores.js';

import stopWheel from '/plug-ins/stop-wheel/index.js';

export default class Architecture {
  static extends = [Application];

  properties = {
  };

  methods = {
    initialize(){
      this.createSocket('out', 1);
    },
    mount(){

      this.foreign = new Instance(Foreign);
      this.createWindowComponent( this.foreign );

      this.component = new Interface({
          target: this.foreign.body,
          props: {
            send: this.send.bind(this),
            tree: stores.getApplicationTree(this)
          }
      });

       stopWheel(this.foreign.body);
    },

    stop(){
      console.log('todo: stopping root application');
    },

    destroy(){
      console.log('todo: destroying root application');
      this.component.$destroy();
      this.dispose()
    },

  };
}
