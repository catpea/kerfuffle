import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Window from "/plug-ins/windows/Window.js";
import Foreign from "/plug-ins/windows/Foreign.js";

import Test from "./Reduce.svelte";
import Stepper from "../api/Stepper.js";


export default class Reduce {
  static extends = [Stepper, Window];

  properties = {
  };

  methods = {

    initialize (){
      this.createSocket('in', 0);
      this.createSocket('function', 0);
      this.createSocket('out', 1);
    },

    mount(){
      this.foreign = new Instance(Foreign);
      this.createWindowComponent( this.foreign );
      this.ui = new Test({ target: this.foreign.body, });
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
