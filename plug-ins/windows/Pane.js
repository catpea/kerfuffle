import { svg, update, click, text } from "/plug-ins/domek/index.js"
import {nest} from "/plug-ins/nest/index.js";

import Pan from "/plug-ins/pan/index.js";
import Zoom from "/plug-ins/zoom/inner.js";

import Node from "/plug-ins/node/Node.js";
import {Instance} from "/plug-ins/object-oriented-programming/index.js";


import Viewport from "/plug-ins/windows/Viewport.js";
import Container from "/plug-ins/windows/Container.js";
import Vertical from "/plug-ins/windows/Vertical.js";
import Horizontal from "/plug-ins/windows/Horizontal.js";

import Junction from "/plug-ins/windows/Junction.js";
import Line from "/plug-ins/windows/Line.js";

import Label from "/plug-ins/windows/Label.js";
import { RelativeLayout } from "/plug-ins/layout-manager/index.js";

const uuid = bundle['uuid'];

const through = (...functions) => {
  return (data) => {
    let response = data;
    for (const funct of functions) {
      response = funct(response) ?? response;
    }
    return response;
  }
}

export default class Pane {

  static extends = [Vertical];

  properties = {
    contain:true,
  };

  observables = {
    panX: 200,
    panY: 200,
    zoom: 2,

    applications: [],
    elements: [],
    anchors: [],
    pipes: [],
    types: [ Junction, Line ],
  };

