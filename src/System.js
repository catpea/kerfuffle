import debounce from "/plug-ins/debounce/index.js";

import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Node from "/plug-ins/node/Node.js";


import TestWindow from "/plug-ins/applications/TestWindow.js";

import RootWindow from "/plug-ins/applications/RootWindow.js";

export default class System {

  properties = {
    rootWindow: null,
    debouncedOnResize: null,
    scene: undefined,

  };

  observables = {
    url: null,
    origins:[],
  };

  constraints = {
  };


  methods = {

    initialize(){
    },

    mount(){


      const node = new Instance(Node, {id:'0', origin:'0', url:this.url, data:{}});
      this.rootWindow = new Instance(RootWindow, {id:node.id, node, svg:this.svg, scene:this.scene, parent:null, origins:this.origins, isRootWindow: true});
      this.rootWindow.start()

      const onResize = () => {
        this.rootWindow.w = this.svg.clientWidth;
        this.rootWindow.h = this.svg.clientHeight;
        this.rootWindow.H = this.svg.clientHeight;
      };

      this.debouncedOnResize = debounce(onResize, 10);
      window.addEventListener('resize', this.debouncedOnResize);
      onResize();
    },

    destroy(){
      this.rootWindow.stop()
      window.removeEventListener('resize', this.debouncedOnResize);
    },

  };

}
