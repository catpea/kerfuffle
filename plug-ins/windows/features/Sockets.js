import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Socket from "/plug-ins/windows/Socket.js";
import { SocketLayout } from "/plug-ins/layout-manager/index.js";

export default class Sockets {
  static extends = [];

  observables = {
    socketRegistry: [],
    sockets: [],
  };

  methods = {

    initialize(){

      this.socketLayout = new SocketLayout(this, {source: 'sockets'});

      this.on("sockets.created", (socket) => {
        socket.start();
        this.socketLayout.manage(socket);
        this.getApplication().socketRegistry.create(socket);
        // this.createPipe(socket.name, socket.side);
      }, {replay: true});

      this.on("sockets.removed", (socket) => {
        socket.stop();
        // this.removePipe(socket.name);
        this.getApplication().socketRegistry.remove(id);
        this.removeControlAnchor(socket.id);
        this.socketLayout.forget(socket);
      });

    },

    createSocket(name, side){

      if(!name) throw new Error(`It is not possible to create an socket without an socket name.`);
      if(!side===undefined) throw new Error(`It is not possible to create an socket without specifying a side, 0 or 1.`);

      const id = [this.getApplication().id, name].join('/');
      const socket = new Instance(Socket, { id, name, side, parent: this, scene: this.scene } )

      this.sockets.create(socket);
    },

    removeSocket(id){
      this.sockets.remove(id);
    },

  };
}
