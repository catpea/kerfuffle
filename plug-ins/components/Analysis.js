import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Application from "/plug-ins/windows/Application.js";
import Foreign from "/plug-ins/windows/Foreign.js";

import Interface from '/plug-ins/components/analysis/Interface.svelte';
import stores from '/plug-ins/components/analysis/stores.js';

import { writable } from 'svelte/store'

export default class Analysis {
  static extends = [Application];

  properties = {
  };

  methods = {



    initialize(){
      this.createSocket('in', 0);


    },
    mount(){

      this.foreign = new Instance(Foreign);
      this.createWindowComponent( this.foreign );

      this.xWritable = writable(0);
      this.yWritable = writable(0);
      this.component = new Interface({
          target: this.foreign.body,
          props: {
            x: this.xWritable,
            y: this.yWritable,
            object: null,
            paneItems: stores.getPaneItems( this.getRoot() )
          }
      });

      this.pipe.on('in', (packet)=>{
        const object = this.getRoot().applications.get(packet.id);
        this.component.$set({ object});
        this.connectObservableToWritable( object, 'x', this, 'xWritable', (v)=>v.toFixed(2))
        this.connectObservableToWritable( object, 'y', this, 'yWritable', (v)=>v.toFixed(2))

        console.log(object);
      })

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
