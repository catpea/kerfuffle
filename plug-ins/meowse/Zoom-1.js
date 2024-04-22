

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

  constructor({ getter, component, transforms, area=window, handle, before=()=>{}, change, after=()=>{}, magnitude=1, min=0.1, max=5, }){

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
      // const local = this.transforms().reduce((a,c)=>({zoom:a.zoom+(c.zoom-1), panX:a.panX+c.panX, panY:a.panY+c.panY, x:a.x+c.x,y:a.y+c.y,    }), {zoom:0, panX:0, panY:0, x:0,y:0});


      console.log('this.transforms()', this.transforms());

      const localList = this.transforms()
      const upperList = this.transforms();
      upperList.pop()

      const local = localList.reduce((a,c)=>({zoom:a.zoom, panX:a.panX+c.panX*(c.parent?c.parent.zoom:1), panY:a.panY+c.panY*(c.parent?c.parent.zoom:1), x:a.x+c.x,y:a.y+c.y,    }), {zoom:0, panX:0, panY:0, x:0,y:0});
      const upper = upperList.reduce((a,c)=>({zoom:a.zoom, panX:a.panX+c.panX*(c.parent?c.parent.zoom:1), panY:a.panY+c.panY*(c.parent?c.parent.zoom:1), x:a.x+c.x,y:a.y+c.y,    }), {zoom:0, panX:0, panY:0, x:0,y:0});

      // const local = localList.reduce((a,c)=>({zoom:a.zoom, panX:a.panX+c.panX*c.zoom, panY:a.panY+c.panY*c.zoom, x:a.x+c.x,y:a.y+c.y,    }), {zoom:0, panX:0, panY:0, x:0,y:0});
      // const upper = upperList.reduce((a,c)=>({zoom:a.zoom, panX:a.panX+c.panX*c.zoom, panY:a.panY+c.panY*c.zoom, x:a.x+c.x,y:a.y+c.y,    }), {zoom:0, panX:0, panY:0, x:0,y:0});

      let upperZoom = upperList.map(o=>o.zoom).reduce((a,c)=>a+c,0);
      let localZoom = localList.map(o=>o.zoom).reduce((a,c)=>a+c,0);
      console.log('Cursor area zoom:', localZoom);
      let cursorX;
      let cursorY;

      // cursorX = cursorX-this.getter('panX');//-this.component.x;
      // cursorY = cursorY-this.getter('panY');//-this.component.y;
      let combination = 0;
      let lineA;
      let lineB;
      let lineC;
      let lineD;

      if(combination == 0){

        // stable, but zoom is not used

        lineA = {x:0,y:e.clientY, length:e.clientX, label: 'clientX'};
        //TODO: must be translated to scale
        cursorX = e.clientX;
        cursorY = e.clientY;

        lineB = {x:0,y:70, length:local.x, label: 'local x'};
        cursorX = cursorX - local.x;
        cursorY = cursorY - local.y;

        lineC = {x:0,y:90, length:local.panX, label: 'pan x'};
        cursorX = cursorX - local.panX;
        cursorY = cursorY - local.panY;

        lineD = {x:0,y:110, length:e.offsetX - local.x - local.panX, label: 'all'};


      }else if(combination == 1){


        cursorX = e.offsetX;
        cursorY = e.offsetY;

        cursorX = cursorX - upper.x//*upperZoom;
        cursorY = cursorY - upper.y//*upperZoom;

        cursorX = cursorX - local.panX//*localZoom;
        cursorY = cursorY - local.panY//*localZoom;

        // cursorX = cursorX - upper.panX*upperZoom;
        // cursorY = cursorY - upper.panY*upperZoom;

      }else if(combination == 2){
        // A
        //B
        cursorX = cursorX - local.panX//*upper.zoom;
        cursorY = cursorY - local.panY//*upper.zoom;
      }else if(combination == 3){
        // bad
        cursorX = cursorX * upper.zoom
        cursorY = cursorY * upper.zoom
      }

      // cursorX = cursorX*upper.zoom;
      // cursorY = cursorY*upper.zoom;

      //C
      console.error('c requires taking zoom under consideration');

      // console.log(local.panX, local.panY);

      // let captions = this.transforms().length * 24
      // cursorX = cursorX - local.x*upper.zoom;
      // cursorY = cursorY - local.y*upper.zoom;
      // cursorX = cursorX - captions -  captions -  captions -  captions
      // cursorY = cursorY - captions -  captions -  captions -  captions

      // var point = globalThis.svg.createSVGPoint();
      // var ctm = this.area.getScreenCTM();
      // var inverse = ctm.inverse();
      // var p = point.matrixTransform(inverse);
      // console.log(p);
      //             // cx.value = p.x;
      //             // cy.value = p.y;
      // cursorX1 = e.clientX-p.x;
      // cursorY1 = e.clientY-p.y;

      // console.log(local);
      // console.log(local.x, lol.y);

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
       magnitude: this.magnitude
     });

     console.error('Cursor is incorrectly calculated');
      this.change(transformed);
      this.after({}, {
        lineA, lineB, lineC, lineD,
        cursorX:cursorX, cursorY:cursorY,
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
