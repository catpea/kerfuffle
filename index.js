(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // plug-ins/object-oriented-programming/index.js
  var Inheritance = class {
    static {
      __name(this, "Inheritance");
    }
    instance;
    root;
    constructor({ Class, instance: instance2, specification }) {
      this.instance = instance2;
      this.instance.oo.extends.push(Class);
      this.collectClasses(Class.extends);
      this.instantiateSuperclasses();
    }
    collectClasses(list) {
      if (!Array.isArray(list))
        return;
      for (const Class of list) {
        this.instance.oo.extends.push(Class);
        this.collectClasses(Class.extends);
      }
    }
    instantiateSuperclasses() {
      let parent;
      for (const Class of this.instance.oo.extends) {
        const instance2 = new Class();
        this.instance.oo.specifications.push(instance2);
        instance2.parent = parent;
        parent = instance2;
      }
    }
  };
  var Instance = class {
    static {
      __name(this, "Instance");
    }
    /*
      do not put anything in the properties section,
      Instance is the class that is returned to the user.
    */
    constructor(Class, data) {
      const specification = new Class();
      this.oo = {};
      this.oo.name = specification.constructor.name;
      this.oo.class = Class;
      this.oo.types = specification.types;
      this.oo.specification = specification;
      this.oo.attributes = [];
      this.oo.extends = [];
      this.oo.disposables = [];
      this.oo.specifications = [];
      new Inheritance({ Class, instance: this, specification, root: this });
      const defaultState = {
        current: "initial",
        initial: {
          run: "initialize",
          can: "start"
        },
        start: {
          run: "mount",
          can: "stop"
        },
        stop: {
          run: "destroy",
          can: "start"
        }
      };
      const ensureArray = /* @__PURE__ */ __name(function(input) {
        if (Array.isArray(input))
          return input;
        return [input];
      }, "ensureArray");
      const isStateTransitionAllowed = /* @__PURE__ */ __name(function({ from, to, state: state2 }) {
        return ensureArray(state2[from].can).includes(to);
      }, "isStateTransitionAllowed");
      for (const inherited of this.oo.specifications) {
        if (inherited.properties) {
          for (const [propertyName, propertyValue] of Object.entries(inherited.properties)) {
            if (propertyName in this === false) {
              Object.defineProperty(this, propertyName, {
                value: propertyValue,
                writable: true,
                enumerable: true,
                configurable: false
              });
            }
          }
        }
      }
      for (const inherited of this.oo.specifications) {
        if (inherited.traits) {
          for (const [traitName, traitFunction] of Object.entries(inherited.traits)) {
            if (traitName in this === false) {
              Object.defineProperty(this, traitName, {
                value: traitFunction.bind(this),
                writable: true,
                enumerable: true,
                configurable: false
              });
            }
          }
        }
      }
      const composite = this;
      const methods = [];
      for (const inherited of this.oo.specifications) {
        if (inherited.methods) {
          for (const [methodName, methodFunction] of Object.entries(inherited.methods)) {
            methods.push(methodName);
          }
        }
      }
      function executeAll(name2, arg, list) {
        let response = null;
        const reversed = Array.from(list).reverse();
        for (const inherited of reversed) {
          if (inherited.methods && inherited.methods[name2]) {
            response = inherited.methods[name2].bind(composite)(...arg);
          }
        }
        return response;
      }
      __name(executeAll, "executeAll");
      for (const methodName of methods) {
        Object.defineProperty(this, methodName, {
          value: function(...arg) {
            return executeAll(methodName, arg, this.oo.specifications);
          },
          writable: true,
          enumerable: true,
          configurable: false
        });
      }
      const observableData = {};
      this.oo.createObservable = (observableName, observableValue = void 0, internal = false) => {
        if (!internal) {
          this.oo.attributes.push(observableName);
        }
        const isArray = Array.isArray(observableValue) ? true : false;
        if (observableName in this === false) {
          if (isArray) {
            observableData[observableName] = new List(observableName, observableValue);
            Object.defineProperty(this, observableName, {
              get: () => observableData[observableName].value,
              set: (value) => {
                throw new Error(`observable array ${name} cannot be replaced`);
              },
              configurable: false
            });
          } else {
            observableData[observableName] = new Primitive(observableName, observableValue);
            Object.defineProperty(this, observableName, {
              get: () => observableData[observableName].value,
              set: (value) => observableData[observableName].value = value,
              configurable: false
            });
          }
        }
      };
      for (const inherited of this.oo.specifications) {
        if (inherited.observables) {
          for (const [observableName, observableValue] of Object.entries(inherited.observables)) {
            this.oo.createObservable(observableName, observableValue, true);
          }
        }
      }
      const disposables = [];
      const disposable = /* @__PURE__ */ __name(function(...arg) {
        disposables.push(...arg);
      }, "disposable");
      Object.defineProperty(this, "disposable", {
        set: (value) => this.oo.disposables.push(value),
        configurable: false
      });
      this.dispose = () => {
        disposables.map((f) => f());
        this.oo.disposables.map((f) => f());
      };
      this.on = function(eventPath, observerCallback, options, control) {
        const [name2, path] = eventPath.split(".", 2);
        if (!observableData[name2])
          throw new Error(`property "${name2}" not defined on ${this.oo.name} (${Object.keys(observableData).join(", ")})`);
        if (control?.manualDispose) {
          return observableData[name2].observe(path || name2, observerCallback, options);
        } else {
          disposable(observableData[name2].observe(path || name2, observerCallback, options));
        }
      };
      this.any = function(observables, ...functions) {
        const callback2 = /* @__PURE__ */ __name(() => {
          const entries = observables.map((key) => [key, this[key]]);
          const packet = Object.fromEntries(entries);
          functions.map((\u0192) => \u0192(packet));
        }, "callback2");
        console.info("must manually dispose!");
        return observables.map((event) => this.on(event, callback2, void 0, { manualDispose: true }));
      };
      this.all = function(observables, ...functions) {
        const callback2 = /* @__PURE__ */ __name(() => {
          const entries = observables.map((key) => [key, this[key]]);
          const packet = Object.fromEntries(entries);
          const isReady = Object.values(packet).every((value) => value !== void 0);
          if (isReady)
            functions.map((\u0192) => \u0192(packet));
          ;
        }, "callback2");
        console.info("must manually dispose!");
        return observables.map((event) => this.on(event, callback2, void 0, { manualDispose: true }));
      };
      const stateConstraints = {};
      const stateConstraint = /* @__PURE__ */ __name(function(constraints, constraintName) {
        if (constraints[constraintName]) {
          constraints[constraintName].forEach(({ test, message }) => {
            const verdict = test();
            if (verdict?.error) {
              throw new Error(`\u{1F354} state constraint error: ${message} - ${verdict.error} (attempted to execute ${constraintName})`);
            }
          });
        }
      }, "stateConstraint");
      const state = specification.state || defaultState;
      for (const [stateName2, stateValue] of Object.entries(state).filter(([stateName3, stateValue2]) => stateName3 !== "current")) {
        if (stateName2 in this === false) {
          const stateFunction = function() {
            const currentState = state.current;
            const from = currentState;
            const to = stateName2;
            const transitionAllowed = isStateTransitionAllowed({
              from,
              to,
              state
            });
            if (!transitionAllowed) {
              throw new Error(`Cannot transition state from ${from} (current) to ${to}, only ${ensureArray(state[currentState].can).join(", ")} allowed.`);
            }
            if (transitionAllowed) {
            }
            const stateFunctions2 = ensureArray(state[stateName2].run);
            for (const functionName of stateFunctions2) {
              if (functionName in this === false)
                throw new Error(`Initialize: Class ${specification.constructor.name} has no function named ${functionName}`);
              stateConstraint(stateConstraints, functionName);
              this[functionName]();
            }
            state.current = stateName2;
          }.bind(this);
          Object.defineProperty(this, stateName2, {
            value: stateFunction,
            writable: true,
            enumerable: true,
            configurable: false
          });
        }
      }
      for (const [stateName2, stateValue] of Object.entries(state).filter(([stateName3, stateValue2]) => stateName3 !== "current")) {
        for (const keyName of ensureArray(stateValue.run)) {
          if (specification.constraints && specification.constraints[keyName]) {
            for (const [constraintName, constraintValue] of Object.entries(specification.constraints[keyName])) {
              if (!stateConstraints[keyName])
                stateConstraints[keyName] = [];
              stateConstraints[keyName].push({ message: constraintName, test: constraintValue.bind(this) });
            }
          }
        }
      }
      for (const inherited of this.oo.specifications) {
        if (inherited.constraints && inherited.observables) {
          for (const [constraintName, constraintValue] of Object.entries(inherited.constraints).filter(([constraintName2, constraintValue2]) => inherited.observables[constraintName2])) {
            if (constraintName in observableData === false)
              throw new Error(`Unable to observable constrain "${constraintName}" becasue it is not defined in ${specification.constructor.name}`);
            for (const [message, test] of Object.entries(constraintValue)) {
              observableData[constraintName].constraints.push({ message, test: test.bind(this) });
              observableData[constraintName].constrain(observableData[constraintName].value, true);
            }
          }
        }
      }
      if (data) {
        for (const [name2, value] of Object.entries(data)) {
          this[name2] = value;
        }
      }
      const stateName = state.current;
      const stateFunctions = ensureArray(state[stateName].run);
      for (const functionName of stateFunctions) {
        if (functionName in this === false)
          throw new Error(`Initialize: Class ${specification.constructor.name} has no function named ${functionName}`);
        stateConstraint(stateConstraints, functionName);
        this[functionName]();
      }
    }
  };
  var Primitive = class {
    static {
      __name(this, "Primitive");
    }
    name = null;
    #value = null;
    constraints = [];
    constructor(name2, value) {
      this.name = name2;
      this.#value = value;
    }
    constrain(data, initialization) {
      if (initialization)
        return;
      this.constraints.forEach(({ test, message }) => {
        const verdict = test(data, this.#value);
        if (verdict?.error) {
          throw new Error(`\u{1F354} constraint error: ${message} - ${verdict.error} (attempted to set ${this.name} to ${data})`);
        }
      });
    }
    // Getter And Setter
    get value() {
      return this.#value;
    }
    set value(data) {
      if (this.#value == data)
        return;
      this.constrain(data);
      const previousValue = this.#value;
      if (data !== void 0)
        this.notify(`${this.name}.before`, this.#value, previousValue);
      this.#value = data;
      if (data !== void 0)
        this.notify(this.name, this.#value, previousValue);
    }
    // Install Observer Functionality
    #observers = {};
    observe(eventName, observerCallback, options = { autorun: true }) {
      if (typeof observerCallback !== "function")
        throw new TypeError("observer must be a function.");
      if (!Array.isArray(this.#observers[eventName]))
        this.#observers[eventName] = [];
      this.#observers[eventName].push(observerCallback);
      if (options.autorun && this.#value !== void 0)
        observerCallback(this.#value);
      return () => {
        console.log(`UNOBSERVING ${eventName}`);
        this.unobserve(eventName, observerCallback);
      };
    }
    unobserve(eventName, observerCallback) {
      this.#observers[eventName] = this.#observers[eventName].filter((obs) => obs !== observerCallback);
    }
    notify(eventName, eventData, ...extra) {
      if (Array.isArray(this.#observers[eventName])) {
        this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
      } else {
      }
    }
    status() {
      return {
        observerCount: Object.values(this.#observers).flat().length
      };
    }
  };
  var List = class {
    static {
      __name(this, "List");
    }
    name = null;
    #value = [];
    constraints = [];
    constructor(name2, value) {
      this.name = name2;
      this.#value.push(...value);
      this.constrain();
    }
    constrain(data, initialization) {
      if (initialization)
        return;
      for (const data2 of this.#value) {
        this.constraints.forEach(({ test, message }) => {
          const verdict = test(data2, this.#value);
          if (verdict?.error) {
            throw new Error(`\u{1F354} constraint error: ${message} - ${verdict.error} (attempted to set ${this.name} to ${data2})`);
          }
        });
      }
    }
    get value() {
      return this;
    }
    // Install Observer Functionality
    #observers = {};
    observe(eventName, observerCallback, options = { autorun: true, replay: false }) {
      if (typeof observerCallback !== "function")
        throw new TypeError("observer must be a function.");
      if (!Array.isArray(this.#observers[eventName]))
        this.#observers[eventName] = [];
      if (options.autorun) {
        if (eventName == this.name) {
          for (const item of this.#value) {
            observerCallback(item);
          }
        }
      }
      if (options.replay) {
        for (const item of this.#value) {
          observerCallback(item);
        }
      }
      this.#observers[eventName].push(observerCallback);
      return () => {
        this.unobserve(eventName, observerCallback);
      };
    }
    unobserve(eventName, observerCallback) {
      this.#observers[eventName] = this.#observers[eventName].filter((obs) => obs !== observerCallback);
    }
    notify(eventName, eventData, ...extra) {
      if (Array.isArray(this.#observers[eventName]))
        this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
    }
    status() {
      return {
        observerCount: Object.values(this.#observers).flat().length
      };
    }
    // Data Editing Functions
    create(...items) {
      for (const item of items) {
        this.constrain(item);
        this.#value.push(item);
        this.notify("created", item);
        this.notify("changed", this);
      }
    }
    remove(input) {
      let id;
      if (typeof input === "string") {
        id = input;
      } else {
        if (!input.id)
          throw new Error("Only stingId and onbect with an id property is supported");
        id = input.id;
      }
      const item = this.#value.find((o) => o.id === id);
      this.#value = this.#value.filter((o) => o !== item);
      this.notify("removed", item);
      this.notify("changed", this);
    }
    // Data Reading Functions
    [Symbol.iterator]() {
      return this.#value[Symbol.iterator]();
    }
    find(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.find(callback);
    }
    get(id) {
      return this.#value.find((o) => o.id === id);
    }
    map(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.map(callback);
    }
    reduce(callback, initialValue) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.reduce(callback, initialValue);
    }
    filter(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.filter(callback);
    }
    forEach(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.forEach(callback);
    }
    indexOf(item) {
      return this.#value.indexOf(item);
    }
    slice(...argv) {
      return this.#value.slice(...argv);
    }
    get length() {
      return this.#value.length;
    }
    get raw() {
      return this.#value;
    }
  };

  // abstract/Theme.js
  var Theme = class {
    static {
      __name(this, "Theme");
    }
    id = "theme-name";
  };

  // src/Themes.js
  var Themes = class {
    static {
      __name(this, "Themes");
    }
    observables = {
      theme: "obsidian",
      themes: [new themes.Nostromo({ subtle: true }), new themes.Obsidian({ subtle: true })]
    };
    constraints = {
      theme: {
        "all themes are lower-case": function(theme) {
          if (theme.match(/[A-Z]/)) {
            return { error: "theme name contains uppercase letters" };
          }
        },
        "specified theme does not exist": function(theme) {
          if (!this.themes.map((o) => o.id).includes(theme))
            return { error: "theme does not exist" };
        }
      },
      themes: {
        "theme is not a prototype of #abstract/Theme": function(v) {
          if (!Theme.prototype.isPrototypeOf(v))
            return { error: "must extend Theme" };
        }
      }
    };
    methods = {
      initialize() {
        this.on("theme.before", (id) => {
        });
        this.on("theme", (id, old) => {
          document.querySelector("html").dataset.uiTheme = id;
        });
        this.on("themes.created", (list) => {
          p;
        });
        this.on("themes.removed", (list) => {
        });
        this.on("themes.changed", (list) => {
        });
      }
    };
  };

  // plug-ins/debounce/index.js
  function debounce_default(func, wait) {
    let timeout;
    return /* @__PURE__ */ __name(function executedFunction(...args) {
      const later = /* @__PURE__ */ __name(() => {
        clearTimeout(timeout);
        func(...args);
      }, "later");
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }, "executedFunction");
  }
  __name(debounce_default, "default");

  // plug-ins/boolean/index.js
  function intersection(a, b) {
    const response = /* @__PURE__ */ new Set();
    for (const item of a) {
      if (b.has(item))
        response.add(item);
    }
    return response;
  }
  __name(intersection, "intersection");
  function difference(a, b) {
    const response = /* @__PURE__ */ new Set();
    for (const item of a) {
      if (!b.has(item))
        response.add(item);
    }
    return response;
  }
  __name(difference, "difference");

  // plug-ins/node/Node.js
  var Node = class {
    static {
      __name(this, "Node");
    }
    state = {
      current: "initial",
      initial: {
        run: "initialize"
      }
    };
    constraints = {
      initialize: {
        "node origin is requred": function() {
          if (this.origin === void 0) {
            return { error: "node is missing origin" };
          }
          if (!(typeof this.origin !== "string" || typeof this.origin !== "number")) {
            return { error: "node origin must be a string" };
          }
        }
      }
    };
    properties = {
      id: null,
      type: null,
      content: void 0
    };
    observables = {
      // some common/required properties
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      H: 0,
      r: 0,
      b: 0,
      p: 0,
      s: 0,
      selected: false,
      source: void 0,
      target: void 0,
      url: void 0,
      // JSON url
      src: void 0,
      // JSON url
      data: void 0
      // JSON data
    };
    types = {
      x: "Float",
      y: "Float",
      w: "Float",
      h: "Float",
      H: "Float",
      r: "Integer",
      b: "Integer",
      p: "Integer",
      s: "Integer"
    };
    methods = {
      assign(meta, data, content) {
        this.content = content;
        const nodeKeys = /* @__PURE__ */ new Set([...Object.keys(this.oo.specification.properties), ...Object.keys(this.oo.specification.observables)]);
        const metaKeys = /* @__PURE__ */ new Set([...Object.keys(meta)]);
        const commonProperties = intersection(nodeKeys, metaKeys);
        const newProperties = difference(metaKeys, commonProperties);
        for (const newProperty of newProperties) {
          this.oo.createObservable(newProperty, meta[newProperty]);
        }
        const values = { ...meta, data, content };
        for (const key in values) {
          if (this.oo.types[key]) {
            this[key] = cast(values[key], this.oo.types[key]);
          } else {
            this[key] = values[key];
          }
        }
      },
      toObject() {
        const meta = {};
        const data = this.data;
        const object = { meta, data };
        for (const [name2, value] of Object.entries(this.oo.specification.properties)) {
          if (this[name2] !== value)
            meta[name2] = this[name2];
        }
        for (const [name2, value] of Object.entries(this.oo.specification.observables).filter(([name3]) => !["data"].includes(name3))) {
          if (this[name2] !== value)
            meta[name2] = this[name2];
        }
        for (const name2 of this.oo.newObservables) {
          meta[name2] = this[name2];
        }
        return object;
      },
      initialize() {
      },
      stop() {
      },
      destroy() {
        this.dispose();
      }
    };
  };
  function cast(value, type) {
    if (type === "Float") {
      return parseFloat(value);
    } else if (type === "Integer") {
      return parseInt(value);
    } else {
      throw new TypeError("Unknown type, no cast procedure");
    }
  }
  __name(cast, "cast");

  // plug-ins/domek/index.js
  var update = /* @__PURE__ */ __name(function(elements, properties) {
    const els = Array.isArray(elements) ? elements : [elements];
    for (const el of els) {
      for (const key in properties) {
        let value = properties[key];
        if (key == "style" && typeof value == "object") {
          for (const name2 in value) {
            el.style[name2] = value[name2];
          }
          continue;
        } else if (typeof value == "object") {
          value = Object.entries(value).map(([k, v]) => `${k}: ${v};`).join(" ");
        }
        if (el.namespaceURI == "http://www.w3.org/2000/svg") {
          el.setAttributeNS(null, key, value);
        } else {
          el.setAttribute(key, value);
        }
      }
    }
  }, "update");
  var svg = new Proxy({}, {
    get: function(target, property) {
      return function(properties, text3) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", property);
        update(el, properties);
        if (text3)
          el.appendChild(document.createTextNode(text3));
        return el;
      };
    }
  });
  var xhtml = new Proxy({}, {
    get: function(target, property) {
      return function(properties, text3) {
        const el = document.createElementNS("http://www.w3.org/1999/xhtml", property);
        update(el, properties);
        if (text3)
          el.appendChild(document.createTextNode(text3));
        return el;
      };
    }
  });
  var html = new Proxy({}, {
    get: function(target, property) {
      return function(properties, text3) {
        const el = document.createElement(property);
        update(el, properties);
        if (text3)
          el.appendChild(document.createTextNode(text3));
        return el;
      };
    }
  });
  var text = /* @__PURE__ */ __name(function(text3) {
    return document.createTextNode(text3);
  }, "text");
  function front(element2) {
    const parentElement = element2.parentNode;
    parentElement.removeChild(element2);
    parentElement.appendChild(element2);
  }
  __name(front, "front");
  function click(element2, callback) {
    element2.addEventListener("mouseup", handler);
    function handler(event) {
      callback(event);
    }
    __name(handler, "handler");
    return () => element2.removeEventListener("mouseup", handler);
  }
  __name(click, "click");

  // plug-ins/layout-manager/index.js
  var BOTH_SIDES = 2;
  var Layout = class {
    static {
      __name(this, "Layout");
    }
    parent;
    source;
    constructor(parent, { source } = { source: "children" }) {
      this.parent = parent;
      this.source = source;
    }
    manage(child) {
    }
    calculateChildW() {
      return 320 * Math.random();
    }
    calculateH() {
      return 200 * Math.random();
    }
    calculateChildX(parent, child) {
      return 800 * Math.random();
    }
    calculateChildY(parent, child) {
      return 600 * Math.random();
    }
    above(parent, child) {
      return parent[this.source].slice(0, parent[this.source].indexOf(child));
    }
    #cleanup = [];
    cleanup(...arg) {
      this.#cleanup.push(...arg);
    }
  };
  var VerticalLayout = class extends Layout {
    static {
      __name(this, "VerticalLayout");
    }
    manage(child) {
      child.x = this.calculateChildX(child);
      child.y = this.calculateChildY(child);
      child.w = this.calculateChildW(child);
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      this.parent.on("w", () => child.w = this.calculateChildW(child));
      child.on("h", () => {
      });
      this.parent.on("h", () => child.y = this.calculateChildY(child));
      this.parent.on("h", () => {
        if (child.flexible)
          child.h = this.calculateGrowChildH(child);
      });
    }
    calculateChildW(child) {
      const response = this.parent.w - (this.parent.b + this.parent.p) * BOTH_SIDES;
      return response;
    }
    calculateH() {
      let heightOfChildren = 0;
      const children2 = this.parent[this.source];
      heightOfChildren = children2.reduce((total, c) => total + c.h, 0) + this.parent.s * 2 * (children2.length > 0 ? children2.length - 1 : 0);
      let response = this.parent.b + this.parent.p + heightOfChildren + this.parent.p + this.parent.b;
      if (response < this.parent.H) {
        response = this.parent.H;
      }
      return response;
    }
    calculateChildX() {
      const response = this.parent.x + // use my own x
      this.parent.b + // add border
      this.parent.p;
      return response;
    }
    calculateChildY(child) {
      const response = this.parent.y + this.parent.b + this.parent.p + this.above(this.parent, child).reduce((total, child2) => total + child2.h, 0) + this.parent.s * 2 * this.above(this.parent, child).length;
      return response;
    }
    calculateGrowChildH(flexibleChild) {
      let response = flexibleChild.h;
      const onlyChild = this.parent.children.length === 1;
      if (onlyChild) {
        return this.parent.h;
      }
      const children2 = this.parent.children.filter((c) => c !== flexibleChild);
      const childrenHeight = children2.reduce((total, c) => total + c.h, 0);
      const childrenHeightGaps = this.parent.s * 1 * this.parent.children.length;
      const freeSpace = this.parent.h - childrenHeight - this.parent.b * 2 - this.parent.p * 2 - childrenHeightGaps;
      console.table("flexibleChild.h", {
        application: this.parent.getApplication().oo.name,
        "application.h": this.parent.getApplication().h,
        h: flexibleChild.h,
        "this.parent.h": this.parent.h,
        size: children2.length,
        freeSpace
      });
      if (children2.length && freeSpace) {
        return freeSpace;
      }
      return response;
    }
  };
  var HorizontalLayout = class extends Layout {
    static {
      __name(this, "HorizontalLayout");
    }
    manage(child) {
      const children2 = this.parent[this.source];
      const childCount = children2.length;
      const siblingCount = this.above(this.parent, child).length;
      child.x = this.calculateChildX(child);
      child.y = this.calculateChildY(child);
      child.w = this.calculateChildW(child);
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      this.parent.on("h", () => child.y = this.calculateChildY(child));
      this.parent.on("children.changed", (list) => list.forEach((child2) => {
        child2.w = this.calculateChildW(child2);
        child2.x = this.calculateChildX(child2);
      }));
      this.parent.on("w", () => {
        child.w = this.calculateChildW(child);
        child.x = this.calculateChildX(child);
      });
      child.on("h", () => this.parent.h = this.calculateH());
    }
    calculateChildX(child) {
      const response = this.parent.x + this.parent.b + this.parent.p + this.above(this.parent, child).reduce((total, child2) => total + child2.w, 0) + this.parent.s * 2 * this.above(this.parent, child).length;
      return response;
    }
    calculateChildW1(child) {
      const children2 = this.parent[this.source];
      const childCount = children2.length;
      const siblingCount = this.above(this.parent, child).length;
      let response = this.parent.w / childCount;
      return response;
    }
    calculateChildW(child) {
      if (!(child.W === void 0))
        return child.W < 1 ? this.parent.w * child.W : child.W;
      const children2 = this.parent[this.source];
      let softElements = children2.filter((child2) => child2.W === void 0);
      let hardElements = children2.filter((child2) => !(child2.W === void 0));
      let hardSpace = hardElements.reduce((total, child2) => total + (child2.W < 1 ? this.parent.w * child2.W : child2.W), 0);
      let spacers = this.parent.s * 2 * (children2.length > 0 ? children2.length - 1 : 0);
      let availableSoftSpace = this.parent.w - hardSpace - spacers;
      let softUnit = availableSoftSpace / (softElements.length || 1);
      return softUnit;
    }
    calculateChildY(child) {
      const response = this.parent.y + this.parent.b + this.parent.p;
      return response;
    }
    calculateH() {
      let heightOfChildren = 0;
      const children2 = this.parent[this.source];
      heightOfChildren = children2.reduce((max, c) => c.h > max ? c.h : max, 0);
      let response = this.parent.b + this.parent.p + heightOfChildren + this.parent.p + this.parent.b;
      if (response < this.parent.H)
        response = this.parent.H;
      return response;
    }
  };
  var AnchorLayout = class extends Layout {
    static {
      __name(this, "AnchorLayout");
    }
    manage(child) {
      child.x = this.calculateChildX(child);
      child.y = this.calculateChildY(child);
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      this.parent.on("w", () => child.x = this.calculateChildX(child));
      this.parent.on("h", () => child.y = this.calculateChildY(child));
    }
    calculateChildX(child) {
      if (!child.side) {
        return this.parent.x - child.r - child.s;
      } else {
        return this.parent.x + this.parent.w + child.r + child.s;
      }
      this.parent.b + this.parent.p;
    }
    calculateChildY(child) {
      const response = this.parent.y + this.parent.b + this.parent.p + child.r + this.above(this.parent, child).filter((o) => o.side == child.side).reduce((total, child2) => total + child2.h, 0) + this.parent.s * 2 * this.above(this.parent, child).length;
      return response;
    }
  };

  // plug-ins/windows/Component.js
  var Component = class {
    static {
      __name(this, "Component");
    }
    properties = {
      id: uuid(),
      el: {},
      // bag of elements
      content: void 0
      // XML nodes
    };
    observables = {
      parent: void 0,
      // it may be needed to access parent from a control
      scene: void 0,
      // remember parent sets the scene, this child must adds its own .g to it, then its own g becomes the scene for children
      node: void 0,
      // data node
      // node has data, we keep it here at the root of component
      data: void 0,
      // the data that is in the node
      selected: false,
      // selection manager feature
      name: "un-named",
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      H: 0,
      // min h
      r: 0,
      // border radius
      b: 0,
      // border
      p: 0,
      // padding
      s: 0,
      // spacer/gap
      flexible: false
      // whether or not component fills all available x,y space in ceratin situations
    };
    constraints = {
      scene: {
        ".scene must be an instance of HTMLElement": function() {
          if (!(obj instanceof HTMLElement))
            return { error: "Not an HTMLElement" };
        }
      },
      mount: {
        ".scene is required to start": function() {
          if (!this.data) {
            return { error: "data missing" };
          }
        },
        ".node is required to start": function() {
          if (!this.node) {
            return { error: "node missing" };
          }
        },
        ".node must be an observable object": function() {
          if (!this.node.on) {
            return { error: ".on missing on .node" };
          }
        }
      }
    };
    traits = {
      draw() {
        this.el.Container = svg.rect({
          name: this.oo.name,
          style: { "pointer-events": "none" },
          class: ["container-background", this.isApplication ? "application" : null].filter((i) => i).join(" "),
          ry: this.r,
          "stroke-width": 0,
          "vector-effect": "non-scaling-stroke",
          // set initial values
          // these are special, handeled by the layout manager
          // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
          width: this.w,
          height: this.h,
          x: this.x,
          y: this.y
        });
        this.getApplication().on("node", (node) => {
          this.el.Container.classList.add(node.type.toLowerCase());
        });
        this.on("name", (name2) => update(this.el.Container, { name: name2 }));
        this.on("w", (width) => update(this.el.Container, { width }));
        this.on("h", (height) => update(this.el.Container, { height }));
        this.on("x", (x) => update(this.el.Container, { x }));
        this.on("y", (y) => update(this.el.Container, { y }));
        this.on("r", (ry) => update(this.el.Container, { ry }));
        this.appendElements();
      },
      allAnchors(parent, list = []) {
        if (parent?.children) {
          for (const child of parent.children) {
            if (child.anchors?.length) {
              for (const anchor of child.anchors) {
                list.push(anchor);
              }
            }
            this.allAnchors(child, list);
          }
        }
        return list;
      },
      appendElements() {
        Object.values(this.el).forEach((el) => this.scene.appendChild(el));
      },
      removeElements() {
        Object.values(this.el).forEach((el) => el.remove());
      },
      getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
      },
      pipe(name2) {
        const id = [name2, this.getRootContainer().id].join(":");
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        const pipe = origin.root.pipes.get(id);
        return pipe;
      },
      // getRootContainer() {
      //   let response = null;
      //
      //   if(!this.parent){
      //     // console.log(`Object ${this.oo.name} did not have a parent`);
      //     response = this;
      //   } else if(!this.parent.getRootContainer){
      //     // console.log(`Object ${this.oo.name} did not have a getRootContainer`);
      //     response = this;
      //   } else if(this.contain){
      //     // console.log(`Object ${this.oo.name} had a .contain directive`);
      //     response = this;
      //   }else{
      //     response = this.parent.getRootContainer();
      //   }
      //
      //   return response;
      // },
      getRootContainer() {
        let response = null;
        if (!this.parent) {
          response = this;
        } else {
          response = this.parent.getRootContainer();
        }
        return response;
      },
      getRoot() {
        let response = null;
        if (!this.parent) {
          response = this;
        } else {
          response = this.parent.getRoot();
        }
        return response;
      },
      getStack(element2, list = []) {
        if (!element2)
          element2 = this;
        list.unshift(element2);
        if (element2.parent)
          this.getStack(element2.parent, list);
        return list;
      },
      getParentScale(component) {
        const list = this.getTransforms(component).slice(0, -1);
        const scale = list.map((o) => o.zoom).reduce((a, c) => a * c, 1);
        return scale;
      },
      getScale(component) {
        const list = this.getTransforms(component);
        const scale = list.map((o) => o.zoom).reduce((a, c) => a * c, 1);
        return scale;
      },
      getTransforms(element2, list = [], root = true) {
        if (!element2)
          element2 = this;
        const isTransform = element2.hasOwnProperty("panX") && element2.hasOwnProperty("panY") && element2.hasOwnProperty("zoom");
        if (isTransform) {
          let offsetX = element2.viewport.x - element2.x;
          let offsetY = element2.viewport.y - element2.y;
          const { oo: { name: name2 }, panX, panY, zoom, x, y } = element2;
          list.unshift({ name: name2, panX, panY, zoom, x: element2.x + offsetX, y: element2.y + offsetY, element: element2.scene, offsetX: 0, offsetY: 0 });
        }
        if (element2.parent)
          this.getTransforms(element2.parent, list, false);
        if (root) {
          let parent = false;
          for (const [index, item] of list.entries()) {
            item.index = index;
            item.parent = parent;
            parent = item;
          }
        }
        return list;
      },
      getApplication(element2) {
        if (!element2)
          element2 = this;
        if (element2.isApplication === true) {
          return element2;
        }
        if (element2.parent)
          return this.getApplication(element2.parent);
      }
    };
    methods = {
      initialize() {
        this.on("node", (node) => {
          node.on("x", (x) => this.x = x);
          node.on("y", (y) => this.y = y);
          node.on("w", (w) => this.w = w);
          node.on("h", (h) => this.h = h);
          node.on("H", (H) => this.H = H);
          node.on("r", (r) => this.r = r);
          node.on("b", (b) => this.b = b);
          node.on("p", (p2) => this.p = p2);
          node.on("s", (s) => this.s = s);
          node.on("data", (data) => this.data = data);
          if (node.content) {
            this.content = node.content;
          }
          ;
        });
      }
    };
  };

  // plug-ins/windows/Container.js
  var Container = class {
    static {
      __name(this, "Container");
    }
    static extends = [Component];
    properties = {
      layout: null
    };
    observables = {
      children: []
    };
    methods = {
      initialize() {
        this.on("children.created", (child) => {
          child.scene = this.scene;
          child.start();
          this.layout.manage(child);
        }, { replay: true });
        this.on("children.removed", (child) => {
          child.stop();
          this.layout.forget(child);
        });
      },
      mount() {
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/windows/Vertical.js
  var Vertical = class {
    static {
      __name(this, "Vertical");
    }
    static extends = [Container];
    methods = {
      initialize() {
        this.layout = new VerticalLayout(this);
      }
    };
  };

  // plug-ins/select/index.js
  var Select = class {
    static {
      __name(this, "Select");
    }
    component;
    handle;
    // handlers
    mouseDownHandler;
    mouseUpHandler;
    constructor({ component, handle }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      this.component = component;
      this.handle = handle;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        const multiSelect = e.ctrlKey;
        this.component.selected = !this.component.selected;
        if (multiSelect) {
        } else {
          if (this.component.selected) {
            for (const item of globalThis.project.applications) {
              if (this.component.id !== item.id) {
                item.selected = false;
              }
            }
            for (const item of globalThis.project.anchors) {
              if (this.component.id !== item.id) {
                item.selected = false;
              }
            }
          }
        }
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
    }
  };

  // plug-ins/connect/index.js
  var uuid2 = bundle["uuid"];
  var Connect = class {
    static {
      __name(this, "Connect");
    }
    parent;
    anchor;
    zone;
    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;
    startX = 0;
    startY = 0;
    dragging = false;
    constructor({ parent, anchor, zone }) {
      if (!parent)
        throw new Error("parent is required");
      if (!anchor)
        throw new Error("anchor is required");
      if (!zone)
        throw new Error("zone is required");
      this.parent = parent;
      this.anchor = anchor;
      this.zone = zone;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        this.line = svg.line({
          class: "editor-anchor-line",
          style: {
            "pointer-events": "none"
            /* required, otherwise the line will mousedrop on it self */
          },
          "vector-effect": "non-scaling-stroke"
        });
        this.anchor.scene.appendChild(this.line);
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.dragging = true;
        globalThis.project.iframe = false;
        this.zone.addEventListener("mousemove", this.mouseMoveHandler);
      };
      this.mouseMoveHandler = (e) => {
        let dx = 0;
        let dy = 0;
        dx = e.clientX - this.startX;
        dy = e.clientY - this.startY;
        dx = dx + this.anchor.x * globalThis.project.zoom;
        dy = dy + this.anchor.y * globalThis.project.zoom;
        dx = dx / globalThis.project.zoom;
        dy = dy / globalThis.project.zoom;
        this.geometry = {
          // origin of th eindicator line is the port
          x1: this.anchor.x,
          y1: this.anchor.y,
          // target of the indicator line is where the cursor is dragging
          x2: dx,
          y2: dy
        };
        update(this.line, this.geometry);
        dx = 0;
        dy = 0;
      };
      this.mouseUpHandler = (e) => {
        if (e.target == this.anchor) {
          console.log("SELF");
        }
        const isOverAnotherPort = this.dragging && e?.target?.classList?.contains("editor-anchor");
        const isOverBackground = this.dragging && e?.target?.classList?.contains("editor-background");
        const origin = this.anchor.getRootContainer().node.origin;
        if (isOverAnotherPort) {
          const source = [this.anchor.name, this.anchor.getRootContainer().node.id].join(":");
          const target = e.target.dataset.target;
          if (source != target) {
            globalThis.project.createNode({ meta: { id: uuid2(), type: "Line", source, target, origin }, data: {} });
          }
        }
        if (isOverBackground) {
          const junctionId = uuid2();
          globalThis.project.createNode({ meta: { id: junctionId, type: "Junction", x: this.geometry.x2, y: this.geometry.y2, origin }, data: {} });
          const source = [this.anchor.name, this.anchor.getRootContainer().node.id].join(":");
          const target = ["input", junctionId].join(":");
          globalThis.project.createNode({ meta: { id: uuid2(), type: "Line", source, target, origin }, data: {} });
        }
        if (this.line)
          this.line.remove();
        this.dragging = false;
        globalThis.project.iframe = true;
        this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      };
      this.anchor.pad.addEventListener("mousedown", this.mouseDownHandler);
      this.zone.addEventListener("mouseup", this.mouseUpHandler);
    }
    destroy() {
      this.anchor.pad.removeEventListener("mousedown", this.mouseDownHandler);
      this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      this.zone.removeEventListener("mouseup", this.mouseUpHandler);
    }
  };

  // plug-ins/windows/Anchor.js
  var Anchor = class {
    static {
      __name(this, "Anchor");
    }
    static extends = [Component];
    properties = {
      pad: null
    };
    observables = {
      side: 0,
      color: "transparent"
    };
    constraints = {
      mount: {
        ".scene is required": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
        this.r = 8;
        this.s = 4;
        this.w = this.r * 2;
        this.h = this.r * 2 + this.s;
        this.x = 0;
        this.y = 0;
      },
      mount() {
        this.el.Primary = svg.circle({
          name: this.name,
          class: "editor-anchor",
          "vector-effect": "non-scaling-stroke",
          r: this.r,
          cx: this.x,
          cy: this.y
        });
        this.on("selected", (selected) => selected ? this.el.Primary.classList.add("selected") : this.el.Primary.classList.remove("selected"));
        const select = new Select({
          component: this,
          handle: this.el.Primary
        });
        this.destructable = () => select.destroy();
        this.el.Primary.dataset.target = [this.name, this.getRootContainer().id].join(":");
        this.pad = this.el.Primary;
        this.on("name", (name2) => update(this.el.Primary, { name: name2 }));
        this.on("x", (cx) => update(this.el.Primary, { cx }));
        this.on("y", (cy) => update(this.el.Primary, { cy }));
        this.on("r", (r) => update(this.el.Primary, { r }));
        this.appendElements();
        const connect = new Connect({
          anchor: this,
          zone: window,
          parent: this
        });
        this.destructable = () => connect.destroy();
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/pipe/Pipe.js
  var EventEmitter = bundle["events"];
  var Pipe = class extends EventEmitter {
    static {
      __name(this, "Pipe");
    }
    id;
    direction;
    constructor(id, direction) {
      super();
      this.id = id;
      this.direction = direction;
    }
    input(data) {
      console.log("pipe got input", data);
    }
  };

  // plug-ins/windows/Control.js
  var Control = class {
    static {
      __name(this, "Control");
    }
    static extends = [Component];
    properties = {
      anchorage: null
    };
    observables = {
      anchors: []
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
      },
      mount() {
        this.anchorage = new AnchorLayout(this, { source: "anchors" });
        this.on("anchors.created", (anchor) => {
          anchor.start();
          this.createPipe(anchor.name, anchor.side);
          this.anchorage.manage(anchor);
        }, { replay: true });
        this.on("anchors.removed", (anchor) => {
          anchor.stop();
          this.removePipe(anchor.name);
          this.removeControlAnchor(anchor.id);
          this.anchorage.forget(anchor);
        });
        this.appendElements();
      },
      createPipe(name2, direction) {
        const id = [name2, this.getRootContainer().id].join(":");
        const pipe = new Pipe(id, direction);
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.pipes.create(pipe);
      },
      removePipe(name2) {
        const id = [name2, this.getRootContainer().id].join(":");
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.pipes.get(id).stop();
        origin.root.pipes.remove(id);
      },
      createControlAnchor({ name: name2, side }) {
        console.log("TODO: createControlAnchor is disabled");
        return;
        if (!name2)
          throw new Error(`It is not possible to create an anchor without an anchor name.`);
        if (!side === void 0)
          throw new Error(`It is not possible to create an anchor without specifying a side, 0 or 1.`);
        const id = [name2, this.getRootContainer().id].join(":");
        const anchor = new Instance(Anchor, { id, name: name2, side, parent: this, scene: this.scene });
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.anchors.create(anchor);
        this.anchors.create(anchor);
      },
      removeControlAnchor(id) {
        this.anchors.remove(id);
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.anchors.remove(id);
      },
      destroy() {
        console.warn("TODO: DESTROY ALL ANCHORS");
        console.warn("TODO: STOP ANCHORAGE");
        this.removeElements();
      }
    };
  };

  // plug-ins/windows/Horizontal.js
  var Horizontal = class {
    static {
      __name(this, "Horizontal");
    }
    static extends = [Container];
    methods = {
      initialize() {
        this.layout = new HorizontalLayout(this);
      }
    };
  };

  // plug-ins/windows/Label.js
  var Label = class {
    static {
      __name(this, "Label");
    }
    static extends = [Control];
    properties = {
      handle: null
    };
    observables = {
      text: ""
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
        this.s = 3;
      },
      mount() {
        this.el.Container = svg.rect({
          name: this.name,
          class: "editor-label",
          "stroke-width": this.b,
          "vector-effect": "non-scaling-stroke",
          ry: this.r,
          // set initial values
          // these are special, handeled by the layout manager
          // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
          width: this.w,
          height: this.h,
          x: this.x,
          y: this.y
        });
        this.handle = this.el.Container;
        this.el.ClipPath = svg.clipPath({
          id: `clip-path-${this.id}`
        });
        const clipPathRect = svg.rect({
          x: this.x,
          y: this.y,
          width: this.w,
          height: this.h
        });
        this.el.ClipPath.appendChild(clipPathRect);
        this.el.Caption = svg.text({
          name: this.name,
          class: "editor-label-text",
          "dominant-baseline": "hanging",
          "clip-path": `url(#clip-path-${this.id})`,
          x: this.x,
          y: this.y
        });
        const updateZUI = /* @__PURE__ */ __name(function(el, zuiAttributes, standardAttributes) {
          if (globalThis.project.zoom > 1) {
            update(el, zuiAttributes);
          } else {
            update(el, standardAttributes);
          }
        }, "updateZUI");
        if (0) {
          globalThis.project.on("zoom", (v) => requestAnimationFrame(() => {
            updateZUI(this.el.Caption, { style: { scale: 1 / globalThis.project.zoom }, x: (this.x + this.s) * globalThis.project.zoom, y: (this.y + this.s) * globalThis.project.zoom }, { style: { scale: 1 }, x: this.x + this.s, y: this.y + this.s });
            updateZUI(clipPathRect, { x: this.x * globalThis.project.zoom, y: this.y * globalThis.project.zoom, width: this.w * globalThis.project.zoom, height: this.h * globalThis.project.zoom }, { x: this.x, y: this.y, width: this.w, height: this.h });
          }));
        }
        const captionText = text(this.text);
        this.el.Caption.appendChild(captionText);
        this.on("selected", (selected) => selected ? this.el.Container.classList.add("selected") : this.el.Container.classList.remove("selected"));
        this.on("name", (name2) => update(this.el.Container, { name: name2 }));
        this.on("w", (width) => update(this.el.Container, { width }));
        this.on("h", (height) => update(this.el.Container, { height }));
        this.on("x", (x) => update(this.el.Container, { x }));
        this.on("y", (y) => update(this.el.Container, { y }));
        this.on("r", (ry) => update(this.el.Container, { ry }));
        this.on("text", (text3) => captionText.nodeValue = text3);
        this.any(["x", "y"], ({ x, y }) => updateZUI(this.el.Caption, { x: (x + this.s) * globalThis.project.zoom, y: (y + this.s) * globalThis.project.zoom }, { style: { scale: 1 }, x: x + this.s, y: y + this.s }));
        this.any(["x", "y", "w", "h"], ({ x, y, w: width, h: height }) => updateZUI(clipPathRect, { x: x * globalThis.project.zoom, y: y * globalThis.project.zoom, width: width * globalThis.project.zoom, height: this.h * globalThis.project.zoom }, { x, y, width, height }));
        this.appendElements();
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/nest/index.js
  var typeOf = /* @__PURE__ */ __name(function(variable) {
    if (Array.isArray(variable))
      return "Array";
    if (typeof variable === "function")
      return "Function";
    if (Object(variable) === variable)
      return "Object";
  }, "typeOf");
  var byType = /* @__PURE__ */ __name(function(input) {
    const response = {};
    for (const variable of input) {
      response[typeOf(variable)] = variable;
    }
    return response;
  }, "byType");
  function nest(Type, ...input) {
    if (!Type)
      return;
    const { Object: attr2, Array: children2, Function: init2 } = byType(input);
    const instance2 = new Instance(Type, attr2);
    if (init2)
      init2(instance2, this ? this.parent : null);
    return [instance2, children2?.map((child) => nest.bind({ parent: instance2 })(...child)).map(([ins, chi]) => chi ? [ins, chi] : ins)];
  }
  __name(nest, "nest");

  // plug-ins/windows/Caption.js
  var Caption = class {
    static {
      __name(this, "Caption");
    }
    static extends = [Control];
    properties = {
      handle: null
    };
    observables = {
      text: ""
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
      },
      mount() {
        const [horizontal, [info1, maximizeButton]] = nest(Horizontal, { parent: this, scene: this.scene, s: 2 }, [
          [Label, { h: 24, text: this.text, parent: this, r: 3 }, (c, p2) => p2.children.create(c)],
          [Label, { h: 24, W: 24, text: "++", parent: this, r: 3 }, (c, p2) => p2.children.create(c)]
        ], (c) => {
          this.destructable = () => {
            c.stop();
            c.destroy();
          };
        });
        this.handle = info1.el.Container;
        horizontal.start();
        this.on("selected", (selected) => selected ? info1.el.Container.classList.add("selected") : info1.el.Container.classList.remove("selected"));
        this.on("text", (text3) => info1.text = text3);
        this.any(["x", "y", "w", "h"], ({ x, y, w, h }) => Object.assign(horizontal, { x, y, w, h }));
        let maximized = false;
        const parent = this.getApplication().parent ? this.getApplication().parent.getApplication() : this.getRootContainer();
        const current = this.getApplication();
        const bottle = [
          [parent.pane, "zoom", null],
          [parent.pane, "panX", null],
          [parent.pane, "panY", null],
          [current, "x", null],
          [current, "y", null],
          [current, "w", null],
          [current, "h", null]
        ];
        let unwatch;
        this.disposable = click(maximizeButton.handle, (e) => {
          e.stopPropagation();
          front(current.scene);
          if (maximized) {
            unwatch.map((x) => x());
            for (const [i, [o, k, v]] of bottle.entries()) {
              o[k] = v;
            }
            maximized = false;
          } else {
            for (const [i, [o, k, v]] of bottle.entries()) {
              bottle[i][2] = o[k];
            }
            parent.pane.zoom = 1;
            parent.pane.panX = 0;
            parent.pane.panY = 0;
            current.x = 0;
            current.y = 0;
            unwatch = parent.pane.viewport.any(["w", "h"], ({ w, h }) => {
              current.w = parent.pane.viewport.w / parent.pane.viewport.zoom;
              current.h = parent.pane.viewport.h / parent.pane.viewport.zoom;
            });
            maximized = true;
          }
        });
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/meowse/Drag.js
  var Drag = class {
    static {
      __name(this, "Drag");
    }
    area = window;
    handle = null;
    scale;
    before = () => {
    };
    movement = () => {
    };
    after = () => {
    };
    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;
    dragging = false;
    previousX = 0;
    previousY = 0;
    constructor({ handle, area, before, movement, after, scale }) {
      this.handle = handle;
      this.area = area;
      this.before = before;
      this.movement = movement;
      this.after = after;
      this.scale = scale;
      this.#mount();
    }
    #mount() {
      this.mouseDownHandler = (e) => {
        this.previousX = e.screenX;
        this.previousY = e.screenY;
        this.area.addEventListener("mousemove", this.mouseMoveHandler);
        this.before();
      };
      this.mouseMoveHandler = (e) => {
        let movementX = this.previousX - e.screenX;
        let movementY = this.previousY - e.screenY;
        const scale = this.scale();
        movementX = movementX / scale;
        movementY = movementY / scale;
        let cancelX = false;
        let cancelY = false;
        this.movement({
          x: movementX,
          y: movementY,
          cancelX: () => cancelX = true,
          cancelY: () => cancelY = true,
          destroy: () => this.destroy(),
          stop: () => this.area.removeEventListener("mousemove", this.mouseMoveHandler)
        });
        if (!cancelX)
          this.previousX = e.screenX;
        if (!cancelY)
          this.previousY = e.screenY;
      };
      this.mouseUpHandler = (e) => {
        this.after();
        this.area.removeEventListener("mousemove", this.mouseMoveHandler);
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
      this.area.addEventListener("mouseup", this.mouseUpHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
      this.area.removeEventListener("mousemove", this.mouseMoveHandler);
      this.area.removeEventListener("mouseup", this.mouseUpHandler);
    }
  };

  // plug-ins/meowse/Move.js
  var Move = class extends Drag {
    static {
      __name(this, "Move");
    }
  };
  var Move_default = Move;

  // plug-ins/meowse/Focus.js
  var Focus = class {
    static {
      __name(this, "Focus");
    }
    component;
    handle;
    element = () => {
    };
    // handlers
    mouseDownHandler;
    mouseUpHandler;
    constructor({ component, handle, element: element2 }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      this.component = component;
      this.element = element2;
      this.handle = handle;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        e.stopPropagation();
        front(this.element());
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
    }
  };

  // plug-ins/windows/Window.js
  var Window = class {
    static {
      __name(this, "Window");
    }
    static extends = [Vertical];
    observables = {
      caption: "Untitled",
      showMenu: false,
      showStatus: false
    };
    properties = {
      contain: true
    };
    methods = {
      initialize() {
        if (!this.isRootWindow) {
          this.r = 5;
          this.b = 5;
          this.s = 3;
        }
      },
      mount() {
        this.draw();
        if (this.isRootWindow)
          return;
        if (this.isMenuWindow)
          return;
        let caption = new Instance(Caption, { h: 24, text: this.caption });
        this.on("caption", (v) => caption.text = v);
        this.createWindowComponent(caption);
        this.on("node", (node) => {
          if (node.caption)
            node.on("caption", (caption2) => this.caption = caption2);
        });
        const move = new Move_default({
          area: window,
          handle: caption.handle,
          scale: () => this.getScale(this),
          before: () => {
          },
          movement: ({ x, y }) => {
            this.node.x -= x;
            this.node.y -= y;
          },
          after: () => {
          }
        });
        this.destructable = () => move.destroy();
        const focus2 = new Focus({
          handle: this.scene,
          // TIP: set to caption above to react to window captions only
          component: this,
          element: () => this.getApplication().scene
        });
        this.destructable = () => focus2.destroy();
      },
      createWindowComponent(component) {
        component.parent = this;
        this.children.create(component);
      }
    };
    constraints = {};
  };

  // plug-ins/windows/Application.js
  var Application = class {
    static {
      __name(this, "Application");
    }
    static extends = [Window];
    properties = {
      isApplication: true
    };
    observables = {
      url: null
    };
    methods = {
      initialize() {
        this.getRoot().origins.create(this);
      }
    };
  };

  // plug-ins/meowse/Pan.js
  var Pan = class extends Drag {
    static {
      __name(this, "Pan");
    }
  };
  var Pan_default = Pan;

  // plug-ins/meowse/Zoom.js
  var Zoom = class {
    static {
      __name(this, "Zoom");
    }
    event = "wheel";
    area;
    handle;
    getter;
    before = () => {
    };
    change = () => {
    };
    after = () => {
    };
    feedback = () => {
    };
    magnitude;
    // magnitude of change
    min;
    max;
    constructor({ getter, component, transforms, area = window, handle, before = /* @__PURE__ */ __name(() => {
    }, "before"), change, after = /* @__PURE__ */ __name(() => {
    }, "after"), feedback = /* @__PURE__ */ __name(() => {
    }, "feedback"), magnitude = 1, min = 0.1, max = 5 }) {
      this.transforms = transforms;
      this.component = component;
      this.area = area;
      this.handle = handle;
      this.getter = getter;
      this.before = before;
      this.change = change;
      this.after = after;
      this.feedback = feedback;
      this.magnitude = magnitude;
      this.min = min;
      this.max = max;
      this.#mount();
    }
    #mount() {
      this.movelHandler = (e) => {
        const [cursorX, cursorY] = this.#translateCursor(e.clientX, e.clientY);
        this.feedback({ cursorX, cursorY });
      };
      this.wheelHandler = (e) => {
        e.stopPropagation();
        this.before(this);
        const INTO = 1;
        const OUTOF = -1;
        let zoomDirection = e.deltaY > 0 ? OUTOF : INTO;
        const [cursorX, cursorY] = this.#translateCursor(e.clientX, e.clientY);
        const transformed = this.#translateZoom({ zoom: this.getter("zoom"), panX: this.getter("panX"), panY: this.getter("panY"), cursorX, cursorY, deltaZoom: zoomDirection, magnitude: this.magnitude });
        this.change(transformed);
        this.after(this);
      };
      this.area.addEventListener(this.event, this.wheelHandler, { passive: true });
      this.handle.addEventListener(this.event, this.wheelHandler, { passive: true });
      this.area.addEventListener("mousemove", this.movelHandler, { passive: true });
    }
    destroy() {
      this.removeStartedObserver();
      this.area.removeEventListener(this.event, this.wheelHandler);
      this.handle.removeEventListener(this.event, this.wheelHandler);
      this.area.removeEventListener("mousemove", this.movelHandler);
    }
    #translateZoom({ zoom, panX, panY, deltaZoom, cursorX, cursorY, magnitude = 1, min = 0.01, max = 1e3 }) {
      const zoomClamp = /* @__PURE__ */ __name((v) => Math.min(max, Math.max(min, v)), "zoomClamp");
      const controledMagnitude = magnitude * zoom;
      let zoom1 = zoomClamp(zoom + deltaZoom * controledMagnitude);
      const zoomChange = zoom1 - zoom;
      const panX1 = panX - cursorX * zoomChange / zoom;
      const panY1 = panY - cursorY * zoomChange / zoom;
      const response = { zoom: zoom1, panX: panX1, panY: panY1 };
      return response;
    }
    #translateCursor(x0, y0) {
      const localList = this.transforms();
      let x1 = x0;
      let y1 = y0;
      let parentZoom = 1;
      let locationX = 0;
      let locationY = 0;
      for (const [i, t] of localList.entries()) {
        let curX = t.x * parentZoom;
        locationX = locationX + curX;
        let curY = t.y * parentZoom;
        locationY = locationY + curY;
        let curPanX = t.panX * parentZoom;
        locationX = locationX + curPanX;
        let curPanY = t.panY * parentZoom;
        locationY = locationY + curPanY;
        parentZoom = parentZoom * t.zoom;
      }
      x1 = x1 - locationX;
      y1 = y1 - locationY;
      const self = localList[localList.length - 1];
      const finalZoom = localList.map((o) => o.zoom).reduce((a, c) => a * c, 1) / self.zoom;
      x1 = x1 / finalZoom;
      y1 = y1 / finalZoom;
      return [x1, y1];
    }
  };

  // plug-ins/meowse/Resize.js
  var Resize = class {
    static {
      __name(this, "Resize");
    }
    box;
    area = window;
    handle = null;
    scale;
    before = () => {
    };
    movement = () => {
    };
    after = () => {
    };
    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;
    dragging = false;
    previousX = 0;
    previousY = 0;
    minimumX = 128;
    minimumY = 128;
    sinkX = 0;
    sinkY = 0;
    simulatedW = 0;
    simulatedH = 0;
    constructor({ box, handle, area, before, movement, after, scale, minimumX, minimumY }) {
      this.box = box;
      this.handle = handle;
      this.area = area;
      this.before = before;
      this.movement = movement;
      this.after = after;
      this.scale = scale;
      this.minimumX = minimumX;
      this.minimumY = minimumY;
      this.#mount();
    }
    #mount() {
      this.mouseDownHandler = (e) => {
        this.previousX = e.screenX;
        this.previousY = e.screenY;
        this.sinkX = 0;
        this.sinkY = 0;
        this.simulatedW = this.box.w;
        this.simulatedH = this.box.h;
        this.area.addEventListener("mousemove", this.mouseMoveHandler);
        this.before();
      };
      this.mouseMoveHandler = (e) => {
        let movementX = this.previousX - e.screenX;
        let movementY = this.previousY - e.screenY;
        const scale = this.scale();
        movementX = movementX / scale;
        movementY = movementY / scale;
        this.simulatedW -= movementX;
        this.simulatedH -= movementY;
        let limitX = this.simulatedW < this.minimumX;
        let limitY = this.simulatedH < this.minimumY;
        if (limitX) {
          this.sinkX = this.sinkX - movementX;
          this.box.w = this.minimumX;
        } else {
          this.box.w = this.simulatedW;
        }
        if (limitY) {
          this.sinkY = this.sinkY - movementY;
          this.box.h = this.minimumY;
        } else {
          this.box.h = this.simulatedH;
        }
        this.previousX = e.screenX;
        this.previousY = e.screenY;
      };
      this.mouseUpHandler = (e) => {
        this.after();
        this.area.removeEventListener("mousemove", this.mouseMoveHandler);
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
      this.area.addEventListener("mouseup", this.mouseUpHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
      this.area.removeEventListener("mousemove", this.mouseMoveHandler);
      this.area.removeEventListener("mouseup", this.mouseUpHandler);
    }
  };

  // plug-ins/meowse/Menu.js
  var Menu = class {
    static {
      __name(this, "Menu");
    }
    area = window;
    scale = null;
    show = null;
    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;
    constructor({ area, scale, show }) {
      this.area = area;
      this.scale = scale;
      this.show = show;
      this.#mount();
    }
    #mount() {
      this.contextMenuHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("SCALE", this.scale());
        let x = e.x;
        let y = e.y;
        this.show({ x, y });
      };
      this.area.addEventListener("contextmenu", this.contextMenuHandler);
    }
    destroy() {
      this.area.removeEventListener("contextmenu", this.contextMenuHandler);
    }
  };

  // plug-ins/diagnostic/index.js
  var DiagnosticRectangle = class {
    static {
      __name(this, "DiagnosticRectangle");
    }
    space = 8;
    name;
    parent;
    constructor(name2, parent, stroke) {
      this.name = name2;
      this.parent = parent;
      this.rectangle1 = svg.rect({ style: { "pointer-events": "none" }, fill: "none", stroke });
      this.parent.appendChild(this.rectangle1);
      this.textContainer = svg.text({ style: { "pointer-events": "none" }, "dominant-baseline": "hanging", fill: stroke });
      this.parent.appendChild(this.textContainer);
      this.text = text();
      this.textContainer.appendChild(this.text);
    }
    draw({ x, y, width, height }) {
      update(this.rectangle1, { x, y, width, height });
      update(this.textContainer, { x, y });
      this.text.nodeValue = `${this.name}`;
    }
  };

  // plug-ins/windows/Viewport.js
  var Viewport = class {
    static {
      __name(this, "Viewport");
    }
    static extends = [Container];
    properties = {
      debugBody: false,
      debugContent: false,
      classes: ""
      // css classes
    };
    observables = {
      toX: 0,
      toY: 0,
      panX: 0,
      panY: 0,
      zoom: 1
    };
    methods = {
      initialize() {
        this.flexible = true;
      },
      mount() {
        this.el.Viewport = svg.g({
          name: "viewport"
        });
        this.clipPath = svg.clipPath({ id: `viewport-clip-path-${this.id}` });
        this.maskRectangle = svg.rect();
        this.clipPath.appendChild(this.maskRectangle);
        this.el.Viewport.appendChild(this.clipPath);
        this.any(["x", "y", "w", "h"], ({ x, y, w: width, h: height }) => {
          update(this.maskRectangle, { x, y, width, height });
        });
        this.mask = svg.g({ name: "viewport-mask", "clip-path": `url(#viewport-clip-path-${this.id})` });
        this.el.Viewport.appendChild(this.mask);
        this.body = svg.g({
          name: "viewport-body",
          style: { "pointer-events": "all" }
        });
        this.mask.appendChild(this.body);
        this.any(["x", "y"], ({ x, y }) => this.body.style.transform = `translate(${x}px, ${y}px)`);
        const bgColor = `hsla(${parseInt(360 * Math.random())}, 25%, 30%, 0.2)`;
        this.background = svg.rect({
          "stroke-width": this.b,
          "vector-effect": "non-scaling-stroke",
          name: "viewport-background",
          class: `viewport-background ${this.classes}`.trim(),
          style: { "transform-origin": "0px 0px" }
        });
        this.getApplication().on("node", (node) => {
          console.log("node-type", node.type);
          this.background.classList.add(node.type.toLowerCase());
        });
        this.body.appendChild(this.background);
        this.any(["x", "y", "w", "h"], ({ x, y, w: width, h: height }) => update(this.background, { x: 0, y: 0, width, height }));
        if (this.debugBody) {
          const r1 = new DiagnosticRectangle(`${this.oo.name} body`, this.body, "red");
          this.any(["w", "h"], ({ w: width, h: height }) => r1.draw({ x: 0, y: 0, width, height }));
        }
        this.content = svg.g({ name: "viewport-elements", style: {} });
        this.body.appendChild(this.content);
        this.on("panX", (v) => requestAnimationFrame(() => {
          this.content.style.transform = `translate(${this.panX / this.zoom}px, ${this.panY / this.zoom}px)`;
        }));
        this.on("panY", (v) => requestAnimationFrame(() => {
          this.content.style.transform = `translate(${this.panX / this.zoom}px, ${this.panY / this.zoom}px)`;
        }));
        this.on("zoom", (v) => requestAnimationFrame(() => {
          this.content.style.scale = this.zoom;
        }));
        if (this.debugContent) {
          const r1 = new DiagnosticRectangle(`${this.oo.name} content`, this.content, "green");
          this.any(["w", "h"], ({ w: width, h: height }) => r1.draw({ x: 0, y: 0, width, height }));
        }
        this.appendElements();
      }
    };
  };

  // plug-ins/windows/Pane.js
  var uuid3 = bundle["uuid"];
  var cheerio = bundle["cheerio"];
  var Pane = class {
    static {
      __name(this, "Pane");
    }
    static extends = [Vertical];
    properties = {
      contain: true,
      classes: "",
      // css classes
      feed: []
    };
    observables = {
      url: null,
      panX: 0,
      panY: 0,
      zoom: 0.4,
      applications: [],
      elements: [],
      anchors: [],
      pipes: [],
      components: components_default
    };
    methods = {
      initialize() {
        this.name = "pane";
        if (this.getRootContainer().isRootWindow)
          return;
        this.flexible = true;
      },
      mount() {
        this.getApplication().on("showMenu", (showMenu) => {
          if (showMenu) {
            const [horizontal1, [addButton, delButton]] = nest(Horizontal, [
              [Label, { h: 24, W: 32, text: "File", parent: this }, (c, p2) => p2.children.create(c)],
              [Label, { h: 24, W: 32, text: "Info", parent: this }, (c, p2) => p2.children.create(c)],
              [Label, { h: 24, text: "", flexible: true, parent: this }, (c, p2) => p2.children.create(c)]
            ], (c) => this.children.create(c));
            this.disposable = click(addButton.handle, (e) => {
              const id = uuid3();
              const node = new Instance(Node, { id, origin: this.getRootContainer().id, type: "Junction", x: 300, y: 300, data: {} });
              this.elements.create(node);
            });
          }
        });
        const paneBody = new Instance(Viewport, { parent: this, classes: this.classes, flexible: true });
        this.viewport = paneBody;
        this.getApplication().viewport = paneBody;
        this.children.create(paneBody);
        globalThis.project.origins.create({ id: this.getRootContainer().id, root: this, scene: paneBody.el.Mask });
        this.getApplication().on("showStatus", (showStatus) => {
          if (showStatus) {
            const [horizontal, [statusBar, resizeHandle]] = nest(Horizontal, [
              [Label, { h: 24, text: "Status: nominal", parent: this }, (c, p2) => p2.children.create(c)],
              [Label, { h: 24, W: 24, text: "///", parent: this }, (c, p2) => p2.children.create(c)]
            ], (c) => this.children.create(c));
            this.any(["x", "y", "zoom", "w", "h"], ({ x, y, zoom: zoom2, w, h }) => statusBar.text = `${x.toFixed(0)}x${y.toFixed(0)} zoom:${zoom2.toFixed(2)} win=${this.getApplication().w.toFixed(0)}:${this.getApplication().h.toFixed(0)} pane=${w.toFixed(0)}:${h.toFixed(0)} id:${this.getApplication().id}`);
            const resize = new Resize({
              area: window,
              minimumX: 320,
              minimumY: 200,
              handle: resizeHandle.el.Container,
              scale: () => this.getParentScale(this),
              box: this.getApplication(this),
              before: () => {
              },
              movement: ({ x, y }) => {
              },
              after: () => {
              }
            });
            this.destructable = () => resize.destroy();
          }
        });
        if (this.parent.isRootWindow) {
          this.parent.on("h", (parentH) => {
            const childrenHeight = this.children.filter((c) => !(c === paneBody)).reduce((total, c) => total + c.h, 0);
            const spacers = this.parent.s * 1 * (this.children.length > 0 ? this.children.length - 1 : 0);
            const freeSpace = parentH - childrenHeight - this.parent.b * 2 - this.parent.p * 2 - spacers;
            paneBody.h = freeSpace;
            paneBody.H = freeSpace;
          });
        }
        ;
        this.on("panX", (panX) => paneBody.panX = panX);
        this.on("panY", (panY) => paneBody.panY = panY);
        this.on("zoom", (zoom2) => paneBody.zoom = zoom2);
        this.on("elements.created", (node) => {
          const Ui = this.components[node.type];
          if (!Ui)
            return console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
          let root = svg.g({ name: "element" });
          paneBody.content.appendChild(root);
          const options = { node, scene: root, parent: this, id: node.id, content: node.content };
          const attributes = {};
          for (const name2 of node.oo.attributes) {
            attributes[name2] = node[name2];
          }
          const ui = new Instance(Ui, Object.assign(attributes, options));
          this.applications.create(ui);
          ui.start();
        }, { replay: true });
        this.on("elements.removed", ({ id }) => {
          this.applications.get(id).stop();
          this.applications.get(id).destroy();
          this.applications.remove(id);
        });
        this.appendElements();
        const menu = new Menu({
          area: paneBody.body,
          scale: () => this.getScale(this),
          pan: () => ({ x: this.getRoot().pane.panX, y: this.getRoot().pane.panY }),
          show: ({ x, y }) => {
            const root = this.getRoot();
            console.log({ x, y, root });
            root.openMenu({
              x,
              y,
              options: { data: [
                { root: this.getApplication().node.id, text: "Bueno", value: "bueno", click: () => console.log("Bueno!") }
              ] }
            });
          }
        });
        this.destructable = () => menu.destroy();
        const pan = new Pan_default({
          area: window,
          handle: paneBody.background,
          scale: () => this.getParentScale(this),
          before: () => {
          },
          movement: ({ x, y }) => {
            this.panX -= x;
            this.panY -= y;
          },
          after: () => {
          }
        });
        this.destructable = () => pan.destroy();
        const zoom = new Zoom({
          magnitude: 0.1,
          area: paneBody.background,
          component: paneBody,
          handle: paneBody.background,
          getter: (key) => this[key],
          transforms: () => this.getTransforms(this),
          before: () => {
          },
          change: ({ zoom: zoom2, panX, panY }) => {
            this.zoom = zoom2;
            this.panX = panX;
            this.panY = panY;
          },
          feedback: (debug) => {
          },
          after: (data, debug) => {
          }
        });
        this.destructable = () => zoom.destroy();
        this.on("url", (url) => this.loadXml(this.url));
        if (this.getApplication().content)
          this.loadElements(
            this.getApplication().content
            /* this passes on the cheerio tuple */
          );
      },
      async loadXml(url) {
        if (!url)
          return;
        const xml = await (await fetch(url)).text();
        const $ = cheerio.load(xml, { xmlMode: true, decodeEntities: true, withStartIndices: true, withEndIndices: true });
        for (const el of $("Workspace").children()) {
          const node = new Instance(Node, { origin: this.getApplication().id });
          const data = {};
          node.assign({ type: el.name, ...el.attribs }, data, [$, $(el).children()]);
          this.elements.create(node);
        }
      },
      loadElements([$, children2]) {
        if (!children2)
          return;
        for (const el of children2) {
          const node = new Instance(Node, { origin: this.getApplication().id });
          const data = {};
          node.assign({ type: el.name, ...el.attribs }, data, [$, $(el).children()]);
          this.elements.create(node);
        }
      }
    };
  };

  // plug-ins/windows/Foreign.js
  var Foreign = class {
    static {
      __name(this, "Foreign");
    }
    static extends = [Control];
    observables = {
      src: ""
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
        this.flexible = true;
      },
      appendChild(domNode) {
        return this.body.appendChild(domNode);
      },
      mount() {
        this.el.ForeignObject = svg.foreignObject({
          name: this.name,
          width: this.w,
          height: this.h,
          x: this.x,
          y: this.y
        });
        this.body = html.div({});
        this.el.ForeignObject.appendChild(this.body);
        this.on("name", (name2) => update(this.el.ForeignObject, { name: name2 }));
        this.on("w", (width) => update(this.el.ForeignObject, { width }));
        this.on("h", (height) => update(this.el.ForeignObject, { height }));
        this.on("x", (x) => update(this.el.ForeignObject, { x }));
        this.on("y", (y) => update(this.el.ForeignObject, { y }));
        this.on("w", (width) => update(this.body, { style: { width: width + "px" } }));
        this.on("h", (height) => update(this.body, { style: { height: height + "px" } }));
        this.appendElements();
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/components/Menu.js
  var Hello = class {
    static {
      __name(this, "Hello");
    }
    static extends = [Application];
    properties = {};
    observables = {
      options: {}
    };
    methods = {
      mount() {
        this.foreign = new Instance(Foreign);
        this.createWindowComponent(this.foreign);
        const textnode = document.createTextNode("I am an HTML context menu, based on foreign object." + JSON.stringify(this.options));
        this.foreign.appendChild(textnode);
        this.on("options", (options) => {
          textnode.textContent = "I am an HTML context menu, based on foreign object." + JSON.stringify(this.options);
        });
        this.foreign.body.addEventListener("click", (e) => {
          this.scene.style.display = "none";
        });
        this.on("h", (h) => {
          console.log({ h });
          this.foreign.h = h;
        });
      },
      stop() {
        console.log("todo: stopping root application");
      },
      destroy() {
        console.log("todo: destroying root application");
        this.dispose();
      }
    };
  };

  // plug-ins/components/Window.js
  var Window2 = class {
    static {
      __name(this, "Window");
    }
    static extends = [Application];
    properties = {};
    methods = {
      openMenu({ x, y, options, w = 200, h = 320 }) {
        console.log({ x, y, options });
        if (this.menu) {
          this.menu.options = options;
          this.menu.x = x;
          this.menu.y = y;
          this.container.style.display = "block";
          return;
        }
        this.container = svg.g({ name: "menu" });
        this.scene.appendChild(this.container);
        this.menu = new Instance(Hello, { parent: this, scene: this.container, x, y, w, h, isMenuWindow: true, options });
        this.menu.start();
      },
      mount() {
        this.pane = new Instance(Pane);
        this.on("node", (node) => {
          node.on("url", (url) => this.pane.url = url);
        });
        this.createWindowComponent(this.pane);
      },
      stop() {
        console.log("todo: stopping root application");
      },
      destroy() {
        console.log("todo: destroying root application");
        this.dispose();
      }
    };
  };

  // plug-ins/components/Port.js
  var Port = class {
    static {
      __name(this, "Port");
    }
    static extends = [Application];
    properties = {};
    methods = {
      mount() {
        console.log("I am the mighty port child of", this.parent.oo.name, "I exist in two places in a window and outside it");
      },
      stop() {
        console.log("todo: stopping root application");
      },
      destroy() {
        console.log("todo: destroying root application");
        this.dispose();
      }
    };
  };

  // node_modules/svelte/src/runtime/internal/utils.js
  function noop() {
  }
  __name(noop, "noop");
  function run(fn) {
    return fn();
  }
  __name(run, "run");
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  __name(blank_object, "blank_object");
  function run_all(fns) {
    fns.forEach(run);
  }
  __name(run_all, "run_all");
  function is_function(thing) {
    return typeof thing === "function";
  }
  __name(is_function, "is_function");
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
  }
  __name(safe_not_equal, "safe_not_equal");
  function is_empty(obj2) {
    return Object.keys(obj2).length === 0;
  }
  __name(is_empty, "is_empty");

  // node_modules/svelte/src/runtime/internal/globals.js
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
    // @ts-ignore Node typings have this
    global
  );

  // node_modules/svelte/src/runtime/internal/ResizeObserverSingleton.js
  var ResizeObserverSingleton = class _ResizeObserverSingleton {
    static {
      __name(this, "ResizeObserverSingleton");
    }
    /**
     * @private
     * @readonly
     * @type {WeakMap<Element, import('./private.js').Listener>}
     */
    _listeners = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;
    /**
     * @private
     * @type {ResizeObserver}
     */
    _observer = void 0;
    /** @type {ResizeObserverOptions} */
    options;
    /** @param {ResizeObserverOptions} options */
    constructor(options) {
      this.options = options;
    }
    /**
     * @param {Element} element
     * @param {import('./private.js').Listener} listener
     * @returns {() => void}
     */
    observe(element2, listener) {
      this._listeners.set(element2, listener);
      this._getObserver().observe(element2, this.options);
      return () => {
        this._listeners.delete(element2);
        this._observer.unobserve(element2);
      };
    }
    /**
     * @private
     */
    _getObserver() {
      return this._observer ?? (this._observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          _ResizeObserverSingleton.entries.set(entry.target, entry);
          this._listeners.get(entry.target)?.(entry);
        }
      }));
    }
  };
  ResizeObserverSingleton.entries = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;

  // node_modules/svelte/src/runtime/internal/dom.js
  var is_hydrating = false;
  function start_hydrating() {
    is_hydrating = true;
  }
  __name(start_hydrating, "start_hydrating");
  function end_hydrating() {
    is_hydrating = false;
  }
  __name(end_hydrating, "end_hydrating");
  function append(target, node) {
    target.appendChild(node);
  }
  __name(append, "append");
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  __name(insert, "insert");
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  __name(detach, "detach");
  function element(name2) {
    return document.createElement(name2);
  }
  __name(element, "element");
  function text2(data) {
    return document.createTextNode(data);
  }
  __name(text2, "text");
  function space() {
    return text2(" ");
  }
  __name(space, "space");
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  __name(listen, "listen");
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  __name(attr, "attr");
  function to_number(value) {
    return value === "" ? null : +value;
  }
  __name(to_number, "to_number");
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  __name(children, "children");
  function set_data(text3, data) {
    data = "" + data;
    if (text3.data === data)
      return;
    text3.data = /** @type {string} */
    data;
  }
  __name(set_data, "set_data");
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  __name(set_input_value, "set_input_value");
  function get_custom_elements_slots(element2) {
    const result = {};
    element2.childNodes.forEach(
      /** @param {Element} node */
      (node) => {
        result[node.slot || "default"] = true;
      }
    );
    return result;
  }
  __name(get_custom_elements_slots, "get_custom_elements_slots");

  // node_modules/svelte/src/runtime/internal/lifecycle.js
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  __name(set_current_component, "set_current_component");

  // node_modules/svelte/src/runtime/internal/scheduler.js
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = /* @__PURE__ */ Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  __name(schedule_update, "schedule_update");
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  __name(add_render_callback, "add_render_callback");
  var seen_callbacks = /* @__PURE__ */ new Set();
  var flushidx = 0;
  function flush() {
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update2(component.$$);
        }
      } catch (e) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  __name(flush, "flush");
  function update2($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  __name(update2, "update");
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }
  __name(flush_render_callbacks, "flush_render_callbacks");

  // node_modules/svelte/src/runtime/internal/transitions.js
  var outroing = /* @__PURE__ */ new Set();
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  __name(transition_in, "transition_in");

  // node_modules/svelte/src/shared/boolean_attributes.js
  var _boolean_attributes = (
    /** @type {const} */
    [
      "allowfullscreen",
      "allowpaymentrequest",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "defer",
      "disabled",
      "formnovalidate",
      "hidden",
      "inert",
      "ismap",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "selected"
    ]
  );
  var boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);

  // node_modules/svelte/src/runtime/internal/Component.js
  function mount_component(component, target, anchor) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
  }
  __name(mount_component, "mount_component");
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  __name(destroy_component, "destroy_component");
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  __name(make_dirty, "make_dirty");
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        start_hydrating();
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      end_hydrating();
      flush();
    }
    set_current_component(parent_component);
  }
  __name(init, "init");
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      static {
        __name(this, "SvelteElement");
      }
      /** The Svelte component constructor */
      $$ctor;
      /** Slots */
      $$s;
      /** The Svelte component instance */
      $$c;
      /** Whether or not the custom element is connected */
      $$cn = false;
      /** Component props data */
      $$d = {};
      /** `true` if currently in the process of reflecting component props back to attributes */
      $$r = false;
      /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
      $$p_d = {};
      /** @type {Record<string, Function[]>} Event listeners */
      $$l = {};
      /** @type {Map<Function, Function>} Event listener unsubscribe functions */
      $$l_u = /* @__PURE__ */ new Map();
      constructor($$componentCtor, $$slots, use_shadow_dom) {
        super();
        this.$$ctor = $$componentCtor;
        this.$$s = $$slots;
        if (use_shadow_dom) {
          this.attachShadow({ mode: "open" });
        }
      }
      addEventListener(type, listener, options) {
        this.$$l[type] = this.$$l[type] || [];
        this.$$l[type].push(listener);
        if (this.$$c) {
          const unsub = this.$$c.$on(type, listener);
          this.$$l_u.set(listener, unsub);
        }
        super.addEventListener(type, listener, options);
      }
      removeEventListener(type, listener, options) {
        super.removeEventListener(type, listener, options);
        if (this.$$c) {
          const unsub = this.$$l_u.get(listener);
          if (unsub) {
            unsub();
            this.$$l_u.delete(listener);
          }
        }
      }
      async connectedCallback() {
        this.$$cn = true;
        if (!this.$$c) {
          let create_slot = function(name2) {
            return () => {
              let node;
              const obj2 = {
                c: /* @__PURE__ */ __name(function create() {
                  node = element("slot");
                  if (name2 !== "default") {
                    attr(node, "name", name2);
                  }
                }, "create"),
                /**
                 * @param {HTMLElement} target
                 * @param {HTMLElement} [anchor]
                 */
                m: /* @__PURE__ */ __name(function mount(target, anchor) {
                  insert(target, node, anchor);
                }, "mount"),
                d: /* @__PURE__ */ __name(function destroy(detaching) {
                  if (detaching) {
                    detach(node);
                  }
                }, "destroy")
              };
              return obj2;
            };
          };
          __name(create_slot, "create_slot");
          await Promise.resolve();
          if (!this.$$cn || this.$$c) {
            return;
          }
          const $$slots = {};
          const existing_slots = get_custom_elements_slots(this);
          for (const name2 of this.$$s) {
            if (name2 in existing_slots) {
              $$slots[name2] = [create_slot(name2)];
            }
          }
          for (const attribute of this.attributes) {
            const name2 = this.$$g_p(attribute.name);
            if (!(name2 in this.$$d)) {
              this.$$d[name2] = get_custom_element_value(name2, attribute.value, this.$$p_d, "toProp");
            }
          }
          for (const key in this.$$p_d) {
            if (!(key in this.$$d) && this[key] !== void 0) {
              this.$$d[key] = this[key];
              delete this[key];
            }
          }
          this.$$c = new this.$$ctor({
            target: this.shadowRoot || this,
            props: {
              ...this.$$d,
              $$slots,
              $$scope: {
                ctx: []
              }
            }
          });
          const reflect_attributes = /* @__PURE__ */ __name(() => {
            this.$$r = true;
            for (const key in this.$$p_d) {
              this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
              if (this.$$p_d[key].reflect) {
                const attribute_value = get_custom_element_value(
                  key,
                  this.$$d[key],
                  this.$$p_d,
                  "toAttribute"
                );
                if (attribute_value == null) {
                  this.removeAttribute(this.$$p_d[key].attribute || key);
                } else {
                  this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
                }
              }
            }
            this.$$r = false;
          }, "reflect_attributes");
          this.$$c.$$.after_update.push(reflect_attributes);
          reflect_attributes();
          for (const type in this.$$l) {
            for (const listener of this.$$l[type]) {
              const unsub = this.$$c.$on(type, listener);
              this.$$l_u.set(listener, unsub);
            }
          }
          this.$$l = {};
        }
      }
      // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
      // and setting attributes through setAttribute etc, this is helpful
      attributeChangedCallback(attr2, _oldValue, newValue) {
        if (this.$$r)
          return;
        attr2 = this.$$g_p(attr2);
        this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
        this.$$c?.$set({ [attr2]: this.$$d[attr2] });
      }
      disconnectedCallback() {
        this.$$cn = false;
        Promise.resolve().then(() => {
          if (!this.$$cn && this.$$c) {
            this.$$c.$destroy();
            this.$$c = void 0;
          }
        });
      }
      $$g_p(attribute_name) {
        return Object.keys(this.$$p_d).find(
          (key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name
        ) || attribute_name;
      }
    };
  }
  function get_custom_element_value(prop, value, props_definition, transform) {
    const type = props_definition[prop]?.type;
    value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
    if (!transform || !props_definition[prop]) {
      return value;
    } else if (transform === "toAttribute") {
      switch (type) {
        case "Object":
        case "Array":
          return value == null ? null : JSON.stringify(value);
        case "Boolean":
          return value ? "" : null;
        case "Number":
          return value == null ? null : value;
        default:
          return value;
      }
    } else {
      switch (type) {
        case "Object":
        case "Array":
          return value && JSON.parse(value);
        case "Boolean":
          return value;
        case "Number":
          return value != null ? +value : value;
        default:
          return value;
      }
    }
  }
  __name(get_custom_element_value, "get_custom_element_value");
  var SvelteComponent = class {
    static {
      __name(this, "SvelteComponent");
    }
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    $$ = void 0;
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    $$set = void 0;
    /** @returns {void} */
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    /**
     * @template {Extract<keyof Events, string>} K
     * @param {K} type
     * @param {((e: Events[K]) => void) | null | undefined} callback
     * @returns {() => void}
     */
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    /**
     * @param {Partial<Props>} props
     * @returns {void}
     */
    $set(props) {
      if (this.$$set && !is_empty(props)) {
        this.$$.skip_bound = true;
        this.$$set(props);
        this.$$.skip_bound = false;
      }
    }
  };

  // node_modules/svelte/src/shared/version.js
  var PUBLIC_VERSION = "4";

  // node_modules/svelte/src/runtime/internal/disclose-version/index.js
  if (typeof window !== "undefined")
    (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);

  // plug-ins/components/hello/index.svelte
  function create_fragment(ctx) {
    let div2;
    let t1;
    let label0;
    let t3;
    let input2;
    let t4;
    let datalist;
    let option0;
    let option1;
    let option2;
    let option3;
    let option4;
    let t5;
    let hr0;
    let t6;
    let label1;
    let t8;
    let input3;
    let t9;
    let hr1;
    let t10;
    let label2;
    let t11;
    let t12;
    let t13;
    let input4;
    let t14;
    let hr2;
    let t15;
    let input5;
    let t16;
    let input6;
    let t17;
    let p2;
    let t18;
    let t19;
    let t20;
    let t21;
    let t22_value = (
      /*a*/
      ctx[0] + /*b*/
      ctx[1] + ""
    );
    let t22;
    let t23;
    let hr3;
    let t24;
    let form;
    let mounted;
    let dispose;
    return {
      c() {
        div2 = element("div");
        div2.innerHTML = `<div class="col"><input type="text" class="form-control" placeholder="First name" aria-label="First name"/></div> <div class="col"><input type="text" class="form-control" placeholder="Last name" aria-label="Last name"/></div>`;
        t1 = space();
        label0 = element("label");
        label0.textContent = "Datalist example";
        t3 = space();
        input2 = element("input");
        t4 = space();
        datalist = element("datalist");
        option0 = element("option");
        option0.innerHTML = ``;
        option1 = element("option");
        option1.innerHTML = ``;
        option2 = element("option");
        option2.innerHTML = ``;
        option3 = element("option");
        option3.innerHTML = ``;
        option4 = element("option");
        option4.innerHTML = ``;
        t5 = space();
        hr0 = element("hr");
        t6 = space();
        label1 = element("label");
        label1.textContent = "Color picker";
        t8 = space();
        input3 = element("input");
        t9 = space();
        hr1 = element("hr");
        t10 = space();
        label2 = element("label");
        t11 = text2("Example range = ");
        t12 = text2(
          /*c*/
          ctx[2]
        );
        t13 = space();
        input4 = element("input");
        t14 = space();
        hr2 = element("hr");
        t15 = space();
        input5 = element("input");
        t16 = space();
        input6 = element("input");
        t17 = space();
        p2 = element("p");
        t18 = text2(
          /*a*/
          ctx[0]
        );
        t19 = text2(" + ");
        t20 = text2(
          /*b*/
          ctx[1]
        );
        t21 = text2(" = ");
        t22 = text2(t22_value);
        t23 = space();
        hr3 = element("hr");
        t24 = space();
        form = element("form");
        form.innerHTML = `<div class="mb-3"><label for="exampleInputEmail1" class="form-label">Email address</label> <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/> <div id="emailHelp" class="form-text">We&#39;ll never share your email with anyone else.</div></div> <div class="mb-3"><label for="exampleInputPassword1" class="form-label">Password</label> <input type="password" class="form-control" id="exampleInputPassword1"/></div> <div class="mb-3 form-check"><input type="checkbox" class="form-check-input" id="exampleCheck1"/> <label class="form-check-label" for="exampleCheck1">Check me out</label></div> <button type="submit" class="btn btn-primary">Submit</button>`;
        attr(div2, "class", "row");
        attr(label0, "for", "exampleDataList");
        attr(label0, "class", "form-label");
        attr(input2, "class", "form-control");
        attr(input2, "list", "datalistOptions");
        attr(input2, "id", "exampleDataList");
        attr(input2, "placeholder", "Type to search...");
        option0.__value = "San Francisco";
        set_input_value(option0, option0.__value);
        option1.__value = "New York";
        set_input_value(option1, option1.__value);
        option2.__value = "Seattle";
        set_input_value(option2, option2.__value);
        option3.__value = "Los Angeles";
        set_input_value(option3, option3.__value);
        option4.__value = "Chicago";
        set_input_value(option4, option4.__value);
        attr(datalist, "id", "datalistOptions");
        attr(label1, "for", "exampleColorInput");
        attr(label1, "class", "form-label");
        attr(input3, "type", "color");
        attr(input3, "class", "form-control form-control-color");
        attr(input3, "id", "exampleColorInput");
        input3.value = "#563d7c";
        attr(input3, "title", "Choose your color");
        attr(label2, "for", "customRange2");
        attr(label2, "class", "form-label");
        attr(input4, "type", "range");
        attr(input4, "class", "form-range");
        attr(input4, "min", "0");
        attr(input4, "max", "500");
        attr(input4, "id", "customRange2");
        attr(input5, "type", "number");
        attr(input6, "type", "number");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        insert(target, t1, anchor);
        insert(target, label0, anchor);
        insert(target, t3, anchor);
        insert(target, input2, anchor);
        insert(target, t4, anchor);
        insert(target, datalist, anchor);
        append(datalist, option0);
        append(datalist, option1);
        append(datalist, option2);
        append(datalist, option3);
        append(datalist, option4);
        insert(target, t5, anchor);
        insert(target, hr0, anchor);
        insert(target, t6, anchor);
        insert(target, label1, anchor);
        insert(target, t8, anchor);
        insert(target, input3, anchor);
        insert(target, t9, anchor);
        insert(target, hr1, anchor);
        insert(target, t10, anchor);
        insert(target, label2, anchor);
        append(label2, t11);
        append(label2, t12);
        insert(target, t13, anchor);
        insert(target, input4, anchor);
        set_input_value(
          input4,
          /*c*/
          ctx[2]
        );
        insert(target, t14, anchor);
        insert(target, hr2, anchor);
        insert(target, t15, anchor);
        insert(target, input5, anchor);
        set_input_value(
          input5,
          /*a*/
          ctx[0]
        );
        insert(target, t16, anchor);
        insert(target, input6, anchor);
        set_input_value(
          input6,
          /*b*/
          ctx[1]
        );
        insert(target, t17, anchor);
        insert(target, p2, anchor);
        append(p2, t18);
        append(p2, t19);
        append(p2, t20);
        append(p2, t21);
        append(p2, t22);
        insert(target, t23, anchor);
        insert(target, hr3, anchor);
        insert(target, t24, anchor);
        insert(target, form, anchor);
        if (!mounted) {
          dispose = [
            listen(
              input4,
              "change",
              /*input4_change_input_handler*/
              ctx[3]
            ),
            listen(
              input4,
              "input",
              /*input4_change_input_handler*/
              ctx[3]
            ),
            listen(
              input5,
              "input",
              /*input5_input_handler*/
              ctx[4]
            ),
            listen(
              input6,
              "input",
              /*input6_input_handler*/
              ctx[5]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & /*c*/
        4)
          set_data(
            t12,
            /*c*/
            ctx2[2]
          );
        if (dirty & /*c*/
        4) {
          set_input_value(
            input4,
            /*c*/
            ctx2[2]
          );
        }
        if (dirty & /*a*/
        1 && to_number(input5.value) !== /*a*/
        ctx2[0]) {
          set_input_value(
            input5,
            /*a*/
            ctx2[0]
          );
        }
        if (dirty & /*b*/
        2 && to_number(input6.value) !== /*b*/
        ctx2[1]) {
          set_input_value(
            input6,
            /*b*/
            ctx2[1]
          );
        }
        if (dirty & /*a*/
        1)
          set_data(
            t18,
            /*a*/
            ctx2[0]
          );
        if (dirty & /*b*/
        2)
          set_data(
            t20,
            /*b*/
            ctx2[1]
          );
        if (dirty & /*a, b*/
        3 && t22_value !== (t22_value = /*a*/
        ctx2[0] + /*b*/
        ctx2[1] + ""))
          set_data(t22, t22_value);
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div2);
          detach(t1);
          detach(label0);
          detach(t3);
          detach(input2);
          detach(t4);
          detach(datalist);
          detach(t5);
          detach(hr0);
          detach(t6);
          detach(label1);
          detach(t8);
          detach(input3);
          detach(t9);
          detach(hr1);
          detach(t10);
          detach(label2);
          detach(t13);
          detach(input4);
          detach(t14);
          detach(hr2);
          detach(t15);
          detach(input5);
          detach(t16);
          detach(input6);
          detach(t17);
          detach(p2);
          detach(t23);
          detach(hr3);
          detach(t24);
          detach(form);
        }
        mounted = false;
        run_all(dispose);
      }
    };
  }
  __name(create_fragment, "create_fragment");
  function instance($$self, $$props, $$invalidate) {
    let a = 1;
    let b = 2;
    let c = 3;
    function input4_change_input_handler() {
      c = to_number(this.value);
      $$invalidate(2, c);
    }
    __name(input4_change_input_handler, "input4_change_input_handler");
    function input5_input_handler() {
      a = to_number(this.value);
      $$invalidate(0, a);
    }
    __name(input5_input_handler, "input5_input_handler");
    function input6_input_handler() {
      b = to_number(this.value);
      $$invalidate(1, b);
    }
    __name(input6_input_handler, "input6_input_handler");
    return [
      a,
      b,
      c,
      input4_change_input_handler,
      input5_input_handler,
      input6_input_handler
    ];
  }
  __name(instance, "instance");
  var Hello2 = class extends SvelteComponent {
    static {
      __name(this, "Hello");
    }
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {});
    }
  };
  var hello_default = Hello2;

  // plug-ins/components/Hello.js
  var Hello3 = class {
    static {
      __name(this, "Hello");
    }
    static extends = [Application];
    properties = {};
    methods = {
      mount() {
        this.foreign = new Instance(Foreign);
        this.createWindowComponent(this.foreign);
        new hello_default({
          target: this.foreign.body
        });
        this.on("h", (h) => {
          console.log({ h });
        });
      },
      stop() {
        console.log("todo: stopping root application");
      },
      destroy() {
        console.log("todo: destroying root application");
        this.dispose();
      }
    };
  };

  // plug-ins/components/Terminal.js
  var { Terminal, FitAddon } = bundle["xterm"];
  var Window3 = class {
    static {
      __name(this, "Window");
    }
    static extends = [Application];
    properties = {};
    methods = {
      mount() {
        this.foreign = new Instance(Foreign);
        this.createWindowComponent(this.foreign);
        const term = new Terminal({
          fontFamily: '"Cascadia Code", Menlo, monospace',
          cursorBlink: true
          // allowProposedApi: true
        });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(this.foreign.body);
        fitAddon.fit();
        fitAddon.fit();
        this.any(["w", "h"], (x) => fitAddon.fit());
        this.foreign.body.addEventListener("wheel", (e) => {
          if (term.buffer.active.baseY > 0) {
            e.preventDefault();
          }
        });
        this.foreign.body.addEventListener("click", (e) => {
          term.focus();
        });
        var command = "";
        this.disposables = term.onData((e) => {
          console.log("term.onData", e);
          switch (e) {
            case "":
              term.write("^C");
              prompt(term);
              break;
            case "\r":
              runCommand(term, command);
              command = "";
              break;
            case "\x7F":
              if (term._core.buffer.x > 2) {
                term.write("\b \b");
                if (command.length > 0) {
                  command = command.substr(0, command.length - 1);
                }
              }
              break;
            default:
              if (e >= String.fromCharCode(32) && e <= String.fromCharCode(126) || e >= "\xA0") {
                command += e;
                term.write(e);
              }
          }
        });
        function prompt(term2) {
          command = "";
          term2.write("\r\n$ ");
        }
        __name(prompt, "prompt");
        function runFakeTerminal() {
          if (term._initialized) {
            return;
          }
          term._initialized = true;
          term.prompt = () => {
            term.write("\r\n$$$ ");
          };
          term.writeln("Below is a simple emulated backend, try running `info`.");
          prompt(term);
        }
        __name(runFakeTerminal, "runFakeTerminal");
        var commands = {
          info: {
            f: () => {
              term.writeln(["yup, I got your info command", "teminal is neat"].join("\r\n"));
              term.prompt(term);
            },
            description: "Prints a fake directory structure"
          }
        };
        function runCommand(term2, text3) {
          const command2 = text3.trim().split(" ")[0];
          if (command2.length > 0) {
            term2.writeln("");
            if (command2 in commands) {
              commands[command2].f();
              return;
            }
            term2.writeln(`${command2}: command not found`);
          }
          prompt(term2);
        }
        __name(runCommand, "runCommand");
        runFakeTerminal();
      },
      stop() {
        console.log("todo: stopping root application");
      },
      destroy() {
        console.log("todo: destroying root application");
        this.dispose();
      }
    };
  };

  // plug-ins/components/Editor.js
  var { basicSetup, EditorView } = bundle["codemirror"];
  var { javascript } = bundle["@codemirror/lang-javascript"];
  var { keymap } = bundle["@codemirror/view"];
  var { indentWithTab } = bundle["@codemirror/commands"];
  var { EditorState } = bundle["@codemirror/state"];
  var { oneDark } = bundle["@codemirror/theme-one-dark"];
  var Window4 = class {
    static {
      __name(this, "Window");
    }
    static extends = [Application];
    properties = {};
    methods = {
      mount() {
        this.foreign = new Instance(Foreign);
        this.createWindowComponent(this.foreign);
        const extensions = [
          basicSetup,
          javascript(),
          EditorView.lineWrapping,
          //NOTE: EditorView.lineWrapping does/did not honor code indents
          keymap.of([indentWithTab]),
          // EditorView.updateListener.of((update) => {if (update.docChanged) value = update.state.doc.toString(); }),
          oneDark,
          EditorView.theme({
            "&": { maxHeight: this.h + "px" },
            ".cm-gutter,.cm-content": { minHeight: "100px" },
            ".cm-scroller": {
              overflow: "auto",
              borderTopLeftRadius: "0px",
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "0px"
            }
          })
        ];
        this.editorView = new EditorView({
          doc: "// Hello!\njavaScript.go('Brrrrr...');\n",
          extensions,
          parent: this.foreign.body
        });
        console.log(this.editorView);
        this.destructable = click(this.foreign.body, () => this.editorView.focus());
      },
      stop() {
        console.log("todo: stopping root application");
      },
      destroy() {
        console.log("todo: destroying root application");
        this.dispose();
      }
    };
  };

  // plug-ins/components/index.js
  var components = {
    Workspace: Window2,
    Window: Window2,
    Port,
    Hello: Hello3,
    Terminal: Window3,
    Editor: Window4
  };
  var components_default = components;

  // src/System.js
  var System = class {
    static {
      __name(this, "System");
    }
    properties = {
      rootWindow: null,
      debouncedOnResize: null,
      scene: void 0
    };
    observables = {
      url: null,
      origins: []
    };
    constraints = {};
    methods = {
      initialize() {
      },
      mount() {
        const node = new Instance(Node, { id: "0", origin: "0", url: this.url, type: "Workspace", data: {} });
        this.rootWindow = new Instance(components_default.Workspace, { id: node.id, node, svg: this.svg, scene: this.scene, parent: null, origins: this.origins, isRootWindow: true });
        this.rootWindow.start();
        const onResize = /* @__PURE__ */ __name(() => {
          this.rootWindow.w = this.svg.clientWidth;
          this.rootWindow.h = this.svg.clientHeight;
          this.rootWindow.H = this.svg.clientHeight;
        }, "onResize");
        this.debouncedOnResize = debounce_default(onResize, 10);
        window.addEventListener("resize", this.debouncedOnResize);
        onResize();
      },
      destroy() {
        this.rootWindow.stop();
        window.removeEventListener("resize", this.debouncedOnResize);
      }
    };
  };

  // src/index.js
  var themes2 = new Instance(Themes);
  themes2.theme = "nostromo";
  var system = new Instance(System);
  globalThis.system = system;
  globalThis.project = system;
  globalThis.scene = document.querySelector("#editor-scene");
  globalThis.svg = document.querySelector("#editor-svg");
  system.name = "Hello World System";
  system.svg = document.querySelector("#editor-svg");
  system.scene = document.querySelector("#editor-scene");
  system.background = document.querySelector("#editor-background");
  system.url = "templates/test.xml";
  system.start();
})();
