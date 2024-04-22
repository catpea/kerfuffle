const segments = new Map(); // for debug

export default class Zoom {

  event = 'wheel';

  area;
  handle;
  getter;

  before = ()=>{};
  change = ()=>{};
  after = ()=>{};
  feedback = ()=>{};

  magnitude; // magnitude of change
  min;
  max;

  constructor({ getter, component, transforms, area=window, handle, before=()=>{}, change, after=()=>{}, feedback=()=>{}, magnitude=1, min=0.1, max=5, }){

    this.transforms = transforms;
    this.component = component;
    this.area = area;
    this.handle = handle;
    this.getter = getter;
    this.before = before;
    this.change = change;
    this.after = after;
    this.feedback = feedback;
    this.magnitude = magnitude;
    this.min = min;
    this.max = max;

    this.#mount();
  }

  /*
  MouseEvent.clientX = The X coordinate of the mouse pointer in viewport coordinates.
  MouseEvent.offsetX = The X coordinate of the mouse pointer relative to the position of the padding edge of the target node.
  MouseEvent.pageY = The Y coordinate of the mouse pointer relative to the whole document.
  MouseEvent.screenY = The Y coordinate of the mouse pointer in screen coordinates.
  */

  #mount(){

    this.translateCursor = (x0,y0) => {

      const localList = this.transforms();


      let x1 = x0;
      let y1 = y0;


      let parentZoom = 1;
      let localZoom = 1;

      let comX = 0;
      let comY = 0;

      let panX = 0;
      let panY = 0;

      let allX = 0
      let allY = 0

      let allComX = 0
      let allComY = 0

      let allPanX = 0
      let allPanY = 0

      // Inner Movement
      let locationX = 0;
      let locationY = 0;


      let hue = 0;
      let hueIncrement = 60;
      for (const [i,t] of localList.entries()) {
        hue = hue + hueIncrement;

        // Position of component x (initialy this will be 0+0)
        let curX = t.x * parentZoom;
        comX = comX + curX;
        segments.set(`x${i}`, {color:`hsl(${hue},90%,50%)`, x:locationX,y:y0+0+24*i*(localList.length), length:curX, label: `x of component ${t.element.parent.id}`});
        locationX = locationX + curX;

        // Position of component x (initialy this will be 0+0)
        let curY = t.y * parentZoom;
        comY = comY + curY;
        locationY = locationY + curY;

        // Position of parent's x pan
        let curPanX = t.panX * parentZoom;
        panX = panX + curPanX;
        segments.set(`xp${i}`,{color:`hsl(${hue},90%,50%)`, x:locationX ,y:y0+24+24*i*(localList.length), length:curPanX, label: `px`});
        locationX = locationX + curPanX;

        // Position of parent's y pan
        let curPanY = t.panY * parentZoom;
        panY = panY + curPanY;
        locationY = locationY + curPanY;

        parentZoom = parentZoom * t.zoom;
      }

      x1 = x1 - locationX;
      y1 = y1 - locationY;

      const f = localList[localList.length-1];
      const finalZoom = localList.map(o=>o.zoom).reduce((a,c)=>a*c,1)/f.zoom;
      const zoomChange = parentZoom - finalZoom;
      x1 = x1/finalZoom
      y1 = y1/finalZoom

      segments.set(`c`,{color:`hsl(300,90%,50%)`, x:locationX ,y:y0 , length:x1, label: `px`});

      return [x1, y1, localZoom, segments];
    },

    this.movelHandler = (e) => {
      const [cursorX, cursorY, zoom, segments] = this.translateCursor(e.clientX, e.clientY);

      this.feedback({
        cursorX, cursorY, zoom,
        // debug:
        segments
      });

    }

    this.wheelHandler = (e) => {

      e.stopPropagation();

      this.before(this);

      const INTO = +1;
      const OUTOF = -1;
      let zoomDirection = e.deltaY>0?OUTOF:INTO;

     const [cursorX, cursorY] = this.translateCursor(e.clientX, e.clientY);

     checkZoomAlgorithm(transformZoom({ zoom: 1, panX: 0, panY: 0, deltaZoom: 1,  cursorX: 1, cursorY: 1, magnitude: 1, }),       {zoom: 2, panX: -1, panY: -1});
     checkZoomAlgorithm(transformZoom({ zoom: 1, panX: 0, panY: 0, deltaZoom: 1,  cursorX: 0, cursorY: 0, magnitude: 1, }),       {zoom: 2, panX:  0, panY:  0});
     checkZoomAlgorithm(transformZoom({ zoom: 1, panX: 0, panY: 0, deltaZoom: 1,  cursorX: 2, cursorY: 2, magnitude: 1, }),       {zoom: 2, panX: -2, panY: -2});
     checkZoomAlgorithm(transformZoom({ zoom: 1, panX: 0, panY: 0, deltaZoom: -1, cursorX: 2, cursorY: 2, magnitude: 1, min:0}),  {zoom: 0, panX:  2, panY:  2});

     const transformed = transformZoom({
       zoom: this.getter('zoom'),
       panX: this.getter('panX'),
       panY: this.getter('panY'),

       cursorX,
       cursorY,

       deltaZoom: zoomDirection,
       magnitude: this.magnitude
     });

      this.change(transformed);
      this.after({});

    };

    this.area.addEventListener(this.event, this.wheelHandler, {passive: true});
    this.handle.addEventListener(this.event, this.wheelHandler, {passive: true});
    this.area.addEventListener('mousemove', this.movelHandler, {passive: true});
  }

  destroy(){
    this.removeStartedObserver();
    this.area.removeEventListener(this.event, this.wheelHandler);
    this.handle.removeEventListener(this.event, this.wheelHandler);
    this.area.removeEventListener('mousemove', this.movelHandler);
  }

}



function transformZoom({zoom, panX, panY,   deltaZoom, cursorX, cursorY,   magnitude=1, min=0.001, max=1_000}){
  // This Algorithm Is Correct - Do Not Edit
  const zoomClamp = v=>Math.min(max, Math.max(min, v)); // using `Math.min(max, value)` to ensure the value doesn't exceed the `max` limit and `Math.max(min, ...)` to ensure the result doesn't fall below the `min` limit.
  let zoom1 = zoomClamp(zoom + (deltaZoom * magnitude));
  const zoomChange = zoom1 - zoom;
  const panX1 = panX - (cursorX * zoomChange) / zoom;
  const panY1 = panY - (cursorY * zoomChange) / zoom;
  const response = { zoom: zoom1, panX: panX1, panY: panY1 };
  return response;
}

const checkZoomAlgorithm = function(actual, expected){
 console.assert(actual.zoom==expected.zoom, `Resulting zoom (${actual.zoom}) level is malformed, expected: ${expected.zoom}`);
 console.assert(actual.panX==expected.panX, `Resulting x (${actual.panX}) is malformed, expected: ${expected.panX}`);
 console.assert(actual.panY==expected.panY, `Resulting y (${actual.panY}) is malformed, expected: ${expected.panY}`);
}
