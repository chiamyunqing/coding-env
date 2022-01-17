import * as esbuild from "esbuild-wasm"; //is an npm module
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState(""); //tracking input value
  const [code, setCode] = useState(""); //transpiled code

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
    setCode(result.outputFiles[0].text); //code is the transpiiled code
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
