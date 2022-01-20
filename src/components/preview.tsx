import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
}

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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    //reset the srcdoc of iframe
    iframe.current.srcdoc = html;
    iframe.current.contentWindow.postMessage(code, "*"); //pass msg from parent to iframe
  }, [code]);

  return (
    <iframe
      title="Code Execution"
      ref={iframe}
      sandbox="allow-scripts"
      srcDoc={html}
    />
  );
};

export default Preview;
