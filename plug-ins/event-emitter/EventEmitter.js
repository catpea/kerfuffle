export default class EventEmitter {
    constructor() {
        this.events = {};
    }

    // Method to subscribe to an event
    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    // Method to unsubscribe from an event
    off(eventName, listener) {
        if (!this.events[eventName]) {
            return;
        }
        const idx = this.events[eventName].indexOf(listener);
        if (idx > -1) {
            this.events[eventName].splice(idx, 1);
        }
    }

    // Method to emit an event
    emit(eventName, ...args) {
        const listeners = this.events[eventName];
        // console.log('EMITTING', eventName, listeners?.length, ...args);
        if (listeners) {
            listeners.forEach(listener => listener.apply(this, args));
        }
    }

    // Method to only listen once for an event
    once(eventName, listener) {
        const onceListener = (...args) => {
            this.off(eventName, onceListener);
            listener.apply(this, args);
        };
        this.on(eventName, onceListener);
    }
}
