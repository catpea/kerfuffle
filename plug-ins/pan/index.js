export default class Pan {

  transformMovement = (data)=>data;
  component;
  handle;

  mouseDownHandler;
  mouseMoveHandler;
  mouseUpHandler;

  dragging = false;

  previousX = 0;
  previousY = 0;

  constructor({component, handle, zone, transformMovement}){
    if(transformMovement) this.transformMovement = transformMovement;
    this.component = component;
    this.handle = handle;
    this.zone = zone;
    this.mount();
  }

  mount(){

    this.mouseDownHandler = (e) => {

      this.previousX = e.screenX;
      this.previousY = e.screenY;
      // Enable dragging
      this.dragging = true;
      this.component.iframe = false;
      this.zone.addEventListener('mousemove', this.mouseMoveHandler);
    };

    this.mouseMoveHandler = (e) => {
      const movementX = this.transformMovement( this.previousX - e.screenX );
      const movementY = this.transformMovement( this.previousY - e.screenY );

      const transforms = this.component.getTransforms();
      const t = transforms.reduce((a,c)=>({x:a.x+c.x,y:a.y+c.y,z:a.z+c.z-1}),{x:0,y:0,z:1}) ;
      console.log(t);


      this.component.panX = this.component.panX - movementX;
      this.component.panY = this.component.panY - movementY;

      this.previousX = e.screenX;
      this.previousY = e.screenY;
     };

    this.mouseUpHandler = (e) => {
      this.dragging = false;
      this.component.iframe = true;
      this.zone.removeEventListener('mousemove', this.mouseMoveHandler);
    };

    this.handle.addEventListener('mousedown', this.mouseDownHandler);
    this.zone.addEventListener('mouseup', this.mouseUpHandler);

  }

  destroy(){
    this.handle.removeEventListener('mousedown', this.mouseDownHandler);
    this.zone.removeEventListener('mousemove', this.mouseMoveHandler);
    this.zone.removeEventListener('mouseup', this.mouseUpHandler);
  }

}
