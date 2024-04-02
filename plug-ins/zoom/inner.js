export default class Zoom {

  probe = null;
  transformMovement = (data)=>data;
  component;
  element;
  zone;
  area;

  magnitude = 1; // magnitude of change
  min = 0.1;
  max = 15;

  constructor({component, element, zone, transformMovement, area   ,probe}){
    if(probe) this.probe = probe;
    if(transformMovement) this.transformMovement = transformMovement;

    this.area = area;
    this.component = component;
    this.element = element;
    this.zone = zone;
    this.mount();
  }

  mount(){

    this.wheelHandler = (e) => {

      // you can use rect as well
      //let rect = this.element.getBoundingClientRect(); // DO NOT USE
      const x0 = this.area.x;
      const y0 = this.area.y;

      const zoom0 = this.component.zoom;
      const panX0 = this.component.panX;
      const panY0 = this.component.panY;

      console.clear();
      console.log('INITIAL', {x0,y0, zoom0, panX0, panY0}, this.element);
      // claculate zoom
      const IN = +1;
      const OUT = -1;
      let zoomDirection = e.deltaY>0?OUT:IN;
      let zoomCorrection = this.magnitude * zoomDirection;
      const limitZooming = v=>Math.min(this.max, Math.max(this.min, v)); // using `Math.min(max, value)` to ensure the value doesn't exceed the `max` limit and `Math.max(min, ...)` to ensure the result doesn't fall below the `min` limit.
      let zoom1 = limitZooming( zoom0 + zoomCorrection );

      // calculate pan relative to cursor
      const scaleRatio = zoom0/zoom1;
      if (scaleRatio==1) {
        return;
      }
      console.info({zoom1, scaleRatio});

      const rescale = v=>v/(scaleRatio); // divide by to translate old coordiante to new

      const cursorX = e.x+x0;
      const cursorY = e.y+y0;

      let panX1 = cursorX - rescale(cursorX - panX0);
      let panY1 = cursorY - rescale(cursorY - panY0);

      this.component.zoom = zoom1; //
      this.component.panX = panX1/zoom1; // falls under zoom, this is a world coordinate it's 0,0 is in the corner of the browser viewport.
      this.component.panY = panY1/zoom1; // falls under zoom, this is a world coordinate it's 0,0 is in the corner of the browser viewport.

      const transforms = this.component.getTransforms();
      console.log('FINAL', {zoom1, panX1, panY1, scaleRatio});

      console.table( transforms);
      console.log(transforms.reduce((a,c)=>({x:a.x+c.x,y:a.y+c.y,z:a.z+c.z}),{x:0,y:0,z:0}) );
      if(this.probe) this.probe({cursor:{x:cursorX, y:cursorY}});
    };

    this.zone.addEventListener('wheel', this.wheelHandler, {passive: true});
    this.element.addEventListener('wheel', this.wheelHandler, {passive: true});
  }

  destroy(){
    this.removeStartedObserver();
    this.zone.removeEventListener('wheel', this.wheelHandler);
    this.element.removeEventListener('wheel', this.wheelHandler);
  }

}
