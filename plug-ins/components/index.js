import Workspace from './Workspace.js';
import Window from './Window.js';
import Port from './Port.js';
import Hello from './Hello.js';
import Terminal from './Terminal.js';
import Editor from './Editor.js';
import Pipe from './Pipe.js';
import Architecture from './Architecture.js';

// Dependency Injection Pattern

const components = {
  Workspace,

  Port,
  Window,
  Pipe,

  Hello,
  Architecture,

  Terminal,
  Editor,
}

export default components;
