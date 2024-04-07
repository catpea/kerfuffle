export default class Pan {

  area = window;
  handle = null;

  before = ()=>{};
  movement = ()=>{};
  after = ()=>{};

  mouseDownHandler;
  mouseMoveHandler;
  mouseUpHandler;


  dragging = false;
  previousX = 0;
  previousY = 0;

  constructor({handle, area, before, movement, after}){
    this.handle = handle;
    this.area = area;
    this.before = before;
    this.movement = movement;
    this.after = after;
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
      console.log( 'HIT!', e.target );
      // if(e.target !== this.handle) return;
      // e.preventDefault();
      // e.stopPropagation();
      const movementX = this.previousX - e.screenX;
      const movementY = this.previousY - e.screenY;
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
