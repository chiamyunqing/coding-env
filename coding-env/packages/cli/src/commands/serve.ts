import path from "path";
import { Command } from "commander";
import { serve } from "local-api";

const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  .command("serve [filename]") //[] is optional
  .description("Open a file for editing")
  .option("-p, --port <number>", "port to run server on", "4005") //<> is not optional
  .action(async (filename = "notebook.js", options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      await serve(parseInt(options.port), filename, dir, !isProduction);
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit your file.
        `
      );
    } catch (err: any) {
      if (err.code === "EADDRINUSE") {
        console.error("Port in use. Use another port with -p");
      } else {
        console.log("here's the problem", err.message);
      }
      process.exit(1);
    }
  });
