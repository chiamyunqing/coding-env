import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { persistMiddleware } from "./middlewares/persist-middleware";

//createStore(reducer, [preloadedState], [enhancer])
export const store = createStore(
  reducers,
  {},
  applyMiddleware(persistMiddleware, thunk)
);

//Simple manual test on manipulation of state in store

// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: null,
//     type: "code",
//   },
// });

// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: null,
//     type: "text",
//   },
// });

//console.log(store.getState());
