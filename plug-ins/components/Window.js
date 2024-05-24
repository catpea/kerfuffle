import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Application from "/plug-ins/windows/Application.js";
import Pane from "/plug-ins/windows/Pane.js";
import Menu from "/plug-ins/components/Menu.js";

import { svg } from "/plug-ins/domek/index.js"


export default class Window {
  static extends = [Application];

  properties = {
  };

  methods = {

    openMenu({x,y,options, w=200, h=320}){
      console.log({x,y,options});

      if(this.menu) {
        this.menu.options = options;
        this.menu.x = x;
        this.menu.y = y;
        this.container.style.display = 'block';
        return;
      }
      // if(this.menu) this.menu.destroy();

      this.container = svg.g({ name: 'menu' });
      this.scene.appendChild(this.container);

      this.menu = new Instance(Menu, {parent:this, scene:this.container, x,y,w,h, isMenuWindow:true, options});
      // const textnode = document.createTextNode("Hello World, I am simple HTML you can hook into to parade foreign elements!");
      // menu.appendChild(textnode);
      this.menu.start();

    },

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
