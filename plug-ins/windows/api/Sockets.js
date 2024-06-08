import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Socket from "/plug-ins/windows/Socket.js";
import { SocketLayout } from "/plug-ins/layout-manager/index.js";
import EventEmitter from "/plug-ins/event-emitter/EventEmitter.js";

export default class Sockets {
  static extends = [];

  observables = {
    socketRegistry: [],
    sockets: [],
  };

  methods = {

    initialize(){
      this.pipe = new EventEmitter();

      this.socketLayout = new SocketLayout(this, {source: 'sockets'});


      // NOTE: WARNING! Parent of a socket is not the wiondow it is attached to!!! Thst is its siblink. The parent of a cocket is the same as the parent of the window it is attached to.
      let parent;
      if(this.parent){
        parent = this.parent.getApplication(); // get out of local application (if isApplication)
      }else{
        // possible root
        parent = this.getApplication()
      }

      this.on("sockets.created", (socket) => {
        socket.start();
        this.socketLayout.manage(socket);
        parent.getApplication().socketRegistry.create(socket);
        // this.createPipe(socket.name, socket.side);
      }, {replay: true});

      this.on("sockets.removed", (socket) => {
        socket.stop();
        // this.removePipe(socket.name);
        parent.getApplication().socketRegistry.remove(id);
        this.removeControlAnchor(socket.id);
        this.socketLayout.forget(socket);
      });

    },

    createSocket(name, side){

      if(!name) throw new Error(`It is not possible to create an socket without an socket name.`);
      if(!side===undefined) throw new Error(`It is not possible to create an socket without specifying a side, 0 or 1.`);

      const id = [this.id, name].join('/');
      const socket = new Instance(Socket, { id, name, side, parent: this.parent, control:this, scene: this.scene } )

      this.sockets.create(socket);
    },
    removeSocket(id){
      this.sockets.remove(id);
    },

    // send(name, packet){
    //   // this.getApplication().pipeRegistry.get(name).emit('data', packet);
    //   this.pipe.emit(`${name}:data`, packet);
    // }

  };
}
