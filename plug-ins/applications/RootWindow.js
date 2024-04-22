import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Application from "/plug-ins/windows/Application.js";
import Pane from "/plug-ins/windows/Pane.js";


export default class RootWindow {
  static extends = [Application];

  properties = {
    isRootWindow: true,
  };

  methods = {

    mount(){
      const pane = new Instance(Pane);
      this.on("node", (node) => {
        console.log('nnn', node);
        node.on("url", url => pane.url = url);
      });
      this.createWindowComponent( pane );
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