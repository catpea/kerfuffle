export default function translate(x0,y0,localList){


      let x1 = x0;
      let y1 = y0;
      let parentZoom = 1;
      let locationX = 0;
      let locationY = 0;

      // console.log(locationX, locationY);

      for (const [i,t] of localList.entries()) {

        // Position of component x
        let curX = (t.x) * parentZoom;
        locationX = locationX + curX;

        // Position of component y
        let curY = (t.y) * parentZoom;
        locationY = locationY + curY;

        // Position of parent's x pan
        let curPanX = t.panX * parentZoom;
        locationX = locationX + curPanX;

        // Position of parent's y pan
        let curPanY = t.panY * parentZoom;
        locationY = locationY + curPanY;

        parentZoom = parentZoom * t.zoom; // set current zoom as parent zoom
      }

      x1 = x1 - locationX;
      y1 = y1 - locationY;

      const self = localList[localList.length-1];
      const finalZoom = localList.map(o=>o.zoom).reduce((a,c)=>a*c,1)/self.zoom;

      x1 = x1 / finalZoom
      y1 = y1 / finalZoom

      x1 = x1 / self.zoom
      y1 = y1 / self.zoom



      return [ x1, y1 ];

}
