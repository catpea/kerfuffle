export default class Zoom {

  transformMovement = (data)=>data;
  component;
  element;
  zone;

  magnitude = 0.2; // magnitude of change
  min = 0.1;
  max = 5;

  constructor({component, element, zone, transformMovement}){
    if(transformMovement) this.transformMovement = transformMovement;

    this.component = component;
    this.element = element;
    this.zone = zone;
    this.mount();
  }

  mount(){

    this.wheelHandler = (e) => {

      const zoom0 = this.component.zoom;
      const panX0 = this.component.panX;
      const panY0 = this.component.panY;

      // claculate zoom
      const IN = +1;
      const OUT = -1;
      let zoomDirection = e.deltaY>0?OUT:IN;
      let zoomCorrection = this.magnitude * zoomDirection;
      const limitZooming = v=>Math.min(this.max, Math.max(this.min, v)); // using `Math.min(max, value)` to ensure the value doesn't exceed the `max` limit and `Math.max(min, ...)` to ensure the result doesn't fall below the `min` limit.
      let zoom1 = limitZooming( zoom0 + zoomCorrection );

      // calculate pan relative to cursor
      const scaleRatio = zoom0/zoom1;
      const rescale = v=>v/(scaleRatio); // divide by to translate old coordiante to new
      const cursorX = e.x;
      const cursorY = e.y;
      let panX1 = cursorX - rescale(cursorX - panX0);
      let panY1 = cursorY - rescale(cursorY - panY0);

      this.component.zoom = zoom1;
      this.component.panX = panX1;
      this.component.panY = panY1;
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