  methods = {

    initialize(){
      if(this.getRootContainer().isRootWindow) return;

      console.info('Line must detect the g it should be placed into');
      this.h = 400;
      this.subLayout = new RelativeLayout(this);

    },

    mount(){


      {
        let v = 0;
        setInterval(x=>{;
          let Δ = Math.sin(v);
          v=v+0.003;
          if(v>=Math.PI) v = 0
          this.panX = (100*Δ);
          this.panY = (100*Δ);
        }, 1_000/32)

      }
      {
        let a = Math.PI/16
        let v = a;
        setInterval(x=>{;
          let Δ = Math.sin(v);
          v=v+0.01;

          this.zoom = (2*Δ);
          console.log(this.zoom);
          // console.log(v);
          // console.log(Δ);

            if(v>=Math.PI-a) v = a
        }, 1_000/32)

      }



      /*
      - standard scene set by parent
        - Horizontal based menu
          - some Label buttons
        - Viewport paneBody (container for UI elements)
      */

      // Add Menu
      const [horizontal, [ addButton, delButton ]] = nest(Horizontal, [
        [Label, {h: 32, W:32, text: 'Add', parent:this}, (c,p)=>p.children.create(c)],
        [Label, {h: 32, W:32, text: 'Del', parent:this}, (c,p)=>p.children.create(c)],
      ], (c)=>this.children.create(c));

      // Add Menu Listeners
      this.disposable = click(addButton.handle, e=>{
        const id = uuid();
        const node = new Instance( Node, {id, origin:this.getRootContainer().id, type: "Junction", x: 300, y: 300, data:{}} );
        this.elements.create(node);
      })

      // Add Viewport
      const paneBody = new Instance(Viewport, {h: 666, parent: this});
      this.children.create( paneBody );
      globalThis.project.origins.create({ id: this.getRootContainer().id, root: this, scene:paneBody.el.Mask })

      // Based on pan and zoom adjust the viewport.
      console.warn(`viewport is moved down by .25 of menu?.. this is a bug`);
      this.on('panX', v=> requestAnimationFrame(() => { paneBody.elements.style.transform = `translate(${this.panX}px, ${this.panY}px)` }));
      this.on('panY', v=> requestAnimationFrame(() => { paneBody.elements.style.transform = `translate(${this.panX}px, ${this.panY}px)` }));
      this.on('zoom', v=> requestAnimationFrame(() => { paneBody.elements.style.scale = this.zoom }));

      this.on("elements.created", (node) => {
        const Ui = this.types.find(o=>o.name==node.type); // concept as in conceptmap is a component as it is a GUI thing.
        if(!Ui) return console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
        const ui = new Instance(Ui, {id:node.id, node, scene: paneBody.elements});
        this.applications.create(ui);
        ui.start()
        this.subLayout.manage(ui);
      }, {replay:true});

      this.on("elements.removed", ({id}) => {
        this.applications.get(id).stop();
        this.applications.get(id).destroy();
        this.applications.remove(id);
      });




      this.appendElements();



      if(1){


        const diagnosticText1 = new DiagnosticText('zoom', paneBody.elements, 'yellow')
        this.any(['panX', 'panY'],coordinates=>diagnosticText1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));
        paneBody.any(['x','y'], coordinates=>diagnosticText1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));


        const diagnosticWidth1 = new DiagnosticWidth('panX', paneBody.background, 'gold')
        this.any(['panX', 'panY'], coordinates=>diagnosticWidth1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));
        paneBody.any(['x','y','w','h'], coordinates=>diagnosticWidth1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));

        const diagnosticHeight1 = new DiagnosticHeight('panY', paneBody.background, 'gold')
        this.any(['panX', 'panY'],coordinates=>diagnosticHeight1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));
        paneBody.any(['x','y','w','h'],coordinates=>diagnosticHeight1.draw(  { zoom: this.zoom, x: paneBody.x, y: paneBody.y, w: paneBody.w, h: paneBody.h, panX: this.panX, panY: this.panY, }));


        const diagnosticRuler1 = new DiagnosticRuler('scene ruler', this.scene, 'red')
        this.any(['x','y','w','h'],coordinates=>diagnosticRuler1.draw(coordinates));

        const diagnosticRuler2 = new DiagnosticRuler('elements/paneBody ruler', paneBody.elements, 'green')
        paneBody.any(['x','y','w','h'],coordinates=>diagnosticRuler2.draw(coordinates, -350));

        const diagnosticCross1 = new DiagnosticCross('scene', this.scene, 'red')
        this.any(['x','y','w','h'],coordinates=>diagnosticCross1.draw(coordinates));

        const diagnosticCross2 = new DiagnosticCross('elements/paneBody', paneBody.elements, 'green')
        paneBody.any(['x','y','w','h'], through(  o=>this.transform(o), o=>diagnosticCross2.draw(o) ) );


        const centerCircle = svg.circle({style:{'pointer-events': 'none'}, stroke:'red', r:5})
        paneBody.elements.appendChild(centerCircle);
        paneBody.any(['x','y','w','h'], ({x,y,w,h})=>update(centerCircle, {cx:x+w/2,cy:y+h/2 }))

        const outlineRectangle = svg.rect({style:{'pointer-events': 'none'}, stroke:'blue', fill:'none'})
        paneBody.elements.appendChild(outlineRectangle);
        // paneBody.any(['x','y','w','h'], ({x,y,w,h})=>update(outlineRectangle, {x,y,width:w,height:h}))
        paneBody.any(['x','y','w','h'], through( o=>console.log(o), o=>this.transform(o, ['x','y','w','h']), ({x,y,w,h})=>({x,y,width:w,height:h}), o=>update(outlineRectangle, o), o=>console.log(o) ) )

      }




      console.warn('these must be configured properly as elemnts are more responsible now. mouse wheel is tracked via the transformed g background rectangle that should have a grid or dot pattern');
      if(0){


      const pan = new Pan({
        component: this,
        handle: paneBody.el.Container,
        zone: window,
        // XXX: transformMovement: (v)=>v/globalThis.project.zoom,
      }); this.destructable = ()=>pan.destroy()

      // const diagnosticPoint1 = new DiagnosticPoint('scrollwheel hit', this.elements, 'yellow')

      const zoom = new Zoom({
        component: this,
        area: paneBody,
        element: paneBody.el.Container,
        zone: paneBody.el.Container,
        // transformMovement: (v)=>v/globalThis.project.zoom,
        probe: ({cursor})=>{
          // diagnosticPoint1.draw(cursor)
        },
      }); this.destructable = ()=>zoom.destroy()

      }




    },

    transform(o, keys=null){
      let response = o;
      for (const transform of this.getTransforms(this)) {
        response = Object.fromEntries(Object.entries(response).map(([k,v])=>{
          if(keys===null){ // transform all
            return [k, v/this.zoom]
          } else if(keys.length){
            if(keys.includes(k)){ // picked
              return [k,v/this.zoom];
            }else{ // do nothing
              return [k,v];
            }
          }
        }));
      }
      return response;

    }

  }

}


class DiagnosticText {
  space = 8;
  name;
  parent;
  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;
    this.textContainer = svg.text({ 'dominant-baseline': 'hanging', fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text("xxxx");
    this.textContainer.appendChild(this.text);
  }
  draw({zoom, x,y,w,h}){
    update(this.textContainer, {x,y});
    this.text.nodeValue = `${zoom} ${this.name}`
  }
}

class DiagnosticCross {
  space = 8;
  name;
  parent;
  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;
    this.diagonal1 = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.diagonal1);
    this.diagonal2 = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.diagonal2);
    this.centerCircle = svg.circle({style:{'pointer-events': 'none'}, stroke, r: this.space})
    this.parent.appendChild(this.centerCircle);
    this.indicatorLine = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.indicatorLine);
    this.textContainer = svg.text({ 'dominant-baseline': 'middle', fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text("xxxx");
    this.textContainer.appendChild(this.text);
  }
  draw({x,y,w,h}){
    update(this.diagonal1, {x1:x, y1:y, x2:x+w, y2:y+h} );
    update(this.diagonal2, {x1:x, y1:y+h, x2:x+w, y2:y} );
    update(this.centerCircle, {cx:x+w/2,cy:y+h/2 } );
    update(this.indicatorLine, {x1:x+w/2+this.space, y1:y+h/2, x2:x+w/2+this.space*8, y2:y+h/2})
    update(this.textContainer, {x:x+w/2+this.space*8,y:y+h/2});
    this.text.nodeValue = `${x+w/2}x ${y+h/2}y ${w}w ${h}h ${this.name}`
  }
}




