export type CellTypes = "code" | "text";

//properties that cell shld have
export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}
