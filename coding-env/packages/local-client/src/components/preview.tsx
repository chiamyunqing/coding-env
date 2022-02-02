import "./preview.css";
import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
  err: string;
}

//iframe listens for events from parent
const html = `
<html>
  <head>
    <style>html {background-color: white;}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const handleError = (err) => {
        const root = document.querySelector('#root');
          root.innerHTML = '<div style="color:red;"><h4>Runtime Error</h4>' + err + '</div>'
      }

      //handle uncaught errors e.g. asynchronous
      window.addEventListener('error', (event) => {
        event.preventDefault();
        handleError(error);
      });

      window.addEventListener('message', (event) => {
        try {
          eval(event.data);
        } catch (err) {
          handleError(err);
        }
        }, false);

    </script>
  </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    //reset the srcdoc of iframe
    iframe.current.srcdoc = html;
    setTimeout(() => {
      //make sure there's enough time to load html
      iframe.current.contentWindow.postMessage(code, "*"); //pass msg from parent to iframe
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="Code Execution"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
