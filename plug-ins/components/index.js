import Window from './Window.js';
import Port from './Port.js';
import Hello from './Hello.js';
import Terminal from './Terminal.js';
import Editor from './Editor.js';
import Pipe from './Pipe.js';

// Dependency Injection Pattern

const components = {
  Workspace: Window,
  Pipe,
  Window,
  Port,
  Hello,
  Terminal,
  Editor,
}

export default components;
