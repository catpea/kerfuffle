import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import { front } from "/plug-ins/domek/index.js"

import Horizontal from "/plug-ins/windows/Horizontal.js";
import Control from "/plug-ins/windows/Control.js";
import Label from "/plug-ins/windows/Label.js";
// import Anchor from "/plug-ins/windows/Anchor.js";

import debounce from "/plug-ins/debounce/index.js";
import { svg, update, click } from "/plug-ins/domek/index.js"
import {nest} from "/plug-ins/nest/index.js";

export default class Caption {

  static extends = [Control];

  properties = {
    handle:null,
  };

  observables = {
    text: '',
  };

  constraints = {
    mount: {
      '.scene is required to start the universe': function(){ if(!this.scene){return {error:'.svg not found'}} },
    }
  }

  methods = {

    initialize(){
      // console.log(`%cComponent.initialize!`, 'background: hsl(180, 80%, 60%); color: black;', this);

    },

    mount(){

      const [horizontal, [ info1, maximizeButton ]] = nest(Horizontal, { parent:this, scene:this.scene, s:2  }, [
        [Label, {h: 24,       text: this.text, parent:this, r:3}, (c,p)=>p.children.create(c)],
        [Label, {h: 24, W:24, text: '++', parent:this , r:3}, (c,p)=>p.children.create(c)],
      ], (c)=>{
        this.destructable = ()=>{c.stop(); c.destroy();}
      })
      this.handle = info1.el.Container;
      horizontal.start()

      this.on("selected", selected => selected?info1.el.Container.classList.add('selected'):info1.el.Container.classList.remove('selected'));
      this.on('text',  text=>info1.text=text, );
      this.any(['x','y','w','h',  ],  ({x,y,w,h})=>Object.assign(horizontal, {x,y,w,h }));

      let maximized = false;

      const parent = this.getApplication().parent?this.getApplication().parent.getApplication():this.getRootContainer();
      const current = this.getApplication();

      const bottle = [
        [parent.pane, 'zoom', null],
        [parent.pane, 'panX', null],
        [parent.pane, 'panY', null],
        [current, 'x', null],
        [current, 'y', null],
        [current, 'w', null],
        [current, 'h', null],
      ];
      let unwatch;

      this.disposable = click(maximizeButton.handle, e=>{
        e.stopPropagation();

        front(current.scene)

        if(maximized){ // restore/minimize
          unwatch.map(x=>x())
          for (const [i,[o,k,v]] of bottle.entries()) {
            o[k] = v;
          }
          maximized = false;
        }else{ // save/maximize

          for (const [i,[o,k,v]] of bottle.entries()) {
            bottle[i][2] = o[k];
          }

          // maximization protocol
            parent.pane.zoom = 1;
            parent.pane.panX = 0;
            parent.pane.panY = 0;
            current.x = 0;
            current.y = 0;

            // current.w = parent.pane.viewport.w/parent.pane.viewport.zoom;
            // current.h = parent.pane.viewport.h/parent.pane.viewport.zoom;

            unwatch = parent.pane.viewport.any(['w','h'], ({w,h})=>{
              current.w = parent.pane.viewport.w/parent.pane.viewport.zoom;
              current.h = parent.pane.viewport.h/parent.pane.viewport.zoom;
            })

          // maximization protocol

          maximized = true;
        }





      });


      //
      // let win = this.getApplication();
      // win.any([  'h',  ],  ({ h})=>{
      //
      //   const viewport = win.pane?.viewport;
      //   if(!viewport) return;
      //   const childrenHeight = win.pane.children.filter(c=>c!==viewport).reduce((total, c) => total + (c.h), 0);
      //   console.log({childrenHeight});
      //   const freeSpace = win.h - childrenHeight;
      //   console.log({freeSpace});
      //
      //     viewport.h = freeSpace;
      //     viewport.H = freeSpace;
      //
      // });

        // win.on('h', parentH=>{
        //
        //   const childrenHeight = win.pane.children.filter(c=>c!==viewport).reduce((total, c) => total + (c.h), 0);
        //   console.log({childrenHeight}, win.pane.children);
        //   const freeSpace = parentH - childrenHeight;
        //   console.log({freeSpace});
        //   // viewport.h = freeSpace;
        //   // viewport.H = freeSpace;
        // })


      // this.disposable = click(maximizeButton.handle, e=>{
      //   // return;
      //   e.stopPropagation();
      //
      //   const parent = this.getApplication().parent?this.getApplication().parent.getApplication():this.getRootContainer();
      //   const current = this.getApplication();
      //
      //   this.getRootContainer().svg.appendChild(current.scene)
      //   current.parent = this.getRootContainer();
      //
      //
      //   console.log(parent, current);
      //   // parent.pane.zoom = 1;
      //   // parent.pane.panX = 0;
      //   // parent.pane.panY = 0;
      //
      //   // current.pane.zoom = 1;
      //   // current.pane.panX = 0;
      //   // current.pane.panY = 0;
      //   //
      //   current.x = parent.x;
      //   current.y = parent.y;
      //   current.w = parent.w;
      //   current.h = parent.h;
      //
      //   const viewport = current.pane.viewport;
      //
      //   parent.on('h', parentH=>{
      //
      //     const childrenHeight = current.pane.children.filter(c=>c!==viewport).reduce((total, c) => total + (c.h), 0);
      //     console.log({childrenHeight}, current.pane.children);
      //     const freeSpace = parentH - childrenHeight;
      //     console.log({freeSpace});
      //     viewport.h = freeSpace;
      //     viewport.H = freeSpace;
      //   })
      //
      //
      //
      //   //
      //   // current.pane.zoom = 1;
      //
      //   //
      //   // console.log(`Maximizing ${wind.id}`, wind.scene, root.scene, wind.viewport.body);
      //   // wind.x = 0;
      //   // wind.y = 0;
      //   // wind.panX = 0;
      //   // wind.panY = 0;
      //   // wind.zoom = 1;
      //   //
      //   // root.svg.appendChild(wind.scene)
      //   // // move the vieport-body into root
      //   //
      //   //
      //   // const viewport = wind.pane.viewport;
      //   //
      //   //
      //   // const onResize = () => {
      //   //   wind.w = root.svg.clientWidth;
      //   //   wind.h = root.svg.clientHeight;
      //   //   wind.H = root.svg.clientHeight;
      //   //
      //   //   //
      //   //   // const allChildren = item.children
      //   //   // .map(c=>c.oo.name);
      //   //   //
      //   //   // const otherChildren = item.children
      //   //   //   .filter(c=>c.oo.name!='Pane')
      //   //   //
      //   //   //   console.log('otherChildren', allChildren, otherChildren);
      //   //   //
      //   //   // const childrenHeight = otherChildren
      //   //   //   .reduce((total, c) => total + (c.h), 0);
      //   //   //
      //   //   // const freeSpace = root.svg.clientHeight - childrenHeight;
      //   //   //
      //   //   // paneBody.h = freeSpace;
      //   //   // paneBody.H = freeSpace;
      //   //
      //   // };
      //   //
      //   // this.debouncedOnResize = debounce(onResize, 10);
      //   // window.addEventListener('resize', this.debouncedOnResize);
      //   // onResize();
      //   //
      //   //
      //   // wind.on('h', parentH=>{
      //   //   console.log(viewport.id, wind.pane.children.map(o=>o.id));
      //   //
      //   //
      //   //   const childrenHeight = wind.pane.children.filter(c=>c!==viewport).reduce((total, c) => total + (c.h), 0);
      //   //   console.log({childrenHeight});
      //   //   const freeSpace = parentH - childrenHeight;
      //   //   console.log({freeSpace});
      //   //   viewport.h = freeSpace;
      //   //   viewport.H = freeSpace;
      //   // })
      //   //
      //   //
      //   //
      //   //
      //   //
      //   //
      //
      // });

    },

    destroy(){
      this.removeElements()
    }

  }

}
