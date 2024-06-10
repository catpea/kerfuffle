import pkg from "/package.json";
import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Application from "/plug-ins/windows/Application.js";
import Foreign from "/plug-ins/windows/Foreign.js";
const { Terminal:Term, FitAddon } = bundle['xterm'];

export default class Terminal {
  static extends = [Application];

  properties = {
  };

  methods = {

    mount(){

      this.foreign = new Instance(Foreign);
      this.createWindowComponent( this.foreign );

      const term = new Term({
        fontFamily: '"Cascadia Code", Menlo, monospace',
        cursorBlink: true,
        // allowProposedApi: true
      });



      const fitAddon = new FitAddon();

      term.loadAddon(fitAddon);
      term.open(this.foreign.body);
      fitAddon.fit();

      fitAddon.fit();

      this.any(['w','h'], x=>fitAddon.fit());

      this.foreign.body.addEventListener('wheel', e => {
        if (term.buffer.active.baseY > 0) {
          e.preventDefault();
        }
      });
      this.foreign.body.addEventListener('click', e => {
        term.focus();
      });

      var command = '';

      this.disposables = term.onData(e => {
        console.log('term.onData', e);
        switch (e) {
          case '\u0003': // Ctrl+C
            term.write('^C');
            prompt(term);
            break;
          case '\r': // Enter
            runCommand(term, command);
            command = '';
            break;
          case '\u007F': // Backspace (DEL)
            // Do not delete the prompt
            if (term._core.buffer.x > 2) {
              term.write('\b \b');
              if (command.length > 0) {
                command = command.substr(0, command.length - 1);
              }
            }
            break;
          default: // Print all other characters for demo
            if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
              command += e;
              term.write(e);
            }
        }
      });


      function prompt(term) {
        command = '';
        term.write('\r\n$ ');
      }

      function runFakeTerm() {

        if (term._initialized) {
          return;
        }

        term._initialized = true;

        term.prompt = () => {
          term.write('\r\n$ ');
        };

        term.writeln([`${pkg.name} ${pkg.version} terminal subsystem`,`Type in 'help' and press enter to begin.`].join('\r\n'));
        prompt(term);

      } // runFakeTerm




        var commands = {

          help: {
            f: () => {
              term.writeln([
                'known commands:',
                ...Object.keys(commands).map(key=>`${key}: ${commands[key].description}`),
              ].join('\r\n'));
              this.getRoot().saveXml();
              term.prompt(term);
            },
            description: 'prints information about all the available commands'
          },

          save: {
            f: () => {
              term.writeln(['Gatehring data...'].join('\r\n'));
              const xml = this.getRoot().saveXml();
              term.writeln(xml);
              term.writeln(['Save complete', 'data printed in the web console'].join('\r\n'));
              term.prompt(term);
            },
            description: 'executes the save XML function'
          },




        };

        function runCommand(term, text) {
          const command = text.trim().split(' ')[0];
          if (command.length > 0) {
            term.writeln('');
            if (command in commands) {
              commands[command].f();
              return;
            }
            term.writeln(`${command}: command not found`);
          }
          prompt(term);
        }






      runFakeTerm();
    },

    stop(){
      console.log('todo: stopping root application');
    },

    destroy(){
      console.log('todo: destroying root application');
      this.dispose()
    },

  };
}
