import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Application from "/plug-ins/windows/Application.js";
import Pane from "/plug-ins/windows/Pane.js";

export default class Window {
  static extends = [Application];

  properties = {
  };

  methods = {

    mount(){
      this.pane = new Instance(Pane);
      this.on("node", (node) => {
        node.on("url", url => this.pane.url = url);
      });
      this.createWindowComponent( this.pane );
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
