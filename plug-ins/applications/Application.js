import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Window from "/plug-ins/windows/Window.js";
import Pane from "/plug-ins/windows/Pane.js";

export default class Application {
  static extends = [Window];
  methods = {
    initialize(){
      this.w = 800;
      this.h = 600;
    },

    mount(){
      const pane = new Instance(Pane, {url: this.url});
      this.createWindowComponent( pane );
      this.on("node", (node) => {
        node.on("url", url => pane.url = url);
      });
    },

    stop(){
      console.log('todo: stopping Application pane...');
    },
    destroy(){
      console.log('todo: destroying Application pane...');
      this.dispose()
    },
  };
}
