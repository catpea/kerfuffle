export default class Drag {

  area = window;
  handle = null;
  scale = ()=>1;
  scene;

  // before, movement, after can be set via constructor or by method overloading
  before(){
  }

  movement({x,y}){
  }

  after(){
  }


  mouseDownHandler;
  mouseMoveHandler;
  mouseUpHandler;

  dragging = false;
  previousX = 0;
  previousY = 0;

  constructor({handle, area, before, movement, after, scale, scene, component}){

    if(handle) this.handle = handle;
    if(area)  this.area = area;
    if(before) this.before = before;
    if(movement) this.movement = movement;
    if(after) this.after = after;

    if(scale) this.scale = scale;
    if(scene) this.scene = scene;
    if(component) this.component = component;


    this.#mount();
  }

  #mount(){

    this.mouseDownHandler = (e) => {
      this.previousX = e.screenX;
      this.previousY = e.screenY;
      this.area.addEventListener('mousemove', this.mouseMoveHandler);
      this.before();
    };

    this.mouseMoveHandler = (e) => {
      // console.log( 'HIT!', e.target );
      // if(e.target !== this.handle) return;
      // e.preventDefault();
      // e.stopPropagation();
      let movementX = this.previousX - e.screenX;
      let movementY = this.previousY - e.screenY;

      // correct drag speed
      // const localList = this.transforms();
      // const self = localList[localList.length-1];
      // const finalZoom = localList.map(o=>o.zoom).reduce((a,c)=>a*c,1)/self.zoom;
      const scale = this.scale();
      movementX = movementX/scale;
      movementY = movementY/scale;
      // correct drag speed

      let cancelX = false;
      let cancelY = false;
      this.movement({ x:movementX, y:movementY,

        cancelX:()=>cancelX=true,
        cancelY:()=>cancelY=true,
        destroy:()=>this.destroy(),
        stop:()=>this.area.removeEventListener('mousemove', this.mouseMoveHandler)

      });


      if(!cancelX) this.previousX = e.screenX
      if(!cancelY) this.previousY = e.screenY

     };

    this.mouseUpHandler = (e) => {
      this.after();
      this.area.removeEventListener('mousemove', this.mouseMoveHandler);
    };

    this.handle.addEventListener('mousedown', this.mouseDownHandler);
    this.area.addEventListener('mouseup', this.mouseUpHandler);

  }

  destroy(){
    this.handle.removeEventListener('mousedown', this.mouseDownHandler);
    this.area.removeEventListener('mousemove', this.mouseMoveHandler);
    this.area.removeEventListener('mouseup', this.mouseUpHandler);
  }

}
