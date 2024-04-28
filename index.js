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
      type: null
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
      this.parent.on("h", () => {
        if (child.flexible)
          child.h = this.calculateGrowChildH(child);
      });
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
      console.log(`${flexibleChild.oo.name} is flexible`);
      const childrenHeight = this.parent.children.filter((c) => c !== flexibleChild).reduce((total, c) => total + c.h, 0);
      const freeSpace = this.parent.h - childrenHeight;
      console.log(flexibleChild.h, freeSpace);
      if (freeSpace) {
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
      getStack(element, list = []) {
        if (!element)
          element = this;
        list.unshift(element);
        if (element.parent)
          this.getStack(element.parent, list);
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
      getTransforms(element, list = [], root = true) {
        if (!element)
          element = this;
        const isTransform = element.hasOwnProperty("panX") && element.hasOwnProperty("panY") && element.hasOwnProperty("zoom");
        if (isTransform) {
          let offsetX = element.viewport.x - element.x;
          let offsetY = element.viewport.y - element.y;
          const { oo: { name: name2 }, panX, panY, zoom, x, y } = element;
          list.unshift({ name: name2, panX, panY, zoom, x: element.x + offsetX, y: element.y + offsetY, element: element.scene, offsetX: 0, offsetY: 0 });
        }
        if (element.parent)
          this.getTransforms(element.parent, list, false);
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
      getApplication(element) {
        if (!element)
          element = this;
        if (element.isApplication === true) {
          return element;
        }
        if (element.parent)
          return this.getApplication(element.parent);
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
          name: this.oo.name,
          style: { "pointer-events": "none" },
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
        const [horizontal, [info1, maximizeButton]] = nest(Horizontal, { parent: this, scene: this.scene }, [
          [Label, { h: 24, text: this.text, parent: this }, (c, p2) => p2.children.create(c)],
          [Label, { h: 24, W: 24, text: "[ ]", parent: this }, (c, p2) => p2.children.create(c)]
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
    constructor({ component, handle, element }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      this.component = component;
      this.element = element;
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
      caption: "Untitled"
    };
    properties = {
      contain: true
    };
    methods = {
      initialize() {
      },
      mount() {
        this.draw();
        if (this.isRootWindow)
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
  var DiagnosticWidth = class {
    static {
      __name(this, "DiagnosticWidth");
    }
    container;
    label;
    x;
    y;
    length;
    color;
    constructor({ container, label, x, y, length, color = "magenta" }) {
      this.container = container;
      this.label = label;
      this.x = x;
      this.y = y;
      this.length = length;
      this.color = color;
      this.line = svg.line({ style: { "pointer-events": "none" }, stroke: this.color, fill: "none" });
      this.container.appendChild(this.line);
      this.lineStart = svg.line({ style: { "pointer-events": "none" }, stroke: this.color, fill: "none" });
      this.container.appendChild(this.lineStart);
      this.lineEnd = svg.line({ style: { "pointer-events": "none" }, stroke: this.color, fill: "none" });
      this.container.appendChild(this.lineEnd);
      this.textContainer = svg.text({ style: { "pointer-events": "none" }, fill: color });
      this.container.appendChild(this.textContainer);
      this.text = text(this.label);
      this.textContainer.appendChild(this.text);
    }
    update({ x, y, length, label }) {
      update(this.line, { x1: x, y1: y, x2: x + length, y2: y });
      update(this.lineStart, { x1: x, y1: y - 10, x2: x, y2: y + 10 });
      update(this.lineEnd, { x1: x + length, y1: y - 10, x2: x + length, y2: y + 10 });
      update(this.textContainer, { x: x + 2, y });
      this.text.nodeValue = `${label}: ${x}x${y}>${length}`;
    }
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
  var Resize = class extends Drag {
    static {
      __name(this, "Resize");
    }
  };
  var Resize_default = Resize;

  // plug-ins/windows/Viewport.js
  var Viewport = class {
    static {
      __name(this, "Viewport");
    }
    static extends = [Container];
    properties = {
      debugBody: false,
      debugContent: false
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
        this.background = svg.rect({ name: "viewport-background", style: { "transform-origin": "0px 0px", fill: bgColor } });
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

  // plug-ins/move/index.js
  var Move2 = class {
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
  var Focus2 = class {
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
        const move = new Move2({
          component: this,
          handle: this.el.Primary,
          window: this,
          zone: window
        });
        this.destructable = () => move.destroy();
        const focus2 = new Focus2({
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
  var segmentDb = {};
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
      url: null,
      panX: 100,
      panY: 100,
      zoom: 0.4,
      applications: [],
      elements: [],
      anchors: [],
      pipes: [],
      types: [TestWindow, Junction, Line]
    };
    methods = {
      initialize() {
        this.name = "pane";
        if (this.getRootContainer().isRootWindow)
          return;
        this.h = 400;
        this.flexible = true;
      },
      mount() {
        const [horizontal1, [addButton, delButton]] = nest(Horizontal, [
          [Label, { h: 24, W: 32, text: "Add", parent: this }, (c, p2) => p2.children.create(c)],
          [Label, { h: 24, W: 32, text: "Del", parent: this }, (c, p2) => p2.children.create(c)]
        ], (c) => this.children.create(c));
        this.disposable = click(addButton.handle, (e) => {
          const id = uuid3();
          const node = new Instance(Node, { id, origin: this.getRootContainer().id, type: "Junction", x: 300, y: 300, data: {} });
          this.elements.create(node);
        });
        const paneBody = new Instance(Viewport, { h: 700, parent: this });
        this.viewport = paneBody;
        this.getApplication().viewport = paneBody;
        this.children.create(paneBody);
        globalThis.project.origins.create({ id: this.getRootContainer().id, root: this, scene: paneBody.el.Mask });
        if (!this.parent.isRootWindow) {
          const [horizontal, [statusBar, resizeHandle]] = nest(Horizontal, [
            [Label, { h: 24, text: "Status: nominal", parent: this }, (c, p2) => p2.children.create(c)],
            [Label, { h: 24, W: 24, text: "///", parent: this }, (c, p2) => p2.children.create(c)]
          ], (c) => this.children.create(c));
          this.any(["x", "y", "zoom", "w", "h"], ({ x, y, zoom: zoom2, w, h }) => statusBar.text = `${x.toFixed(0)}x${y.toFixed(0)} zoom:${zoom2.toFixed(2)} ${w.toFixed(0)}:${h.toFixed(0)} id:${this.getApplication().id}`);
          const resize = new Resize_default({
            area: window,
            handle: resizeHandle.el.Container,
            scale: () => this.getParentScale(this),
            before: () => {
            },
            movement: ({ x, y, stop }) => {
              let win = this.getApplication();
              if (win.w - x > 256) {
                win.w -= x;
              } else {
                stop();
              }
              if (win.h - y > 256) {
                win.h -= y;
              } else {
                stop();
              }
            },
            after: () => {
            }
          });
          this.destructable = () => resize.destroy();
        }
        if (this.parent.isRootWindow) {
          this.parent.on("h", (parentH) => {
            const childrenHeight = this.children.filter((c) => !(c === paneBody)).reduce((total, c) => total + c.h, 0);
            const freeSpace = parentH - childrenHeight;
            paneBody.h = freeSpace;
            paneBody.H = freeSpace;
          });
        }
        ;
        this.on("panX", (panX) => paneBody.panX = panX);
        this.on("panY", (panY) => paneBody.panY = panY);
        this.on("zoom", (zoom2) => paneBody.zoom = zoom2);
        this.on("elements.created", (node) => {
          const Ui = this.types.find((o) => o.name == node.type);
          if (!Ui)
            return console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
          let root = svg.g({ name: "element" });
          paneBody.content.appendChild(root);
          const ui = new Instance(Ui, { id: node.id, node, scene: root, parent: this });
          this.applications.create(ui);
          ui.start();
        }, { replay: true });
        this.on("elements.removed", ({ id }) => {
          this.applications.get(id).stop();
          this.applications.get(id).destroy();
          this.applications.remove(id);
        });
        this.appendElements();
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
        function segmentHandler(requests, { container }) {
          for (const [key, request] of requests) {
            let lineExists = segmentDb[key];
            if (!lineExists)
              segmentDb[key] = new DiagnosticWidth({ ...request, container });
            segmentDb[key].update(request);
          }
        }
        __name(segmentHandler, "segmentHandler");
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
        this.on("url", (url) => this.load(this.url));
      },
      async load(url) {
        if (!url)
          return;
        const rehydrated = await (await fetch(url)).json();
        this.meta = rehydrated.meta;
        for (const { meta, data } of rehydrated.data) {
          const node = new Instance(Node, { origin: this.getApplication().id });
          node.assign(meta, data);
          this.elements.create(node);
        }
      },
      transform(o, keys = null, scale = null) {
        let zoom = scale ?? this.zoom;
        let response = o;
        for (const transform of this.getTransforms(this)) {
          response = Object.fromEntries(Object.entries(response).map(([k, v]) => {
            if (keys === null) {
              return [k, v * zoom];
            } else if (keys.length) {
              if (keys.includes(k)) {
                return [k, v * zoom];
              } else {
                return [k, v];
              }
            }
          }));
        }
        return response;
      }
    };
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
        this.w = 800;
        this.h = 600;
        this.getRoot().origins.create(this);
      }
    };
  };

  // plug-ins/applications/TestWindow.js
  var TestWindow = class {
    static {
      __name(this, "TestWindow");
    }
    static extends = [Application];
    properties = {};
    methods = {
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

  // plug-ins/applications/RootWindow.js
  var RootWindow = class {
    static {
      __name(this, "RootWindow");
    }
    static extends = [Application];
    properties = {
      isRootWindow: true
    };
    methods = {
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
        const node = new Instance(Node, { id: "0", origin: "0", url: this.url, data: {} });
        this.rootWindow = new Instance(RootWindow, { id: node.id, node, svg: this.svg, scene: this.scene, parent: null, origins: this.origins, isRootWindow: true });
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
  system.url = "templates/test.json";
  system.start();
})();
