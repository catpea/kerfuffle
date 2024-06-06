import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Window from "/plug-ins/windows/Window.js";
import EventEmitter from "/plug-ins/event-emitter/EventEmitter.js";

export default class Application {
  static extends = [Window];

  properties = {
    isApplication: true,
  };

  observables = {
    url: null,
  };

  methods = {

    initialize(){
      this.controller = new EventEmitter();

      // this.intervalId = setInterval(x=>this.controller.emit('step'), 666);
      // this.controller.emit('step');

      // All Applications Register Themselves
      this.getRoot().origins.create(this);

    },


  };
}
