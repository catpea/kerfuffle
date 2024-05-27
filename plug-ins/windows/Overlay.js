import Component from "/plug-ins/windows/Component.js";
import debounce from "/plug-ins/debounce/index.js";

import { svg, update } from "/plug-ins/domek/index.js"

export default class Overlay {
  static extends = [Component];

  properties = {
    layout: null,
  };

  observables = {
    show: false,
    children: [],
  };



  methods = {

    initialize(){

      this.debouncedDnResizeWindow = debounce( this.onResizeWindow.bind(this), 10 );

      this.on('show', (show)=>{
        if(show){
          update(this.el.Overlay,{style:{display:'block'}});
        }else{
          update(this.el.Overlay,{style:{display:'none'}});
        }
      }, {autorun:false});

    },

    drawOverlay(){

      this.el.Overlay = svg.rect({
        name: this.oo.name,
        style:{ display:'none'},
        class: 'editor-overlay',
        ry: this.r,
        'stroke-width': 0,
        'vector-effect': 'non-scaling-stroke',
        x:0,
        y:0,
      });

      this.on('w',  width=>update(this.el.Overlay,{width}), );
      this.on('h', height=>update(this.el.Overlay,{height}),);

      this.appendElements();

      this.el.Overlay.addEventListener('click', e => {
        console.log('Overlay click');
         this.parent.closeMenu();
      });

    },

    mount(){
      this.drawOverlay();
      this.resizeToFullWindow();
    },



    destroy(){
      window.removeEventListener('resize', this.debouncedDnResizeWindow);
      this.removeElements();
    },

    resizeToFullWindow(){
      window.addEventListener('resize', this.debouncedDnResizeWindow);
      this.onResizeWindow();
    },

    onResizeWindow(){
      console.log(this);
      update(this.el.Overlay, {width:  this.getRoot().svg.clientWidth} );
      update(this.el.Overlay, {height: this.getRoot().svg.clientHeight} );

    },



  }

}
