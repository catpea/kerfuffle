export default class Drag {

  dragging = false;

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

      this.dragging = true;
      this.area.addEventListener('mousemove', this.mouseMoveHandler);

      this.before({e});
    };

    this.mouseMoveHandler = (e) => {

      let movementX = this.previousX - e.screenX;
      let movementY = this.previousY - e.screenY;

      const scale = this.scale();

      movementX = movementX/scale;
      movementY = movementY/scale;

      this.movement({e, x:movementX, y:movementY });

      this.previousX = e.screenX
      this.previousY = e.screenY

     };

    this.mouseUpHandler = (e) => {
      if(!this.dragging) return;
      this.area.removeEventListener('mousemove', this.mouseMoveHandler);

      this.after({e});
      this.dragging = false;

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
