import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Window from "/plug-ins/windows/Window.js";
import Foreign from "/plug-ins/windows/Foreign.js";
import calculatePercent from 'calculate-percent';
import QueueUI from "./Queue.svelte";

export default class Queue {
  static extends = [Window];

  observables = {
    displayTitle: 'Queue',

    displayStatus: {counter:0, percent:0, length:100},
    displaySample: '(none)',
    feedUrl: 'sample/data/catpea.32.json',
    feedData: undefined,
  };

  methods = {

    initialize (){
      this.caption = this.oo.name;
      this.createSocket('out', 1);

    },

    mount(){

      this.foreign = new Instance(Foreign);
      this.createWindowComponent( this.foreign );
      this.ui = new QueueUI({
        target: this.foreign.body,
        control: this.control,
      });
      this.on('displayTitle', displayTitle=> this.ui.$set({displayTitle}));
      this.on('displayStatus', displayStatus=> this.ui.$set({displayStatus}));
      this.on('displaySample', displaySample=> this.ui.$set({displaySample}));



      this.on('feedUrl', async url=> this.feedData={data:(await(await fetch(url)).json()).reverse()});
      this.on('feedData', feed=>{
        let counter = 0;
        let percent = 0;
        let length = feed.data.length;
        this.getApplication().controller.on('step', x=>{
            if(feed.data.length){
              const fragment = feed.data.pop();
              counter++;
              this.displayTitle = fragment.attr.title;
              this.displaySample = fragment.snip;
              percent = calculatePercent(counter, length, 0);
              this.step(fragment);
            }
            this.displayStatus = {counter, length, percent};
        });

      })



    },

    stop(){
      console.log('todo: stopping root application');
    },

    destroy(){
      console.log('todo: destroying root application');
      this.dispose()
    },

    // --- //

    step(data){
 
      this.pipe.emit('out', {source:this, detail:data});
      this.el.ComponentBackground.classList.add('indicate');
      setTimeout(()=>this.el.ComponentBackground.classList.remove('indicate'), 333)
      this.packet = null;
    },

  };
}
