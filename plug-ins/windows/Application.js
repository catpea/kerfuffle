import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Window from "/plug-ins/windows/Window.js";
import EventEmitter from "/plug-ins/event-emitter/EventEmitter.js";

export default class Application {
  static extends = [Window];

  properties = {
    isApplication: true,
  };

  observables = {
    origins: [],
    applications: [],
    url: null,
  };

  traits = {


    /**
    USAGE:
    this.xWritable = writable(0);
    this.yWritable = writable(0);
    this.component = new Interface({
        target: this.foreign.body,
        props: {
          x: this.xWritable,
          y: this.yWritable,
          object: null,
          paneItems: stores.getPaneItems( this.getRoot() )
        }
    });
    this.connectObservableToWritable( object, 'x', this, 'xWritable', (v)=>v.toFixed(2))
    this.connectObservableToWritable( object, 'y', this, 'yWritable', (v)=>v.toFixed(2))

    **/
    connectObservableToWritable(fromObject, property, toObject, writable, transform){

      if(!this.oo.scratch.couplers){
        this.oo.scratch.couplers = {};
        this.disposable = ()=>{ Object.values(this.oo.scratch.couplers).map(f=>f())}; // clean any remaining couplers
      }
      let id = property;
      if(this.oo.scratch.couplers[id]) this.oo.scratch.couplers[id](); // execute destructable
      this.oo.scratch.couplers[id] = fromObject.on(property, (v)=>toObject[writable].set(transform?transform(v):v),{autorun:true},{manualDispose:true});

    },
  };

  methods = {

    initialize(){
      this.controller = new EventEmitter();
      this.getRoot().applications.create(this);
      console.log('XXXX', this.getRoot().id, this.id, );
    },


  };
}
