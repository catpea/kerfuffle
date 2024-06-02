import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Anchor from "/plug-ins/windows/Anchor.js";

import Control from "/plug-ins/windows/Control.js";
import { svg, html, update } from "/plug-ins/domek/index.js"

export default class Foreign {

  static extends = [Control];

  observables = {
    src: "",
  };

  constraints = {
    mount: {
      '.scene is required to start the universe': function(){ if(!this.scene){return {error:'.svg not found'}} },
    }
  }

  methods = {

    initialize(){
      this.flexible = true;
    },

    appendChild(domNode){
      return this.body.appendChild(domNode);
    },

    mount(){

      this.el.ForeignObject = svg.foreignObject({
        name: this.name,
        width: this.w,
        height: this.h,
        x: this.x,
        y: this.y,
      });

      this.body = html.div({
        style: {
          'overflow-y': 'scroll',
        }
      });

      this.el.ForeignObject.appendChild(this.body)

      this.on('name', name=>update(this.el.ForeignObject,{name}));

      this.on('w', width=>update(this.el.ForeignObject,{width}));
      this.on('h', height=>update(this.el.ForeignObject,{height}));
      this.on('x', x=>update(this.el.ForeignObject,{x}));
      this.on('y', y=>update(this.el.ForeignObject,{y}));
      this.on('w', width=>update(this.body, {style:{width: width+'px'}}));
      this.on('h', height=>update(this.body, {style:{height: height+'px'}}));



      this.appendElements();
    },

    destroy(){
      this.removeElements()
    }

  }

}
