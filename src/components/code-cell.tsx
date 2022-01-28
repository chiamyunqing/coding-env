import { useState, useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";

//convert local state to use redux
interface CodeCellProps {
  cell: Cell;
}

//1 code editor + 1 preview
//input cell is what user is actually typing in code editor
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const { updateCell } = useActions(); //use this dispatcher to update cell

  //useEffect if returns a function, func will run the next time it is called
  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content); //returns an object
      setCode(output.code);
      setErr(output.err);
      return () => {
        clearTimeout(timer);
      };
    }, 1000);
  }, [cell.content]);

  //iframe to embed html doc into another html doc
  //sandbox iframed prevents child and parent window to communicate
  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
