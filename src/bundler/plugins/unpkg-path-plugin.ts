//plugin
import * as esbuild from "esbuild-wasm";
/*
bundling process: 
1) onResolve: figure out where file is
2) onLoad: attempt to load the file
3) Parse the file, find import/require/exports
4) Repeat onResolve, onLoad steps on the imports
*/
export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    //called by esbuild, aka the bundling process
    setup(build: esbuild.PluginBuild) {
      //filter works on name of file, if fulfills it, run the function
      //handle root entry file
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      //handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });

      //handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
