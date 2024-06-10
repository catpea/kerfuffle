import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Application from "/plug-ins/windows/Application.js";
import Pane from "/plug-ins/windows/Pane.js";
import Menu from "/plug-ins/windows/Menu.js";
import Overlay from "/plug-ins/windows/Overlay.js";

import { svg, click } from "/plug-ins/domek/index.js"


export default class Window {
  static extends = [Application];

  properties = {
    serializables: 'id x y w h showMenu showStatus zoom library'.split(' ')
  };

  methods = {

    // TODO: menu should be destroyed/recreated each time

    closeMenu(){
      console.log('Close Menu');
        this.overlay.show = false;
        this.menu.show = false;
        this.container.style.display = 'none';


    },
    openMenu({x,y,options, w=250, h=280}){

      if(this.menu) {
        this.menu.options = options;
        this.menu.x = x;
        this.menu.y = y;

        this.container.style.display = 'block';
        this.overlay.show = true;
        this.menu.show = true;

        return;
      }
      // if(this.menu) this.menu.destroy();

      this.container = svg.g({ name: 'menu' });

      this.scene.appendChild(this.container);

      this.overlay = new Instance(Overlay, {parent:this, scene:this.container});
      this.overlay.start();
      this.overlay.show = true;

      this.menu = new Instance(Menu, {parent:this, scene:this.container, x,y,w,h, options});
      this.menu.start();
      this.menu.show = true;

    },

    initialize(){
      this.createSocket('in', 0);
      this.createSocket('out', 1);
    },

    mount(){



      this.pane = new Instance(Pane, {library: this.library});

      this.on("node", (node) => {
        node.on("url", url => this.pane.url = url);
        node.on("zoom", zoom => this.pane.zoom = zoom);
        this.pane.on("zoom", zoom => this.zoom = zoom);

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
