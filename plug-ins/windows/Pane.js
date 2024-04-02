import { svg, update, click, text } from "/plug-ins/domek/index.js"
import {nest} from "/plug-ins/nest/index.js";

import Pan from "/plug-ins/pan/index.js";
import Zoom from "/plug-ins/zoom/inner.js";

import Node from "/plug-ins/node/Node.js";
import {Instance} from "/plug-ins/object-oriented-programming/index.js";


import Container from "/plug-ins/windows/Container.js";
import Vertical from "/plug-ins/windows/Vertical.js";
import Horizontal from "/plug-ins/windows/Horizontal.js";

import Junction from "/plug-ins/windows/Junction.js";
import Line from "/plug-ins/windows/Line.js";

import Label from "/plug-ins/windows/Label.js";
import { RelativeLayout } from "/plug-ins/layout-manager/index.js";

const uuid = bundle['uuid'];

export default class Pane {

  static extends = [Vertical];

  properties = {
    contain:true,
  };

  observables = {
    panX: 0,
    panY: 0,
    zoom: 1,

    applications: [],
    elements: [],
    anchors: [],
    pipes: [],
    types: [ Junction, Line ],
  };

  methods = {

    initialize(){

      console.log('ROOT', this.getRootContainer());

      if(this.getRootContainer().isRootWindow) return;

      console.info('Line must detect the g it should be placed into');
      this.h = 400;
      this.subLayout = new RelativeLayout(this);
      this.el.Group = svg.g()

      this.childrenGroup = svg.g({style:{'transform-origin': 'top left'}})
      this.el.Group.appendChild(this.childrenGroup);

      globalThis.project.origins.create({ id: this.getRootContainer().id, root: this, scene:this.el.Group })

      this.on('panX', v=> requestAnimationFrame(() => { this.childrenGroup.style.transform = `translate(${this.panX}px, ${this.panY}px)` }));
      this.on('panY', v=> requestAnimationFrame(() => { this.childrenGroup.style.transform = `translate(${this.panX}px, ${this.panY}px)` }));
      this.on('zoom', v=> requestAnimationFrame(() => { this.childrenGroup.style.scale = this.zoom }));

      this.on("elements.created", (node) => {
        const Ui = this.types.find(o=>o.name==node.type); // concept as in conceptmap is a component as it is a GUI thing.
        if(!Ui) return console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
        const ui = new Instance(Ui, {id:node.id, node, scene: this.childrenGroup});
        this.applications.create(ui);
        ui.start()
        this.subLayout.manage(ui);
      }, {replay:true});

      this.on("elements.removed", ({id}) => {
        this.applications.get(id).stop();
        this.applications.get(id).destroy();
        this.applications.remove(id);
      });

    },

    mount(){

      // Add Menu
      const [horizontal, [ addButton, delButton, vplCanvas ]] = nest(Horizontal, [
        [Label, {h: 32, W:32, text: 'Add', parent:this}, (c,p)=>p.children.create(c)],
        [Label, {h: 32, W:32, text: 'Del', parent:this}, (c,p)=>p.children.create(c)],
      ], (c)=>this.children.create(c))

      this.disposable = click(addButton.handle, e=>{
        const id = uuid();
        const node = new Instance( Node, {id, origin:this.getRootContainer().id, type: "Junction", x: 300, y: 300, data:{}} );
        this.elements.create(node);
      })














      const area = new Instance(Container, {h: 500, parent: this});
      this.children.create( area );
      area.draw();

      const diagnosticRuler1 = new DiagnosticRuler('scene ruler', this.scene, 'red')
      this.any(['x','y','w','h'],coordinates=>diagnosticRuler1.draw(coordinates));

      const diagnosticRuler2 = new DiagnosticRuler('childrenGroup/area ruler', this.childrenGroup, 'green')
      area.any(['x','y','w','h'],coordinates=>diagnosticRuler2.draw(coordinates, 50));

      const diagnosticCross1 = new DiagnosticCross('scene', this.scene, 'red')
      this.any(['x','y','w','h'],coordinates=>diagnosticCross1.draw(coordinates));

      const diagnosticCross2 = new DiagnosticCross('childrenGroup/area', this.childrenGroup, 'green')
      area.any(['x','y','w','h'],coordinates=>diagnosticCross2.draw(coordinates));

      const centerCircle = svg.circle({style:{'pointer-events': 'none'}, stroke:'red', r:5})
      this.childrenGroup.appendChild(centerCircle);
      area.any(['x','y','w','h'], ({x,y,w,h})=>update(centerCircle, {cx:x+w/2,cy:y+h/2 }))

      const outlineRectangle = svg.rect({style:{'pointer-events': 'none'}, stroke:'blue', fill:'none'})
      this.childrenGroup.appendChild(outlineRectangle);
      area.any(['x','y','w','h'], ({x,y,w,h})=>update(outlineRectangle, {x,y,width:w,height:h}))




      this.el.ClipPath = svg.clipPath({id: `clip-path-${this.id}`});
      const clipPathRect = svg.rect();
      this.el.ClipPath.appendChild(clipPathRect);
      update(this.el.Group, {'clip-path': `url(#clip-path-${this.id})`} );
      area.any(['x','y','w', 'h'], ({x,y,w:width,h:height})=>{ update(clipPathRect, {x,y,width,height} ) })

      this.appendElements();



      const pan = new Pan({
        component: this,
        handle: area.el.Container,
        zone: window,
        // XXX: transformMovement: (v)=>v/globalThis.project.zoom,
      }); this.destructable = ()=>pan.destroy()

      const diagnosticPoint1 = new DiagnosticPoint('scrollwheel hit', this.childrenGroup, 'yellow')

    const zoom = new Zoom({
      component: this,
      area: area,
      element: area.el.Container,
      zone: area.el.Container,
      // transformMovement: (v)=>v/globalThis.project.zoom,
      probe: ({cursor})=>{
        diagnosticPoint1.draw(cursor)
      },
    }); this.destructable = ()=>zoom.destroy()

    const transforms = this.getTransforms(this);
    console.table(transforms)


    }
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
