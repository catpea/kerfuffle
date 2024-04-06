import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Window from "/plug-ins/windows/Window.js";
import Pane from "/plug-ins/windows/Pane.js";

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
      this.w = 800;
      this.h = 600;

      // All Applications Register Themselves
      this.getRoot().origins.create(this);
    },

  };
}