class DiagnosticRuler {
  mark = 12;
  marks = [];
  labels = [];
  space = 50;
  name;
  parent;

  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;
    this.diagonal1 = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.diagonal1);
    for (let markNumber = 0; markNumber <= this.mark; markNumber++) {
      const mark = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
      this.parent.appendChild(mark);
      this.marks[markNumber] = mark;
      //
      const container = svg.text({ 'dominant-baseline': 'middle', fill:stroke });
      this.parent.appendChild(container);
      const label = text(`#${markNumber}`);
      container.appendChild(label);
      this.labels[markNumber] = {container, label};

    }
    this.textContainer = svg.text({fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text(this.name);
    this.textContainer.appendChild(this.text);
  }
  draw({x,y},n=0){
    y=y+n
    let baseY = y+this.space*8;
    let deltaY = this.space/3;
    update(this.diagonal1, {x1:x, y1:baseY, x2:x+(this.mark*this.space), y2:baseY} );
    for (let markNumber = 0; markNumber <= this.mark; markNumber++) {

      const mark = this.marks[markNumber];
      update(mark, {x1:markNumber*this.space, y1:baseY-deltaY, x2:markNumber*this.space, y2:baseY+deltaY/4} );
      //
      const {container, label} = this.labels[markNumber];
      update(container, {x:markNumber*this.space, y:baseY-deltaY});
      label.nodeValue = `${markNumber*this.space}x`;
    }
    update(this.textContainer, {x,y:baseY+deltaY});

    this.text.nodeValue = `${this.name}`



  }
}





class DiagnosticWidth {
  name;
  parent;
  space = 32;
  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;
    this.diagonal1 = svg.line({style:{'pointer-events': 'none'}, opacity:.4, stroke, fill:'none'});
    this.diagonal2 = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.diagonal1);
    this.parent.appendChild(this.diagonal2);

    this.textContainer = svg.text({fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text(this.name);
    this.textContainer.appendChild(this.text);
  }
  draw({x,y, panX, panY, zoom}, n=0){
    // update(this.diagonal1, {x1:x, y1:y+panY, x2:x+panX, y2:y+panY} );
    update(this.diagonal2, {x1:x*zoom, y1:y+(panY*zoom), x2:x+(panX*zoom), y2:y+(panY*zoom)} );
    update(this.textContainer, {x:x*zoom,y:y+(panY*zoom)});
    this.text.nodeValue = `${this.name}: ${panX}x (${(panX*zoom).toFixed(4)}x scaled)`
  }
}

class DiagnosticHeight {
  name;
  parent;
  space = 32;

  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;
    this.diagonal1 = svg.line({style:{'pointer-events': 'none'}, opacity:.4, stroke, fill:'none'});
    this.diagonal2 = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.diagonal1);
    this.parent.appendChild(this.diagonal2);

    this.textContainer = svg.text({fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text(this.name);
    this.textContainer.appendChild(this.text);
  }
  draw({x,y, panX, panY, zoom}, n=0){
    // update(this.diagonal1, {x1:panX, y1:y, x2:panX, y2:y+panY} );
    update(this.diagonal2, {x1:panX*zoom, y1:y, x2:panX*zoom, y2:y+(panY*zoom)} );

    update(this.textContainer, {x:panX*zoom, y:(y+(panY*zoom))/2});
    this.text.nodeValue = `${this.name}: ${panY}y (${(panY*zoom).toFixed(4)}y scaled)`
  }
}


class DiagnosticPoint {
  space = 8;
  name;
  parent;
  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;
    this.centerCircle = svg.circle({style:{'pointer-events': 'none'}, stroke, r: this.space})
    this.parent.appendChild(this.centerCircle);
    this.indicatorLine = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.indicatorLine);
    this.textContainer = svg.text({ 'dominant-baseline': 'middle', fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text("xxxx");
    this.textContainer.appendChild(this.text);
  }
  draw({x,y}){
    update(this.centerCircle, {cx:x,cy:y } );
    update(this.indicatorLine, {x1:x+this.space, y1:y, x2:x+this.space*4, y2:y})
    update(this.textContainer, {x:x+this.space*4,y:y});
    this.text.nodeValue = `${x}x ${y}y ${this.name}`
  }
}
