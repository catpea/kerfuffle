import { svg, update, click, text } from "/plug-ins/domek/index.js"

// export default { DiagnosticText, DiagnosticRectangle, DiagnosticCross, DiagnosticRuler, DiagnosticWidth, DiagnosticHeight, DiagnosticPoint };

export class DiagnosticText {
  space = 8;
  name;
  parent;
  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;
    this.textContainer = svg.text({ 'dominant-baseline': 'hanging', fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text("xxxx");
    this.textContainer.appendChild(this.text);
  }
  draw({zoom, x,y,w,h}){
    update(this.textContainer, {x,y});
    this.text.nodeValue = `${zoom} ${this.name}`
  }
}

export class DiagnosticRectangle {
  space = 8;
  name;
  parent;
  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;

    this.rectangle1 = svg.rect({style:{'pointer-events': 'none'}, fill:'none', stroke})
    this.parent.appendChild(this.rectangle1);

    this.textContainer = svg.text({style:{'pointer-events': 'none'}, 'dominant-baseline': 'hanging', fill:stroke });
    this.parent.appendChild(this.textContainer);

    this.text = text();
    this.textContainer.appendChild(this.text);

  }
  draw({x,y,width,height}){
    update(this.rectangle1, {x,y,width,height});
    update(this.textContainer, {x,y});
    this.text.nodeValue = `${this.name}`
  }
}

export class DiagnosticCross {
  space = 8;
  name;
  parent;
  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;
    this.diagonal1 = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.diagonal1);
    this.diagonal2 = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.diagonal2);
    this.centerCircle = svg.circle({style:{'pointer-events': 'none'}, stroke, r: this.space})
    this.parent.appendChild(this.centerCircle);
    this.indicatorLine = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.indicatorLine);
    this.textContainer = svg.text({ 'dominant-baseline': 'middle', fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text("xxxx");
    this.textContainer.appendChild(this.text);
  }
  draw({x,y,w,h}){
    update(this.diagonal1, {x1:x, y1:y, x2:x+w, y2:y+h} );
    update(this.diagonal2, {x1:x, y1:y+h, x2:x+w, y2:y} );
    update(this.centerCircle, {cx:x+w/2,cy:y+h/2 } );
    update(this.indicatorLine, {x1:x+w/2+this.space, y1:y+h/2, x2:x+w/2+this.space*8, y2:y+h/2})
    update(this.textContainer, {x:x+w/2+this.space*8,y:y+h/2});
    this.text.nodeValue = `${x+w/2}x ${y+h/2}y ${w}w ${h}h ${this.name}`
  }
}

export class DiagnosticRuler {
  mark = 12;
  marks = [];
  labels = [];
  space = 50;
  name;
  parent;

  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;
    this.diagonal1 = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.diagonal1);
    for (let markNumber = 0; markNumber <= this.mark; markNumber++) {
      const mark = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
      this.parent.appendChild(mark);
      this.marks[markNumber] = mark;
      //
      const container = svg.text({ 'dominant-baseline': 'middle', fill:stroke });
      this.parent.appendChild(container);
      const label = text(`#${markNumber}`);
      container.appendChild(label);
      this.labels[markNumber] = {container, label};

    }
    this.textContainer = svg.text({fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text(this.name);
    this.textContainer.appendChild(this.text);
  }
  draw({x,y},n=0){
    y=y+n
    let baseY = y+this.space*8;
    let deltaY = this.space/3;
    update(this.diagonal1, {x1:x, y1:baseY, x2:x+(this.mark*this.space), y2:baseY} );
    for (let markNumber = 0; markNumber <= this.mark; markNumber++) {

      const mark = this.marks[markNumber];
      update(mark, {x1:markNumber*this.space, y1:baseY-deltaY, x2:markNumber*this.space, y2:baseY+deltaY/4} );
      //
      const {container, label} = this.labels[markNumber];
      update(container, {x:markNumber*this.space, y:baseY-deltaY});
      label.nodeValue = `${markNumber*this.space}x`;
    }
    update(this.textContainer, {x,y:baseY+deltaY});

    this.text.nodeValue = `${this.name}`



  }
}

