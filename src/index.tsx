import "bulmaswatch/solar/bulmaswatch.min.css";
import * as esbuild from "esbuild-wasm"; //is an npm module
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";

const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState(""); //tracking input value

  const startService = async () => {
    //service is what we use to transpile and bundle code
    ref.current = await esbuild.startService({
      //go to public folder and get esbuild binary
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      //if not initialised
      return;
    }

    //reset the srcdoc of iframe
    iframe.current.srcdoc = html;

    //intercept the bundling with our own plugins
    const result = await ref.current.build({
      entryPoints: ["index.js"], //first one to be bundled
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"', //replace with string, not var
        global: "window",
      },
    });

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*"); //pass msg from parent to iframe
  };

  //iframe listens for events from parent
  const html = `
    <html>
      <head>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color:red;"><h4>Runtime Error</h4>' + err + '</div>'
              console.error(err);
            }
            }, false);
        </script>
      </body>
    </html>
  `;

  //iframe to embed html doc into another html doc
  //sandbox iframed prevents child and parent window to communicate
  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        title="Code Execution"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
