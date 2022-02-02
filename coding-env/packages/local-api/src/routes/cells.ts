import express from "express";
import fs from 'fs/promises';
import path from 'path'

interface Cell {
    id: string;
    content: string;
    type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
    router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    //read file
    //parse a list of cells
    //send list of cells back to browser

    try {
        const result = await fs.readFile(fullPath, {encoding: 'utf-8'});
        res.send(JSON.parse(result));
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            //add code to create a file
            await fs.writeFile(fullPath, '[]', 'utf-8');
            res.send([]);
        } else {
            throw err;
        }
    }
  });

  router.post("/cells", async (req, res) => {
    //make sure file exists, if file does not exist, create
    //take list of cells from req object,
    const {cells} : {cells: Cell[]} = req.body;

    //write to file
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send("status all good");
});
  
  return router;
};
