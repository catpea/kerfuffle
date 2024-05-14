import Component from "/plug-ins/windows/Component.js";

import { svg, update } from "/plug-ins/domek/index.js"

export default class Container {
  static extends = [Component];

  properties = {
    layout: null,
  };

  observables = {
    children: [],
  };



  methods = {

    initialize(){

      this.on("children.created", (child) => {
        child.scene = this.scene;
        child.start();
        this.layout.manage(child);
      }, {replay: true});

      this.on("children.removed", (child) => {
        child.stop();
        this.layout.forget(child);
      });

    },

    mount(){



    },

    destroy(){
      this.removeElements()
    }

  }

}
