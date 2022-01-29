import { Fragment } from "react";
import { useTypedSelector } from "../hooks/use-typed-selector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";

//hook to redux store
const CellList: React.FC = () => {
  //extract cells
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell prevCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div>
      <AddCell prevCellId={null} />
      {renderedCells}
      <div className={cells.length === 0 ? "force-visible" : ""}></div>
    </div>
  );
};

export default CellList;