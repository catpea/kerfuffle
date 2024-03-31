import debounce from "/plug-ins/debounce/index.js";

import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Node from "/plug-ins/node/Node.js";
import Application from "/plug-ins/applications/Application.js";

export default class System {

  properties = {
    application: null,
    debouncedOnResize: null,
    scene: undefined,

  };

  observables = {
    origins:[],
  };

  constraints = {
  };


  methods = {

    initialize(){
    },

    mount(){

      const node = new Instance(Node, {id:0, origin: -1, data:{}});
      this.application = new Instance(Application, {id:node.id, node, scene:this.scene, isRootWindow: true});
      this.application.start()

      const onResize = () => {
        this.application.w = this.svg.clientWidth;
        this.application.h = this.svg.clientHeight;
      };
      this.debouncedOnResize = debounce(onResize, 10);
      window.addEventListener('resize', this.debouncedOnResize);
      onResize();

    },

    destroy(){
      window.removeEventListener('resize', this.debouncedOnResize);
    },

  };

}
