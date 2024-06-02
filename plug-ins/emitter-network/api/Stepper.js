import EventEmitter from `/plug-ins/event-emitter/EventEmitter.js`;
import calculatePercent from 'calculate-percent';

export default class Stepper {

  methods = {

    initialize (){
      this.control = new EventEmitter();

      this.dataQueue = [];

      let counter = 0;
      let waterLevel = 0;

      this.pipe.on('in', packet=>{
        this.dataQueue.push(packet.detail);
        waterLevel = this.dataQueue.length>waterLevel?waterLevel=this.dataQueue.length:waterLevel;
      });

      this.getApplication().controller.on('step', x=>{


        if(this.dataQueue.length && !this.job){
          this.job = this.dataQueue.shift();
          console.log('Got Job', this.job );
          this.displayTitle = this.job.attr.title;
        } else if(this.job){
          this.step(this.job);
          this.job = null;
          this.displayTitle = "";;
          counter++;

        }

        this.displayStatus = { counter:this.dataQueue.length, length:waterLevel, percent:calculatePercent(this.dataQueue.length, waterLevel) }


      });
    },

    step(packet){
      this.pipe.emit('out', {source:this, detail:packet});
      this.el.ComponentBackground.classList.add('indicate');
      setTimeout(()=>this.el.ComponentBackground.classList.remove('indicate'), 333);
    },

  };
}
