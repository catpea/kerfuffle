import { svg, update } from "/plug-ins/domek/index.js"

export default class Component {

  properties = {
    id: uuid(),
    el: {}, // bag of elements
  };

  observables = {

    parent: undefined, // it may be needed to access parent from a control
    scene:  undefined, // remember parent sets the scene, this child must adds its own .g to it, then its own g becomes the scene for children
    node:  undefined, // data node

    // node has data, we keep it here at the root of component
    data:  undefined, // the data that is in the node

    selected:  false, // selection manager feature

    name:  'un-named',

    x: 0,
    y: 0,

    w: 0,
    h: 0,

    H: 0, // min h
    r: 0, // border radius

    b: 0, // border
    p: 0, // padding
    s: 0, // spacer/gap

  };

  constraints = {
    scene: {
      '.scene must be an instance of HTMLElement': function(){ if(!(obj instanceof HTMLElement)) return {error: 'Not an HTMLElement'}}
    },
    mount: {
      '.scene is required to start': function(){ if(!this.data){return {error:'data missing'}} },
      '.node is required to start': function(){ if(!this.node){return {error:'node missing'}} },
      '.node must be an observable object': function(){ if(!this.node.on){return {error:'.on missing on .node'}} },
    }
  }

  traits = {
    //
    // appendMain(){
    //   Object.values(this.el).forEach(el => this.scene.appendChild(el));
    // },

    allAnchors(parent, list=[]){

      if(parent?.children){
        for (const child of parent.children) {

          if(child.anchors?.length){
            for (const anchor of child.anchors) {
              list.push(anchor);
            }
          }

          this.allAnchors(child, list)

        }
      }

      return list;
    },

    appendElements(){

      // if(!this.g){
      //   this.g = svg.g({class:'component'});
      //   this.scene.appendChild(this.g)
      // }
      //
      // Object.values(this.el).forEach(el => this.g.appendChild(el));

      Object.values(this.el).forEach(el => this.scene.appendChild(el));

    },

    removeElements(){
      Object.values(this.el).forEach(el => el.remove());
    },

    getRandomIntInclusive(min, max) {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
    },

    pipe(name){
      const id = [name, this.getRootContainer().id].join(':');
      const origin = globalThis.project.origins.get(this.getRootContainer().node.origin); // root container always has a node, node always has an origin, origin has a root
      const pipe = origin.root.pipes.get(id);
      return pipe;
    },

    getRootContainer() {
      let response = null;

      if(!this.parent){
        // console.log(`Object ${this.oo.name} did not have a parent`);
        response = this;
      } else if(!this.parent.getRootContainer){
        // console.log(`Object ${this.oo.name} did not have a getRootContainer`);
        response = this;
      } else if(this.contain){
        // console.log(`Object ${this.oo.name} had a .contain directive`);
        response = this;
      }else{
        response = this.parent.getRootContainer();
      }

      return response;
    },

    getAbsoluteRoot() {
      let response = null;
      if(!this.parent){
        response = this;
      }else{
        response = this.parent.getAbsoluteRoot();
      }
      return response;
    },




    getRoot() {
      let response = null;
      if(!this.parent){
        response = this;
      }else{
        response = this.parent.getRoot();
      }
      return response;
    },




    getStack(element, list=[]) {
      if(!element) element = this;
      list.unshift(element);
      if(element.parent) this.getStack(element.parent, list);
      return list;
    },

    getParentScale(component){
      const list = this.getTransforms(component).slice(0, -1); // NOTE: removal of last entry, hence parent scale
      const scale = list.map(o=>o.zoom).reduce((a,c)=>a*c, 1) ;
      return scale;
    },
    getScale(component){
      const list = this.getTransforms(component);
      const scale = list.map(o=>o.zoom).reduce((a,c)=>a*c, 1) ;
      return scale;
    },

    getTransforms(element, list=[], root=true) {
      if(!element) element = this;
      const isTransform = element.hasOwnProperty('panX')&&element.hasOwnProperty('panY')&&element.hasOwnProperty('zoom');
      if(isTransform){
        let offsetX = element.viewport.x - element.x;
        let offsetY = element.viewport.y - element.y;
        // console.log('XXX paneY', element.oo.name, element.y, element.viewport.y, offsetY);

        const {oo:{name}, panX, panY, zoom, x,y} = element;
        list.unshift({name, panX, panY, zoom, x:element.x+offsetX,y:element.y+offsetY , element:element.scene, offsetX:0, offsetY:0});
      }

      if(element.parent) this.getTransforms(element.parent, list, false);
      if(root){
        let parent = false
        for (const [index, item] of list.entries()) {
          item.index = index;
          item.parent = parent;
          parent = item;
        }
      }
      return list;
    },

    getApplication(element) {
      if(!element) element = this;
      if(element.isApplication===true){
        return element;
      }
      if(element.parent) return this.getApplication(element.parent);
    },

  }

  methods = {


    initialize(){
      // console.log(`%cComponent.initialize!`, 'background: hsl(180, 90%, 60%); color: black;');

      this.on("node", (node) => {

        node.on("x", x => this.x = x);
        node.on("y", y => this.y = y);
        node.on("w", w => this.w = w);
        node.on("h", h => this.h = h);
        node.on("H", H => this.H = H);
        node.on("r", r => this.r = r);
        node.on("b", b => this.b = b);
        node.on("p", p => this.p = p);
        node.on("s", s => this.s = s);

        // node carries a .data property
        node.on("data", data => this.data = data);
      });
    },

  }

}
