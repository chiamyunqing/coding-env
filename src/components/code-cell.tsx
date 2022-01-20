import { useState, useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";

//1 code editor + 1 preview
const CodeCell = () => {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [input, setInput] = useState(""); //tracking input value

  //useEffect if returns a function, func will run the next time it is called
  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input); //returns an object
      setCode(output.code);
      setErr(output.err);
      return () => {
        clearTimeout(timer);
      };
    }, 1000);
  }, [input]);

  //iframe to embed html doc into another html doc
  //sandbox iframed prevents child and parent window to communicate
  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a = 1;"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
