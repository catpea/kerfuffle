export default class Zoom {

  area;
  handle;
  getter;

  before = ()=>{};
  change = ()=>{};
  after = ()=>{};

  magnitude; // magnitude of change
  min;
  max;

  constructor({ getter, area=window, handle, before=()=>{}, change, after=()=>{}, magnitude=.02, min=0.1, max=5, }){

    this.area = area;
    this.handle = handle;
    this.getter = getter;
    this.before = before;
    this.change = change;
    this.after = after;
    this.magnitude = magnitude;
    this.min = min;
    this.max = max;

    this.#mount();
  }

  #mount(){

    this.wheelHandler = (e) => {
      e.stopPropagation();

      this.before();

      const zoom0 = this.getter('zoom');
      const panX0 = this.getter('panX');
      const panY0 = this.getter('panY');

      const INTO = +1;
      const OUTOF = -1;

      let zoomDirection = e.deltaY>0?OUTOF:INTO;
      let zoomCorrection = this.magnitude * zoomDirection;
      const limitZooming = v=>Math.min(this.max, Math.max(this.min, v)); // using `Math.min(max, value)` to ensure the value doesn't exceed the `max` limit and `Math.max(min, ...)` to ensure the result doesn't fall below the `min` limit.
      let zoom1 = limitZooming( zoom0 + zoomCorrection );

      console.log(zoom1);

      let panX1 = panX0;
      let panY1 = panY0;


      this.change({ x:panX1, y:panY1, z:zoom1 });

      // // calculate pan relative to cursor
      // const scaleRatio = zoom0/zoom1;
      // const rescale = v=>v/(scaleRatio); // divide by to translate old coordiante to new
      // const cursorX = e.x;
      // const cursorY = e.y;
      // let panX1 = cursorX - rescale(cursorX - panX0);
      // let panY1 = cursorY - rescale(cursorY - panY0);
      //
      // this.component.zoom = zoom1;
      // this.component.panX = panX1;
      // this.component.panY = panY1;

      this.after();
    };

    this.area.addEventListener('wheel', this.wheelHandler, {passive: true});
    this.handle.addEventListener('wheel', this.wheelHandler, {passive: true});
  }

  destroy(){
    this.removeStartedObserver();
    this.area.removeEventListener('wheel', this.wheelHandler);
    this.handle.removeEventListener('wheel', this.wheelHandler);
  }

}
