import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Application from "/plug-ins/windows/Application.js";
import Foreign from "/plug-ins/windows/Foreign.js";

import Interface from '/plug-ins/components/architecture/Interface.svelte';
import stores from '/plug-ins/components/architecture/stores.js';

export default class Tree {
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

      const component = new Interface({
          target: this.foreign.body,
          props: {
            paneItems: stores.getPaneItems( this.getRoot() )
          }
      });





      this.on('h', (h)=>{
        // console.log({h});
      });

      console.log('XXX', this.getRoot());


    },

    stop(){
      console.log('todo: stopping root application');
    },

    destroy(){
      console.log('todo: destroying root application');
      this.dispose()
    },

  };
}
