import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Vertical from "/plug-ins/windows/Vertical.js";
import Foreign from "/plug-ins/windows/Foreign.js";
import { svg, update } from "/plug-ins/domek/index.js"
import UI from "./ui/Menu.svelte";
import stopWheel from '/plug-ins/stop-wheel/index.js';


export default class Menu {
  static extends = [Vertical];

  properties = {
  };

  observables = {
    show: false,
    options: {},
  };

  methods = {

    initialize(){
      this.r = 5;
      this.b = 5;
      this.s = 3;
      this.p = 3;
    },

    mount(){

      this.el.Background = svg.rect({
        name: this.oo.name,
        style:{ background:'red'},
        class: 'editor-menu',
        ry: this.r,
        'stroke-width': 0,
        'vector-effect': 'non-scaling-stroke',
        x:0,
        y:0,
      });

      this.on('w',  width=>update(this.el.Background,{width}), );
      this.on('h', height=>update(this.el.Background,{height}),);
      this.on('x',      x=>update(this.el.Background,{x}),     );
      this.on('y',      y=>update(this.el.Background,{y}),     );

      this.appendElements();

      this.foreign = new Instance(Foreign, {parent: this});
      this.children.create(this.foreign);

      this.ui = new UI({
        target: this.foreign.body,
        control: this.control,
      });
      stopWheel(this.foreign.body);

      this.on('options', options=> this.ui.$set({options}));


      this.foreign.body.addEventListener('click', e => {
         this.parent.closeMenu();
      });

      this.on('h', (h)=>{
        console.log({h});
        this.foreign.h = h - (this.p*2) - (this.b*2);
      });

      this.on('show', (show)=>{
        console.log('menu on show', show);
        if(show){
          this.el.Background.style.display = 'block';
          this.foreign.body.style.display = 'block';
        }else{
          this.el.Background.style.display = 'none';
          this.foreign.body.style.display = 'none';
        }
      });


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
