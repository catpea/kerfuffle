export default class Menu {

  area = window;
  scale = null;
  show = null;

  mouseDownHandler;
  mouseMoveHandler;
  mouseUpHandler;

  constructor({area, scale, show}){
    this.area = area;
    this.scale = scale;
    this.show = show;


    this.#mount();
  }

  #mount(){

    this.contextMenuHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log('SCALE', this.scale());
      let x = e.x;//*this.scale();
      let y = e.y;//*this.scale();

      this.show({x,y});
    };

    this.area.addEventListener('contextmenu', this.contextMenuHandler);
  }

  destroy(){
    this.area.removeEventListener('contextmenu', this.contextMenuHandler);
  }

}
