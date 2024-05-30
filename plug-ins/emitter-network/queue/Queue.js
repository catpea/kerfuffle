import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Application from "/plug-ins/windows/Application.js";
import Foreign from "/plug-ins/windows/Foreign.js";

import Test from "./Queue.svelte";


export default class Queue {
  static extends = [Application];

  properties = {
  };

  methods = {

    mount(){

      this.foreign = new Instance(Foreign);
      this.createWindowComponent( this.foreign );

      new Test({
          target: this.foreign.body,
      });


      this.on('h', (h)=>{
        console.log({h});
      });


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
