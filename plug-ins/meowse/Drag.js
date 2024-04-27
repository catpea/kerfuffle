export default class Drag {

  area = window;
  handle = null;

  transforms;

  before = ()=>{};
  movement = ()=>{};
  after = ()=>{};

  mouseDownHandler;
  mouseMoveHandler;
  mouseUpHandler;

  dragging = false;
  previousX = 0;
  previousY = 0;

  constructor({handle, area, before, movement, after, transforms}){
    this.handle = handle;
    this.area = area;
    this.before = before;
    this.movement = movement;
    this.after = after;

    this.transforms = transforms;


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
      const localList = this.transforms();
      const self = localList[localList.length-1];
      const finalZoom = localList.map(o=>o.zoom).reduce((a,c)=>a*c,1)/self.zoom;
      movementX = movementX/finalZoom;
      movementY = movementY/finalZoom;
      // correct drag speed

      this.movement({ x:movementX, y:movementY })
      this.previousX = e.screenX;
      this.previousY = e.screenY;
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
