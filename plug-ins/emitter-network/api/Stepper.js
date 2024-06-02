export default class Stepper {

  methods = {

    initialize (){

      this.dataQueue = [];

      this.pipe.on('in', packet=>{
        this.dataQueue.push(packet);
      });

      this.getApplication().controller.on('step', x=>{

        if(this.dataQueue.length && !this.job){
          this.job = this.dataQueue.shift();
          console.log('Got Job');
        } else if(this.job){
          this.ui.$set({count: this.job.detail.count});
          this.step(this.job);
          this.job = null;
        }

      });
    },

    step(packet){
      this.pipe.emit('out', {source:this, detail:packet.detail});
      this.el.ComponentBackground.classList.add('indicate');
      setTimeout(()=>this.el.ComponentBackground.classList.remove('indicate'), 333);
    },

  };
}
