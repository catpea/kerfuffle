import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Window from "/plug-ins/windows/Window.js";
import Connector from "/plug-ins/windows/Connector.js";

export default class Pipe {
  static extends = [Window];

  properties = {
    serializables: 'id from to out in'.split(' ')
  };

  methods = {
    initialize(){
      this.showCaption = false;
      this.isResizable = false;

    },
    mount(){

      this.connector = new Instance(Connector, {
        scene: this.scene,
        parent: this,
        from: this.node.from,
        to: this.node.to,
        out: this.node.out,
        in: this.node.in,
      });

      this.node.on("from", v => this.pipe.from = v);
      this.node.on("to", v => this.pipe.to = v);
      this.node.on("out", v => this.pipe.out = v);
      this.node.on("in", v => this.pipe.in = v);

      this.connector.start();


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
