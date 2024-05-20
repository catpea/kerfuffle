import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Application from "/plug-ins/windows/Application.js";
import Foreign from "/plug-ins/windows/Foreign.js";

export default class Hello {
  static extends = [Application];

  properties = {
  };

  methods = {

    mount(){

      this.foreign = new Instance(Foreign);
      this.createWindowComponent( this.foreign );
      const textnode = document.createTextNode("Hello World, I am simple HTML you can hook into to parade foreign elements!");
      this.foreign.appendChild(textnode);

      this.on('h', (h)=>{
        console.log({h});
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
