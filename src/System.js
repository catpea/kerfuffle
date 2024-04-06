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


      // 
      //
      //
      //
      //
      //
      // const node1 = new Instance(Node, {id:1, origin: 1, x:10,y:10, data:{}});
      // const node2 = new Instance(Node, {id:2, origin: 1, x:500,y:500, data:{}});
      //
      // const app1 = new Instance(Application, {id:node1.id, node, scene:paneBody.elements, isRootWindow: false});
      // const app2 = new Instance(Application, {id:node2.id, node, scene:paneBody.elements, isRootWindow: false});
      //
      //
      //
      //
      //
      //


















    },

    destroy(){
      window.removeEventListener('resize', this.debouncedOnResize);
    },

  };

}
