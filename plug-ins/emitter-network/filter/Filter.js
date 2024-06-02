import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Window from "/plug-ins/windows/Window.js";
import Foreign from "/plug-ins/windows/Foreign.js";

import Test from "./Filter.svelte";
import Stepper from "../api/Stepper.js";

/*
  Pad = graphic
*/

export default class Filter {
  static extends = [Stepper, Window];

  observables = {
    displayTitle: 'Filter',
    displayStatus: {counter:0, percent:0, length:100},
    displaySample: '(none)',
  };

  methods = {

    initialize (){
      this.caption = this.oo.name;

      this.createSocket('in', 0);
      this.createSocket('function', 0);
      this.createSocket('out', 1);
    },

    mount(){
      this.foreign = new Instance(Foreign);
      this.createWindowComponent( this.foreign );
      this.ui = new Test({
        target: this.foreign.body,
        control: this.control,
      });
      this.on('displayTitle', displayTitle=> this.ui.$set({displayTitle}));
      this.on('displayStatus', displayStatus=> this.ui.$set({displayStatus}));
      this.on('displaySample', displaySample=> this.ui.$set({displaySample}));

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
