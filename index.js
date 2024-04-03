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
    constructor({ Class, instance, specification }) {
      this.instance = instance;
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
        const instance = new Class();
        this.instance.oo.specifications.push(instance);
        instance.parent = parent;
        parent = instance;
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
      this.oo.specification = specification;
      this.oo.newObservables = [];
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
          this.oo.newObservables.push(observableName);
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
          throw new Error(`property "${name2}" not defined (${Object.keys(observableData).join(", ")})`);
        if (control?.manualDispose) {
          return observableData[name2].observe(path || name2, observerCallback, options);
        } else {
          disposable(observableData[name2].observe(path || name2, observerCallback, options));
        }
      };
      this.any = function(observables, callback1) {
        const callback2 = /* @__PURE__ */ __name(() => {
          const entries = observables.map((key) => [key, this[key]]);
          const packet = Object.fromEntries(entries);
          callback1(packet);
        }, "callback2");
        return observables.map((event) => this.on(event, callback2, void 0, { manualDispose: true }));
      };
      this.all = function(observables, callback1) {
        const callback2 = /* @__PURE__ */ __name(() => {
          const entries = observables.map((key) => [key, this[key]]);
          const packet = Object.fromEntries(entries);
          const isReady = Object.values(packet).every((value) => value !== void 0);
          if (isReady)
            callback1(packet);
        }, "callback2");
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
      type: null
    };
    observables = {
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
    methods = {
      assign(meta, data) {
        const nodeKeys = /* @__PURE__ */ new Set([...Object.keys(this.oo.specification.properties), ...Object.keys(this.oo.specification.observables)]);
        const metaKeys = /* @__PURE__ */ new Set([...Object.keys(meta)]);
        const commonProperties = intersection(nodeKeys, metaKeys);
        const newProperties = difference(metaKeys, commonProperties);
        for (const newProperty of newProperties) {
          this.oo.createObservable(newProperty, meta[newProperty]);
        }
        Object.assign(this, meta, { data });
      },
      toObject() {
        const meta = {};
        const data = this.data;
        const object = { meta, data };
        for (const [name2, value] of Object.entries(this.oo.specification.properties)) {
          console.log(this[name2], name2, value);
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
      child.on("h", () => this.parent.h = this.calculateH());
      this.parent.on("h", () => child.y = this.calculateChildY(child));
    }
    calculateChildW(child) {
      const response = this.parent.w - (this.parent.b + this.parent.p) * BOTH_SIDES;
      return response;
    }
    calculateH() {
      let heightOfChildren = 0;
      const children = this.parent[this.source];
      heightOfChildren = children.reduce((total, c) => total + c.h, 0) + this.parent.s * 2 * (children.length > 0 ? children.length - 1 : 0);
      let response = this.parent.b + this.parent.p + // this.parent.H + // NOT A MISTAKE design can hold a base h that is used in calculations
      heightOfChildren + this.parent.p + this.parent.b;
      if (response < this.parent.H)
        response = this.parent.H;
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
  };
  var HorizontalLayout = class extends Layout {
    static {
      __name(this, "HorizontalLayout");
    }
    manage(child) {
      const children = this.parent[this.source];
      const childCount = children.length;
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
      const children = this.parent[this.source];
      const childCount = children.length;
      const siblingCount = this.above(this.parent, child).length;
      let response = this.parent.w / childCount;
      return response;
    }
    calculateChildW(child) {
      if (!(child.W === void 0))
        return child.W < 1 ? this.parent.w * child.W : child.W;
      const children = this.parent[this.source];
      let softElements = children.filter((child2) => child2.W === void 0);
      let hardElements = children.filter((child2) => !(child2.W === void 0));
      let hardSpace = hardElements.reduce((total, child2) => total + (child2.W < 1 ? this.parent.w * child2.W : child2.W), 0);
      let availableSoftSpace = this.parent.w - hardSpace;
      let softUnit = availableSoftSpace / (softElements.length || 1);
      return softUnit;
    }
    calculateChildY(child) {
      const response = this.parent.y + this.parent.b + this.parent.p;
      return response;
    }
    calculateH() {
      let heightOfChildren = 0;
      const children = this.parent[this.source];
      heightOfChildren = children.reduce((max, c) => c.h > max ? c.h : max, 0);
      let response = this.parent.b + this.parent.p + // this.parent.H + // NOT A MISTAKE design can hold a base h that is used in calculations
      heightOfChildren + this.parent.p + this.parent.b;
      if (response < this.parent.H)
        response = this.parent.H;
      return response;
    }
  };
  var RelativeLayout = class extends Layout {
    static {
      __name(this, "RelativeLayout");
    }
    children = /* @__PURE__ */ new WeakMap();
    manage(child) {
      if (!child.node)
        throw new Error("RelativeLayout requires that all children have a valid .node attached.");
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      child.node.on("x", () => child.x = this.calculateChildX(child));
      child.node.on("y", () => child.y = this.calculateChildY(child));
    }
    calculateChildX(child) {
      return this.parent.x + child.node.x;
    }
    calculateChildY(child) {
      return this.parent.y + child.node.y;
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
    calculateChildW(child) {
    }
  };

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
      return function(properties, text2) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", property);
        update(el, properties);
        if (text2)
          el.appendChild(document.createTextNode(text2));
        return el;
      };
    }
  });
  var xhtml = new Proxy({}, {
    get: function(target, property) {
      return function(properties, text2) {
        const el = document.createElementNS("http://www.w3.org/1999/xhtml", property);
        update(el, properties);
        if (text2)
          el.appendChild(document.createTextNode(text2));
        return el;
      };
    }
  });
  var html = new Proxy({}, {
    get: function(target, property) {
      return function(properties, text2) {
        const el = document.createElement(property);
        update(el, properties);
        if (text2)
          el.appendChild(document.createTextNode(text2));
        return el;
      };
    }
  });
  var text = /* @__PURE__ */ __name(function(text2) {
    return document.createTextNode(text2);
  }, "text");
  function front(element) {
    const parentElement = element.parentNode;
    parentElement.removeChild(element);
    parentElement.appendChild(element);
  }
  __name(front, "front");
  function click(element, callback) {
    element.addEventListener("mouseup", handler);
    function handler(event) {
      callback(event);
    }
    __name(handler, "handler");
    return () => element.removeEventListener("mouseup", handler);
  }
  __name(click, "click");

  // plug-ins/windows/Component.js
  var Component = class {
    static {
      __name(this, "Component");
    }
    properties = {
      id: uuid(),
      el: {}
      // bag of elements
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
      s: 0
      // spacer/gap
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
      //
      // appendMain(){
      //   Object.values(this.el).forEach(el => this.scene.appendChild(el));
      // },
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
      getRootContainer() {
        let response = null;
        if (!this.parent) {
          response = this;
        } else if (!this.parent.getRootContainer) {
          response = this;
        } else if (this.contain) {
          response = this;
        } else {
          response = this.parent.getRootContainer();
        }
        return response;
      },
      getAbsoluteRoot() {
        let response = null;
        if (!this.parent) {
          response = this;
        } else {
          response = this.parent.getAbsoluteRoot();
        }
        return response;
      },
      //
      // getTransforms(list=[]) {
      //   console.log(this.oo.name);
      //
      //   if(this.parent?.getTransforms){
      //     this.parent.getTransforms(list);
      //   } else if(this.parent){
      //     list.unshift(this.parent);
      //   }
      //
      //   list.push(this);
      //   return list;
      // }
      getTransforms(element, list = []) {
        if (!element)
          element = this;
        const isTransform = element.hasOwnProperty("panX") && element.hasOwnProperty("panY") && element.hasOwnProperty("zoom");
        if (isTransform) {
          const { oo: { name: name2 }, panX: x, panY: y, zoom: z } = element;
          list.unshift({ name: name2, x, y, z, element });
        }
        if (element.parent)
          this.getTransforms(element.parent, list);
        return list;
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
    traits = {
      draw() {
        this.el.Container = svg.rect({
          name: this.name,
          class: "editor-container",
          ry: this.r,
          "stroke-width": 2,
          "vector-effect": "non-scaling-stroke",
          // set initial values
          // these are special, handeled by the layout manager
          // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
          width: this.w,
          height: this.h,
          x: this.x,
          y: this.y
        });
        this.on("name", (name2) => update(this.el.Container, { name: name2 }));
        this.on("w", (width) => update(this.el.Container, { width }));
        this.on("h", (height) => update(this.el.Container, { height }));
        this.on("x", (x) => update(this.el.Container, { x }));
        this.on("y", (y) => update(this.el.Container, { y }));
        this.on("r", (ry) => update(this.el.Container, { ry }));
        this.appendElements();
      }
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
        console.warn("Label is not monitoring global zoom becasue it is not yet programmed to use the transforms");
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
        this.on("text", (text2) => captionText.nodeValue = text2);
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
    const { Object: attr, Array: children, Function: init } = byType(input);
    const instance = new Instance(Type, attr);
    if (init)
      init(instance, this ? this.parent : null);
    return [instance, children?.map((child) => nest.bind({ parent: instance })(...child)).map(([ins, chi]) => chi ? [ins, chi] : ins)];
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
        this.createControlAnchor({ name: "input", side: 0 });
        this.createControlAnchor({ name: "output", side: 1 });
        const [horizontal, [info1, info2]] = nest(Horizontal, { parent: this, scene: this.scene }, [
          [Label, { h: 24, text: this.text, parent: this }, (c, p2) => p2.children.create(c)],
          [Label, { h: 24, W: 24, text: "^", parent: this }, (c, p2) => p2.children.create(c)]
        ], (c) => {
          this.destructable = () => {
            c.stop();
            c.destroy();
          };
        });
        this.handle = info1.el.Container;
        horizontal.start();
        this.on("selected", (selected) => selected ? info1.el.Container.classList.add("selected") : info1.el.Container.classList.remove("selected"));
        this.on("text", (text2) => info1.text = text2);
        this.any(["x", "y", "w", "h"], ({ x, y, w, h }) => Object.assign(horizontal, { x, y, w, h }));
        let maximizer;
        let maximized = false;
        let restoreWindow = {};
        let restoreZoomPan = {};
        this.disposable = click(info2.handle, (e) => {
          console.log("maximized", maximized);
          if (maximized) {
            console.log("MINIMIZE", maximizer);
            maximizer.map((a) => a());
            maximized = false;
            Object.assign(this.getRootContainer(), restoreWindow);
            Object.assign(globalThis.project, restoreZoomPan);
          } else {
            console.log("MAXIMIZE!");
            restoreWindow = {
              x: this.getRootContainer().x,
              y: this.getRootContainer().y,
              w: this.getRootContainer().w,
              h: this.getRootContainer().h
            };
            restoreZoomPan = {
              panX: globalThis.project.panX,
              panY: globalThis.project.panY,
              zoom: globalThis.project.zoom
            };
            const handler = /* @__PURE__ */ __name(() => {
              this.getRootContainer().x = 0 - globalThis.project.panX / globalThis.project.zoom;
              this.getRootContainer().y = 0 - globalThis.project.panY / globalThis.project.zoom;
              this.getRootContainer().w = globalThis.project.w / globalThis.project.zoom;
              this.getRootContainer().h = globalThis.project.h / globalThis.project.zoom;
            }, "handler");
            maximizer = globalThis.project.any(["zoom", "panX", "panY", "w", "h"], handler);
            handler();
            console.log("maximizer", maximizer);
            maximized = true;
          }
          console.log({
            x: this.getRootContainer().x,
            y: this.getRootContainer().y,
            w: this.getRootContainer().w,
            h: this.getRootContainer().h
          });
        });
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/move/index.js
  var Move = class {
    static {
      __name(this, "Move");
    }
    component;
    window;
    handle;
    zone;
    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;
    previousX = 0;
    previousY = 0;
    dragging = false;
    constructor({ component, window: window2, handle, zone }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      if (!window2)
        throw new Error("window is required");
      if (!zone)
        throw new Error("zone is required");
      this.component = component;
      this.handle = handle;
      this.window = window2;
      this.zone = zone;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        this.previousX = e.screenX;
        this.previousY = e.screenY;
        this.dragging = true;
        globalThis.project.iframe = false;
        this.zone.addEventListener("mousemove", this.mouseMoveHandler);
      };
      this.mouseMoveHandler = (e) => {
        const movementX = this.previousX - e.screenX;
        const movementY = this.previousY - e.screenY;
        this.component.node.x = this.component.node.x - movementX / globalThis.project.zoom;
        this.component.node.y = this.component.node.y - movementY / globalThis.project.zoom;
        this.previousX = e.screenX;
        this.previousY = e.screenY;
      };
      this.mouseUpHandler = (e) => {
        this.dragging = false;
        globalThis.project.iframe = true;
        this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
      this.zone.addEventListener("mouseup", this.mouseUpHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
      this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      this.zone.removeEventListener("mouseup", this.mouseUpHandler);
    }
  };

  // plug-ins/focus/index.js
  var Focus = class {
    static {
      __name(this, "Focus");
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
        front(this.component.scene);
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
      caption: "Untitled"
    };
    properties = {
      streams: /* @__PURE__ */ new Map(),
      contain: true,
      isRootWindow: false
    };
    methods = {
      initialize() {
        if (!this.oo)
          throw new Error("Window oo Not Found");
      },
      mount() {
        this.draw();
        if (this.isRootWindow)
          return;
        let caption = new Instance(Caption, { h: 24, text: this.caption });
        this.on("caption", (v) => caption.text = v);
        this.createWindowComponent(caption);
        this.on("node", (node) => {
          node.on("caption", (caption2) => this.caption = caption2);
        });
        const move = new Move({
          component: this,
          handle: caption.handle,
          window: this,
          zone: window
        });
        this.destructable = () => move.destroy();
        const focus2 = new Focus({
          component: this,
          handle: this.scene
          // set to caption above to react to window captions only
        });
        this.destructable = () => focus2.destroy();
        const select = new Select({
          component: this,
          handle: caption.handle
        });
        this.destructable = () => focus2.destroy();
        this.on("selected", (selected) => caption.selected = selected);
      },
      createWindowComponent(component) {
        component.parent = this;
        this.children.create(component);
      }
    };
    constraints = {
      // NOTE: TODO ITEM BELOW
      // TODO: add method constraints this will requre gathering all constraints from each chain item
      // createWindowComponent: {
      //   'object must be based on Component': function(v){
      //     console.log('YYY', v);
      //     // if(! Theme.prototype.isPrototypeOf(v) ) return {error:'must extend Theme'};
      //   }
      // }
    };
  };

  // plug-ins/windows/Viewport.js
  var Viewport = class {
    static {
      __name(this, "Viewport");
    }
    static extends = [Container];
    methods = {
      initialize() {
      },
      mount() {
        this.el.ClipPath = svg.clipPath({ id: `clip-path-${this.id}` });
        this.maskRectangle = svg.rect();
        this.el.ClipPath.appendChild(this.maskRectangle);
        this.any(["x", "y", "w", "h"], ({ x, y, w: width, h: height }) => {
          update(this.maskRectangle, { x, y, width, height });
        });
        this.el.Mask = svg.g({ "clip-path": `url(#clip-path-${this.id})` });
        this.maskedElements = svg.g({ style: { "transform-origin": "top left" } });
        this.el.Mask.appendChild(this.maskedElements);
        console.warn(`this.maskedElements needs a background to track actusl x and y of mouse wheel hits`);
        this.appendElements();
      }
    };
  };

  // plug-ins/windows/Junction.js
  var Junction = class {
    static {
      __name(this, "Junction");
    }
    static extends = [Control];
    properties = {
      handle: null
    };
    observables = {};
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
        this.w = 0;
        this.h = 0;
        this.r = 12;
      },
      mount() {
        this.el.Primary = svg.circle({
          name: this.name,
          class: "editor-junction",
          "vector-effect": "non-scaling-stroke",
          r: this.r,
          width: this.w,
          height: this.h,
          cx: this.x,
          cy: this.y
        });
        this.on("selected", (selected) => selected ? this.el.Primary.classList.add("selected") : this.el.Primary.classList.remove("selected"));
        const move = new Move({
          component: this,
          handle: this.el.Primary,
          window: this,
          zone: window
        });
        this.destructable = () => move.destroy();
        const focus2 = new Focus({
          component: this,
          handle: this.scene
          // set to caption above to react to window captions only
        });
        this.destructable = () => focus2.destroy();
        const select = new Select({
          component: this,
          handle: this.el.Primary
        });
        this.destructable = () => select.destroy();
        this.appendElements();
        const inputAnchor = this.createControlAnchor({ name: "input", side: 0, r: 4 });
        const outputAnchor = this.createControlAnchor({ name: "output", side: 1, r: 4 });
        this.pipe("input").on("data", (data) => this.pipe("output").emit("data", data));
        this.on("name", (name2) => update(this.el.Primary, { name: name2 }));
        this.on("x", (cx) => update(this.el.Primary, { cx }));
        this.on("y", (cy) => update(this.el.Primary, { cy }));
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/geometrique/midpoint.js
  function midpoint({ x1, y1, x2, y2 }) {
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    return { cx, cy };
  }
  __name(midpoint, "midpoint");

  // plug-ins/geometrique/edgepoint.js
  function edgepoint(cx, cy, r, x1, y1, x2, y2) {
    const angleRadians = Math.atan2(y2 - y1, x2 - x1);
    const x = cx + r * Math.cos(angleRadians);
    const y = cy + r * Math.sin(angleRadians);
    return [x, y];
  }
  __name(edgepoint, "edgepoint");

  // plug-ins/windows/Line.js
  var Line = class {
    static {
      __name(this, "Line");
    }
    static extends = [Component];
    properties = {};
    observables = {
      source: null,
      target: null,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
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
        this.el.Primary = svg.line({
          name: this.name,
          class: "editor-line",
          "vector-effect": "non-scaling-stroke"
        });
        this.el.Midpoint = svg.circle({
          name: this.name,
          class: "editor-line-midpoint",
          "vector-effect": "non-scaling-stroke",
          r: 4
        });
        this.on("selected", (selected) => selected ? this.el.Primary.classList.add("selected") : this.el.Primary.classList.remove("selected"));
        this.on("selected", (selected) => selected ? this.el.Midpoint.classList.add("selected") : this.el.Midpoint.classList.remove("selected"));
        const select = new Select({
          component: this,
          handle: this.el.Primary
        });
        this.destructable = () => focus.destroy();
        this.on("name", (name2) => update(this.el.Primary, { name: name2 }));
        this.on("node", (node) => {
          node.on("source", (source) => this.source = source);
          node.on("target", (target) => this.target = target);
        });
        this.on("source", (id) => {
          if (!id)
            throw new Error(`Primary requires source id`);
          if (!id.includes(":"))
            throw new Error(`Id must contain ":".`);
          const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
          const component = origin.root.anchors.get(id);
          component.on("x", (x) => this.x1 = x);
          component.on("y", (y) => this.y1 = y);
        });
        this.on("target", (id) => {
          if (!id)
            throw new Error(`Primary requires target id`);
          if (!id.includes(":"))
            throw new Error(`Id must contain ":".`);
          const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
          const component = origin.root.anchors.get(id);
          component.on("x", (x) => this.x2 = x);
          component.on("y", (y) => this.y2 = y);
        });
        this.all(["source", "target"], ({ source, target }) => {
          const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
          globalThis.project.pipe(origin, source, target);
        });
        this.any(["x1", "y1", "x2", "y2"], (packet) => update(this.el.Midpoint, midpoint(packet)));
        this.any(["x1", "y1", "x2", "y2"], ({ x1, y1, x2, y2 }) => {
          const [x3, y3] = edgepoint(x1, y1, 12, x1, y1, x2, y2);
          const [x4, y4] = edgepoint(x2, y2, -12, x1, y1, x2, y2);
          update(this.el.Primary, { x1: x3, y1: y3, x2: x4, y2: y4 });
        });
        this.appendElements();
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/windows/Pane.js
  var uuid3 = bundle["uuid"];
  var Pane = class {
    static {
      __name(this, "Pane");
    }
    static extends = [Vertical];
    properties = {
      contain: true
    };
    observables = {
      panX: 0,
      panY: 0,
      zoom: 1,
      applications: [],
      elements: [],
      anchors: [],
      pipes: [],
      types: [Junction, Line]
    };
    methods = {
      initialize() {
        if (this.getRootContainer().isRootWindow)
          return;
        console.info("Line must detect the g it should be placed into");
        this.h = 400;
        this.subLayout = new RelativeLayout(this);
      },
      mount() {
        const [horizontal, [addButton, delButton]] = nest(Horizontal, [
          [Label, { h: 32, W: 32, text: "Add", parent: this }, (c, p2) => p2.children.create(c)],
          [Label, { h: 32, W: 32, text: "Del", parent: this }, (c, p2) => p2.children.create(c)]
        ], (c) => this.children.create(c));
        this.disposable = click(addButton.handle, (e) => {
          const id = uuid3();
          const node = new Instance(Node, { id, origin: this.getRootContainer().id, type: "Junction", x: 300, y: 300, data: {} });
          this.elements.create(node);
        });
        const paneBody = new Instance(Viewport, { h: 500, parent: this });
        this.children.create(paneBody);
        globalThis.project.origins.create({ id: this.getRootContainer().id, root: this, scene: paneBody.el.Mask });
        this.on("panX", (v) => requestAnimationFrame(() => {
          paneBody.maskedElements.style.transform = `translate(${this.panX}px, ${this.panY}px)`;
        }));
        this.on("panY", (v) => requestAnimationFrame(() => {
          paneBody.maskedElements.style.transform = `translate(${this.panX}px, ${this.panY}px)`;
        }));
        this.on("zoom", (v) => requestAnimationFrame(() => {
          paneBody.maskedElements.style.scale = this.zoom;
        }));
        this.on("elements.created", (node) => {
          const Ui = this.types.find((o) => o.name == node.type);
          if (!Ui)
            return console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
          const ui = new Instance(Ui, { id: node.id, node, scene: paneBody.maskedElements });
          this.applications.create(ui);
          ui.start();
          this.subLayout.manage(ui);
        }, { replay: true });
        this.on("elements.removed", ({ id }) => {
          this.applications.get(id).stop();
          this.applications.get(id).destroy();
          this.applications.remove(id);
        });
        this.appendElements();
        if (1) {
          const diagnosticRuler1 = new DiagnosticRuler("scene ruler", this.scene, "red");
          this.any(["x", "y", "w", "h"], (coordinates) => diagnosticRuler1.draw(coordinates));
          const diagnosticRuler2 = new DiagnosticRuler("maskedElements/paneBody ruler", paneBody.maskedElements, "green");
          paneBody.any(["x", "y", "w", "h"], (coordinates) => diagnosticRuler2.draw(coordinates, 50));
          const diagnosticCross1 = new DiagnosticCross("scene", this.scene, "red");
          this.any(["x", "y", "w", "h"], (coordinates) => diagnosticCross1.draw(coordinates));
          const diagnosticCross2 = new DiagnosticCross("maskedElements/paneBody", paneBody.maskedElements, "green");
          paneBody.any(["x", "y", "w", "h"], (coordinates) => diagnosticCross2.draw(coordinates));
          const centerCircle = svg.circle({ style: { "pointer-events": "none" }, stroke: "red", r: 5 });
          paneBody.maskedElements.appendChild(centerCircle);
          paneBody.any(["x", "y", "w", "h"], ({ x, y, w, h }) => update(centerCircle, { cx: x + w / 2, cy: y + h / 2 }));
          const outlineRectangle = svg.rect({ style: { "pointer-events": "none" }, stroke: "blue", fill: "none" });
          paneBody.maskedElements.appendChild(outlineRectangle);
          paneBody.any(["x", "y", "w", "h"], ({ x, y, w, h }) => update(outlineRectangle, { x, y, width: w, height: h }));
        }
        console.warn("these must be configured properly as elemnts are more responsible now. mouse wheel is tracked via the transformed g background rectangle that should have a grid or dot pattern");
        if (0) {
          const pan = new Pan({
            component: this,
            handle: paneBody.el.Container,
            zone: window
            // XXX: transformMovement: (v)=>v/globalThis.project.zoom,
          });
          this.destructable = () => pan.destroy();
          const zoom = new Zoom({
            component: this,
            area: paneBody,
            element: paneBody.el.Container,
            zone: paneBody.el.Container,
            // transformMovement: (v)=>v/globalThis.project.zoom,
            probe: ({ cursor }) => {
            }
          });
          this.destructable = () => zoom.destroy();
        }
        const transforms = this.getTransforms(this);
      }
    };
  };
  var DiagnosticCross = class {
    static {
      __name(this, "DiagnosticCross");
    }
    space = 8;
    name;
    parent;
    constructor(name2, parent, stroke) {
      this.name = name2;
      this.parent = parent;
      this.diagonal1 = svg.line({ style: { "pointer-events": "none" }, stroke, fill: "none" });
      this.parent.appendChild(this.diagonal1);
      this.diagonal2 = svg.line({ style: { "pointer-events": "none" }, stroke, fill: "none" });
      this.parent.appendChild(this.diagonal2);
      this.centerCircle = svg.circle({ style: { "pointer-events": "none" }, stroke, r: this.space });
      this.parent.appendChild(this.centerCircle);
      this.indicatorLine = svg.line({ style: { "pointer-events": "none" }, stroke, fill: "none" });
      this.parent.appendChild(this.indicatorLine);
      this.textContainer = svg.text({ "dominant-baseline": "middle", fill: stroke });
      this.parent.appendChild(this.textContainer);
      this.text = text("xxxx");
      this.textContainer.appendChild(this.text);
    }
    draw({ x, y, w, h }) {
      update(this.diagonal1, { x1: x, y1: y, x2: x + w, y2: y + h });
      update(this.diagonal2, { x1: x, y1: y + h, x2: x + w, y2: y });
      update(this.centerCircle, { cx: x + w / 2, cy: y + h / 2 });
      update(this.indicatorLine, { x1: x + w / 2 + this.space, y1: y + h / 2, x2: x + w / 2 + this.space * 8, y2: y + h / 2 });
      update(this.textContainer, { x: x + w / 2 + this.space * 8, y: y + h / 2 });
      this.text.nodeValue = `${x + w / 2}x ${y + h / 2}y ${w}w ${h}h ${this.name}`;
    }
  };
  var DiagnosticRuler = class {
    static {
      __name(this, "DiagnosticRuler");
    }
    mark = 12;
    marks = [];
    labels = [];
    space = 50;
    name;
    parent;
    constructor(name2, parent, stroke) {
      this.name = name2;
      this.parent = parent;
      this.diagonal1 = svg.line({ style: { "pointer-events": "none" }, stroke, fill: "none" });
      this.parent.appendChild(this.diagonal1);
      for (let markNumber = 0; markNumber <= this.mark; markNumber++) {
        const mark = svg.line({ style: { "pointer-events": "none" }, stroke, fill: "none" });
        this.parent.appendChild(mark);
        this.marks[markNumber] = mark;
        const container = svg.text({ "dominant-baseline": "middle", fill: stroke });
        this.parent.appendChild(container);
        const label = text(`#${markNumber}`);
        container.appendChild(label);
        this.labels[markNumber] = { container, label };
      }
      this.textContainer = svg.text({ fill: stroke });
      this.parent.appendChild(this.textContainer);
      this.text = text(this.name);
      this.textContainer.appendChild(this.text);
    }
    draw({ x, y }, n = 0) {
      y = y + n;
      let baseY = y + this.space * 8;
      let deltaY = this.space / 3;
      update(this.diagonal1, { x1: x, y1: baseY, x2: x + this.mark * this.space, y2: baseY });
      for (let markNumber = 0; markNumber <= this.mark; markNumber++) {
        const mark = this.marks[markNumber];
        update(mark, { x1: markNumber * this.space, y1: baseY - deltaY, x2: markNumber * this.space, y2: baseY + deltaY / 4 });
        const { container, label } = this.labels[markNumber];
        update(container, { x: markNumber * this.space, y: baseY - deltaY });
        label.nodeValue = `${markNumber * this.space}x`;
      }
      update(this.textContainer, { x, y: baseY + deltaY });
      this.text.nodeValue = `${this.name}`;
    }
  };

  // plug-ins/applications/Application.js
  var Application = class {
    static {
      __name(this, "Application");
    }
    static extends = [Window];
    methods = {
      initialize() {
        this.w = 800;
        this.h = 600;
      },
      mount() {
        const pane = new Instance(Pane, { url: this.url });
        this.createWindowComponent(pane);
        this.on("node", (node) => {
          node.on("url", (url) => imagePicker.url = url);
        });
      },
      stop() {
        console.log("todo: Stopping pane...");
      },
      destroy() {
        console.log("todo: Destroying pane...");
        this.dispose();
      }
    };
  };

  // src/System.js
  var System = class {
    static {
      __name(this, "System");
    }
    properties = {
      application: null,
      debouncedOnResize: null,
      scene: void 0
    };
    observables = {
      origins: []
    };
    constraints = {};
    methods = {
      initialize() {
      },
      mount() {
        const node = new Instance(Node, { id: 0, origin: -1, data: {} });
        this.application = new Instance(Application, { id: node.id, node, scene: this.scene, isRootWindow: true });
        this.application.start();
        const onResize = /* @__PURE__ */ __name(() => {
          this.application.w = this.svg.clientWidth;
          this.application.h = this.svg.clientHeight;
        }, "onResize");
        this.debouncedOnResize = debounce_default(onResize, 10);
        window.addEventListener("resize", this.debouncedOnResize);
        onResize();
      },
      destroy() {
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
  system.name = "Hello World System";
  system.svg = document.querySelector("#editor-svg");
  system.scene = document.querySelector("#editor-scene");
  system.background = document.querySelector("#editor-background");
  system.start();
})();