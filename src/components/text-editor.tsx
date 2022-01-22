import "./text-editor.css";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState, useRef } from "react";

const TextEditor: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null); //ref what is being clicked
  const [editing, setEditing] = useState(false); //check if editing mode
  const [value, setValue] = useState("# Header");

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      //element clicked is inside editor,then don't disappear
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }

      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor value={value} onChange={(v) => setValue(v || "")} />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
