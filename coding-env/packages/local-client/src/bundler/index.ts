import * as esbuild from "esbuild-wasm"; //is an npm module
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

//service is what we use to transpile and bundle code
let service: esbuild.Service;

const bundle = async (rawCode: string) => {
  //initialise esbuild bundler
  if (!service) {
    service = await esbuild.startService({
      //go to public folder and get esbuild binary
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  }

  try {
    const result = await service.build({
      entryPoints: ["index.js"], //first one to be bundled
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        "process.env.NODE_ENV": '"production"', //replace with string, not var
        global: "window",
      },
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });

    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (err: any) {
    return {
      code: "",
      err: err.message,
    };
  }
};

export default bundle;
