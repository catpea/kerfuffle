

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

  constructor({ getter, component, transforms, area=window, handle, before=()=>{}, change, after=()=>{}, magnitude=.2, min=0.1, max=5, }){

    this.transforms = transforms;
    this.component = component;
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

      const INTO = +1;
      const OUTOF = -1;
      let zoomDirection = e.deltaY>0?OUTOF:INTO;

      /*
      MouseEvent.clientX = The X coordinate of the mouse pointer in viewport coordinates.
      MouseEvent.offsetX = The X coordinate of the mouse pointer relative to the position of the padding edge of the target node.
      MouseEvent.pageY = The Y coordinate of the mouse pointer relative to the whole document.
      MouseEvent.screenY = The Y coordinate of the mouse pointer in screen coordinates.
      */


      //
      // cursorX=cursorX - (this.component.x*this.getter('zoom'));
      // cursorY=cursorY - (this.component.y*this.getter('zoom'));
      // console.log(`component ${this.component.y}x${this.component.y}`);
      // adjust "imaginary dot" to take existing pan under consideration
      // cursorX=cursorX-this.component.x;
      // cursorY=cursorY-this.component.y;


      // TODO: take under consideration not just pan but window position
      //cursorX=cursorX-this.getter('panX');//-this.component.x;
      //cursorY=cursorY-this.getter('panY');//-this.component.y;

      // console.log(lol);
      // cursorX = cursorX - lol.x;
      // cursorY = cursorY - lol.y;
      let cursorX = e.offsetX;
      let cursorY = e.offsetY;

      // cursorX = cursorX-this.getter('panX');//-this.component.x;
      // cursorY = cursorY-this.getter('panY');//-this.component.y;

      const lol1 = this.transforms().reduce((a,c)=>({zoom:a.zoom+c.zoom, panX:a.panX+c.panX, panY:a.panY+c.panY, x:a.x+c.x,y:a.y+c.y,    }), {zoom:1, panX:0, panY:0, x:0,y:0});
      // const lol = this.transforms().pop()||{zoom:1, panX:0, panY:0, x:0,y:0};
      const lol = this.component.getApplication();

      // LEVEL 2 experiment undex zoom - required cursorX-this.getter('panX')
      //   cursorX = cursorX - lol.x - 150 - 24;
      //   cursorY = cursorY - lol.y - 150 - 24;
      // ///////////////////////////////////////////

      // A
      cursorX = cursorX - lol1.x;
      cursorY = cursorY - lol1.y;

      //B
      cursorX = cursorX - lol1.panX;
      cursorY = cursorY - lol1.panY;

      //C
      //c requires taking zoom under consideration

      // console.log(lol1.panX, lol1.panY);

      // let captions = this.transforms().length * 24
      // cursorX = cursorX - captions -  captions -  captions -  captions
      // cursorY = cursorY - captions -  captions -  captions -  captions


      // console.log(lol1);
      // console.log(lol1.x, lol.y);

     //TODO: expand these tests with real world scenatios to test oanning

     checkZoomAlgorithm(transformZoom({ zoom: 1, panX: 0, panY: 0, deltaZoom: 1, cursorX: 1, cursorY: 1, magnitude: 1, }),       {zoom: 2, panX: -1, panY: -1});
     checkZoomAlgorithm(transformZoom({ zoom: 1, panX: 0, panY: 0, deltaZoom: 1, cursorX: 0, cursorY: 0, magnitude: 1, }),       {zoom: 2, panX:  0, panY:  0});
     checkZoomAlgorithm(transformZoom({ zoom: 1, panX: 0, panY: 0, deltaZoom: 1, cursorX: 2, cursorY: 2, magnitude: 1, }),       {zoom: 2, panX: -2, panY: -2});
     checkZoomAlgorithm(transformZoom({ zoom: 1, panX: 0, panY: 0, deltaZoom: -1, cursorX: 2, cursorY: 2, magnitude: 1, min:0}), {zoom: 0, panX:  2, panY:  2});

     const transformed = transformZoom({
       zoom: this.getter('zoom'),
       panX: this.getter('panX'),
       panY: this.getter('panY'),
       deltaZoom: zoomDirection,
       cursorX: cursorX,// -this.component.x,
       cursorY: cursorY,// -this.component.y,
       magnitude: 0.01 //this.magnitude
     });

      this.change(transformed);
      this.after({}, {
        cursorX, cursorY,
      });
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



function transformZoom({zoom, panX, panY,   deltaZoom, cursorX, cursorY,   magnitude=0.3, min=0.001, max=1_000}){
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
