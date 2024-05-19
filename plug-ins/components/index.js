import Window from './Window.js';
import Port from './Port.js';

// Dependency Injection Pattern

const components = {
  Workspace: Window,
  Window: Window,
  Port: Port,
}

export default components;
