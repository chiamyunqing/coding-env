import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localforage from "localforage"; //use indexedDB as cache

const fileCache = localforage.createInstance({
  name: "filecache",
});

//plugins return an object with name and set up function
//esbuild keeps calling onLoad until an object is being returned
export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      //hijack onLoad process by not looking at file system
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //check to see if we have alr fetched this file and if in cache
        //key as args.path, value as the object
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult; //typescript error- unknown type?
        }
      });

      //fallsthrough if no cachedResult

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        //make it escaped
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
          const style = document.createElement('style');
          style.innerText =  '${escaped}';
          document.head.appendChild(style); 
          `;
        const result: esbuild.OnLoadResult = {
          loader: "jsx", //esbuild can't store css
          contents: contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        //store response in cache
        await fileCache.setItem(args.path, result);
        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: "jsx", //esbuild can't store css
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        //store response in cache
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