export class DiagnosticWidth {
  name;
  parent;
  space = 32;
  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;
    this.diagonal1 = svg.line({style:{'pointer-events': 'none'}, opacity:.4, stroke, fill:'none'});
    this.diagonal2 = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.diagonal1);
    this.parent.appendChild(this.diagonal2);

    this.textContainer = svg.text({fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text(this.name);
    this.textContainer.appendChild(this.text);
  }
  draw({x,y, panX, panY, zoom}, n=0){
    // update(this.diagonal1, {x1:x, y1:y+panY, x2:x+panX, y2:y+panY} );
    update(this.diagonal2, {x1:x*zoom, y1:y+(panY*zoom), x2:x+(panX*zoom), y2:y+(panY*zoom)} );
    update(this.textContainer, {x:x*zoom,y:y+(panY*zoom)});
    this.text.nodeValue = `${this.name}: ${panX}x (${(panX*zoom).toFixed(4)}x scaled)`
  }
}

export class DiagnosticHeight {
  name;
  parent;
  space = 32;

  constructor(name, parent, stroke){
    this.name = name;
    this.parent = parent;
    this.diagonal1 = svg.line({style:{'pointer-events': 'none'}, opacity:.4, stroke, fill:'none'});
    this.diagonal2 = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.diagonal1);
    this.parent.appendChild(this.diagonal2);

    this.textContainer = svg.text({fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text(this.name);
    this.textContainer.appendChild(this.text);
  }
  draw({x,y, panX, panY, zoom}, n=0){
    // update(this.diagonal1, {x1:panX, y1:y, x2:panX, y2:y+panY} );
    update(this.diagonal2, {x1:panX*zoom, y1:y, x2:panX*zoom, y2:y+(panY*zoom)} );

    update(this.textContainer, {x:panX*zoom, y:(y+(panY*zoom))/2});
    this.text.nodeValue = `${this.name}: ${panY}y (${(panY*zoom).toFixed(4)}y scaled)`
  }
}

export class DiagnosticPoint {
  space = 8;
  name;
  parent;
  angle;
  length;
  constructor(name, parent, angle=0, length=10, stroke='blue'){
    this.name = name;
    this.parent = parent;
    this.angle = angle;
    this.length = length;
    this.centerCircle = svg.circle({style:{'pointer-events': 'none'}, stroke, fill:stroke, r: 5})
    this.parent.appendChild(this.centerCircle);

    this.indicatorLine = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.indicatorLine);

    this.textLine = svg.line({style:{'pointer-events': 'none'}, stroke, fill:'none'});
    this.parent.appendChild(this.textLine);

    this.textContainer = svg.text({style:{'pointer-events': 'none'}, 'dominant-baseline': 'middle', fill:stroke });
    this.parent.appendChild(this.textContainer);
    this.text = text(name);
    this.textContainer.appendChild(this.text);
  }
  draw({x,y}){

    // console.log(`draw({${x},${y}})`);
    this.text.nodeValue = `${x}x ${y}y ${this.name}`
    const {x1,y1,x2,y2} = rotate2({x1:x, y1:y, x2:x+this.length, y2:y}, this.angle);
    // console.log({x1,y1,x2,y2});
    update(this.centerCircle, {cx:x,cy:y } );
    // update(this.indicatorLine, {x1:x+this.space, y1:y, x2:x+200, y2:y})
    update(this.indicatorLine, {x1,y1,x2,y2})
    update(this.textLine, {x1:x2,y1:y2,x2:x2+this.length*0.5,y2})
    update(this.textContainer, {x:x2+this.length*0.5,y:y2});
  }
}


function rotate2({x1, y1, x2, y2}, d) {
  let r = ((Math.PI*2)/360)*d;
  // Calculating the rotated position for x
  const newX = Math.cos(r) * (x2 - x1) - Math.sin(r) * (y2 - y1) + x1;

  // Calculating the rotated position for y
  const newY = Math.sin(r) * (x2 - x1) + Math.cos(r) * (y2 - y1) + y1;

  return {x1, y1, x2:newX, y2:newY};
}
