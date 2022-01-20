import { useState } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";

//1 code editor + 1 preview
const CodeCell = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState(""); //tracking input value

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  //iframe to embed html doc into another html doc
  //sandbox iframed prevents child and parent window to communicate
  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default CodeCell;
