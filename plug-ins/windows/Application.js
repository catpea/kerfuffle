import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Window from "/plug-ins/windows/Window.js";

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

      // All Applications Register Themselves
      this.getRoot().origins.create(this);

    },
 

  };
}
