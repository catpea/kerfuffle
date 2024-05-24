import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Application from "/plug-ins/windows/Application.js";
import Foreign from "/plug-ins/windows/Foreign.js";

export default class Hello {
  static extends = [Application];

  properties = {
  };

  observables = {
    options: {},
  };

  methods = {

    mount(){

      this.foreign = new Instance(Foreign);
      this.createWindowComponent( this.foreign );
      const textnode = document.createTextNode("I am an HTML context menu, based on foreign object." + JSON.stringify(this.options));
      this.foreign.appendChild(textnode);

      this.on('options', options=>{
        textnode.textContent = "I am an HTML context menu, based on foreign object." + JSON.stringify(this.options);
      })

      this.foreign.body.addEventListener('click', e => {
         this.scene.style.display = 'none';
      });

      this.on('h', (h)=>{
        console.log({h});
        this.foreign.h = h;
      });


    },

    stop(){
      console.log('todo: stopping root application');
    },

    destroy(){
      console.log('todo: destroying root application');
      this.dispose()
    },

  };
}
